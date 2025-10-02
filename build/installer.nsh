; Custom NSIS installer script for Valorant Voice Recorder
!include "MUI2.nsh"

; Define the name of the installer
Name "Valorant Voice Recorder"
OutFile "ValorantVoiceRecorderSetup.exe"

; Set the installation directory
InstallDir "$PROGRAMFILES64\ValorantVoiceRecorder"

; Request application privileges
RequestExecutionLevel admin

; Define installer pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; Define uninstaller pages
!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; Set modern UI language
!insertmacro MUI_LANGUAGE "English"

; Installer section
Section "Install"
    ; Set output path to the installation directory
    SetOutPath $INSTDIR
    
    ; Install files
    File /r "${BUILD_RESOURCES_DIR}\*"
    
    ; Create desktop shortcut
    CreateShortCut "$DESKTOP\Valorant Voice Recorder.lnk" "$INSTDIR\ValorantVoiceRecorder.exe"
    
    ; Create start menu shortcut
    CreateDirectory "$SMPROGRAMS\Valorant Voice Recorder"
    CreateShortCut "$SMPROGRAMS\Valorant Voice Recorder\Valorant Voice Recorder.lnk" "$INSTDIR\ValorantVoiceRecorder.exe"
    CreateShortCut "$SMPROGRAMS\Valorant Voice Recorder\Uninstall.lnk" "$INSTDIR\Uninstall.exe"
    
    ; Add to Windows startup (optional)
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Run" "ValorantVoiceRecorder" "$INSTDIR\ValorantVoiceRecorder.exe --startup"
    
    ; Create uninstaller
    WriteUninstaller "$INSTDIR\Uninstall.exe"
    
    ; Add entry to Add/Remove Programs
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ValorantVoiceRecorder" "DisplayName" "Valorant Voice Recorder"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ValorantVoiceRecorder" "UninstallString" "$INSTDIR\Uninstall.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ValorantVoiceRecorder" "Publisher" "Valorant Voice Recorder Team"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ValorantVoiceRecorder" "DisplayVersion" "1.0.0"
    
    ; Success message
    MessageBox MB_OK "Valorant Voice Recorder has been installed successfully!$\r$\n$\r$\nThe app will automatically start monitoring for Valorant.$\r$\nCheck your system tray for the recorder icon."
    
    ; Start the application
    Exec "$INSTDIR\ValorantVoiceRecorder.exe"
SectionEnd

; Uninstaller section
Section "Uninstall"
    ; Stop the application if running
    nsExec::Exec 'taskkill /f /im ValorantVoiceRecorder.exe'
    
    ; Remove startup entry
    DeleteRegValue HKLM "Software\Microsoft\Windows\CurrentVersion\Run" "ValorantVoiceRecorder"
    
    ; Remove from Add/Remove Programs
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ValorantVoiceRecorder"
    
    ; Delete shortcuts
    Delete "$DESKTOP\Valorant Voice Recorder.lnk"
    Delete "$SMPROGRAMS\Valorant Voice Recorder\Valorant Voice Recorder.lnk"
    Delete "$SMPROGRAMS\Valorant Voice Recorder\Uninstall.lnk"
    RMDir "$SMPROGRAMS\Valorant Voice Recorder"
    
    ; Delete installation files
    RMDir /r "$INSTDIR"
    
    MessageBox MB_OK "Valorant Voice Recorder has been uninstalled successfully!"
SectionEnd