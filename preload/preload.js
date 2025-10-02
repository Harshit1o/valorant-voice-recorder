"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose the API to the renderer process
const audioRecorderAPI = {
    requestMicrophonePermission: () => electron_1.ipcRenderer.invoke('request-microphone-permission'),
    getAudioSources: () => electron_1.ipcRenderer.invoke('get-audio-sources'),
    startRecording: (options) => electron_1.ipcRenderer.invoke('start-recording', options),
    stopRecording: () => electron_1.ipcRenderer.invoke('stop-recording'),
    saveAudioFile: (audioData, filename) => electron_1.ipcRenderer.invoke('save-audio-file', audioData, filename),
    getRecordingStatus: () => electron_1.ipcRenderer.invoke('get-recording-status')
};
// Expose the API through context bridge
electron_1.contextBridge.exposeInMainWorld('audioRecorderSDK', audioRecorderAPI);
//# sourceMappingURL=preload.js.map