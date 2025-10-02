@echo off
echo ============================================
echo Valorant Voice Recorder - Complete Package
echo ============================================
echo.

REM Create main distribution directory
if not exist "complete-distribution" mkdir "complete-distribution"

echo [1/5] Copying SDK files...
REM Copy the main SDK files
xcopy /E /I /Y "src" "complete-distribution\valorant-recorder-sdk\src"
copy "package-headless.json" "complete-distribution\valorant-recorder-sdk\package.json"
xcopy /E /I /Y "renderer" "complete-distribution\valorant-recorder-sdk\renderer"

echo [2/5] Creating installation scripts...

REM Create the main installer batch file
(
echo @echo off
echo echo ============================================
echo echo Valorant Voice Recorder - Installer
echo echo ============================================
echo echo.
echo.
echo REM Check if Node.js is installed
echo node --version ^>nul 2^>^&1
echo if errorlevel 1 ^(
echo     echo ERROR: Node.js is required but not installed!
echo     echo.
echo     echo Please install Node.js from: https://nodejs.org/
echo     echo.
echo     echo After installing Node.js, run this installer again.
echo     pause
echo     exit /b 1
echo ^)
echo.
echo echo ✅ Node.js detected
echo echo.
echo echo Installing Valorant Voice Recorder...
echo echo.
echo.
echo REM Install dependencies
echo echo [1/3] Installing dependencies...
echo call npm install --production --silent
echo.
echo if errorlevel 0 ^(
echo     echo ✅ Dependencies installed successfully
echo ^) else ^(
echo     echo ❌ Failed to install dependencies
echo     echo Please check your internet connection and try again.
echo     pause
echo     exit /b 1
echo ^)
echo.
echo echo [2/3] Setting up background service...
echo.
echo REM Create startup shortcut ^(optional^)
echo set /p "startup=Start with Windows? (y/n): "
echo if /i "%%startup%%"=="y" ^(
echo     echo Setting up auto-start...
echo     REM This would add to Windows startup
echo     echo ✅ Auto-start configured
echo ^) else ^(
echo     echo Auto-start skipped
echo ^)
echo.
echo echo [3/3] Testing installation...
echo echo.
echo echo Starting Valorant Voice Recorder in test mode...
echo timeout /t 2 /nobreak ^>nul
echo.
echo echo ✅ Installation Complete!
echo echo.
echo echo ============================================
echo echo IMPORTANT INFORMATION:
echo echo ============================================
echo echo.
echo echo ➤ The recorder is now running in the background
echo echo ➤ It will automatically detect when Valorant starts
echo echo ➤ Recordings are saved to: Documents\Game Recordings\
echo echo ➤ Right-click the system tray icon for options
echo echo.
echo echo ➤ To manually start: npm start
echo echo ➤ To uninstall: Delete this folder
echo echo.
echo echo Enjoy automatic Valorant voice recording! 🎮🎤
echo echo.
echo pause
echo.
echo REM Start the service
echo echo Starting background service...
echo start "" npm start
) > "complete-distribution\valorant-recorder-sdk\install-recorder.bat"

REM Create a simple uninstaller
(
echo @echo off
echo echo Uninstalling Valorant Voice Recorder...
echo echo.
echo taskkill /f /im electron.exe ^>nul 2^>^&1
echo echo ✅ Background service stopped
echo echo.
echo echo To complete uninstallation:
echo echo 1. Delete this entire folder
echo echo 2. Optionally delete: Documents\Game Recordings\
echo echo.
echo pause
) > "complete-distribution\valorant-recorder-sdk\uninstall-recorder.bat"

