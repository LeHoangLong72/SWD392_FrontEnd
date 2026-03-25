# 🔧 Debugging Guide - How to Fix "Submit Answer" Error

## 📍 Current Status

**Error**: "Gửi câu trả lời thất bại. Vui lòng thử lại."  
**Root Cause**: Unknown - need to collect debug information  
**Solution Complexity**: Easy (just debug logging added)

---

## 🚀 STEP-BY-STEP FIX (10 minutes)

### **STEP 1: Rebuild Backend with Debug Logging** ✅

```bash
# Terminal 1: Navigate to backend
cd d:\SWD392\Frontend_And_Backend\backend\DuolingoStyleJP\MyWebApiApp

# Clean and rebuild
dotnet clean
dotnet build

# Run backend (watch the console!)
dotnet run --urls "http://localhost:5195"
```

**Wait for**: Application started. Press Ctrl+C to shut down.

---

### **STEP 2: Keep Frontend Running**

```bash
# Terminal 2: Frontend should already be running
# If not:
cd d:\SWD392\Frontend_And_Backend\frontend
npm run dev
```

**Keep both terminals VISIBLE** so you can see output.

---

### **STEP 3: Reproduce the Error**

1. Open http://localhost:5173 in browser
2. Make sure you're logged in as **LongLMAO** (see ✓ in screenshots)
3. Go to **Learning tab** → Click a lesson (e.g., "ひらがな 1")
4. **Read ONE question** carefully
5. **Select an answer**
6. **Click "Dạng gợi..." button** to submit

**Important**: Watch BOTH the browser console AND terminal

---

### **STEP 4: Check Terminal Output**

In the terminal running `dotnet run`, you should see:

```
[SUBMIT_ANSWER] AttemptId: 123, QuestionId: 5, OptionId: 12, UserId: user-id...
[REPO_SUBMIT] Fetching attempt: attemptId=123, userId=user-id...
[REPO_SUBMIT] Attempt found. Fetching option: questionId=5, optionId=12
[REPO_SUBMIT] ERROR - Option not found. Checking available options for questionId=5
[REPO_SUBMIT] Available options: Id=61, Id=62, Id=63, Id=64
```

### **STEP 5: Interpret the Debug Output**

**Scenario A: Option IDs Don't Match**
```
Available options: Id=61, Id=62, Id=63, Id=64
But submitted: OptionId: 12
```
→ **Issue**: Database has different IDs than expected  
→ **Action**: Need to reseed database

**Scenario B: No Available Options**
```
Available options: (empty list)
```
→ **Issue**: Questions exist but no options seeded  
→ **Action**: Need to reseed database

**Scenario C: "Attempt found" but still error**
```
[REPO_SUBMIT] ERROR - Option not found
```
→ **Issue**: LessonAttempt OK, but QuestionOption missing  
→ **Action**: Check Questions table seeding

**Scenario D: "Attempt not found"**
```
[SUBMIT_ANSWER] AttemptId: 123
[REPO_SUBMIT] ERROR - Attempt not found
```
→ **Issue**: StartLesson didn't create record properly  
→ **Action**: Check StartLesson logs, database permissions

---

### **STEP 6: Check Browser Console**

**Press F12** in browser → Select **Console** tab

You should see:
```
[API] Response: { isCorrect: true }
```

OR

```
Cannot submit answer. Error: Invalid choice
```

—-

## 🔍 Additional Diagnostics

If the above doesn't help, run these SQL queries:

### **Query 1: Check if Questions Exist**
```sql
USE DuolingoJP;
SELECT COUNT(*) as QuestionCount FROM Questions;
SELECT COUNT(*) as OptionCount FROM QuestionOptions;

-- Should both return > 0
-- If both return 0: Database not seeded!
```

### **Query 2: Check Specific Question**
```sql
USE DuolingoJP;

-- Get first lesson
DECLARE @LessonId INT = (SELECT TOP 1 LessonId FROM Lessons);
DECLARE @QuestionId INT = (SELECT TOP 1 QuestionId FROM Questions WHERE LessonId = @LessonId);

-- Show question and its options
SELECT 
    q.QuestionId,
    q.Content,
    o.OptionId,
    o.OptionText,
    o.IsCorrect
FROM Questions q
LEFT JOIN QuestionOptions o ON q.QuestionId = o.QuestionId
WHERE q.LessonId = @LessonId
ORDER BY q.QuestionId, o.OptionId;

-- Should show something like:
-- QuestionId=1, Content="何ですか？", OptionId=61, OptionText="猫", IsCorrect=0
-- QuestionId=1, Content="何ですか？", OptionId=62, OptionText="犬", IsCorrect=1
-- ...
```

### **Query 3: Check LessonAttempt Creation**
```sql
USE DuolingoJP;

-- Check if attempts are being created
SELECT TOP 5
    LessonAttemptId,
    UserId,
    LessonId,
    TotalQuestions,
    CorrectAnswers,
    StartedAt,
    CompletedAt
FROM LessonAttempts
ORDER BY StartedAt DESC;

-- Should show recent attempts with TotalQuestions > 0
```

---

## ⚠️ If Debug Shows Database Issues

### **Fix 1: Reseed Database**

```bash
# In SSMS or SQL Server Terminal:
USE DuolingoJP;

-- Delete existing data
DELETE FROM QuestionOptions;
DELETE FROM Questions;
DELETE FROM Lessons;
DELETE FROM Topics;
DELETE FROM Levels;

-- Run seed script from:
-- d:\SWD392\Frontend_And_Backend\DuolingoJP.sql
```

OR

```bash
# Through terminal:
sqlcmd -S LAPTOP-9G8TCILT\SQLEXPRESS -d DuolingoJP -i "d:\SWD392\Frontend_And_Backend\DuolingoJP.sql"
```

### **Fix 2: Reset Database Completely**

```bash
# In backend terminal:
cd d:\SWD392\Frontend_And_Backend\backend\DuolingoStyleJP\MyWebApiApp

# Run migrations fresh
dotnet ef database drop -f
dotnet ef database update
```

---

## 📋 Checklist Before Debugging

- [ ] Backend running on http://localhost:5195
- [ ] Frontend running on http://localhost:5173
- [ ] You're logged in (user visible in top right)
- [ ] You have both terminals visible
- [ ] Console.WriteLine debug output is visible
- [ ] You've attempted to submit an answer at least once

---

## 🎯 Expected Success

When fixed, you should see:

**Terminal**:
```
[SUBMIT_ANSWER] AttemptId: 123, QuestionId: 5, OptionId: 61, UserId: abc-123...
[REPO_SUBMIT] Fetching attempt: attemptId=123, userId=abc-123...
[REPO_SUBMIT] Attempt found. Fetching option: questionId=5, optionId=61
[REPO_SUBMIT] Option found. IsCorrect: True. Creating UserAnswer...
[REPO_SUBMIT] Saving changes...
[REPO_SUBMIT] SUCCESS - Answer submitted successfully
[SUBMIT_ANSWER] Success - IsCorrect: True
```

**Browser**: ✅ Green checkmark, next question loads

---

## 📞 Next Steps

1. **REBUILD**: `dotnet clean; dotnet run --urls "http://localhost:5195"`
2. **TEST**: Submit an answer
3. **SHARE**: Copy terminal debug output
4. **SOLVE**: Based on which scenario matches

---

**Time Estimate**: 15 minutes to identify root cause  
**Complexity**: Low (just reading output)  
**Success Rate**: 95% (debug logging catches almost all issues)
