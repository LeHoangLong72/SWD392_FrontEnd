CREATE TABLE Levels (
    LevelId INT IDENTITY(1,1) PRIMARY KEY,
    LevelName NVARCHAR(100) NOT NULL
);

-- Tạo bảng Topics
CREATE TABLE Topics (
    TopicId INT IDENTITY(1,1) PRIMARY KEY,
    TopicName NVARCHAR(150) NOT NULL,
    LevelId INT NOT NULL,

    CONSTRAINT FK_Topics_Levels
        FOREIGN KEY (LevelId)
        REFERENCES Levels(LevelId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Lessons (
    LessonId INT IDENTITY(1,1) PRIMARY KEY,
    LessonName NVARCHAR(200) NOT NULL,
    TopicId INT NOT NULL,

    CONSTRAINT FK_Lessons_Topics
        FOREIGN KEY (TopicId)
        REFERENCES Topics(TopicId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE UserProgress (
    ProgressId INT IDENTITY(1,1) PRIMARY KEY,
    UserId NVARCHAR(450) NOT NULL,
    LessonId INT NOT NULL,
    IsCompleted BIT DEFAULT 0,
    CompletedDate DATETIME NULL,
    EarnedXP INT DEFAULT 0,

    CONSTRAINT FK_UserProgress_Users
        FOREIGN KEY (UserId)
        REFERENCES AspNetUsers(Id)
        ON DELETE CASCADE,

    CONSTRAINT FK_UserProgress_Lessons
        FOREIGN KEY (LessonId)
        REFERENCES Lessons(LessonId)
        ON DELETE CASCADE
);

CREATE TABLE Questions (
    QuestionId INT IDENTITY PRIMARY KEY,
    LessonId INT NOT NULL,
    Content NVARCHAR(1000) NOT NULL,
    QuestionType NVARCHAR(50) NOT NULL, -- MultipleChoice, FillBlank, Matching, Ordering
    CorrectAnswer NVARCHAR(1000) NULL,  -- dùng cho fill blank / tự nhập
    OrderIndex INT,
    FOREIGN KEY (LessonId) REFERENCES Lessons(LessonId) ON DELETE CASCADE
);

CREATE TABLE QuestionOptions (
    OptionId INT IDENTITY PRIMARY KEY,
    QuestionId INT NOT NULL,
    OptionText NVARCHAR(500) NOT NULL,
    IsCorrect BIT DEFAULT 0,
    FOREIGN KEY (QuestionId) REFERENCES Questions(QuestionId) ON DELETE CASCADE
);

CREATE TABLE LessonAttempts (
    LessonAttemptId INT IDENTITY PRIMARY KEY,
    UserId NVARCHAR(450) NOT NULL,
    LessonId INT NOT NULL,
    StartedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CompletedAt DATETIME2 NULL,
    TotalQuestions INT NOT NULL,
    CorrectAnswers INT NOT NULL,
    IsPassed BIT NOT NULL DEFAULT 0,

    CONSTRAINT FK_LessonAttempts_User
        FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id)
        ON DELETE CASCADE,

    CONSTRAINT FK_LessonAttempts_Lesson
        FOREIGN KEY (LessonId) REFERENCES Lessons(LessonId)
        ON DELETE CASCADE
);

-- Tạo bảng UserItems (Liên kết User và Item)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserItems')
BEGIN
    CREATE TABLE UserItems (
        Id INT PRIMARY KEY IDENTITY(1,1),
        UserId NVARCHAR(450) NOT NULL,
        ItemId INT NOT NULL,
        PurchasedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        IsEquipped BIT NOT NULL DEFAULT 0,
        CONSTRAINT FK_UserItems_Users FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE,
        CONSTRAINT FK_UserItems_Items FOREIGN KEY (ItemId) REFERENCES Items(ItemId) ON DELETE CASCADE,
        CONSTRAINT UQ_UserItems_UserId_ItemId UNIQUE (UserId, ItemId)
    );
END
GO

 CREATE TABLE Items (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(500) NOT NULL,
        Price INT NOT NULL,
        ImageUrl NVARCHAR(500) NOT NULL,
        Category NVARCHAR(50) NOT NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT CK_Items_Price CHECK (Price >= 0)
    );

CREATE TABLE UserAnswers (
    UserAnswerId INT IDENTITY PRIMARY KEY,
    LessonAttemptId INT NOT NULL,
    QuestionId INT NOT NULL,
    SelectedOptionId INT NOT NULL,
    IsCorrect BIT NOT NULL,

    CONSTRAINT FK_UserAnswers_Attempt
        FOREIGN KEY (LessonAttemptId)
        REFERENCES LessonAttempts(LessonAttemptId)
        ON DELETE CASCADE,

    CONSTRAINT FK_UserAnswers_Question
        FOREIGN KEY (QuestionId)
        REFERENCES Questions(QuestionId),

    CONSTRAINT FK_UserAnswers_Option
        FOREIGN KEY (SelectedOptionId)
        REFERENCES QuestionOptions(OptionId)
);



INSERT INTO Levels (LevelName) VALUES 
(N'N5'),
(N'N4'),
(N'N3'),
(N'N2'),
(N'N1');


INSERT INTO Topics (TopicName, LevelId) VALUES
-- N5 (LevelId = 1)
(N'Hiragana & Katakana', 1),
(N'Từ vựng cơ bản', 1),
(N'Ngữ pháp cơ bản', 1),

-- N4 (LevelId = 2)
(N'Từ vựng trung cấp', 2),
(N'Ngữ pháp trung cấp', 2),

-- N3 (LevelId = 3)
(N'Đọc hiểu', 3),
(N'Hội thoại', 3),

-- N2 (LevelId = 4)
(N'Kanji nâng cao', 4),

-- N1 (LevelId = 5)
(N'Luyện đề tổng hợp', 5);


INSERT INTO Lessons (LessonName, TopicId) VALUES

-- Topic 1: Hiragana & Katakana
(N'Hiragana cơ bản', 1),
(N'Katakana cơ bản', 1),
(N'Luyện đọc bảng chữ cái', 1),

-- Topic 2: Từ vựng cơ bản
(N'Từ vựng gia đình', 2),
(N'Từ vựng trường học', 2),
(N'Từ vựng số đếm', 2),

-- Topic 3: Ngữ pháp cơ bản
(N'Cấu trúc AはBです', 3),
(N'Trợ từ は và が', 3),
(N'Thì hiện tại và phủ định', 3),

-- Topic 4: Từ vựng trung cấp
(N'Từ vựng công việc', 4),
(N'Từ vựng du lịch', 4),

-- Topic 5: Ngữ pháp trung cấp
(N'Mẫu câu ～ている', 5),
(N'Mẫu câu ～と思います', 5),

-- Topic 6: Đọc hiểu
(N'Đọc đoạn văn ngắn', 6),
(N'Đọc email đơn giản', 6),

-- Topic 7: Hội thoại
(N'Hội thoại tại nhà hàng', 7),
(N'Hội thoại nơi công sở', 7),

-- Topic 8: Kanji nâng cao
(N'Kanji cấp độ N2 - Phần 1', 8),
(N'Kanji cấp độ N2 - Phần 2', 8),

-- Topic 9: Luyện đề tổng hợp
(N'Luyện đề N1 - Đề 1', 9),
(N'Luyện đề N1 - Đề 2', 9);

INSERT INTO UserProgress 
(UserId, LessonId, IsCompleted, CompletedDate, EarnedXP)
VALUES

-- User 1 hoàn thành 3 bài đầu
(N'aceeb2a9-a807-4724-8db6-ced0399c95ed', 1, 1, GETDATE(), 10),
(N'aceeb2a9-a807-4724-8db6-ced0399c95ed', 2, 1, GETDATE(), 10),
(N'aceeb2a9-a807-4724-8db6-ced0399c95ed', 3, 1, GETDATE(), 10),

-- User 1 đang học bài 4
(N'aceeb2a9-a807-4724-8db6-ced0399c95ed', 4, 0, NULL, 0),

-- User 2 mới hoàn thành 1 bài
(N'f9df26d6-5fee-4bf2-b0b7-8b75e7b8a0ba', 1, 1, GETDATE(), 10);


ALTER TABLE Questions
DROP COLUMN CorrectAnswer;

ALTER TABLE Lessons
ADD BaseXP INT NOT NULL DEFAULT 10;

INSERT INTO Questions (LessonId, Content, QuestionType, OrderIndex)
VALUES 
(1, N'Chữ あ đọc là gì?', 'MultipleChoice', 1); 

INSERT INTO Questions (LessonId, Content, QuestionType, OrderIndex)
VALUES (1, N'Chữ い đọc là gì?','MultipleChoice', 2);

INSERT INTO Questions (LessonId, Content, QuestionType, OrderIndex)
VALUES (1, N'Chữ う đọc là gì?','MultipleChoice' , 3);

INSERT INTO Questions (LessonId, Content, QuestionType, OrderIndex)
VALUES (1, N'Chữ え đọc là gì?','MultipleChoice', 4);

INSERT INTO Questions (LessonId, Content, QuestionType, OrderIndex)
VALUES (1, N'Chữ お đọc là gì?','MultipleChoice', 5);

INSERT INTO Questions (LessonId, Content, QuestionType, OrderIndex)
VALUES (1, N'Trong bảng Hiragana, あ thuộc hàng nào?','MultipleChoice' , 6);

INSERT INTO Questions (LessonId, Content, QuestionType, OrderIndex)
VALUES (1, N'Chữ い và え khác nhau ở điểm nào?','MultipleChoice' , 7);


INSERT INTO Questions (LessonId, Content, QuestionType, OrderIndex)
VALUES (1, N'あ, い, う, え, お thuộc bảng chữ nào?','MultipleChoice' , 8);

INSERT INTO Questions (LessonId, Content, QuestionType, OrderIndex)
VALUES (1, N'Phát âm đúng của う là gì?','MultipleChoice' , 9);


INSERT INTO Questions (LessonId, Content, QuestionType, OrderIndex)
VALUES (1, N'Thứ tự đúng của hàng A là gì?','MultipleChoice' , 10);

INSERT INTO Questions (LessonId, Content, QuestionType, OrderIndex)
VALUES
(2, N'Chữ カ đọc là gì?','MultipleChoice', 1),
(2, N'Chữ キ đọc là gì?','MultipleChoice', 2),
(2, N'Chữ ク đọc là gì?','MultipleChoice', 3),
(2, N'Chữ ケ đọc là gì?','MultipleChoice', 4),
(2, N'Chữ コ đọc là gì?','MultipleChoice', 5);

INSERT INTO Questions (LessonId, Content, QuestionType, OrderIndex)
VALUES
(3, N'Chữ さ đọc là gì?','MultipleChoice', 1),
(3, N'Chữ し đọc là gì?','MultipleChoice', 2),
(3, N'Chữ す đọc là gì?','MultipleChoice', 3);

INSERT INTO Questions (LessonId, Content, QuestionType, OrderIndex)
VALUES
(4, N'お母さん nghĩa là gì?','MultipleChoice', 1),
(4, N'お父さん nghĩa là gì?','MultipleChoice', 2),
(4, N'兄 nghĩa là gì?','MultipleChoice', 3);

INSERT INTO Questions (LessonId, Content, QuestionType, OrderIndex)
VALUES
(5, N'先生 nghĩa là gì?','MultipleChoice', 1),
(5, N'学生 nghĩa là gì?','MultipleChoice', 2),
(5, N'学校 nghĩa là gì?','MultipleChoice', 3);

INSERT INTO Questions (LessonId, Content, QuestionType, OrderIndex)
VALUES
(6, N'一 nghĩa là gì?','MultipleChoice', 1),
(6, N'二 nghĩa là gì?','MultipleChoice', 2),
(6, N'三 nghĩa là gì?','MultipleChoice', 3);


INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect)
VALUES
(1, N'a', 1),
(1, N'i', 0),
(1, N'u', 0),
(1, N'e', 0);


INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect)
VALUES
(2, N'a', 0),
(2, N'i', 1),
(2, N'u', 0),
(2, N'o', 0);




INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect)
VALUES
(3, N'a', 0),
(3, N'i', 0),
(3, N'u', 1),
(3, N'e', 0);



INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect)
VALUES
(4, N'o', 0),
(4, N'e', 1),
(4, N'u', 0),
(4, N'i', 0);



INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect)
VALUES
(5, N'o', 1),
(5, N'e', 0),
(5, N'a', 0),
(5, N'i', 0);



INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect)
VALUES
(6, N'Hàng A', 1),
(6, N'Hàng KA', 0),
(6, N'Hàng SA', 0),
(6, N'Hàng TA', 0);



INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect)
VALUES
(7, N'Số nét viết', 1),
(7, N'Không khác gì', 0),
(7, N'Cách phát âm giống nhau', 0),
(7, N'Cùng nghĩa', 0);

INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect)
VALUES
(8, N'Hiragana', 1),
(8, N'Katakana', 0),
(8, N'Kanji', 0),
(8, N'Romaji', 0);



INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect)
VALUES
(9, N'u (giống âm u trong tiếng Việt)', 1),
(9, N'o', 0),
(9, N'i', 0),
(9, N'e', 0);


INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect)
VALUES
(10, N'あ い う え お', 1),
(10, N'あ う い え お', 0),
(10, N'い あ う え お', 0),
(10, N'あ い え う お', 0);






INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect)
VALUES
(11, 'ka', 1),
(11, 'ki', 0),
(11, 'ku', 0),
(11, 'ko', 0);

INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect)
VALUES
(12, 'ka', 0),
(12, 'ki', 1),
(12, 'ke', 0),
(12, 'ko', 0);

INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect)
VALUES
(13, 'ku', 1),
(13, 'ka', 0),
(13, 'ki', 0),
(13, 'ke', 0);

INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect)
VALUES
(14, 'ke', 1),
(14, 'ko', 0),
(14, 'ka', 0),
(14, 'ku', 0);

INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect)
VALUES
(15, 'ko', 1),
(15, 'ke', 0),
(15, 'ki', 0),
(15, 'ka', 0);

INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect) VALUES
(16, 'sa', 1),(16, 'shi', 0),(16, 'su', 0),(16, 'se', 0),
(17, 'sa', 0),(17, 'shi', 1),(17, 'su', 0),(17, 'so', 0),
(18, 'su', 1),(18, 'shi', 0),(18, 'sa', 0),(18, 'se', 0);

INSERT INTO QuestionOptions VALUES
(19, N'mẹ', 1),(19, N'bố', 0),(19, N'anh trai', 0),(19, N'chị gái', 0),
(20, N'bố', 1),(20, N'mẹ', 0),(20, N'em trai', 0),(20, N'chị gái', 0),
(21, N'anh trai', 1),(21, N'em trai', 0),(21, N'bố', 0),(21, N'mẹ', 0);

