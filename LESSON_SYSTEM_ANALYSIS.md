# 📊 Complete API Flow Verification - Lesson System

## Overview: How Lessons Work (FE → BE → DB)

```
┌─────────────────────────────────────────────────────────────┐
│                    LESSON FLOW DIAGRAM                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. GET /api/learning-path/japanese-path                    │
│     └─ Returns: [ { lessonId: 1, lessonName: "ひらがな1"..."} ]          │
│                                                              │
│  2. User clicks lesson → GET /api/lesson-attempt/{id}      │
│     └─ Returns: Questions + Options (NO attempt yet)       │
│                                                              │
│  3. User starts lesson → POST /api/lesson-attempt/start/{id}
│     ├─ Creates: LessonAttempt record                        │
│     └─ Returns: Questions + Options + attemptId            │
│                                                              │
│  4. User selects answer → POST /api/lesson-attempt/submit-
      answer/{attemptId}
│     ├─ Payload: { questionId: X, selectedOptionId: Y }     │
│     ├─ Validates: QuestionOption exists                    │
│     ├─ Creates: UserAnswer record                          │
│     ├─ Updates: CorrectAnswers count                       │
│     └─ Returns: { isCorrect: true/false }                  │
│                                                              │
│  5. After all questions → POST /api/lesson-attempt/complete
/{attemptId}
│     ├─ Calculates: XP, streak, achievements...             │
│     └─ Returns: Score, rewards, etc.                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔴 CURRENT ERROR: Step 4 - Submit Answer Fails

**Error Message**: "Gửi câu trả lời thất bại. Vui lòng thử lại."  
**Location**: LessonAttemptRepository.cs:SubmitAnswerAsync  
**Likely Cause**: QuestionOption with combined `(OptionId, QuestionId)` not found

---

## 📋 Verification Steps (IN ORDER)

### **STEP 1: Verify Questions Exist in Database**

```sql
-- Run in SSMS:
SELECT 
    q.QuestionId,
    q.Content,
    q.OrderIndex,
    COUNT(o.OptionId) as OptionCount
FROM Questions q
LEFT JOIN QuestionOptions o ON q.QuestionId = o.QuestionId
GROUP BY q.QuestionId, q.Content, q.OrderIndex
ORDER BY q.QuestionId
LIMIT 50;

-- Expected: 50+ rows with OptionCount >= 2
-- If empty: No questions seeded! Need to run: DuolingoJP.sql
```

### **STEP 2: Verify QuestionOptions Exist**

```sql
-- Run in SSMS:
SELECT TOP 50
    o.OptionId,
    o.QuestionId,
    o.OptionText,
    o.IsCorrect
FROM QuestionOptions o
ORDER BY o.QuestionId, o.OptionId;

-- Expected output:
-- OptionId  QuestionId  OptionText         IsCorrect
-- 1         1           猫                 0
-- 2         1           犬                 1
-- 3         1           鳥                 0
-- 4         1           魚                 0
-- 5         2           春                 0
-- ...

-- If empty: Same issue as Step 1
```

### **STEP 3: Frontend - Check Console for OptionIds**

**In browser (F12 → Console)**:

1. Click lesson to load it
2. Paste and run:
```javascript
// Check what options the frontend received
console.log('Questions loaded:', 
  document.querySelectorAll('[role="radio"]').length, 
  'options'
);

// Alternative: if using React DevTools, inspect Learning component state
```

3. Select an option, then immediately paste:
```javascript
// Check what we're about to submit
const form = document.querySelector('form') || document.body;
console.log('Selected option ID:', form.value || 'UNKNOWN');
```

### **STEP 4: Backend - Check Debug Logs**

After rebuild, when you try to submit an answer:

**In Terminal running `dotnet run`**:
```
[SUBMIT_ANSWER] AttemptId: 123, QuestionId: 5, OptionId: 12, UserId: abc-123...
[SUBMIT_ANSWER] Attempt found
[REPO_SUBMIT] Option not found. Checking available options for questionId=5
[REPO_SUBMIT] Available options: Id=61, Id=62, Id=63, Id=64
[REPO_SUBMIT] ERROR - Option not found
```

**Analysis**:
- If OptionId is 12 but available options are 61-64 → FRONTEND ISSUE
- If no available options → DATABASE SEEDING ISSUE

### **STEP 5: Confirm API Endpoint Working**

Via terminal/PowerShell:

```powershell
# Get valid question IDs
$token = "YOUR_JWT_TOKEN_FROM_LOCALSTORAGE"  # Get from browser console

