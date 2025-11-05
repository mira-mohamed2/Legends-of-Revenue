@echo off
cls
echo ========================================
echo   MIRA - Legends of Revenue
echo   Portable Version
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Starting portable server with correct MIME types...
echo.
echo Opening browser in 2 seconds...
echo Press Ctrl+C to stop the server.
echo.

REM Wait 2 seconds then open browser
timeout /t 2 /nobreak >nul
start http://localhost:7766

REM Start the custom Node.js server
node serve-portable.js