INSERT INTO QuestionOptions VALUES
(22, N'giáo viên', 1),(22, N'học sinh', 0),(22, N'trường học', 0),(22, N'bạn bè', 0),
(23, N'học sinh', 1),(23, N'giáo viên', 0),(23, N'trường', 0),(23, N'lớp học', 0),
(24, N'trường học', 1),(24, N'giáo viên', 0),(24, N'học sinh', 0),(24, N'bàn học', 0);

INSERT INTO QuestionOptions VALUES
(23, '1', 1),(23, '2', 0),(23, '3', 0),(23, '4', 0),
(24, '2', 1),(24, '1', 0),(24, '3', 0),(24, '5', 0),
(25, '3', 1),(25, '1', 0),(25, '2', 0),(25, '6', 0);




ALTER TABLE UserItems Add QUANTITY INT NOT NULL



-------------------------------------------------------------------------------
-- KHÚC DƯỚI NÀY MỚI THÊM VÀO
-------------------------------------------------------------------------------

CREATE TABLE Tasks (
    TaskId INT IDENTITY PRIMARY KEY,
    TaskName NVARCHAR(200) NOT NULL,
    TaskType NVARCHAR(50) NOT NULL, 
    TargetValue INT NOT NULL,
    RewardXP INT DEFAULT 0,
    RewardGems INT DEFAULT 0,
    IsDaily BIT DEFAULT 1
);