# Get lesson content
$response = Invoke-WebRequest -Uri "http://localhost:5195/api/lesson-attempt/1" `
  -Headers @{"Authorization" = "Bearer $token"}

$json = $response.Content | ConvertFrom-Json
$firstQuestion = $json.questions[0]
echo "First Question ID: $($firstQuestion.questionId)"
echo "Options: $($firstQuestion.options | ConvertTo-Json -Depth 2)"

# Now test submission with VALID IDs

$firstOptionId = $firstQuestion.options[0].optionId

$body = @{
    questionId = $firstQuestion.questionId
    selectedOptionId = $firstOptionId
} | ConvertTo-Json

$submitResponse = Invoke-WebRequest -Uri "http://localhost:5195/api/lesson-attempt/submit-answer/ATTEMPT_ID" `
  -Method POST `
  -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
  -Body $body

echo "Response: $($submitResponse.Content)"
```

---

## 🎯 Most Likely Scenarios

### **Scenario A: Database Not Seeded** (HIGH PROBABILITY)
- Questions table = empty OR has wrong structure
- QuestionOptions table = empty OR has wrong structure
- **Fix**: Run `DuolingoJP.sql` seed script

### **Scenario B: OptionId Mismatch** (MEDIUM PROBABILITY)
- Frontend receives OptionId 1-4 from API
- Frontend sends OptionId 1, but DB expects 61-64
- Cause: Multiple lesson attempts or DB reseeding created ID gaps
- **Fix**: Force frontend to send correct IDs from API response

### **Scenario C: LessonAttempt Not Created** (LOW PROBABILITY)
- POST /api/lesson-attempt/start/{lessonId} failed silently
- User proceeded without valid attemptId
- **Fix**: Check browser console for errors when starting lesson

### **Scenario D: JSON Deserialization** (VERY LOW)
- Backend can't parse `{ questionId, selectedOptionId }`
- **Fix**: Ensure Program.cs has proper JSON config (it should be OK by default)

---

## 🛠️ Fix Checklist

After adding debug logging (✅ DONE), do this:

- [ ] **Rebuild**: `dotnet clean; dotnet build`
- [ ] **Run**: `dotnet run --urls "http://localhost:5195"`
- [ ] **Test**: Try submitting answer again
- [ ] **Check Console**: Note the debug output
- [ ] **Share**: Copy console output and paste in next message
- [ ] **If Empty DB**: Run SQL seeding script
- [ ] **If ID Mismatch**: Trace frontend data flow
- [ ] **If Works**: Remove Console.WriteLine() debug code

---

## 📝 All API Endpoints for Lesson System

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/lesson-attempt/{lessonId}` | GET | Get lesson content (questions + options) | ✅ Working |
| `/api/lesson-attempt/start/{lessonId}` | POST | Start lesson (creates LessonAttempt) | ✅ Working |
| `/api/lesson-attempt/submit-answer/{attemptId}` | POST | Submit one answer | 🔴 **BROKEN** |
| `/api/lesson-attempt/complete/{attemptId}` | POST | Complete lesson (calculate XP/rewards) | ✅ Not tested yet |
| `/api/learning-path/japanese-path` | GET | Get all lessons | ✅ Working |
| `/api/learning-path/my-progress` | GET | Get completed lessons | ✅ Working |

---

## 🚀 Quick Fix Procedure

1. **Add Debug Logging** ✅ (Done in updated code)
2. **Rebuild Backend**
```bash
cd d:\SWD392\Frontend_And_Backend\backend\DuolingoStyleJP\MyWebApiApp
dotnet clean
dotnet run --urls "http://localhost:5195"
```
3. Check for logs during error
4. **Verify Database**
```sql
-- If debug shows "Option not found", run:
SELECT COUNT(*) FROM Questions;
SELECT COUNT(*) FROM QuestionOptions;
-- If both return 0 → need to seed DB
```
5. **Share Debug Output** for next steps

---

**Current Status**: Ready for debug logging (✅ Code updated)  
**Next Action**: Rebuild and test, observe console output
