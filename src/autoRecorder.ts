/**
 * Simple Auto Audio Recorder
 * Automatically records audio when Valorant is running
 * Max duration: 2 hours
 */

import ApplicationMonitor, { ApplicationInfo } from './valorantMonitor';
import { AudioRecorderSDK } from './index';

export interface RecordingSession {
  application: ApplicationInfo;
  startTime: Date;
  endTime?: Date;
  filePath?: string;
  duration?: number;
}

export class AutoAudioRecorder {
  private appMonitor: ApplicationMonitor;
  private audioRecorder: AudioRecorderSDK;
  private isRecording = false;
  private currentSession: RecordingSession | null = null;
  private recordingSessions: RecordingSession[] = [];
  private isInitialized = false;
  private maxRecordingDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  private recordingTimeoutId: NodeJS.Timeout | null = null;

  constructor() {
    this.appMonitor = new ApplicationMonitor({ pollingInterval: 2000 });
    this.audioRecorder = new AudioRecorderSDK();
    this.setupEventHandlers();
  }

  /**
   * Initialize the Auto Audio Recorder
   */
  public async initialize(): Promise<boolean> {
    try {
      console.log('🎤 Initializing Simple Auto Recorder...');
      
      const audioInitialized = await this.audioRecorder.initialize();
      if (!audioInitialized) {
        throw new Error('Failed to initialize audio recorder');
      }

      const permission = await this.audioRecorder.requestMicrophonePermission();
      if (!permission.granted) {
        throw new Error('Microphone permission denied');
      }

      this.isInitialized = true;
      console.log('✅ Simple Auto Recorder initialized');
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to initialize:', errorMessage);
      return false;
    }
  }

  /**
   * Start monitoring for Valorant
   */
  public startMonitoring(): void {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized. Call initialize() first.');
    }

    console.log('🔍 Starting Valorant monitoring...');
    console.log('� Simple logic: Valorant runs = Recording starts');
    this.appMonitor.startMonitoring();
  }

  /**
   * Stop monitoring and any active recordings
   */
  public stopMonitoring(): void {
    console.log('🛑 Stopping monitoring...');
    this.appMonitor.stopMonitoring();
    
    if (this.currentSession) {
      this.stopCurrentRecording();
    }
    
    if (this.recordingTimeoutId) {
      clearTimeout(this.recordingTimeoutId);
      this.recordingTimeoutId = null;
    }
  }

  /**
   * Setup event handlers for application detection
   */
  private setupEventHandlers(): void {
    this.appMonitor.onAppStart(async (app: ApplicationInfo) => {
      console.log(`✅ ${app.name} started - Beginning recording`);
      await this.startRecordingForApp(app);
    });

    this.appMonitor.onAppStop(async (app: ApplicationInfo) => {
      console.log(`❌ ${app.name} stopped - Ending recording`);
      
      if (this.currentSession && 
          this.currentSession.application.processName === app.processName) {
        await this.stopCurrentRecording();
      }
    });
  }

  /**
   * Start recording for detected application
   */
  private async startRecordingForApp(app: ApplicationInfo): Promise<void> {
    if (this.isRecording) {
      console.log('⚠️ Already recording');
      return;
    }

    try {
      const result = await this.audioRecorder.startRecording({
        mimeType: 'audio/webm;codecs=opus',
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      });

      if (result.success) {
        this.isRecording = true;
        this.currentSession = {
          application: app,
          startTime: new Date()
        };

        console.log(`🔴 Recording started for ${app.name}`);
        console.log(`⏰ Max duration: 2 hours`);
        
        // Set 2-hour timeout
        this.recordingTimeoutId = setTimeout(() => {
          console.log('⏰ 2-hour limit reached - stopping recording');
          this.stopCurrentRecording();
        }, this.maxRecordingDuration);

      } else {
        console.error(`❌ Failed to start recording: ${result.error}`);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Error starting recording: ${errorMessage}`);
    }
  }

  /**
   * Stop current recording
   */
  private async stopCurrentRecording(): Promise<void> {
    if (!this.currentSession) {
      return;
    }

    try {
      if (this.recordingTimeoutId) {
        clearTimeout(this.recordingTimeoutId);
        this.recordingTimeoutId = null;
      }

      const result = await this.audioRecorder.stopRecording();
      
      if (result.success && this.currentSession) {
        this.currentSession.endTime = new Date();
        this.currentSession.duration = 
          this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime();

        console.log(`🛑 Recording stopped for ${this.currentSession.application.name}`);
        console.log(`⏱️ Duration: ${this.formatDuration(this.currentSession.duration)}`);
        
        if (this.currentSession.duration >= this.maxRecordingDuration - 1000) {
          console.log(`⏰ Stopped due to 2-hour limit`);
        }
        
        await this.saveCurrentRecording();
        this.recordingSessions.push({ ...this.currentSession });
        this.currentSession = null;
        this.isRecording = false;
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Error stopping recording: ${errorMessage}`);
    }
  }

  /**
   * Save the current recording
   */
  private async saveCurrentRecording(): Promise<void> {
    if (!this.currentSession) {
      return;
    }

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const appName = this.sanitizeFilename(this.currentSession.application.name);
      const filename = `${appName}_${timestamp}.webm`;
      
      console.log(`💾 Saving recording: ${filename}`);
      
      const mockAudioData = new Uint8Array(0);
      const result = await this.audioRecorder.saveAudioFile(mockAudioData, filename);
      
      if (result.success) {
        this.currentSession.filePath = result.filePath || undefined;
        console.log(`✅ Recording saved to: ${result.filePath}`);
      } else {
        console.error(`❌ Failed to save recording: ${result.error}`);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Error saving recording: ${errorMessage}`);
    }
  }

  /**
   * Sanitize filename
   */
  private sanitizeFilename(filename: string): string {
    return filename.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_');
  }

  /**
   * Format duration in human-readable format
   */
  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Get current status
   */
  public getStatus(): {
    monitoring: boolean;
    recording: boolean;
    currentApp: string | null;
    sessionsCount: number;
  } {
    return {
      monitoring: this.appMonitor.isAnyAppRunning(),
      recording: this.isRecording,
      currentApp: this.currentSession?.application.name || null,
      sessionsCount: this.recordingSessions.length
    };
  }

  /**
   * Get recording sessions
   */
  public getRecordingSessions(): RecordingSession[] {
    return [...this.recordingSessions];
  }

  /**
   * Get running applications
   */
  public getRunningApps(): ApplicationInfo[] {
    return this.appMonitor.getRunningApps();
  }
}

// Export singleton instance
export const autoAudioRecorder = new AutoAudioRecorder();

export default AutoAudioRecorder;