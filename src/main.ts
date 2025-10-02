import { app, BrowserWindow, ipcMain, systemPreferences, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

class AudioRecorderSDK {
  private mainWindow: BrowserWindow | null = null;
  private isRecording = false;
  private saveDirectory: string | null = null; // User's preferred save location

  constructor() {
    this.initializeApp();
  }

  private initializeApp(): void {
    app.whenReady().then(() => {
      this.createWindow();
      this.setupIPC();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });
  }

  private createWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload/preload.js'),
        webSecurity: false // Enable for development, disable for production
      }
    });

    // Load the HTML file
    this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.webContents.openDevTools();
    }
  }

  private setupIPC(): void {
    // Request microphone permission
    ipcMain.handle('request-microphone-permission', async () => {
      try {
        if (process.platform === 'darwin') {
          const status = await systemPreferences.askForMediaAccess('microphone');
          return { granted: status, error: null };
        }
        // For Windows and Linux, permissions are handled by the browser
        return { granted: true, error: null };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { granted: false, error: errorMessage };
      }
    });

    // Get audio sources
    ipcMain.handle('get-audio-sources', async () => {
      try {
        // For now, return a simple audio source structure
        // Real audio source detection would need more complex implementation
        const sources = [
          { id: 'default', name: 'Default Microphone', kind: 'audioinput' }
        ];
        return { sources, error: null };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { sources: [], error: errorMessage };
      }
    });

    // Start recording
    ipcMain.handle('start-recording', async (event, options) => {
      try {
        this.isRecording = true;
        // The actual recording will be handled in the renderer process
        // This is just for state management
        return { success: true, error: null };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: errorMessage };
      }
    });

    // Stop recording
    ipcMain.handle('stop-recording', async () => {
      try {
        this.isRecording = false;
        return { success: true, error: null };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: errorMessage };
      }
    });

    // Save audio file
    ipcMain.handle('save-audio-file', async (event, audioData, filename) => {
      try {
        // Use custom save directory if set, otherwise use default Game Recordings folder
        let recordingsDir: string;
        
        if (this.saveDirectory) {
          recordingsDir = this.saveDirectory;
        } else {
          const documentsPath = app.getPath('documents');
          recordingsDir = path.join(documentsPath, 'Game Recordings');
        }
        
        // Ensure the directory exists
        await fs.promises.mkdir(recordingsDir, { recursive: true });
        
        const filePath = path.join(recordingsDir, filename);
        
        // Convert base64 to buffer if needed
        let buffer: Buffer;
        if (typeof audioData === 'string') {
          buffer = Buffer.from(audioData, 'base64');
        } else {
          buffer = Buffer.from(audioData);
        }
        
        await fs.promises.writeFile(filePath, buffer);
        return { success: true, filePath, error: null };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, filePath: null, error: errorMessage };
      }
    });

    // Get recording status
    ipcMain.handle('get-recording-status', async () => {
      return { isRecording: this.isRecording };
    });

    // Choose save directory
    ipcMain.handle('choose-save-directory', async () => {
      try {
        const result = await dialog.showOpenDialog(this.mainWindow!, {
          properties: ['openDirectory'],
          title: 'Choose Recording Save Location'
        });
        
        if (!result.canceled && result.filePaths.length > 0) {
          this.saveDirectory = result.filePaths[0]; // Store the selected directory
          return { success: true, path: result.filePaths[0], error: null };
        } else {
          return { success: false, path: null, error: 'No directory selected' };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, path: null, error: errorMessage };
      }
    });
  }
}

// Initialize the SDK
new AudioRecorderSDK();