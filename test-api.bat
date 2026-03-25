@echo off
REM API Test Script - Save output to file
setlocal enabledelayedexpansion

set OUTPUT_FILE=api-test-results.txt
echo ============================================ > %OUTPUT_FILE%
echo   API Test Results
echo   Timestamp: %date% %time%
echo ============================================ >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%

echo Testing backend connectivity... >> %OUTPUT_FILE%
REM Test 1: Hiragana endpoint (no auth required)
echo. >> %OUTPUT_FILE%
echo [TEST 1] GET /api/alphabets/hiragana >> %OUTPUT_FILE%
curl -s http://localhost:5195/api/alphabets/hiragana >> %OUTPUT_FILE% 2>&1
echo. >> %OUTPUT_FILE%

REM Test 2: Shop items
echo [TEST 2] GET /api/shop/items >> %OUTPUT_FILE%
curl -s http://localhost:5195/api/shop/items >> %OUTPUT_FILE% 2>&1
echo. >> %OUTPUT_FILE%

REM Test 3: Health check
echo [TEST 3] Check if services are running >> %OUTPUT_FILE%
tasklist | find /i "dotnet" >> %OUTPUT_FILE% 2>&1
echo. >> %OUTPUT_FILE%

echo. >> %OUTPUT_FILE%
echo Test complete! See results above. >> %OUTPUT_FILE%

echo Output saved to %OUTPUT_FILE%
type %OUTPUT_FILE%
