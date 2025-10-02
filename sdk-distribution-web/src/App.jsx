import React, { useState, useEffect } from 'react'
import { Download, User, Play, CheckCircle, AlertCircle, Mic, Settings, Shield } from 'lucide-react'

function App() {
  const [userName, setUserName] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState('idle') // idle, downloading, complete
  const [currentStep, setCurrentStep] = useState(1)

  const handleLogin = (e) => {
    e.preventDefault()
    if (userName.trim()) {
      setIsLoggedIn(true)
      setCurrentStep(2)
    }
  }

  const handleDownload = async () => {
    setDownloadStatus('downloading')
    
    try {
      // Create setup instructions first
      const setupInstructions = `# Valorant Voice Recorder - Installation Guide

Hello ${userName}!

## 🎮 What you downloaded:
- ValorantVoiceRecorderSetup.exe (Automatic Installer) 
- OR ValorantVoiceRecorder-Portable.zip (Portable Version)

## 🚀 Installation Options:

### Option 1: Automatic Installer (Recommended)
1. **Run the installer**: Double-click "ValorantVoiceRecorderSetup.exe"
2. **Follow the setup wizard**: Choose installation location
3. **Grant permissions**: Allow microphone access when prompted
4. **Done!** The app starts automatically and runs in system tray

### Option 2: Portable Version
1. **Extract ZIP file**: Right-click → "Extract All"
2. **Run the app**: Double-click "ValorantVoiceRecorder.exe"
3. **Grant permissions**: Allow microphone access when prompted

## ✨ How it works:
✅ **Automatic Detection**: Monitors for VALORANT.exe process
✅ **Smart Recording**: Starts when Valorant launches, stops when you quit
✅ **2-Hour Limit**: Prevents huge files with automatic session limits
✅ **High Quality**: WebM/Opus format for clear voice recording
✅ **Background Operation**: Runs silently in system tray
✅ **Auto-Start**: Optional Windows startup integration

## 📁 File Locations:
- **Recordings**: Documents/Game Recordings/
- **App Location**: Program Files/ValorantVoiceRecorder/ (or your chosen folder)

## 🎯 System Tray Features:
Right-click the tray icon to:
- View recording status (🔴 Recording / ⚪ Monitoring)
- Open recordings folder
- Show main window
- Check for updates
- Quit the application

## 🔧 Troubleshooting:

**No recordings created?**
- Check Windows microphone permissions (Settings → Privacy → Microphone)
- Verify Valorant is running (should see VALORANT.exe in Task Manager)
- Test your microphone in other apps

**App not starting?**
- Run as Administrator (right-click → "Run as administrator")
- Check Windows Defender / antivirus settings
- Ensure you have the latest Windows updates

**Performance issues?**
- The app uses minimal resources (< 50MB RAM)
- Close other recording software to avoid conflicts
- Restart the app if you experience any issues

## 🔄 Updates:
- The app automatically checks for updates
- You'll be notified when new versions are available
- Updates include new features and bug fixes

## 🎊 You're all set!
Launch Valorant and start playing - your voice will be recorded automatically!
Files are saved with timestamps like: "valorant_recording_2024-10-02_16-30-15.webm"

---
Installation Guide for: ${userName}
Generated: ${new Date().toLocaleString()}
Version: 1.0.0

Enjoy automatic Valorant voice recording! 🎮🎤`

      // Download setup instructions
      const blob = new Blob([setupInstructions], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Valorant-Recorder-Setup-Guide-${userName.toLowerCase().replace(/\s+/g, '-')}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Download the actual installer from GitHub releases
      setTimeout(async () => {
        try {
          // Direct download from GitHub releases
          const downloadInfo = `# 🎮 Valorant Voice Recorder - Installation Guide

Hello ${userName}!

## 🚀 Quick Start:

### Step 1: Download
Visit: https://github.com/Harshit1o/valorant-voice-recorder/releases/latest

### Step 2: Windows Security Setup (IMPORTANT)
Windows will show security warnings because this is a free app (not paying $200+/year for code signing).

**Choose ONE method:**

#### Method A: Run as Administrator (Recommended)
1. Right-click the downloaded .exe file
2. Select "Run as administrator" 
3. Click "Yes" when Windows asks permission
4. ✅ App will run normally!

#### Method B: SmartScreen Bypass
If you see "Windows protected your PC":
1. Click "More info"
2. Click "Run anyway"
3. ✅ App will run normally!

#### Method C: Add to Windows Defender Exclusions
1. Open Windows Security → Virus & threat protection
2. Click "Manage settings" → "Exclusions" → "Add an exclusion"
3. Select "File" and choose your downloaded .exe
4. ✅ No more warnings!

## 🎯 Available Downloads:
- **Valorant Voice Recorder Setup 1.0.6.exe** (Installer - Recommended)
- **electron-audio-recorder-sdk-Setup-1.0.6.exe** (Advanced installer)  
- **Valorant Voice Recorder 1.0.6.exe** (Portable - No installation)

## ✨ How It Works:
✅ Automatically detects when Valorant launches
✅ Records your microphone in high quality (WebM/Opus)
✅ Runs silently in system tray
✅ Stops recording when you quit Valorant
✅ 2-hour session limit (prevents huge files)
✅ Saves to Documents/Game Recordings/

## �️ Is It Safe?
**YES!** This app is:
- ✅ Open source (view all code on GitHub)
- ✅ Only records when Valorant is running
- ✅ No internet connections or data sharing
- ✅ Stores everything locally on your computer
- ✅ Built with standard Electron framework (used by Discord, VS Code, etc.)

## 🔧 After Installation:
- Look for the app icon in your system tray (bottom-right corner)
- Right-click the tray icon to see options
- Launch Valorant and recording starts automatically!
- Files saved as: valorant_recording_2024-10-02_16-30-15.webm

## ❓ Troubleshooting:
**Nothing happens when clicking .exe?**
- Try "Run as administrator"
- Check if it's running in system tray
- Temporarily disable antivirus

**No recordings created?**
- Check microphone permissions in Windows settings
- Verify Valorant.exe is running in Task Manager
- Test microphone in other apps first

## 📧 Need Help?
- GitHub Issues: https://github.com/Harshit1o/valorant-voice-recorder/issues
- View source code: https://github.com/Harshit1o/valorant-voice-recorder

---
Installation guide for: ${userName}
Generated: ${new Date().toLocaleString()}
GitHub: https://github.com/Harshit1o/valorant-voice-recorder

🎮 Happy Gaming! 🎤`

          const infoBlob = new Blob([downloadInfo], { type: 'text/plain' })
          const infoUrl = URL.createObjectURL(infoBlob)
          const infoLink = document.createElement('a')
          infoLink.href = infoUrl
          infoLink.download = `Valorant-Recorder-Download-${userName.toLowerCase().replace(/\s+/g, '-')}.txt`
          document.body.appendChild(infoLink)
          infoLink.click()
          document.body.removeChild(infoLink)
          URL.revokeObjectURL(infoUrl)

          // Also open GitHub releases page
          window.open('https://github.com/Harshit1o/valorant-voice-recorder/releases/latest', '_blank')
          
        } catch (error) {
          console.log('Error creating download info:', error)
        }
      }, 1000)

      // Simulate download completion
      setTimeout(() => {
        setDownloadStatus('complete')
        setCurrentStep(3)
      }, 3000)

    } catch (error) {
      console.error('Download failed:', error)
      setDownloadStatus('idle')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-valorant-dark via-gray-900 to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Mic className="w-12 h-12 text-valorant-red mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold text-glow">
              Valorant Voice Recorder
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Automatically record your voice during Valorant matches. Zero configuration, maximum convenience.
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-8">
              {[
                { num: 1, label: 'Login', icon: User },
                { num: 2, label: 'Download', icon: Download },
                { num: 3, label: 'Setup Complete', icon: CheckCircle }
              ].map(({ num, label, icon: Icon }) => (
                <div key={num} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    currentStep >= num 
                      ? 'bg-valorant-blue border-valorant-blue text-valorant-dark' 
                      : 'border-gray-600 text-gray-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`ml-2 font-medium ${currentStep >= num ? 'text-white' : 'text-gray-400'}`}>
                    {label}
                  </span>
                  {num < 3 && (
                    <div className={`w-16 h-0.5 ml-4 ${currentStep > num ? 'bg-valorant-blue' : 'bg-gray-600'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Login */}
          {!isLoggedIn && (
            <div className="card max-w-md mx-auto glow">
              <div className="text-center mb-6">
                <User className="w-16 h-16 text-valorant-blue mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
                <p className="text-gray-400">Enter your name to get started</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="input-field w-full"
                    placeholder="Enter your name..."
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Continue
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Download */}
          {isLoggedIn && downloadStatus !== 'complete' && (
            <div className="card max-w-2xl mx-auto glow">
              <div className="text-center mb-6">
                <Download className={`w-16 h-16 mx-auto mb-4 ${downloadStatus === 'downloading' ? 'text-valorant-gold animate-bounce-slow' : 'text-valorant-blue'}`} />
                <h2 className="text-2xl font-bold mb-2">Hi {userName}!</h2>
                <p className="text-gray-400">Ready to download your Valorant Voice Recorder?</p>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {[
                  { icon: Shield, title: 'Automatic Detection', desc: 'Detects Valorant launches automatically' },
                  { icon: Mic, title: 'High Quality Audio', desc: 'Crystal clear voice recording' },
                  { icon: Settings, title: 'Zero Configuration', desc: 'Works out of the box' },
                  { icon: Play, title: 'Background Service', desc: 'Runs silently in background' }
                ].map(({ icon: Icon, title, desc }, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                    <Icon className="w-6 h-6 text-valorant-blue flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-sm">{title}</h3>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleDownload}
                disabled={downloadStatus === 'downloading'}
                className={`w-full ${downloadStatus === 'downloading' ? 'bg-gray-600 cursor-not-allowed' : 'btn-primary'}`}
              >
                {downloadStatus === 'downloading' ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Preparing Download...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Download className="w-5 h-5 mr-2" />
                    Download SDK Package
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Step 3: Setup Complete */}
          {downloadStatus === 'complete' && (
            <div className="card max-w-2xl mx-auto glow">
              <div className="text-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-pulse-slow" />
                <h2 className="text-2xl font-bold mb-2">Setup Instructions Downloaded!</h2>
                <p className="text-gray-400">Follow the instructions in the downloaded file to complete setup</p>
              </div>

              <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-400 mb-1">Next Steps:</h3>
                    <ul className="text-sm text-green-200 space-y-1">
                      <li>1. Check your Downloads folder for the setup instructions</li>
                      <li>2. Follow the installation guide to set up the background service</li>
                      <li>3. Launch Valorant and start playing - recording begins automatically!</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn-secondary"
                >
                  Download for Another User
                </button>
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="text-center mt-12 text-gray-500">
            <p className="text-sm">
              Recordings are saved to: <code className="bg-gray-800 px-2 py-1 rounded">Documents/Game Recordings/</code>
            </p>
            <p className="text-xs mt-2">
              Automatic 2-hour recording limit per session • High-quality WebM/Opus format
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App