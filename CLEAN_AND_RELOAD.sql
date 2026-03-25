-- CLEAN_AND_RELOAD.sql
-- Script để xóa duplicate data và reload đúng

USE DuolingoJP;

-- ============================================
-- Step 1: Xóa tất cả dữ liệu cũ (giữ structure)
-- ============================================
DELETE FROM UserAnswers;
DELETE FROM LessonAttempts;
DELETE FROM QuestionOptions;
DELETE FROM Questions;
DELETE FROM UserProgress;

-- Verify xóa xong
SELECT 'Questions' as TableName, COUNT(*) as RecordCount FROM Questions
UNION ALL
SELECT 'QuestionOptions', COUNT(*) FROM QuestionOptions
UNION ALL
SELECT 'LessonAttempts', COUNT(*) FROM LessonAttempts
UNION ALL
SELECT 'UserAnswers', COUNT(*) FROM UserAnswers;

-- ============================================
-- Step 2: Insert Questions mới
-- ============================================
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

-- ============================================
-- Step 3: Insert QuestionOptions cho câu 1-5
-- ============================================
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

-- ============================================
-- Step 4: Verify data
-- ============================================
PRINT '=== VERIFICATION ==='
SELECT 'Total Questions in Lesson 1' as Info, COUNT(*) as Count FROM Questions WHERE LessonId = 1
UNION ALL
SELECT 'Total Options', COUNT(*) FROM QuestionOptions
UNION ALL
SELECT 'Options for Q1', COUNT(*) FROM QuestionOptions WHERE QuestionId = 1
UNION ALL
SELECT 'Options for Q2', COUNT(*) FROM QuestionOptions WHERE QuestionId = 2;

-- Chi tiết từng câu
SELECT 
    q.QuestionId,
    q.Content,
    COUNT(qo.OptionId) as OptionCount
FROM Questions q
LEFT JOIN QuestionOptions qo ON q.QuestionId = qo.QuestionId
WHERE q.LessonId = 1
GROUP BY q.QuestionId, q.Content
ORDER BY q.OrderIndex;

PRINT 'CLEAN & RELOAD COMPLETE!';