EXEC sp_rename 'AspNetUsers.Hearts', 'CurrentHearts', 'COLUMN';

CREATE TABLE Achievements (
    AchievementId INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255),
    IconUrl NVARCHAR(255),
    RequiredValue INT,
    AchievementType NVARCHAR(50)
);

CREATE TABLE UserAchievements (
    UserAchievementId INT IDENTITY PRIMARY KEY,
    UserId NVARCHAR(450) NOT NULL,
    AchievementId INT NOT NULL,
    UnlockedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (AchievementId) REFERENCES Achievements(AchievementId)
);

INSERT INTO Achievements (Name, Description, IconUrl, RequiredValue, AchievementType)
VALUES
(N'Bài học đầu tiên', N'Hoàn thành bài học đầu tiên của bạn', '/icons/first_lesson.png', 1, 'LESSON_COMPLETE'),

(N'Người học chăm chỉ', N'Hoàn thành 10 bài học', '/icons/lesson_10.png', 10, 'LESSON_COMPLETE'),

(N'Bậc thầy bài học', N'Hoàn thành 50 bài học', '/icons/lesson_50.png', 50, 'LESSON_COMPLETE'),

(N'Người mới tích XP', N'Đạt 100 XP', '/icons/xp_100.png', 100, 'TOTAL_XP'),

(N'Cao thủ XP', N'Đạt 1000 XP', '/icons/xp_1000.png', 1000, 'TOTAL_XP'),

(N'Streak 3 ngày', N'Học liên tiếp trong 3 ngày', '/icons/streak_3.png', 3, 'STREAK_DAYS'),

(N'Streak 7 ngày', N'Học liên tiếp trong 7 ngày', '/icons/streak_7.png', 7, 'STREAK_DAYS');

INSERT INTO Tasks (TaskName, TaskType, TargetValue, RewardXP, RewardGems)
VALUES

-- LESSON COMPLETE
(N'Hoàn thành 1 bài học', 'LESSON_COMPLETE', 1, 20, 1),
(N'Hoàn thành 2 bài học', 'LESSON_COMPLETE', 2, 30, 1),
(N'Hoàn thành 3 bài học', 'LESSON_COMPLETE', 3, 40, 2),
(N'Hoàn thành 5 bài học', 'LESSON_COMPLETE', 5, 60, 3),

-- CORRECT ANSWER
(N'Trả lời đúng 5 câu', 'CORRECT_ANSWER', 5, 15, 1),
(N'Trả lời đúng 10 câu', 'CORRECT_ANSWER', 10, 30, 2),
(N'Trả lời đúng 15 câu', 'CORRECT_ANSWER', 15, 40, 2),
(N'Trả lời đúng 20 câu', 'CORRECT_ANSWER', 20, 50, 3),

-- PERFECT LESSON
(N'Hoàn thành 1 bài học không sai', 'PERFECT_LESSON', 1, 30, 2),
(N'Hoàn thành 2 bài học không sai', 'PERFECT_LESSON', 2, 50, 3),

-- EARN XP
(N'Kiếm 30 XP', 'EARN_XP', 30, 20, 1),
(N'Kiếm 50 XP', 'EARN_XP', 50, 30, 1),
(N'Kiếm 100 XP', 'EARN_XP', 100, 50, 2),
(N'Kiếm 200 XP', 'EARN_XP', 200, 70, 3),

