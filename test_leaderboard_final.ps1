#!/usr/bin/env pwsh
param(
    [string]$Username = "testuser_$(Get-Random -Minimum 1000 -Maximum 9999)",
    [string]$Password = "Testpass123@"
)

$baseUrl = "http://localhost:7001"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Testing Duolingo Leaderboard System" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Register user
Write-Host "[1] Registering test user: $Username" -ForegroundColor Yellow

$registerBody = @{
    username = $Username
    email = "$([System.Guid]::NewGuid().ToString().Substring(0, 8))@test.com"
    password = $Password
} | ConvertTo-Json

try {
    $registerResp = Invoke-WebRequest "$baseUrl/api/account/register" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $registerBody `
        -UseBasicParsing
    
    $registerData = $registerResp.Content | ConvertFrom-Json
    $token = $registerData.token
    
    if (-not $token) {
        Write-Host "ERROR: No token received" -ForegroundColor Red
        Write-Host "Response: $($registerData | ConvertTo-Json)" -ForegroundColor Gray
        exit 1
    }
    
    Write-Host "[OK] User registered successfully" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Test Leaderboard API
Write-Host "[2] Calling /api/leaderboard endpoint" -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $leaderResp = Invoke-WebRequest "$baseUrl/api/leaderboard" `
        -Headers $headers `
        -UseBasicParsing -TimeoutSec 10
    
    Write-Host "[OK] API call successful - Status $($leaderResp.StatusCode)" -ForegroundColor Green
    
    $responseData = $leaderResp.Content | ConvertFrom-Json
    
    Write-Host "Response Details:" -ForegroundColor Cyan
    Write-Host "  Type: $($responseData.GetType().Name)"
    Write-Host "  Is Array: $($responseData -is [array])"
    
    if ($responseData -is [array]) {
        $count = $responseData.Count
        Write-Host "  Count: $count"
        
        if ($count -gt 0) {
            Write-Host ""
            Write-Host "First 10 users:" -ForegroundColor Green
            $responseData | Select-Object -First 10 | ForEach-Object {
                $xpDisplay = if ($_.totalXp) { "$($_.totalXp) XP" } else { "no XP" }
                Write-Host "  - Rank $($_.rank): $($_.username) - $xpDisplay"
            }
            Write-Host ""
            Write-Host "[SUCCESS] Leaderboard has $count users!" -ForegroundColor Green
        } else {
            Write-Host "[WARNING] Leaderboard array is empty!" -ForegroundColor Yellow
        }
    } else {
        Write-Host "[ERROR] Response is not an array!" -ForegroundColor Red
        Write-Host "Response: $($responseData | ConvertTo-Json)" -ForegroundColor Gray
        exit 1
    }
    
} catch {
    Write-Host "[ERROR] API call failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
