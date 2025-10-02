/**
 * Audio Recorder SDK for Electron
 * A cross-platform desktop SDK for recording audio from microphone
 */

/// <reference path="./types.d.ts" />

export interface AudioRecorderOptions {
  mimeType?: string;
  audioBitsPerSecond?: number;
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
}

export interface RecordingResult {
  success: boolean;
  error?: string | null;
}

export interface PermissionResult {
  granted: boolean;
  error?: string | null;
}

export interface SaveResult {
  success: boolean;
  filePath?: string | null;
  error?: string | null;
}

export interface AudioSource {
  id: string;
  name: string;
  kind: string;
}

export interface SourcesResult {
  sources: AudioSource[];
  error?: string | null;
}

/**
 * Main SDK class for audio recording functionality
 */
export class AudioRecorderSDK {
  private isInitialized: boolean = false;
  private isRecording: boolean = false;

  /**
   * Initialize the SDK
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if we're in an Electron environment
      if (typeof window === 'undefined' || !window.audioRecorderSDK) {
        throw new Error('SDK must be used in an Electron renderer process');
      }
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Audio Recorder SDK:', error);
      return false;
    }
  }

  /**
   * Request microphone permission from the user
   */
  async requestMicrophonePermission(): Promise<PermissionResult> {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized. Call initialize() first.');
    }

    try {
      const result = await window.audioRecorderSDK.requestMicrophonePermission();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { granted: false, error: errorMessage };
    }
  }

  /**
   * Get available audio input sources
   */
  async getAudioSources(): Promise<SourcesResult> {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized. Call initialize() first.');
    }

    try {
      const result = await window.audioRecorderSDK.getAudioSources();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { sources: [], error: errorMessage };
    }
  }

  /**
   * Start recording audio
   */
  async startRecording(options?: AudioRecorderOptions): Promise<RecordingResult> {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized. Call initialize() first.');
    }

    if (this.isRecording) {
      return { success: false, error: 'Recording is already in progress' };
    }

    try {
      const result = await window.audioRecorderSDK.startRecording(options);
      if (result.success) {
        this.isRecording = true;
      }
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Stop recording audio
   */
  async stopRecording(): Promise<RecordingResult> {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized. Call initialize() first.');
    }

    if (!this.isRecording) {
      return { success: false, error: 'No recording in progress' };
    }

    try {
      const result = await window.audioRecorderSDK.stopRecording();
      if (result.success) {
        this.isRecording = false;
      }
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Save recorded audio to file
   */
  async saveAudioFile(audioData: Uint8Array | ArrayBuffer, filename: string): Promise<SaveResult> {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized. Call initialize() first.');
    }

    try {
      const result = await window.audioRecorderSDK.saveAudioFile(audioData, filename);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Get current recording status
   */
  async getRecordingStatus(): Promise<{ isRecording: boolean }> {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized. Call initialize() first.');
    }

    try {
      const result = await window.audioRecorderSDK.getRecordingStatus();
      this.isRecording = result.isRecording;
      return result;
    } catch (error) {
      return { isRecording: false };
    }
  }

  /**
   * Check if currently recording
   */
  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Check if SDK is initialized
   */
  isSDKInitialized(): boolean {
    return this.isInitialized;
  }
}

// Export a singleton instance for convenience
export const audioRecorder = new AudioRecorderSDK();

// Default export
export default AudioRecorderSDK;