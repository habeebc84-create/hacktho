Write-Host "===================================================" -ForegroundColor Green
Write-Host "  Starting Cultivate - A Living-Growth Life RPG" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/3] Starting Express Backend (Port 5000)..." -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/k cd /d `"$Root\server`" && npm run dev"

Start-Sleep -Seconds 2

Write-Host "[2/3] Starting Vite Frontend (Port 5173)..." -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/k cd /d `"$Root\client`" && npm run dev"

Start-Sleep -Seconds 3

Write-Host "[3/3] Opening browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"

Write-Host "✨ Cultivate is running at http://localhost:5173!" -ForegroundColor Green
