interface AudioRecorderAPI {
    requestMicrophonePermission(): Promise<{
        granted: boolean;
        error: string | null;
    }>;
    getAudioSources(): Promise<{
        sources: any[];
        error: string | null;
    }>;
    startRecording(options?: any): Promise<{
        success: boolean;
        error: string | null;
    }>;
    stopRecording(): Promise<{
        success: boolean;
        error: string | null;
    }>;
    saveAudioFile(audioData: any, filename: string): Promise<{
        success: boolean;
        filePath: string | null;
        error: string | null;
    }>;
    getRecordingStatus(): Promise<{
        isRecording: boolean;
    }>;
}
declare global {
    interface Window {
        audioRecorderSDK: AudioRecorderAPI;
    }
}
export {};
//# sourceMappingURL=preload.d.ts.map