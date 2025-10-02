const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, dialog } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const fs = require('fs')
const { autoRecorder } = require('./autoRecorder')

// Configure auto-updater
autoUpdater.checkForUpdatesAndNotify()

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  console.log('Update available.')
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: 'A new version is available. It will be downloaded in the background.',
    buttons: ['OK']
  })
})

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available.')
})

autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater. ' + err)
})

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
  console.log(log_message)
})

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded')
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: 'Update downloaded. The application will restart to apply the update.',
    buttons: ['Restart Now', 'Later']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall()
    }
  })
})

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
  // Create tray icon (basic icon - you can replace with proper icon)
  const icon = nativeImage.createEmpty()
  icon.addRepresentation({
    scaleFactor: 1.0,
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')
  })
  
  tray = new Tray(icon)
  
  const updateTrayMenu = () => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Valorant Voice Recorder v1.0.0',
        enabled: false
      },
      { type: 'separator' },
      {
        label: `Status: ${isRecording ? '🔴 Recording' : '⚪ Monitoring'}`,
        enabled: false
      },
      { type: 'separator' },
      {
        label: 'Show Window',
        click: () => {
          if (mainWindow) {
            mainWindow.show()
            mainWindow.focus()
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
        label: 'Check for Updates',
        click: () => {
          autoUpdater.checkForUpdatesAndNotify()
        }
      },
      { type: 'separator' },
      {
        label: 'Quit Valorant Recorder',
        click: () => {
          app.isQuiting = true
          app.quit()
        }
      }
    ])
    
    tray.setContextMenu(contextMenu)
  }
  
  updateTrayMenu()
  tray.setToolTip('Valorant Voice Recorder - Click for options')
  
  // Update tray menu periodically to reflect recording status
  setInterval(updateTrayMenu, 2000)
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // Start hidden
    autoHideMenuBar: true,
    icon: path.join(__dirname, '../build/icon.png'),
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
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  // Hide to tray instead of closing
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
      
      // Show notification on first minimize
      if (!mainWindow.hasShownTrayNotification) {
        tray.displayBalloon({
          iconType: 'info',
          title: 'Valorant Voice Recorder',
          content: 'App is running in the background. Right-click the tray icon for options.'
        })
        mainWindow.hasShownTrayNotification = true
      }
    }
  })

  // Show window when created
  mainWindow.once('ready-to-show', () => {
    if (process.argv.includes('--show-window')) {
      mainWindow.show()
    }
  })
}

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, focus our window instead
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
      mainWindow.show()
    }
  })

  // Initialize the app
  app.whenReady().then(async () => {
    createTray()
    createWindow()
    
    // Start auto recording immediately
    autoRecorder.start()
    
    // Check for updates on startup (after 3 seconds delay)
    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify()
    }, 3000)
    
    // Update recording status
    setInterval(() => {
      const newStatus = autoRecorder.isRecording()
      if (newStatus !== isRecording) {
        isRecording = newStatus
        // Tray menu updates automatically via setInterval above
      }
    }, 2000)
  })
}

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  // Keep running in background on all platforms
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

// IPC handlers for communication with renderer
ipcMain.handle('get-microphone-permission', async () => {
  try {
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

ipcMain.handle('check-for-updates', async () => {
  autoUpdater.checkForUpdatesAndNotify()
})