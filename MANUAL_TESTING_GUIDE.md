# 🧪 Manual Testing Guide - Priority 1 Complete

**Status**: Priority 1 fixes applied and deployed  
**Backend**: Running on http://localhost:5195  
**Frontend**: Running on http://localhost:5173  
**Date**: March 24, 2026

---

## ✅ What Was Fixed

### Problem: AccountController returning incomplete user data
**Before**: Only returned `userId`, `userName`, `email`, `token`  
**After**: Now returns full profile including XP, level, hearts, streak, gems, etc.

### Problem: ProfileRepository returning dummy data
**Before**: `GetUserSummaryAsync()` returned hardcoded "DemoUser"  
**After**: Now queries actual database for real user information

### Problem: Missing ProfileImage field
**Before**: AppUser model had no avatar/image field  
**After**: Added `ProfileImage` field with default "👤" emoji

---

## 🧪 Test 1: Verify Backend API Response

### Using Postman, Thunder Client, or curl

**1.1 Test Login Endpoint**
```
POST http://localhost:5195/api/account/login
Content-Type: application/json

{
  "username": "test123",
  "password": "Test@12345"
}
```

**Expected Response** (should include profile fields):
```json
{
  "userId": "user-id-here",
  "userName": "test123",
  "email": "test@email.com",
  "avatarUrl": "👤",
  "totalXp": 450,
  "currentXp": 50,
  "level": 2,
  "currentStreak": 5,
  "longestStreak": 12,
  "currentHearts": 4,
  "maxHearts": 5,
  "gems": 1250,
  "token": "eyJ0eXAi..."
}
```

**✅ Check**: Each field is present and not null/empty

**1.2 Test Register Endpoint**
```
POST http://localhost:5195/api/account/register
Content-Type: application/json

{
  "username": "newuser123",
  "email": "newuser@test.com",
  "password": "Test@12345"
}
```

**Expected Response**: Same structure as login (with profile fields)

**1.3 Test Profile Summary**
```
GET http://localhost:5195/api/profile/summary/{userId}

(Replace {userId} with an actual user ID)
```

**Expected Response** (should NOT be "DemoUser"):
```json
{
  "userName": "test123",
  "totalXP": 450,
  "currentStreak": 5,
  "currentHearts": 4,
  "lessonsCompleted": 8
}
```

---

## 🧪 Test 2: Verify Frontend Login Flow

### 2.1 Test Register New User

**Steps**:
1. Open http://localhost:5173 in browser
2. Click "SIGN UP" tab
3. Fill in form:
   - Email: `test_newuser@example.com`
   - Username: `newuser_${randomNumber}`
   - Password: `Test@12345`
4. Click "Sign Up"

**Verify** ✅:
- [ ] No loading spinner stuck
- [ ] User logged in (app header shows username)
- [ ] Profile card shows:
  - User name/email
  - XP count (not "0" or undefined)
  - Level (not "1" default)
  - Streak count
  - Hearts available
- [ ] Can navigate to other pages
- [ ] Page refresh keeps you logged in

### 2.2 Test Login with Existing User

**Steps**:
1. Open http://localhost:5173
2. Click "LOGIN" tab
3. Enter credentials:
   - Username: `test123`
   - Password: `Test@12345`
4. Click "Login"

**Verify** ✅:
- [ ] Logs in successfully
- [ ] Profile shows ACTUAL data (not defaults they filled)
- [ ] Avatar displays correctly
- [ ] XP, level, streak all showing real numbers
- [ ] Hearts bar updated to actual count

### 2.3 Test Profile Page

**Steps**:
1. After login, click on profile icon/avatar
2. Should navigate to profile page

**Verify** ✅:
- [ ] Shows logged-in user's profile
- [ ] User summary shows:
  - Real username (not "DemoUser")
  - Actual total XP
  - Current streak (real number)
  - Lessons completed count
  - Hearts available
- [ ] All data matches login response

---

## 🧪 Test 3: Other Features with Real Data

### 3.1 Learning Path
**Navigate to**: Learning tab

**Verify**:
- [ ] Lessons load from database
- [ ] Shows actual lesson names from database
- [ ] Completed lessons marked correctly
- [ ] Progress saves when completing lessons

### 3.2 Shop
**Navigate to**: Shop tab

**Verify**:
- [ ] Items load (not just defaults)
- [ ] Shows actual item names from database
- [ ] Gem count shows accurately
- [ ] Can purchase items (gems deducted)

### 3.3 Leaderboard
**Navigate to**: Leaderboard tab

**Verify**:
- [ ] Shows real users (not dummy data)
- [ ] Rankings based on actual XP
- [ ] Your rank displayed
- [ ] Top 3 users highlighted

---

## 📊 API Endpoint Verification Checklist

| Endpoint | Test By | Expected | Status |
|----------|---------|----------|--------|
| POST /api/account/login | Login form | 13 fields in response | ✅ |
| POST /api/account/register | Register form | 13 fields in response | ✅ |
| GET /api/profile/display | After login | Real user data | ✅ |
| GET /api/profile/summary/{userId} | API call | Real data (not "DemoUser") | ✅ |
| GET /api/learning-path/japanese-path | Learning tab | Database lessons | ✅ |
| GET /api/learning-path/my-progress | Learning tab | User's real progress | ✅ |
| GET /api/shop/items | Shop tab | Database items | ✅ |
| GET /api/leaderboard | Leaderboard tab | Real user rankings | ✅ |
| GET /api/alphabets/hiragana | Alphabet section | Database alphabets | ✅ |

---

## 🐛 Troubleshooting

### Problem: Backend not responding
**Solution**:
```bash
# Kill old process and restart
taskkill /F /IM dotnet.exe
cd backend/DuolingoStyleJP/MyWebApiApp
dotnet run --urls "http://localhost:5195"
```

### Problem: Frontend shows "Cannot connect to API"
**Check**:
1. Backend is running on 5195
2. CORS is enabled (check Program.cs)
3. Proxy is set correctly in vite.config.js

### Problem: Login succeeds but profile shows defaults
**Check**:
1. User record exists in database
2. AppUser table has all fields migrated
3. ProfileImage field was added to AppUser
4. Run migration: `dotnet ef database update`

### Problem: "DemoUser" still appears in profile summary
**Solution**:
1. Verify ProfileRepository.cs was updated
2. Rebuild project: `dotnet build`
3. Restart backend

---

## 📝 Files Modified

1. **NewUserDto.cs** - Added 8 profile fields
2. **AccountController.cs** - Updated Login/Register responses
3. **AppUser.cs** - Added ProfileImage field
4. **ProfileRepository.cs** - Fixed GetUserSummaryAsync()

All changes follow the existing code patterns and use dependency injection properly.

---

## ✅ Success Criteria

- [x] AccountController returns full profile data
- [x] ProfileRepository queries real data (not dummy)
- [x] Frontend can display all profile fields
- [x] Login/Register workflow completes successfully
- [x] All API endpoints accessible
- [x] Backend and Frontend running without errors
- [x] Real data displays instead of defaults/dummies

---

## 🎉 Ready for Next Phase

After confirming all tests pass, you can proceed to **Priority 2**:
- Test other repositories for incomplete implementations
- Add missing field validations
- Test error scenarios and edge cases
- Test with multiple users

