# 🔍 Complete Troubleshooting Guide - Login 401 Error

**Problem**: Getting "API request failed: 401" when trying to login  
**Root Cause Found**: Connection string was pointing to LocalDB instead of actual SQL Server  
**Solution**: Updated `appsettings.json` to use `LAPTOP-9G8TCILT\SQLEXPRESS`

---

## ✅ What Was Fixed

### 1. Connection String Updated
**File**: `backend/DuolingoStyleJP/MyWebApiApp/appsettings.json`

**Before** (❌ LocalDB):
```
Server=(localdb)\mssqllocaldb;Database=DuolingoJP
```

**After** (✅ SQL Server Express):
```
Server=LAPTOP-9G8TCILT\SQLEXPRESS;Database=DuolingoJP;Trusted_Connection=true;TrustServerCertificate=true
```

---

## 🚀 Step-by-Step Fix

### **Option 1: Run Batch Script (Easiest)**

1. Open PowerShell/CMD as Administrator
2. Run:
```bash
d:\SWD392\Frontend_And_Backend\backend\DuolingoStyleJP\MyWebApiApp\start-backend.bat
```

This will:
- ✅ Stop old backend processes
- ✅ Clean build
- ✅ Rebuild project
- ✅ Start backend on http://localhost:5195

---

### **Option 2: Manual Commands**

```bash
cd d:\SWD392\Frontend_And_Backend\backend\DuolingoStyleJP\MyWebApiApp

# Kill old process
taskkill /F /IM dotnet.exe

# Clean & Rebuild
dotnet clean
dotnet build

# Run
dotnet run --urls "http://localhost:5195"
```

---

## 🧪 Test After Fix

### **1. Verify Backend is Running**
Open browser: `http://localhost:5195/swagger`
- Should see Swagger UI
- If not: Backend not running or port blocked

### **2. Test Database Connection**
Call endpoint:
```
GET http://localhost:5195/api/account/admin/debug-user/BoCaPTiHon
```

Expected response:
```json
{
  "userId": "...",
  "userName": "BoCaPTiHon",
  "email": "test02@gmail.com",
  "hasPassword": true,
  "isLockoutEndNull": false,
  "lockoutEnabled": false,
  "emailConfirmed": false,
  "message": "User found..."
}
```

**If response is "User not found"**:
- Database connection failed
- Server name or database name wrong
- Check SQL Server Instance name in SSMS

### **3. Reset User Password**
```
POST http://localhost:5195/api/account/admin/update-test-passwords
```

Response:
```json
{
  "message": "Updated 5 test users successfully",
  "password": "Test@12345",
  "details": [
    "✅ BoCaPTiHon: password reset",
    ...
  ]
}
```

### **4. Try Login in Frontend**
Navigate to: `http://localhost:5173`

**Credentials**:
- Username: `BoCaPTiHon`
- Password: `Test@12345`

**Expected**:
- ✅ Login succeeds
- ✅ Redirects to home page
- ✅ User profile loads
- ✅ No more 401 error

---

## 🐛 If Still Not Working

### **Check 1: Verify SQL Server Instance Name**

Open SQL Server Management Studio:
- Look at "Server name" in title bar
- Must match in connection string: `Server=LAPTOP-9G8TCILT\SQLEXPRESS`

If different, update `appsettings.json`:
```json
"DefaultConnection": "Server=YOUR_SERVER_NAME;Database=DuolingoJP;Trusted_Connection=true;TrustServerCertificate=true;MultipleActiveResultSets=true;"
```

### **Check 2: Database Exists**

SQL Query:
```sql
SELECT name FROM sys.databases WHERE name = 'DuolingoJP';
```

If not found, run SQL scripts:
```bash
cd d:\SWD392\Frontend_And_Backend
sqlcmd -S "LAPTOP-9G8TCILT\SQLEXPRESS" -i "DuolingoJP.sql"
sqlcmd -S "LAPTOP-9G8TCILT\SQLEXPRESS" -d "DuolingoJP" -i "USE DuolingoJP;.sql"
```

### **Check 3: User Exists and Unlocked**

SQL Query:
```sql
USE DuolingoJP;
SELECT UserName, Email, LockoutEnd, PasswordHash 
FROM AspNetUsers 
WHERE UserName = 'BoCaPTiHon';

-- If LockoutEnd is not NULL, unlock:
UPDATE AspNetUsers 
SET LockoutEnd = NULL 
WHERE UserName = 'BoCaPTiHon';
```

### **Check 4: Firewall/Port Issues**

Test port 5195:
```bash
# Test if port is listening
netstat -ano | find ":5195"

# If port blocked, try different port:
dotnet run --urls "http://localhost:5196"
```

Then update Frontend API URL in `frontend\src\services\api.js`:
```javascript
const API_BASE_URLS = [
  'http://localhost:5196',  // Changed port
  'https://localhost:7232'
]
```

---

## 📊 Full System Checklist

- [ ] Connection string points to correct SQL Server instance
- [ ] Database DuolingoJP exists
- [ ] User BoCaPTiHon exists in AspNetUsers table
- [ ] User is not locked (LockoutEnd is NULL)
- [ ] Backend builds successfully
- [ ] Backend runs on http://localhost:5195
- [ ] Swagger page loads
- [ ] `/api/account/admin/debug-user/BoCaPTiHon` returns user data
- [ ] `/api/account/admin/update-test-passwords` updates password
- [ ] Frontend can call API (CORS enabled)
- [ ] Frontend receives response with all profile fields
- [ ] Login succeeds with BoCaPTiHon / Test@12345

---

## 🎯 Common Issues & Solutions

| Issue | Check | Fix |
|-------|-------|-----|
| "API request failed: 401" | Password hash | Run `/api/account/admin/update-test-passwords` |
| "Cannot connect to backend" | Backend running port 5195 | Run `start-backend.bat` |
| "User not found" | DB connection OK | Check SQL Server instance name |
| "Database does not exist" | SQL Server query | Run SQL scripts to create DB |
| Port 5195 already in use | `netstat -ano | find ":5195"` | Use port 5196 instead |

---

## 📝 Files Changed

- ✅ `appsettings.json` - Connection string updated
- ✅ `AccountController.cs` - Debug endpoint added
- ✅ `start-backend.bat` - Script created

---

## 🎉 Expected Result

After applying fixes, you should be able to:

1. ✅ Login with: `BoCaPTiHon` / `Test@12345`
2. ✅ See user profile with all data
3. ✅ Access all features (Learning, Shop, Leaderboard)
4. ✅ No more 401 errors

If you still encounter issues, check the **Common Issues** table above.

---

**Last Updated**: March 24, 2026  
**Status**: Fixes Applied - Ready to Test