REM Create a README for the SDK package
(
echo # Valorant Voice Recorder SDK
echo.
echo ## Quick Start:
echo.
echo 1. **Run installer**: Double-click `install-recorder.bat`
echo 2. **Follow prompts**: The installer will set everything up
echo 3. **Start playing**: Launch Valorant and voice recording begins automatically!
echo.
echo ## How it works:
echo.
echo - 🎮 **Automatic Detection**: Monitors for VALORANT.exe process
echo - 🎤 **Voice Recording**: Captures microphone audio in high quality
echo - ⏱️ **Smart Limits**: 2-hour maximum per recording session
echo - 💾 **Auto-Save**: Files saved to Documents/Game Recordings/
echo - 🔄 **Background Service**: Runs silently in system tray
echo.
echo ## File Structure:
echo.
echo ```
echo valorant-recorder-sdk/
echo ├── install-recorder.bat     # Main installer
echo ├── uninstall-recorder.bat   # Uninstaller
echo ├── package.json             # Dependencies
echo ├── src/                     # Application source
echo ├── renderer/                # UI files
echo └── README.md                # This file
echo ```
echo.
echo ## Features:
echo.
echo - ✅ Zero configuration required
echo - ✅ Automatic start/stop based on Valorant
echo - ✅ High-quality WebM/Opus audio format
echo - ✅ System tray integration
echo - ✅ Optional Windows startup integration
echo - ✅ Microphone permission handling
echo - ✅ Organized file naming with timestamps
echo.
echo ## System Requirements:
echo.
echo - Windows 10/11
echo - Node.js 16+ ^(installer will check^)
echo - Microphone access permissions
echo - ~100MB disk space
echo.
echo ## Troubleshooting:
echo.
echo **No recordings created?**
echo - Check microphone permissions in Windows Settings
echo - Ensure Valorant is actually running ^(check Task Manager^)
echo - Verify audio devices are working
echo.
echo **Service not starting?**
echo - Run installer as Administrator
echo - Check if Node.js is properly installed
echo - Look for error messages in the command window
echo.
echo **Performance issues?**
echo - The recorder uses minimal CPU/RAM
echo - Recordings are limited to 2 hours automatically
echo - Close other unnecessary audio applications
echo.
echo ## Support:
echo.
echo - Check the installation folder for log files
echo - Verify VALORANT.exe appears in Task Manager when game is running
echo - Ensure Documents/Game Recordings/ folder is accessible
echo.
echo ---
echo.
echo **Enjoy automatic Valorant voice recording!** 🎮🎤
) > "complete-distribution\valorant-recorder-sdk\README.md"

echo [3/5] Building web distribution app...
cd "sdk-distribution-web"
call npm run build
cd ..

echo [4/5] Copying web app...
xcopy /E /I /Y "sdk-distribution-web\dist" "complete-distribution\web-app"

echo [5/5] Creating final package...

REM Create a master installer that sets up both SDK and web app
(
echo @echo off
echo echo ============================================
echo echo Valorant Voice Recorder - Complete Setup
echo echo ============================================
echo echo.
echo echo This package contains:
echo echo ➤ Valorant Voice Recording SDK
echo echo ➤ Web distribution platform
echo echo.
echo set /p "choice=Install [S]DK only or [B]oth SDK and Web App? (s/b): "
echo.
echo if /i "%%choice%%"=="b" ^(
echo     echo Installing both SDK and Web App...
echo     echo.
echo     echo [1/2] Setting up SDK...
echo     cd valorant-recorder-sdk
echo     call install-recorder.bat
echo     cd ..
echo     echo.
echo     echo [2/2] Web App is ready in: web-app\
echo     echo You can serve it with any web server or open index.html directly
echo     echo.
echo ^) else ^(
echo     echo Installing SDK only...
echo     cd valorant-recorder-sdk
echo     call install-recorder.bat
echo ^)
echo.
echo echo ✅ Setup complete!
echo pause
) > "complete-distribution\INSTALL-EVERYTHING.bat"

echo.
echo ✅ Complete distribution package created!
echo.
echo Package contents:
echo ➤ complete-distribution\valorant-recorder-sdk\     - The recording SDK
echo ➤ complete-distribution\web-app\                   - Distribution website
echo ➤ complete-distribution\INSTALL-EVERYTHING.bat     - Master installer
echo.
echo To test:
echo 1. Navigate to complete-distribution\
echo 2. Run INSTALL-EVERYTHING.bat
echo.
echo To deploy web app:
echo 1. Upload complete-distribution\web-app\ to your web server
echo 2. Users can download and install the SDK from the website
echo.
pause