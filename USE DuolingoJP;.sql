USE DuolingoJP;
SET NOCOUNT ON;

BEGIN TRY
    BEGIN TRAN;

    /* 1) Ensure schema compatibility */
    IF COL_LENGTH('Lessons', 'BaseXP') IS NULL
    BEGIN
        ALTER TABLE Lessons ADD BaseXP INT NOT NULL CONSTRAINT DF_Lessons_BaseXP DEFAULT 10;
    END

    IF COL_LENGTH('Questions', 'QuestionType') IS NULL
    BEGIN
        ALTER TABLE Questions
        ADD QuestionType NVARCHAR(50) NOT NULL
            CONSTRAINT DF_Questions_QuestionType DEFAULT 'MultipleChoice';
    END

    IF COL_LENGTH('Questions', 'CorrectAnswer') IS NOT NULL
    BEGIN
        ALTER TABLE Questions DROP COLUMN CorrectAnswer;
    END

    /* 2) Seed Level (table name is [Level], not Levels) */
    INSERT INTO [Level] (LevelName)
    SELECT v.LevelName
    FROM (VALUES (N'N5'), (N'N4'), (N'N3'), (N'N2'), (N'N1')) v(LevelName)
    WHERE NOT EXISTS (
        SELECT 1
        FROM [Level] l
        WHERE l.LevelName = v.LevelName
    );

    /* 3) Seed Topic (table name is [Topic], not Topics) */
    INSERT INTO [Topic] (TopicName, LevelId)
    SELECT v.TopicName, l.LevelId
    FROM (VALUES
        (N'Hiragana & Katakana', N'N5'),
        (N'Từ vựng cơ bản', N'N5'),
        (N'Ngữ pháp cơ bản', N'N5'),
        (N'Từ vựng trung cấp', N'N4'),
        (N'Ngữ pháp trung cấp', N'N4'),
        (N'Đọc hiểu', N'N3'),
        (N'Hội thoại', N'N3'),
        (N'Kanji nâng cao', N'N2'),
        (N'Luyện đề tổng hợp', N'N1')
    ) v(TopicName, LevelName)
    JOIN [Level] l ON l.LevelName = v.LevelName
    WHERE NOT EXISTS (
        SELECT 1
        FROM [Topic] t
        WHERE t.TopicName = v.TopicName
    );

    /* 4) Seed Lessons (+ BaseXP) */
    INSERT INTO Lessons (LessonName, TopicId, BaseXP)
    SELECT v.LessonName, t.TopicId, v.BaseXP
    FROM (VALUES
        (N'Hiragana cơ bản',      N'Hiragana & Katakana', 10),
        (N'Katakana cơ bản',      N'Hiragana & Katakana', 10),
        (N'Luyện đọc bảng chữ cái', N'Hiragana & Katakana', 12),

        (N'Từ vựng gia đình',     N'Từ vựng cơ bản', 12),
        (N'Từ vựng trường học',   N'Từ vựng cơ bản', 12),
        (N'Từ vựng số đếm',       N'Từ vựng cơ bản', 12),

        (N'Cấu trúc AはBです',      N'Ngữ pháp cơ bản', 15),
        (N'Trợ từ は và が',         N'Ngữ pháp cơ bản', 15),
        (N'Thì hiện tại và phủ định', N'Ngữ pháp cơ bản', 15)
    ) v(LessonName, TopicName, BaseXP)
    JOIN [Topic] t ON t.TopicName = v.TopicName
    WHERE NOT EXISTS (
        SELECT 1
        FROM Lessons x
        WHERE x.LessonName = v.LessonName
    );

    /* 5) Seed sample questions for lesson "Hiragana cơ bản" */
    DECLARE @LessonHira INT =
    (
        SELECT TOP 1 LessonId
        FROM Lessons
        WHERE LessonName = N'Hiragana cơ bản'
        ORDER BY LessonId
    );

    IF @LessonHira IS NOT NULL
    BEGIN
        INSERT INTO Questions (LessonId, Content, QuestionType, OrderIndex)
        SELECT @LessonHira, v.Content, N'MultipleChoice', v.OrderIndex
        FROM (VALUES
            (N'Chữ あ đọc là gì?', 1),
            (N'Chữ い đọc là gì?', 2),
            (N'Chữ う đọc là gì?', 3)
        ) v(Content, OrderIndex)
        WHERE NOT EXISTS (
            SELECT 1
            FROM Questions q
            WHERE q.LessonId = @LessonHira
              AND q.OrderIndex = v.OrderIndex
        );

        DECLARE @Q1 INT = (SELECT QuestionId FROM Questions WHERE LessonId = @LessonHira AND OrderIndex = 1);
        DECLARE @Q2 INT = (SELECT QuestionId FROM Questions WHERE LessonId = @LessonHira AND OrderIndex = 2);
        DECLARE @Q3 INT = (SELECT QuestionId FROM Questions WHERE LessonId = @LessonHira AND OrderIndex = 3);

        IF @Q1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM QuestionOptions WHERE QuestionId = @Q1)
        BEGIN
            INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect) VALUES
            (@Q1, N'a', 1), (@Q1, N'i', 0), (@Q1, N'u', 0), (@Q1, N'e', 0);
        END

        IF @Q2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM QuestionOptions WHERE QuestionId = @Q2)
        BEGIN
            INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect) VALUES
            (@Q2, N'a', 0), (@Q2, N'i', 1), (@Q2, N'u', 0), (@Q2, N'o', 0);
        END

        IF @Q3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM QuestionOptions WHERE QuestionId = @Q3)
        BEGIN
            INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect) VALUES
            (@Q3, N'a', 0), (@Q3, N'i', 0), (@Q3, N'u', 1), (@Q3, N'e', 0);
        END
    END

    COMMIT TRAN;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRAN;

    SELECT
        ERROR_NUMBER() AS ErrorNumber,
        ERROR_MESSAGE() AS ErrorMessage,
        ERROR_LINE() AS ErrorLine;
END CATCH;

/* 6) Quick check output */
SELECT 'Level' AS TableName, COUNT(*) AS TotalRows FROM [Level]
UNION ALL SELECT 'Topic', COUNT(*) FROM [Topic]
UNION ALL SELECT 'Lessons', COUNT(*) FROM Lessons
UNION ALL SELECT 'Questions', COUNT(*) FROM Questions
UNION ALL SELECT 'QuestionOptions', COUNT(*) FROM QuestionOptions;

SELECT TOP 20 LessonId, TopicId, LessonName, BaseXP FROM Lessons ORDER BY LessonId;
SELECT TOP 20 QuestionId, LessonId, Content, OrderIndex, QuestionType FROM Questions ORDER BY QuestionId;
SELECT TOP 40 OptionId, QuestionId, OptionText, IsCorrect FROM QuestionOptions ORDER BY OptionId;                                                           