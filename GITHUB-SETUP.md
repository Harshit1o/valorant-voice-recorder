# 🚀 GitHub Repository Setup Guide

## Complete setup for automatic GitHub Releases distribution

---

## 📁 **Essential Files for GitHub Repository**

### **Core Application Files (Required)**
```
├── src/                           # Main Electron source code
│   ├── main-production.js         # Production main process
│   ├── autoRecorder.ts           # Recording engine
│   ├── valorantMonitor.ts        # Process monitoring
│   └── preload.ts                # IPC bridge
├── renderer/                      # Frontend UI
│   ├── index.html                # Main interface
│   └── app.js                    # Frontend logic
├── build/                         # Build assets
│   ├── installer.nsh             # NSIS installer script
│   └── LICENSE.txt               # License for installer
├── package.json                   # Dependencies & build config
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.preload.json          # Preload TypeScript config
└── LICENSE                        # MIT License
```

### **GitHub Automation Files (Required)**
```
├── .github/
│   └── workflows/
│       └── build-release.yml      # Auto-build on release
├── .gitignore                     # Git ignore patterns
└── README.md                      # Project documentation
```

### **Optional but Recommended**
```
├── sdk-distribution-web/          # Web distribution platform
│   ├── src/                      # React source
│   ├── package.json              # Web app dependencies
│   └── dist/                     # Built web app (auto-generated)
├── DEPLOYMENT-GUIDE.md           # Deployment instructions
└── GITHUB-SETUP.md               # This file
```

---

## 🔧 **Step-by-Step GitHub Setup**

### **Step 1: Create GitHub Repository**

1. **Go to GitHub.com** and create new repository
2. **Repository name**: `valorant-voice-recorder`
3. **Description**: "Automatically record voice during Valorant matches"
4. **Visibility**: Public (for free GitHub Actions)
5. **Initialize**: Don't initialize (we have local repo)

### **Step 2: Connect Local Repository**

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR-USERNAME/valorant-voice-recorder.git

# Update package.json with your GitHub info
# Edit package.json "publish" section:
"publish": [
  {
    "provider": "github",
    "owner": "YOUR-USERNAME",
    "repo": "valorant-voice-recorder"
  }
]
```

### **Step 3: Prepare Files for Upload**

```bash
# Stage all files
git add .

# Commit initial version
git commit -m "Initial commit: Valorant Voice Recorder v1.0.0"

# Push to GitHub
git push -u origin main
```

### **Step 4: Configure Repository Settings**

1. **Go to repository Settings**
2. **Actions → General → Workflow permissions**
3. **Select**: "Read and write permissions"
4. **Check**: "Allow GitHub Actions to create and approve pull requests"

### **Step 5: Create First Release**

```bash
# Tag the first version
git tag v1.0.0

# Push the tag to trigger auto-build
git push origin v1.0.0
```

---

## 🔄 **Automatic Build Process**

### **What Happens When You Push a Tag:**

1. **GitHub Actions triggers** (`build-release.yml`)
2. **Builds on 3 platforms**: Windows, macOS, Linux
3. **Creates installers**: 
   - Windows: `ValorantVoiceRecorderSetup.exe`
   - macOS: `ValorantVoiceRecorder.dmg`
   - Linux: `ValorantVoiceRecorder.AppImage`
4. **Creates GitHub Release** with all installers attached
5. **Users can download** from releases page

### **Release URL Structure:**
```
https://github.com/YOUR-USERNAME/valorant-voice-recorder/releases
```

---

## 🎯 **Files You MUST Include in GitHub**

### **1. Core Application** ✅
- [x] `src/` folder (all TypeScript source)
- [x] `renderer/` folder (HTML/JS frontend)
- [x] `package.json` (with electron-builder config)
- [x] `tsconfig.json` files

### **2. Build Configuration** ✅
- [x] `build/installer.nsh` (Windows installer script)
- [x] `.github/workflows/build-release.yml` (Auto-build)

### **3. Documentation** ✅
- [x] `README.md` (User-facing documentation)
- [x] `LICENSE` (MIT License)
- [x] `.gitignore` (Exclude build files)

### **4. Web Distribution** (Optional but recommended)
- [x] `sdk-distribution-web/` (React web app)

---

## 🚫 **Files You Should NOT Include**

### **Build Outputs** (Auto-generated)
```
├── node_modules/          # Dependencies (npm install)
├── dist/                  # Compiled TypeScript
├── release/               # Built installers
└── complete-distribution/ # Local distribution package
```

### **Development Files**
```
├── .vscode/              # VS Code settings
├── *.log                 # Log files
└── .env                  # Environment variables
```

---

## 🔥 **Quick Setup Commands**

### **Complete Repository Setup (Copy & Paste)**

```bash
# 1. Initialize and connect repository
git remote add origin https://github.com/YOUR-USERNAME/valorant-voice-recorder.git

# 2. Update package.json owner/repo fields (manually edit)

# 3. Stage all files
git add .

# 4. Initial commit
git commit -m "🎮 Initial commit: Valorant Voice Recorder v1.0.0

Features:
- Automatic Valorant detection and voice recording
- 2-hour recording limit per session
- Background operation with system tray
- Auto-updates via GitHub releases
- Cross-platform support (Windows/Mac/Linux)
- Web distribution platform with React"

# 5. Push to GitHub
git push -u origin main

# 6. Create and push first release tag
git tag v1.0.0
git push origin v1.0.0
```

### **Update Package.json Before Push**

Edit these lines in `package.json`:
```json
{
  "build": {
    "publish": [
      {
        "provider": "github",
        "owner": "YOUR-ACTUAL-USERNAME",
        "repo": "valorant-voice-recorder"
      }
    ]
  }
}
```

---

## 🎉 **After Setup: User Experience**

### **For Users:**
1. **Visit**: `https://github.com/YOUR-USERNAME/valorant-voice-recorder`
2. **Click**: "Releases" → "Latest"
3. **Download**: `ValorantVoiceRecorderSetup.exe`
4. **Install**: Double-click installer
5. **Use**: Launch Valorant → Recording starts automatically!

### **For Updates:**
```bash
# Update version in package.json
"version": "1.0.1"

# Commit changes
git commit -am "Update to v1.0.1: Bug fixes and improvements"

# Tag new version
git tag v1.0.1
git push origin v1.0.1

# GitHub automatically builds and releases!
```

---

## 🔧 **Troubleshooting GitHub Actions**

### **Build Failures:**
1. **Check Actions tab** in GitHub repository
2. **Common issues**:
   - Missing `package.json` scripts
   - TypeScript compilation errors
   - Missing dependencies
3. **Fix locally** and push again

### **Release Not Created:**
1. **Verify tag format**: Must be `v1.0.0` (with 'v' prefix)
2. **Check permissions**: Repository settings → Actions
3. **Verify workflow file**: `.github/workflows/build-release.yml`

---

## ✅ **Final Checklist**

Before pushing to GitHub:

- [ ] Update `package.json` with your GitHub username
- [ ] Test local build: `npm run dist:win`
- [ ] Verify all source files are present
- [ ] Check `.gitignore` excludes build outputs
- [ ] Confirm GitHub repository is created
- [ ] Repository has Actions enabled with write permissions

**You're ready to launch!** 🚀

Once pushed, users will be able to download your Valorant Voice Recorder from GitHub Releases with automatic updates!