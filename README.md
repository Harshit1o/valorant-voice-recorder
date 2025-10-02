# 🎮 Valorant Voice Recorder

Automatically record your voice during Valorant matches with zero configuration required.

![Valorant Voice Recorder](https://img.shields.io/badge/Platform-Windows-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Electron](https://img.shields.io/badge/Electron-27.0.0-lightblue)
![React](https://img.shields.io/badge/React-18.2.0-blue)

## ✨ Features

- ✅ **ONLY Valorant starts** → Recording automatically starts
- ❌ **Valorant closes** → Recording automatically stops  
- ⏰ **2-hour limit** → Recording auto-stops after 2 hours max
- 🚫 **No other apps** → Riot Client, Steam, Discord, etc. are ignored
- 📁 **Auto-save** → Files saved to `Documents/Game Recordings/`

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the application
npm start
```

## 📋 Usage

1. **Initialize** - Click "Initialize" to set up microphone permissions
2. **Start Monitoring** - Click "Start Monitoring" to begin Valorant detection
3. **Launch Valorant** - Recording starts automatically when Valorant runs
4. **Play** - Recording continues for entire session (max 2 hours)
5. **Close Valorant** - Recording stops and saves automatically

## 📂 Project Structure

```
src/
├── main.ts              # Electron main process
├── index.ts             # Core AudioRecorderSDK
├── valorantMonitor.ts   # Simple process monitoring
└── autoRecorder.ts      # Auto recording logic

renderer/
├── index.html           # UI interface
└── app.js              # Frontend logic

preload/
└── preload.ts          # Secure IPC bridge
```

## 🔧 Core Features

- **Simple Process Detection** - No complex memory analysis
- **2-Hour Recording Limit** - Prevents excessive file sizes
- **Automatic File Management** - Organized saving with timestamps
- **Clean Architecture** - Easy to understand and maintain
- **Cross-Platform Ready** - Electron-based for Windows/Mac/Linux

## 📁 Recording Files

Files are automatically saved to:
- **Windows**: `C:\Users\[Username]\Documents\Game Recordings\`
- **Format**: `Valorant_YYYY-MM-DD-HH-MM-SS.webm`
- **Quality**: High-quality audio with noise suppression

## 🎤 Audio Settings

- **Format**: WebM with Opus codec
- **Features**: Echo cancellation, noise suppression, auto gain control
- **Bitrate**: Optimized for voice and game audio

## ⚙️ Configuration

The SDK uses simple, reliable defaults:
- **Polling Interval**: 2 seconds (process detection)
- **Max Recording**: 2 hours
- **Audio Quality**: High with noise reduction

## 🛠️ Development

```bash
# Watch mode for development
npm run dev

# Build TypeScript
npm run build

# Package for distribution
npm run package
```

## 📝 Notes

- **EXCLUSIVELY monitors `VALORANT.exe`** (the actual game process)
- **Completely ignores**: Riot Client, League Client, Steam, Discord, etc.
- **Simple binary logic**: Valorant process running = Recording active
- **Zero false positives**: No accidental recordings from other apps
- **Game-focused**: Only captures actual Valorant gameplay sessions

---

**Simple, reliable, and focused on actual gameplay recording!** 🎮🎤