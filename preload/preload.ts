import { contextBridge, ipcRenderer } from 'electron';

// Define the API interface
interface AudioRecorderAPI {
  requestMicrophonePermission(): Promise<{ granted: boolean; error: string | null }>;
  getAudioSources(): Promise<{ sources: any[]; error: string | null }>;
  startRecording(options?: any): Promise<{ success: boolean; error: string | null }>;
  stopRecording(): Promise<{ success: boolean; error: string | null }>;
  saveAudioFile(audioData: any, filename: string): Promise<{ success: boolean; filePath: string | null; error: string | null }>;
  getRecordingStatus(): Promise<{ isRecording: boolean }>;
}

// Expose the API to the renderer process
const audioRecorderAPI: AudioRecorderAPI = {
  requestMicrophonePermission: () => ipcRenderer.invoke('request-microphone-permission'),
  getAudioSources: () => ipcRenderer.invoke('get-audio-sources'),
  startRecording: (options) => ipcRenderer.invoke('start-recording', options),
  stopRecording: () => ipcRenderer.invoke('stop-recording'),
  saveAudioFile: (audioData, filename) => ipcRenderer.invoke('save-audio-file', audioData, filename),
  getRecordingStatus: () => ipcRenderer.invoke('get-recording-status')
};

// Expose the API through context bridge
contextBridge.exposeInMainWorld('audioRecorderSDK', audioRecorderAPI);

// Type declaration for TypeScript
declare global {
  interface Window {
    audioRecorderSDK: AudioRecorderAPI;
  }
}