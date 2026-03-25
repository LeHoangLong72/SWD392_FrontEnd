# 🔴 API Error Diagnosis - Submit Answer Failed

## Error Found: "Gửi câu trả lời thất bại" (Failed to submit answer)

---

## 📊 Root Cause Analysis

### **Issue 1: Case Sensitivity in JSON Serialization** ⚠️

**Frontend sends** (Learning.jsx:218):
```javascript
{
  "questionId": 1,
  "selectedOptionId": 2
}
```

**Backend expects** (SubmitAnswerRequest.cs):
```csharp
public class SubmitAnswerRequest
{
    public int QuestionId { get; set; }
    public int SelectedOptionId { get; set; }
}
```

**Analysis**: 
- Frontend uses camelCase: `questionId`, `selectedOptionId`
- Backend uses PascalCase: `QuestionId`, `SelectedOptionId`
- Default .NET 6+ System.Text.Json **IS case-insensitive**, so this should work...
- **HOWEVER**: The error might be thrown AFTER deserialization succeeds

---

### **Issue 2: Most Likely - Invalid QuestionOption ID** 🎯

**LessonAttemptRepository.cs:280**:
```csharp
var option = await _context.QuestionOptions
    .FirstOrDefaultAsync(o =>
        o.OptionId == request.SelectedOptionId &&
        o.QuestionId == request.QuestionId);

if (option == null)
    throw new Exception("Lựa chọn không hợp lệ");  // Invalid choice
```

**What's happening:**
1. Frontend loads lesson questions with options
2. Frontend displays options with `optionId` from API
3. Frontend user selects an option (frontend tracks as `selectedOptionId`)
4. Frontend could be sending WRONG `selectedOptionId` (off-by-one error, missing IDs, etc.)
5. Backend can't find matching QuestionOption
6. Throws "Invalid choice" error
7. Frontend catches and shows alert

---

### **Issue 3: Invalid Attempt ID** 🎯

**Possible but less likely** - If LessonAttempt doesn't exist:
```csharp
var attempt = await _context.LessonAttempts
    .FirstOrDefaultAsync(a =>
        a.LessonAttemptId == attemptId &&
        a.UserId == userId);

if (attempt == null)
    throw new Exception("Invalid attempt");
```

---

## 🔍 Verification Checklist

### **Step 1: Check Frontend Data Reception**

In **Learning.jsx** `handleLoadLesson`:
```javascript
// Add this console.log to verify option IDs
console.log('Loaded options:', currentQuestion.options)
// Should show: [
//   { optionId: 1, optionText: "選択肢1" },
//   { optionId: 2, optionText: "選択肢2" },
//   ...
// ]
```

### **Step 2: Check Frontend Selection**

In **Learning.jsx** `handleSubmitAnswer`:
```javascript
console.log('Submitting:', {
  questionId: currentQuestion.questionId,
  selectedOptionId: selectedOptionId,
  availableOptions: currentQuestion.options.map(o => o.optionId)
})
// Should show that selectedOptionId is IN availableOptions array
```

### **Step 3: Database CHECK**

```sql
-- Check if Questions and QuestionOptions exist
SELECT TOP 5 
    q.QuestionId,
    q.Content,
    o.OptionId,
    o.OptionText,
    o.IsCorrect
FROM Questions q
LEFT JOIN QuestionOptions o ON q.QuestionId = o.QuestionId
ORDER BY q.QuestionId, o.OptionId;

-- Should return something like:
-- QuestionId   Content           OptionId  OptionText        IsCorrect
-- 1            何ですか？           1        猫                0
-- 1            何ですか？           2        犬                1
-- 1            何ですか？           3        鳥                0
-- ...
```

### **Step 4: Check LessonAttempt Creation**

```sql
-- Check if lesson attempts are being created
SELECT TOP 5 
    LessonAttemptId,
    UserId,
    LessonId,
    StartedAt,
    CorrectAnswers,
    TotalQuestions
FROM LessonAttempts
ORDER BY StartedAt DESC;

-- Should show recent attempts with UserId matching logged-in user
```

---

## 🛠️ Fix: Enable Better Error Messages

**Add this to LessonAttemptController.cs**:

```csharp
[HttpPost("submit-answer/{attemptId}")]
public async Task<IActionResult> SubmitAnswer(int attemptId, [FromBody] SubmitAnswerRequest request)
{
    try
    {
        // DEBUG: Log the request
        System.Console.WriteLine($"[DEBUG] SubmitAnswer called:");
        System.Console.WriteLine($"  AttemptId: {attemptId}");
        System.Console.WriteLine($"  QuestionId: {request?.QuestionId}");
        System.Console.WriteLine($"  SelectedOptionId: {request?.SelectedOptionId}");
        
        var userId = User.GetUserId();
        var result = await _lessonContentRepo.SubmitAnswerAsync(userId, attemptId, request);
        
        return Ok(result);
    }
    catch (Exception ex)
    {
        // DEBUG: Return detailed error
        System.Console.WriteLine($"[ERROR] SubmitAnswer failed: {ex.Message}");
        System.Console.WriteLine($"[ERROR] Stack trace: {ex.StackTrace}");
        
        return BadRequest(new { 
            message = ex.Message,
            type = ex.GetType().Name,
            stack = ex.StackTrace  // Remove in production!
        });
    }
}
```

---

## 📋 Complete Diagnostic Checklist

| Item | Status | Action |
|------|--------|--------|
| [ ] JSON case sensitivity | Assumed OK | Monitor console |
| [ ] QuestionOptions populated | **VERIFY** | Run SQL query |
| [ ] LessonAttempt created | **VERIFY** | Run SQL query |
| [ ] OptionId matches | **VERIFY** | Check frontend console |
| [ ] Backend error details | **GET** | Add debug logging ☝️ |
| [ ] User token valid | Likely OK | Check in browser DevTools |
| [ ] Hearts remaining | Visible ✅ | User has 5/5, so OK |

---

## 🚀 Immediate Action Plan

### **Option 1: Manual Debug (Fastest)**
1. Open http://localhost:5173 → DevTools (F12) → Console tab
2. Click a lesson, select an answer
3. Look for error in console
4. Share screenshot of error with stack trace

### **Option 2: Add Diagnostic Endpoint** (Recommended for Production)
Apply the fix above to LessonAttemptController.cs, rebuild, and try again

### **Option 3: Check Database State**
Run the SQL queries above in SSMS to verify:
- Questions exist
- QuestionOptions exist with correct IDs
- No orphaned records

---

## 📝 Next Steps

1. **Gather more info**: Enable debug logging ☝️
2. **Rebuild**: `dotnet clean; dotnet run --urls "http://localhost:5195"`
3. **Test again**: Try to submit answer
4. **Check console**: Backend should now show detailed error
5. **Verify data**: Run SQL queries to ensure data exists
6. **Report**: Share console error + SQL results

---

**Status**: 🔴 CRITICAL - User cannot complete lessons  
**Priority**: P1 - Blocking core functionality  
**ETA Fix**: 15 minutes with debug logging
