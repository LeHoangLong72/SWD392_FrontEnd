# ✅ Complete Feature Test Checklist

**Connection**: ✅ Fixed (SQL Server Express)  
**Authentication**: ✅ Full profile return  
**API Endpoints**: ✅ 32/32 Implemented  
**Ready to Test**: YES

---

## 🚀 Step 1: Prepare Backend

```bash
# Terminal 1: Navigate to backend
cd d:\SWD392\Frontend_And_Backend\backend\DuolingoStyleJP\MyWebApiApp

# Clear old processes (if any)
taskkill /F /IM dotnet.exe

# Rebuild and run
dotnet clean
dotnet build
dotnet run --urls "http://localhost:5195"
```

Wait for: `Application started. Press Ctrl+C to shut down`

---

## 🚀 Step 2: Prepare Frontend

```bash
# Terminal 2: Navigate to frontend
cd d:\SWD392\Frontend_And_Backend\frontend

# Start dev server
npm run dev
```

Wait for: `VITE v... ready in ... ms`  
Then open: `http://localhost:5173`

---

## 🧪 Test Suite 1: Authentication (10 min)

### 1.1 Login with Existing User
- [ ] Open http://localhost:5173
- [ ] Click "LOGIN" tab
- [ ] Enter:
  - Username: `BoCaPTiHon`
  - Password: `Test@12345`
- [ ] Click "LOG IN"
- ✅ Expected: Redirect to home, profile loads with all data

**Verify Data**:
- [ ] Username displays correctly
- [ ] XP count shows (not 0)
- [ ] Level shows (not 1)
- [ ] Hearts shows (not 5 default)
- [ ] Current streak shows

### 1.2 Register New User
- [ ] Click "SIGN UP" tab
- [ ] Enter:
  - Email: `testuser_${Date.now()}@test.com`
  - Username: `testuser${Date.now()}`
  - Password: `Test@12345`
- [ ] Click "Sign Up"
- ✅ Expected: Login succeeds, home page loads

**Verify**:
- [ ] New account created in database
- [ ] User can login with new credentials

### 1.3 Token Persistence
- [ ] Login successfully
- [ ] Refresh page `F5`
- ✅ Expected: Still logged in, no need to login again
- [ ] Check localStorage has `auth_token`

---

## 🧪 Test Suite 2: Learning System (15 min)

### 2.1 View Learning Path
- [ ] From home, navigate to "Learning" tab
- ✅ Expected: See list of lessons from database
- [ ] Check:
  - [ ] Lessons load from DB (not hardcoded defaults)
  - [ ] Completed lessons marked
  - [ ] Lesson names correct

### 2.2 Start & Complete Lesson
- [ ] Click on incomplete lesson "ひらがな 1"
- ✅ Expected: Lesson modal opens with questions
- [ ] Verify questions load:
  - [ ] Has question text
  - [ ] Has 4 answer options
  - [ ] Has audio/visual elements

### 2.3 Answer Questions
- [ ] Select correct answer
- [ ] Click next question
- [ ] Select wrong answer (to test feedback)
- ✅ Expected: Feedback shows
- [ ] Complete all 5-10 questions

### 2.4 Complete Lesson
- [ ] Click "Complete Lesson" button
- ✅ Expected:
  - [ ] Score shows (e.g., 8/10)
  - [ ] XP awarded (check before/after)
  - [ ] Lesson marked completed

**Database Check**:
```sql
SELECT * FROM UserProgress ORDER BY CompletedDate DESC;
-- Verify: Latest record matches your user + lesson
```

### 2.5 View Progress
- [ ] Back to Learning tab
- ✅ Expected: Previously completed lesson now shows as completed
- [ ] Check progress counter updated

### 2.6 View Learning Mistakes (if available)
- [ ] Check if mistakes endpoint returns data:
```
http://localhost:5195/api/learning-path/mistakes
```
- ✅ Expected: Returns questions user got wrong

---

## 🧪 Test Suite 3: Shop & Items (10 min)

### 3.1 Browse Shop
- [ ] Navigate to "Shop" tab
- ✅ Expected: Load items from database
- [ ] Check:
  - [ ] Item names load (not defaults)
  - [ ] Item prices show
  - [ ] Item categories work (power-up, cosmetic, etc)
  - [ ] Gem count displays correctly

### 3.2 Purchase Item
- [ ] Note current gems (e.g., 1250)
- [ ] Click "Buy" on item (e.g., Streak Freeze - 200 gems)
- ✅ Expected:
  - [ ] Gems deducted (1250 → 1050)
  - [ ] Item moves to inventory
  - [ ] "Equipped" button appears

### 3.3 Equip Powerup
- [ ] Click "Equip" on purchased item
- ✅ Expected: Item activates/shows as active

**Database Check**:
```sql
SELECT * FROM UserItems WHERE UserId = (SELECT Id FROM AspNetUsers WHERE UserName = 'BoCaPTiHon');
-- Verify: IsEquipped = 1, ActivatedAt = now
```

---

## 🧪 Test Suite 4: Hearts System (5 min)

### 4.1 Check Hearts
- [ ] Look at heart counter (top right)
- [ ] Note current hearts (e.g., 4/5)
- ✅ Expected: Data loads correctly

### 4.2 Refill Hearts (Optional - costs gems)
- [ ] Click heart icon
- [ ] Click "Refill Hearts"
- ✅ Expected:
  - [ ] Hearts refilled to 5/5
  - [ ] Gems deducted (e.g., 20 gems)

### 4.3 Lose Hearts (Test in Lesson)
- [ ] Start a lesson
- [ ] Answer all questions wrong
- ✅ Expected: After lesson, hearts decreased

---

