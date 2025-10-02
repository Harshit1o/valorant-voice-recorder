@echo off
echo Building Valorant Voice Recorder SDK Package...
echo.

REM Navigate to the main SDK directory
cd /d "C:\Users\hp\OneDrive\Documents\startup"

echo [1/4] Installing dependencies...
call npm install

echo.
echo [2/4] Building Electron SDK...
call npm run build

echo.
echo [3/4] Creating distribution package...

REM Create distribution directory
if not exist "dist-package" mkdir "dist-package"
if not exist "sdk-distribution-web\public\downloads" mkdir "sdk-distribution-web\public\downloads"

REM Copy built files to distribution package
xcopy /E /I /Y "dist" "dist-package\valorant-recorder-sdk"
copy "package.json" "dist-package\valorant-recorder-sdk\"
copy "README.md" "dist-package\valorant-recorder-sdk\"

REM Create setup instructions
echo Creating setup instructions...
(
echo # Valorant Voice Recorder - Setup Instructions
echo.
echo ## Installation Steps:
echo.
echo 1. **Extract this folder** to your desired location ^(e.g., C:\ValorantRecorder\^)
echo.
echo 2. **Open Command Prompt as Administrator** in the extracted folder
echo.
echo 3. **Install dependencies:**
echo    ```
echo    npm install --production
echo    ```
echo.
echo 4. **Start the recorder service:**
echo    ```
echo    npm start
echo    ```
echo.
echo 5. **For automatic startup** ^(optional^):
echo    - Add the recorder to Windows startup
echo    - The service will run in the background
echo.
echo ## How it works:
echo.
echo - ✅ Automatically detects when Valorant is running
echo - ✅ Starts recording your voice during matches
echo - ✅ Stops recording when you exit the game
echo - ✅ Saves recordings to: Documents/Game Recordings/
echo - ✅ 2-hour maximum recording per session
echo.
echo ## File Locations:
echo - **Recordings:** Documents/Game Recordings/
echo - **Configuration:** This folder
echo.
echo ## Troubleshooting:
echo - Ensure microphone permissions are granted
echo - Check that Valorant.exe is running
echo - Verify audio devices are working
echo.
echo Enjoy automatic voice recording for Valorant!
) > "dist-package\SETUP-INSTRUCTIONS.md"

REM Create a simple installer script
(
echo @echo off
echo echo Installing Valorant Voice Recorder...
echo echo.
echo.
echo REM Check if Node.js is installed
echo node --version ^>nul 2^>^&1
echo if errorlevel 1 ^(
echo     echo ERROR: Node.js is not installed!
echo     echo Please install Node.js from https://nodejs.org/
echo     pause
echo     exit /b 1
echo ^)
echo.
echo echo Node.js detected. Installing dependencies...
echo call npm install --production
echo.
echo if errorlevel 0 ^(
echo     echo.
echo     echo ✅ Installation complete!
echo     echo.
echo     echo To start recording:
echo     echo   npm start
echo     echo.
echo     echo The recorder will automatically detect Valorant and start recording.
echo     echo Recordings will be saved to: Documents/Game Recordings/
echo ^) else ^(
echo     echo.
echo     echo ❌ Installation failed!
echo     echo Please check your internet connection and try again.
echo ^)
echo.
echo pause
) > "dist-package\valorant-recorder-setup.bat"

REM Copy package to web app downloads
xcopy /E /I /Y "dist-package" "sdk-distribution-web\public\downloads\valorant-recorder-v1.0.0"

echo.
echo [4/4] Building web distribution app...
cd "sdk-distribution-web"
call npm install
call npm run build

echo.
echo ✅ Build complete!
echo.
echo SDK Package: dist-package\
echo Web App: sdk-distribution-web\dist\
echo.
echo To test the web app locally:
echo   cd sdk-distribution-web
echo   npm run preview
echo.
pause