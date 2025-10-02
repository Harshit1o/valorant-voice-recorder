# 🛡️ Windows Security Setup for Valorant Voice Recorder

## For Users: How to Run the App Safely

### Method 1: One-Time Setup (Recommended)
1. **Download the app** from GitHub releases
2. **Right-click** on the downloaded `.exe` file
3. **Select "Properties"**
4. **Check "Unblock"** at the bottom (if present)
5. **Click "OK"**
6. **Right-click** again and **"Run as administrator"**
7. **When Windows asks "Do you want to allow this app to make changes?"** → Click **"Yes"**

### Method 2: Add to Windows Defender Exclusions
1. **Open Windows Security** (search in Start menu)
2. **Go to "Virus & threat protection"**
3. **Click "Manage settings"** under "Virus & threat protection settings"
4. **Scroll down** to "Exclusions"
5. **Click "Add or remove exclusions"**
6. **Click "Add an exclusion"** → **"File"**
7. **Browse and select** your downloaded `.exe` file
8. **Click "Open"**

### Method 3: SmartScreen Bypass
If you see "Windows protected your PC":
1. **Click "More info"**
2. **Click "Run anyway"**
3. **The app will run normally**

### Method 4: PowerShell Execution (Advanced)
1. **Open PowerShell as Administrator**
2. **Navigate to the app folder**
3. **Run:** `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
4. **Run the app:** `.\Valorant.Voice.Recorder.1.0.0.exe`

## Why This Happens
- The app is **not digitally signed** (costs $200+/year)
- Windows protects against **unsigned executables**
- This is **normal for free/open-source software**
- The app is **completely safe** - it only records audio when Valorant runs

## Is It Safe?
✅ **YES!** The app is:
- Open source (you can view all code)
- Only records microphone when Valorant is running
- Stores recordings locally on your computer
- No network connections or data sharing
- Built with standard Electron framework

## After First Run
- The app remembers your choice
- No more security warnings
- Runs normally in system tray
- Auto-starts recording when Valorant launches

---
📧 Questions? Open an issue on GitHub: https://github.com/Harshit1o/valorant-voice-recorder/issues