## 🧪 Test Suite 5: Leaderboard (5 min)

### 5.1 View Global Leaderboard
- [ ] Navigate to "Leaderboard" tab
- ✅ Expected:
  - [ ] See top 50 users with XP rankings
  - [ ] Your rank visible
  - [ ] Rankings based on actual XP (not dummy data)

### 5.2 Check Your Rank
- [ ] Look for your username in list
- [ ] Note your rank number
- ✅ Expected: Accurate based on your XP

### 5.3 Weekly Top 3
- [ ] If available, check weekly leaderboard
- ✅ Expected: Shows top 3 users for current week

---

## 🧪 Test Suite 6: Achievements & Tasks (10 min)

### 6.1 View Achievements
- [ ] Navigate to Achievements section
- ✅ Expected:
  - [ ] See achievement list from database
  - [ ] Shows locked/unlocked status
  - [ ] Shows requirements

### 6.2 Claim Achievement (if unlocked)
- [ ] Find unlocked achievement
- [ ] Click "Claim"
- ✅ Expected:
  - [ ] XP/Gems awarded
  - [ ] Achievement marked as claimed

### 6.3 View Daily Tasks
- [ ] Navigate to Tasks section
- ✅ Expected:
  - [ ] See 3 daily tasks
  - [ ] Tasks from current day
  - [ ] Shows requirements & rewards

### 6.4 Complete & Claim Task
- [ ] Complete a task requirement (e.g., "Complete 1 lesson")
- [ ] Task shows as completed ✓
- [ ] Click "Claim Reward"
- ✅ Expected:
  - [ ] XP/Gems added
  - [ ] Task marked claimed

---

## 🧪 Test Suite 7: Alphabets (5 min)

### 7.1 View Hiragana
- [ ] Navigate to Alphabet section
- ✅ Expected:
  - [ ] See hiragana characters
  - [ ] Properly formatted
  - [ ] Audio/pronunciation available

### 7.2 View Katakana
- [ ] Switch to Katakana
- ✅ Expected: Different characters from Hiragana

### 7.3 View Kanji by Level
- [ ] Filter by level (N5, N4, etc)
- ✅ Expected: Returns only kanji for that level

---

## 🧪 Test Suite 8: Profile (5 min)

### 8.1 View Profile
- [ ] Click profile icon (top right)
- ✅ Expected:
  - [ ] Shows all user data
  - [ ] XP, level, streak, hearts display
  - [ ] Not dummy data ("DemoUser")

### 8.2 Update Profile
- [ ] Edit any field (e.g., username)
- [ ] Click "Save"
- ✅ Expected: Changes saved, data persists on refresh

---

## 🧪 Test Suite 9: Error Handling (5 min)

### 9.1 Login Failure
- [ ] Try login with wrong password
- ✅ Expected: Error message "Tên đăng nhập hoặc mật khẩu không đúng"

### 9.2 Insufficient Gems
- [ ] Try buy item with more gems than you have
- ✅ Expected: Error "Không đủ gems"

### 9.3 Network Error (Optional)
- [ ] Stop backend server
- [ ] Try any API call
- ✅ Expected: Error "Cannot connect to backend API"

### 9.4 Unauthorized (Optional)
- [ ] Clear localStorage (DevTools → Storage → Clear All)
- [ ] Try access protected page
- ✅ Expected: Redirect to login

---

## 🧪 Test Suite 10: Data Consistency (10 min)

### 10.1 Multi-Tab Sync
- [ ] Open http://localhost:5173 in Tab 1
- [ ] Open http://localhost:5173 in Tab 2 (same user)
- [ ] Complete lesson in Tab 1
- [ ] Refresh Tab 2
- ✅ Expected: Tab 2 shows updated progress

### 10.2 Profile Persistence
- [ ] Login
- [ ] Note: XP = 100, Hearts = 4
- [ ] Refresh page
- ✅ Expected: Same values load

### 10.3 Streak Consistency
- [ ] Check streak counter
- [ ] Note current streak
- [ ] Complete a lesson
- ✅ Expected: Streak updated correctly

---

## 📊 Results Summary

After completing all tests, fill this:

| Test Suite | Status | Issues | Notes |
|-----------|--------|--------|-------|
| Authentication | ✅ / ❌ | | |
| Learning System | ✅ / ❌ | | |
| Shop & Items | ✅ / ❌ | | |
| Hearts System | ✅ / ❌ | | |
| Leaderboard | ✅ / ❌ | | |
| Achievements & Tasks | ✅ / ❌ | | |
| Alphabets | ✅ / ❌ | | |
| Profile | ✅ / ❌ | | |
| Error Handling | ✅ / ❌ | | |
| Data Consistency | ✅ / ❌ | | |

---

## 🐛 If Any Test Fails

### Debugging Steps:
1. **Check Backend Running**:
   ```bash
   curl http://localhost:5195/swagger
   # Should return HTML
   ```

2. **Check Frontend Running**:
   ```bash
   curl http://localhost:5173
   # Should return HTML
   ```

3. **Check API Response**:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5195/api/profile/display
   # Should return user data
   ```

4. **Check Database Connection**:
   - Open SSMS
   - Query: `SELECT COUNT(*) FROM AspNetUsers;`
   - Should return user count

5. **Check Logs**:
   - Backend console shows all API calls
   - Frontend DevTools (F12) shows network errors

---

## ✅ Success Criteria

All features working = **Project is Production Ready** 🎉

- [ ] All 10 test suites pass
- [ ] No error messages in console
- [ ] Data syncs correctly between tabs
- [ ] Database saves all changes
- [ ] API responses complete in < 1 sec
- [ ] No 401/404 errors on valid requests

**Now ready for full integration and deployment!**

