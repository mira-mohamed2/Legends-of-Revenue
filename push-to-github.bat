@echo off
REM Quick GitHub Push Script
REM Edit the USERNAME variable below before running

SET USERNAME=YOUR_USERNAME

echo ================================================
echo   Legends of Revenue - GitHub Setup
echo ================================================
echo.

if "%USERNAME%"=="YOUR_USERNAME" (
    echo ERROR: Please edit this file first!
    echo.
    echo 1. Open push-to-github.bat in Notepad
    echo 2. Change line 5:
    echo    SET USERNAME=YOUR_USERNAME
    echo    to your actual GitHub username
    echo 3. Save and run again
    echo.
    pause
    exit /b
)

echo Username: %USERNAME%
echo Repository: legends-of-revenue
echo.

set /p CONFIRM="Have you created the repository on GitHub? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo.
    echo Please create the repository first at:
    echo https://github.com/new
    echo.
    echo Repository name: legends-of-revenue
    echo Description: A medieval RPG about tax enforcement
    echo.
    pause
    exit /b
)

echo.
echo Pushing to GitHub...
echo.

git remote add origin https://github.com/%USERNAME%/legends-of-revenue.git 2>nul
if errorlevel 1 (
    git remote set-url origin https://github.com/%USERNAME%/legends-of-revenue.git
)

git branch -M main
git push -u origin main

if errorlevel 0 (
    echo.
    echo ================================================
    echo   SUCCESS! Repository is now on GitHub!
    echo ================================================
    echo.
    echo View at: https://github.com/%USERNAME%/legends-of-revenue
    echo.
) else (
    echo.
    echo Push failed. Check the error message above.
    echo.
)

pause
