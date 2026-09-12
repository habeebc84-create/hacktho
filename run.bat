@echo off
echo ===================================================
echo   Starting Cultivate - A Living-Growth Life RPG
echo ===================================================
cd /d "%~dp0"

echo [1/3] Starting Express Backend (Port 5000)...
start "Cultivate Backend" cmd /k "cd server && npm run dev"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Vite Frontend (Port 5173)...
start "Cultivate Frontend" cmd /k "cd client && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Opening Cultivate in your browser...
start http://localhost:5173

echo.
echo ===================================================
echo   Cultivate is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ===================================================
pause
