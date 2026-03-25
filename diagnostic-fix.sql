-- ==================================
-- Duolingo JP Password Diagnostic & Fix
-- ==================================

USE [DuolingoJP];

-- 1. Check user status
PRINT '========== User Status ==========';
SELECT TOP 10
    Id,
    UserName,
    Email,
    PasswordHash,
    LockoutEnd,
    LockoutEnabled,
    EmailConfirmed,
    CASE 
        WHEN PasswordHash IS NULL THEN 'NO PASSWORD'
        WHEN LEN(PasswordHash) > 100 THEN 'HAS PASSWORD'
        ELSE 'UNKNOWN'
    END as PasswordStatus
FROM AspNetUsers
WHERE UserName IN ('BoCaPTiHon', 'test123', 'LongLMAO', 'copilotdemo01', 'demo0316')
ORDER BY UserName;

-- 2. Check specific user
PRINT '';
PRINT '========== BoCaPTiHon Details ==========';
SELECT 
    Id,
    UserName,
    Email,
    PasswordHash,
    LockoutEnd,
    LockoutEnabled,
    LockoutEnd as IsLocked
FROM AspNetUsers
WHERE UserName = 'BoCaPTiHon';

-- 3. If user is locked, unlock them
PRINT '';
PRINT '========== Unlock All Test Users ==========';
UPDATE AspNetUsers
SET LockoutEnd = NULL, FailedAccessAttemptCount = 0
WHERE UserName IN ('BoCaPTiHon', 'test123', 'LongLMAO', 'copilotdemo01', 'demo0316');
PRINT 'Test users unlocked.';

-- 4. Confirm email for all test users
PRINT '';
PRINT '========== Confirm Email for Test Users ==========';
UPDATE AspNetUsers
SET EmailConfirmed = 1
WHERE UserName IN ('BoCaPTiHon', 'test123', 'LongLMAO', 'copilotdemo01', 'demo0316');
PRINT 'Email confirmed for test users.';

-- 5. Final check
PRINT '';
PRINT '========== Final Status After Updates ==========';
SELECT 
    UserName,
    Email,
    LockoutEnd,
    FailedAccessAttemptCount,
    EmailConfirmed,
    CASE 
        WHEN LockoutEnd IS NOT NULL THEN 'LOCKED'
        WHEN PasswordHash IS NULL THEN 'NO PASSWORD'
        ELSE 'OK'
    END as Status
FROM AspNetUsers
WHERE UserName IN ('BoCaPTiHon', 'test123', 'LongLMAO', 'copilotdemo01', 'demo0316')
ORDER BY UserName;

PRINT '';
PRINT '========== Note ==========';
PRINT 'If user still cannot login after this, password hash needs to be reset via API endpoint:';
PRINT 'POST /api/account/admin/update-test-passwords';
