@echo off
echo ============================================
echo Valorant Voice Recorder - Production Build
echo ============================================
echo.

echo [1/6] Installing dependencies...
call npm install

echo.
echo [2/6] Installing electron-builder...
call npm install --save-dev electron-builder

echo.
echo [3/6] Building TypeScript...
call npm run build

echo.
echo [4/6] Creating distribution packages...
echo.
echo Building Windows installer...
call npm run dist:win

echo.
echo [5/6] Creating portable version...
REM Create a portable ZIP package
if not exist "release\portable" mkdir "release\portable"
cd release
for %%f in (*.exe) do (
    if not "%%f"=="*Setup*" (
        echo Creating portable package from %%f...
        if exist "%%~nf" rmdir /s /q "%%~nf"
        mkdir "%%~nf"
        copy "%%f" "%%~nf\"
        copy "..\README.md" "%%~nf\"
        copy "..\build\LICENSE.txt" "%%~nf\"
        echo @echo off > "%%~nf\start-recorder.bat"
        echo echo Starting Valorant Voice Recorder... >> "%%~nf\start-recorder.bat"
        echo "%%f" >> "%%~nf\start-recorder.bat"
        powershell -command "Compress-Archive -Path '%%~nf\*' -DestinationPath 'portable\ValorantVoiceRecorder-Portable.zip' -Force"
    )
)
cd ..

echo.
echo [6/6] Updating web distribution...
cd sdk-distribution-web

REM Copy the built installers to web app
if not exist "public\downloads" mkdir "public\downloads"
copy "..\release\*.exe" "public\downloads\" >nul 2>&1
copy "..\release\portable\*.zip" "public\downloads\" >nul 2>&1

REM Rebuild web app with new downloads
call npm run build

cd ..

echo.
echo ✅ Production build complete!
echo.
echo Created files:
echo ➤ Windows Installer: release\*Setup*.exe
echo ➤ Portable Version: release\portable\ValorantVoiceRecorder-Portable.zip
echo ➤ Web Distribution: sdk-distribution-web\dist\
echo.
echo Next steps:
echo 1. Upload installers to your hosting service
echo 2. Deploy web app to your domain
echo 3. Update download links in the web app
echo.
echo To test locally:
echo ➤ Install: .\release\ValorantVoiceRecorderSetup.exe
echo ➤ Web app: cd sdk-distribution-web && npm run preview
echo.
pause