const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron')
const path = require('path')
const fs = require('fs')
const { autoRecorder } = require('./autoRecorder')

// Keep the app running in background
let tray = null
let mainWindow = null
let isRecording = false

// Set app to start with Windows (optional)
if (process.platform === 'win32') {
  app.setLoginItemSettings({
    openAtLogin: true,
    name: 'Valorant Voice Recorder',
    enabled: true
  })
}

const createTray = () => {
  // Create tray icon (you can add a proper icon file)
  const icon = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
  tray = new Tray(icon)
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Valorant Voice Recorder',
      enabled: false
    },
    { type: 'separator' },
    {
      label: `Status: ${isRecording ? 'Recording' : 'Monitoring'}`,
      enabled: false
    },
    { type: 'separator' },
    {
      label: 'Show Window',
      click: () => {
        if (mainWindow) {
          mainWindow.show()
        } else {
          createWindow()
        }
      }
    },
    {
      label: 'Open Recordings Folder',
      click: () => {
        const { shell } = require('electron')
        const recordingsPath = path.join(require('os').homedir(), 'Documents', 'Game Recordings')
        shell.openPath(recordingsPath)
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ])
  
  tray.setContextMenu(contextMenu)
  tray.setToolTip('Valorant Voice Recorder - Monitoring')
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    show: false, // Start hidden
    icon: path.join(__dirname, '../assets/icon.png'), // Add icon if available
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile('renderer/index.html')
  }

  // Hide to tray instead of closing
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
    }
  })
}

// Initialize the app
app.whenReady().then(() => {
  createTray()
  createWindow()
  
  // Start auto recording immediately
  autoRecorder.start()
  
  // Update tray status
  setInterval(() => {
    const newStatus = autoRecorder.isRecording()
    if (newStatus !== isRecording) {
      isRecording = newStatus
      if (tray) {
        const contextMenu = Menu.buildFromTemplate([
          {
            label: 'Valorant Voice Recorder',
            enabled: false
          },
          { type: 'separator' },
          {
            label: `Status: ${isRecording ? 'Recording' : 'Monitoring'}`,
            enabled: false
          },
          { type: 'separator' },
          {
            label: 'Show Window',
            click: () => {
              if (mainWindow) {
                mainWindow.show()
              } else {
                createWindow()
              }
            }
          },
          {
            label: 'Open Recordings Folder',
            click: () => {
              const { shell } = require('electron')
              const recordingsPath = path.join(require('os').homedir(), 'Documents', 'Game Recordings')
              shell.openPath(recordingsPath)
            }
          },
          { type: 'separator' },
          {
            label: 'Quit',
            click: () => {
              app.quit()
            }
          }
        ])
        tray.setContextMenu(contextMenu)
        tray.setToolTip(`Valorant Voice Recorder - ${isRecording ? 'Recording' : 'Monitoring'}`)
      }
    }
  }, 2000)
})

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  // Keep running in background
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Handle app quitting
app.on('before-quit', () => {
  app.isQuiting = true
  autoRecorder.stop()
})

// IPC handlers (same as before)
ipcMain.handle('get-microphone-permission', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach(track => track.stop())
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('start-recording', async (event, filename) => {
  return autoRecorder.startRecordingForApp('manual', filename)
})

ipcMain.handle('stop-recording', async () => {
  return autoRecorder.stopCurrentRecording()
})

ipcMain.handle('get-recording-status', async () => {
  return {
    isRecording: autoRecorder.isRecording(),
    currentApp: autoRecorder.getCurrentApp(),
    startTime: autoRecorder.getStartTime()
  }
})

ipcMain.handle('save-recording', async (event, audioBlob, filename) => {
  try {
    const documentsPath = require('os').homedir()
    const recordingsDir = path.join(documentsPath, 'Documents', 'Game Recordings')
    
    if (!fs.existsSync(recordingsDir)) {
      fs.mkdirSync(recordingsDir, { recursive: true })
    }
    
    const buffer = Buffer.from(audioBlob)
    const filePath = path.join(recordingsDir, filename)
    
    fs.writeFileSync(filePath, buffer)
    
    return { success: true, filePath }
  } catch (error) {
    return { success: false, error: error.message }
  }
})