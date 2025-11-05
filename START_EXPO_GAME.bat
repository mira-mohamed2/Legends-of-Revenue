@echo off
cls
echo ========================================
echo   MIRA - Legends of Revenue
echo   Local Expo Version
echo ========================================
echo.
echo Starting game server...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules\" (
    echo Installing dependencies...
    echo This may take a few minutes...
    call npm install
)

REM Start the development server
echo.
echo ========================================
echo Game will open in your browser...
echo.
echo Press Ctrl+C to stop when done.
echo ========================================
echo.

REM Wait a moment then open browser
timeout /t 2 /nobreak >nul
start http://localhost:5173

REM Start the dev server
npm run dev
