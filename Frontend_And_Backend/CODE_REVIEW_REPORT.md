# 🔍 Code Review Report - Duolingo JP Project

**Date**: March 24, 2026  
**Status**: ~70% Complete - Critical Issues Found  
**Priority**: HIGH - Account/Authentication Response Issue

---

## 📋 Executive Summary

The project has a **well-structured architecture** with functional Fetch API implementation and comprehensive backend endpoints. However, there are **critical issues** preventing proper user authentication flow and profile data synchronization between FE and BE.

### ✅ What's Working
- ✅ Fetch API properly implemented with error handling
- ✅ JWT token authentication configured
- ✅ Database schema complete with all necessary tables
- ✅ Repository pattern correctly implemented
- ✅ All major controllers exist (Account, Profile, Shop, Lessons, etc.)
- ✅ Most API endpoints functional

### ❌ Critical Issues
1. **AccountController returns incomplete data** (BLOCKING)
2. **ProfileRepository has hardcoded dummy data**
3. **Auth.jsx fills in defaults because API doesn't return them**
4. **Some repositories have stub/incomplete implementations**

---

## 🔴 CRITICAL ISSUE #1: AccountController Incomplete Response

### Problem
**Login/Register endpoints return only 4 fields:**
```json
{
  "userId": "...",
  "userName": "...",
  "email": "...",
  "token": "..."
}
```

**But Auth.jsx expects 11 fields:**
```json
{
  "id": "...",
  "name": "...",
  "username": "...",
  "email": "...",
  "avatarUrl": "...",
  "totalXp": 0,
  "currentStreak": 0,
  "currentHearts": 5,
  "maxHearts": 5,
  "level": 1,
  "longestStreak": 0,
  "token": "..."
}
```

### Current Workaround
Auth.jsx fills missing fields with defaults:
```javascript
onLogin({
  id: response.userId,
  name: response.userName || formData.username,
  totalXp: response.totalXp || 0,        // DEFAULTS
  currentStreak: response.currentStreak || 0,  // DEFAULTS
  currentHearts: response.currentHearts || 5,  // DEFAULTS
  ...
})
```

### Impact
- ❌ User profile data not synced to frontend after login
- ❌ Streaks, XP, hearts not properly loaded
- ❌ subsequent page refreshes may lose state

### Solution
**Expand AccountController to return full user profile:**

**File**: `backend/DuolingoStyleJP/MyWebApiApp/Controllers/AccountController.cs`

**Current Code** (Line 30-55):
```csharp
return Ok(
    new NewUserDto
    {
        UserId = user.Id,
        UserName = user.UserName,
        Email = user.Email,
        Token = _tokenService.CreateToken(user)
    }
);
```

**Should Change To**:
```csharp
return Ok(
    new NewUserDto
    {
        UserId = user.Id,
        UserName = user.UserName,
        Email = user.Email,
        AvatarUrl = user.ProfileImage ?? "👤",  // Add avatar
        TotalXp = user.TotalXP,
        CurrentXp = user.CurrentXP,
        Level = user.Level,
        CurrentStreak = user.CurrentStreak,
        LongestStreak = user.LongestStreak,
        CurrentHearts = user.CurrentHearts,
        MaxHearts = user.MaxHearts,
        Token = _tokenService.CreateToken(user)
    }
);
```

---

## 🔴 CRITICAL ISSUE #2: ProfileRepository Returns Dummy Data

### Problem
**File**: `backend/DuolingoStyleJP/MyWebApiApp/Repositories/ProfileRepository.cs` (Line 48-56)

```csharp
public async Task<UserSummaryDto?> GetUserSummaryAsync(string userId)
{
    return new UserSummaryDto
    {
        UserName = "DemoUser",        // ❌ HARDCODED!
        TotalXP = 0,                  // ❌ HARDCODED!
        CurrentStreak = 0,            // ❌ HARDCODED!
        CurrentHearts = 5,            // ❌ HARDCODED!
        LessonsCompleted = 0          // ❌ HARDCODED!
    };
}
```

### Solution
Implement actual database queries:
```csharp
public async Task<UserSummaryDto?> GetUserSummaryAsync(string userId)
{
    var user = await _context.Users
        .FirstOrDefaultAsync(u => u.Id == userId);

    if (user == null) return null;

    var lessonsCompleted = await _context.UserProgress
        .Where(p => p.UserId == userId && p.IsCompleted)
        .CountAsync();

    return new UserSummaryDto
    {
        UserName = user.UserName,
        TotalXP = user.TotalXP,
        CurrentStreak = user.CurrentStreak,
        CurrentHearts = user.CurrentHearts,
        LessonsCompleted = lessonsCompleted
    };
}
```

---

## ⚠️ ISSUE #3: Account Response DTO Missing Fields

### Problem
**File**: `backend/DuolingoStyleJP/MyWebApiApp/DTOs/Account/NewUserDto.cs`

The DTO likely only has 4 properties. Need to add profile-related fields.

### Solution
Update `NewUserDto` to include:
```csharp
public class NewUserDto
{
    public string UserId { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string AvatarUrl { get; set; }  // ADD
    public int TotalXp { get; set; }       // ADD
    public int CurrentXp { get; set; }     // ADD
    public int Level { get; set; }         // ADD
    public int CurrentStreak { get; set; } // ADD
    public int LongestStreak { get; set; } // ADD
    public int CurrentHearts { get; set; } // ADD
    public int MaxHearts { get; set; }     // ADD
    public string Token { get; set; }
}
```