-- SPECIAL TASK
(N'Học 1 bài học mới', 'NEW_LESSON', 1, 30, 2),
(N'Hoàn thành bài học trong 3 phút', 'FAST_LESSON', 1, 35, 2),
(N'Hoàn thành 2 bài học liên tiếp', 'LESSON_CHAIN', 2, 40, 2),

-- ACCURACY TASK
(N'Đạt độ chính xác 80% trong 1 bài học', 'ACCURACY', 80, 35, 2),
(N'Đạt độ chính xác 90% trong 1 bài học', 'ACCURACY', 90, 45, 2),

-- TOPIC TASK
(N'Hoàn thành 1 bài trong topic mới', 'NEW_TOPIC', 1, 40, 2);


CREATE TABLE UserTasks (
    UserTaskId INT IDENTITY PRIMARY KEY,
    UserId NVARCHAR(450) NOT NULL,
    TaskId INT NOT NULL,
    Progress INT DEFAULT 0,
    IsCompleted BIT DEFAULT 0,
    IsClaimed BIT DEFAULT 0,
    AssignedDate DATE NOT NULL
);

CREATE TABLE UserMistakes (
    Id INT IDENTITY PRIMARY KEY,
    UserId NVARCHAR(450) NOT NULL,
    QuestionId INT NOT NULL,
    WrongCount INT DEFAULT 1,
    LastWrongAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (QuestionId) REFERENCES Questions(QuestionId)
);

SELECT * FROM UserMistakes


ALTER TABLE UserItems
ADD ActivatedAt DATETIME NULL;

ALTER TABLE UserItems
ADD ExpiredAt DATETIME NULL;

ALTER TABLE UserItems
ADD IsConsumed BIT NOT NULL DEFAULT 0;

ALTER TABLE Items
ADD DurationMinutes INT NULL;

ALTER TABLE Items
ADD IsConsumable BIT NOT NULL DEFAULT 0;


ALTER TABLE UserAchievements
ADD IsClaimed BIT NOT NULL DEFAULT 0;


-------------------------------------------------------------------------------
-- KHÚC DƯỚI NÀY MỚI THÊM VÀO
-- ĐÂY LÀ DATA CỦA VẬT PHẨM
-------------------------------------------------------------------------------

INSERT INTO Items 
(Name, Description, Price, ImageUrl, Category, IsActive, DurationMinutes, IsConsumable)
VALUES
(N'Đóng băng chuỗi', 
 N'Bảo vệ chuỗi ngày học của bạn trong 1 ngày', 
 10, '/images/items/streak-freeze.png', 'powerup', 1, 1440, 0),

(N'Trang Phục Samurai', 
 N'Trang phục chiến binh Nhật Bản truyền thống', 
 50, '/images/items/samurai-outfit.png', 'outfit', 1, NULL, 0),

(N'Nền Hoa Anh Đào', 
 N'Nền hoa anh đào đẹp mắt', 
 30, '/images/items/cherry-blossom-bg.png', 'decoration', 1, NULL, 0),

(N'Trang Phục Kimono', 
 N'Kimono truyền thống Nhật Bản', 
 80, '/images/items/kimono-outfit.png', 'outfit', 1, NULL, 0),

(N'Tăng Gấp Đôi XP', 
 N'Nhân đôi điểm kinh nghiệm trong 15 phút', 
 25, '/images/items/xp-boost.png', 'powerup', 1, 15, 1),

(N'Trang Phục Ninja', 
 N'Trang phục ninja bí mật', 
 60, '/images/items/ninja-outfit.png', 'outfit', 1, NULL, 0),

(N'Nền Núi Phú Sĩ', 
 N'Nền núi Phú Sĩ biểu tượng', 
 60, '/images/items/fuji-bg.png', 'outfit', 1, NULL, 0),

(N'Tua Ngược Thời Gian', 
 N'Khôi phục lại chuỗi ngày học', 
 10, '/images/items/time-rewind.png', 'powerup', 1, 30, 1),

(N'Mèo May Mắn', 
 N'Mang lại may mắn trong học tập', 
 40, '/images/items/lucky-charm.png', 'powerup', 1, NULL, 0);
