@echo off
cls
echo ========================================
echo   MIRA - Expo Setup Wizard
echo ========================================
echo.
echo This will prepare your game for the expo.
echo.
pause

echo.
echo Step 1/3: Installing dependencies...
call npm install

echo.
echo Step 2/3: Building local version...
call npm run build:expo

echo.
echo Step 3/3: Creating expo package...

REM Create expo-portable folder
if not exist "expo-portable" mkdir expo-portable

REM Copy built files
echo Copying game files...
xcopy /E /I /Y dist expo-portable\game

REM Copy the portable server script
echo Copying server files...
copy serve-portable.js expo-portable\

REM Copy launcher to expo-portable folder
echo @echo off > expo-portable\START_GAME.bat
echo cls >> expo-portable\START_GAME.bat
echo echo ======================================== >> expo-portable\START_GAME.bat
echo echo   MIRA - Legends of Revenue >> expo-portable\START_GAME.bat
echo echo   Expo Booth Version >> expo-portable\START_GAME.bat
echo echo ======================================== >> expo-portable\START_GAME.bat
echo echo. >> expo-portable\START_GAME.bat
echo where node ^>nul 2^>nul >> expo-portable\START_GAME.bat
echo if %%ERRORLEVEL%% NEQ 0 ( >> expo-portable\START_GAME.bat
echo     echo ERROR: Node.js is required! >> expo-portable\START_GAME.bat
echo     echo Please install from: https://nodejs.org/ >> expo-portable\START_GAME.bat
echo     pause >> expo-portable\START_GAME.bat
echo     exit /b 1 >> expo-portable\START_GAME.bat
echo ^) >> expo-portable\START_GAME.bat
echo echo Starting game... >> expo-portable\START_GAME.bat
echo timeout /t 2 /nobreak ^>nul >> expo-portable\START_GAME.bat
echo start http://localhost:7766 >> expo-portable\START_GAME.bat
echo node serve-portable.js >> expo-portable\START_GAME.bat

REM Create README for expo team
echo # MIRA Legends of Revenue - Expo Version > expo-portable\README.txt
echo. >> expo-portable\README.txt
echo QUICK START: >> expo-portable\README.txt
echo 1. Double-click START_GAME.bat >> expo-portable\README.txt
echo 2. Game opens in browser automatically >> expo-portable\README.txt
echo 3. Press Ctrl+C to stop when done >> expo-portable\README.txt
echo. >> expo-portable\README.txt
echo REQUIREMENTS: >> expo-portable\README.txt
echo - Node.js (download from https://nodejs.org/) >> expo-portable\README.txt
echo - Any modern web browser >> expo-portable\README.txt
echo. >> expo-portable\README.txt
echo TROUBLESHOOTING: >> expo-portable\README.txt
echo If game doesn't open: >> expo-portable\README.txt
echo 1. Install Node.js from: https://nodejs.org/ >> expo-portable\README.txt
echo 2. During install, keep all default settings >> expo-portable\README.txt
echo 3. Restart computer and try again >> expo-portable\README.txt
echo. >> expo-portable\README.txt
echo Online version available at: >> expo-portable\README.txt
echo https://mira-mohamed2.github.io/Legends-of-Revenue/ >> expo-portable\README.txt

echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo Expo package created in: expo-portable\
echo.
echo Instructions for expo team:
echo 1. Copy the 'expo-portable' folder to USB drive
echo 2. Give to marketing/expo team
echo 3. They just double-click START_GAME.bat
echo.
echo The game runs completely offline!
echo.
pause