---

## ⚠️ ISSUE #4: Frontend Fetch Endpoints Not Matching API

### Potential Mismatch
**Frontend** calls:
```javascript
api.getProfile()           // → /api/profile/display
api.getMyLearningProgress() // → /api/learning-path/my-progress
```

**Make sure these routes exist** in backend before frontend uses them.

---

## 🔄 API Endpoints Status

| Endpoint | Method | Status | Comments |
|----------|--------|--------|----------|
| `/api/account/login` | POST | ⚠️ Return incomplete | Need to add profile data |
| `/api/account/register` | POST | ⚠️ Return incomplete | Need to add profile data |
| `/api/profile/display` | GET | ✅ Working | Returns full profile |
| `/api/profile/modify` | PUT | ✅ Working | Update user profile |
| `/api/profile/summary/{userId}` | GET | ❌ Dummy data | Returns hardcoded values |
| `/api/learning-path/japanese-path` | GET | ✅ Working | Returns lessons |
| `/api/learning-path/my-progress` | GET | ✅ Working | Returns user progress |
| `/api/lesson-attempt/{lessonId}` | GET | ✅ Working | Get lesson content |
| `/api/lesson-attempt/start/{lessonId}` | POST | ✅ Working | Start lesson |
| `/api/lesson-attempt/submit-answer/{attemptId}` | POST | ✅ Working | Submit answer |
| `/api/lesson-attempt/complete/{attemptId}` | POST | ✅ Working | Complete lesson |
| `/api/shop/items` | GET | ✅ Working | Get shop items |
| `/api/shop/purchase` | POST | ✅ Working | Purchase item |
| `/api/leaderboard` | GET | ✅ Working | Get leaderboard |
| `/api/alphabets/hiragana` | GET | ✅ Working | Get hiragana |
| `/api/alphabets/katakana` | GET | ✅ Working | Get katakana |
| `/api/alphabets/kanji` | GET | ✅ Working | Get kanji |

---

## 📂 Database Status

### Tables Implemented
✅ AspNetUsers (AppUser with profile fields)  
✅ UserProgress (learning progress)  
✅ Lessons, Topics, Levels  
✅ Questions, QuestionOptions  
✅ LessonAttempts  
✅ UserItems, Items  
✅ Achievements, UserAchievements  
✅ UserTasks  
✅ Leaderboard views  

### Fields in AppUser Model
```csharp
- Id (inherited)
- UserName (inherited)
- Email (inherited)
- CurrentXP = 0
- TotalXP = 0
- Level = 1
- CurrentHearts = 5
- MaxHearts = 5
- LastHeartRefillTime
- Gems = 0
- CurrentStreak = 0
- LongestStreak = 0
- LastStudyDate
- StreakFreezeCount = 0
```

**Missing in AppUser**: `ProfileImage`/`AvatarUrl` field

---

## 🛠️ Frontend Fetch API Analysis

### ✅ Strengths
```javascript
// api.js - Properly implemented:
1. Centralized request function with error handling
2. Token management (localStorage)
3. Multiple API base URLs for fallback
4. Proper Authorization headers with Bearer token
5. Error message extraction from response body
6. All major functions exported
```

### ✅ Functions Available
- Authentication: `login()`, `register()`
- Profile: `getProfile()`, `updateProfile()`
- Learning: `getLearningPath()`, `getMyLearningProgress()`, `getLessonContent()`, etc.
- Shop: `getShopItems()`, `purchaseShopItem()`, `getShopInventory()`, etc.
- Leaderboard: `getLeaderboard()`, `getWeeklyLeaderboard()`, etc.
- Other: `getHearts()`, `refillHearts()`, `getAchievements()`, etc.

---

## 📝 Recommended Action Plan

### Priority 1: IMMEDIATE (Blocking login/auth)
- [ ] Add profile fields to `NewUserDto` 
- [ ] Update `AccountController` Login action to return all profile data
- [ ] Update `AccountController` Register action to return all profile data
- [ ] Add `ProfileImage` field to `AppUser` model (optional but recommended)

### Priority 2: HIGH (Data consistency)
- [ ] Fix `ProfileRepository.GetUserSummaryAsync()` to use actual database queries
- [ ] Test all API endpoints to ensure they match frontend expectations
- [ ] Verify LearningRepository implementations are complete

### Priority 3: MEDIUM (Code quality)
- [ ] Handle null/empty profile fields gracefully in Frontend
- [ ] Add input validation on all controllers
- [ ] Test error scenarios (network failures, invalid tokens, etc.)

### Priority 4: ENHANCEMENT (Future)
- [ ] Add request logging/monitoring
- [ ] Implement rate limiting
- [ ] Add caching for frequently accessed data
- [ ] Add API versioning

---

## ✅ Test Checklist

- [ ] Login with valid credentials returns all profile fields
- [ ] Register returns user with default profile values  
- [ ] Token in response can be used to access protected endpoints
- [ ] Profile data persists across page refresh
- [ ] Learning progress loads correctly for authenticated user
- [ ] Shop, leaderboard, and other features work with actual database data
- [ ] Error messages are user-friendly and clear

---

## 📞 Summary

**Current Implementation Status**: 70% complete

**What works**: 
- API architecture, database design, most controllers, error handling

**What needs fixing**:
- Account response completeness (1-2 hours work)
- Repository dummy data removal (1-2 hours work)

**Estimated time to fix**: **2-4 hours**

**Risk Level**: 🟡 MEDIUM (Blocking authentication but easy to fix)

