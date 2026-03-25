#!/usr/bin/env pwsh

# Test Duolingo Leaderboard API

$baseUrl = "http://localhost:7001"

Write-Host "[TEST] Duolingo Leaderboard API Check" -ForegroundColor Cyan
Write-Host "Backend URL: $baseUrl" -ForegroundColor Gray
Write-Host ""

# Step 1: Register a new test user
Write-Host "[REGISTER] Registering new test user..." -ForegroundColor Yellow

$registerPayload = @{
    username = "testleaderboard"
    email = "testlb@test.com"
    password = "TestPassword123@"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "$baseUrl/api/account/register" `
        -Method POST `
        -Headers @{ "Content-Type" = "application/json" } `
        -Body $registerPayload `
        -UseBasicParsing
    
    $registerData = $registerResponse.Content | ConvertFrom-Json
    $token = $registerData.token
    
    if ($token) {
        Write-Host "[OK] User registered successfully" -ForegroundColor Green
        Write-Host "Token received" -ForegroundColor Gray
    } else {
        Write-Host "[ERROR] No token in response" -ForegroundColor Red
        Write-Host "Response: $($registerData | ConvertTo-Json)" -ForegroundColor Gray
        exit 1
    }
} catch {
    Write-Host "[ERROR] Registration failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Get Leaderboard
Write-Host "[FETCH] Fetching leaderboard..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $leaderboardResponse = Invoke-WebRequest -Uri "$baseUrl/api/leaderboard" `
        -Headers $headers `
        -UseBasicParsing
    
    $leaderboardData = $leaderboardResponse.Content | ConvertFrom-Json
    
    Write-Host "[OK] Leaderboard API Response received" -ForegroundColor Green
    Write-Host "Response Type: $($leaderboardData.GetType().Name)" -ForegroundColor Gray
    Write-Host "Response is Array: $($leaderboardData -is [System.Collections.IEnumerable])" -ForegroundColor Gray
    
    if ($leaderboardData -is [System.Collections.IEnumerable] -and $leaderboardData.Count -gt 0) {
        Write-Host "Count: $($leaderboardData.Count)" -ForegroundColor Green
        Write-Host "" 
        Write-Host "[DATA] First 10 entries:" -ForegroundColor Cyan
        $leaderboardData | Select-Object -First 10 | ForEach-Object {
            Write-Host "Rank $($_.rank): $($_.username) - $($_.totalXp) XP"
        }
    } else {
        Write-Host "[WARNING] Response is empty or not an array" -ForegroundColor Yellow
        Write-Host "Response: " -ForegroundColor Gray
       if ($leaderboardData) { $leaderboardData | ConvertTo-Json | Write-Host } else { Write-Host "(null)" }
    }
    
} catch {
    Write-Host "[ERROR] Leaderboard fetch failed: $_" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "[OK] Test completed successfully" -ForegroundColor Green
