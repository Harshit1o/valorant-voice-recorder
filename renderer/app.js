// Simple Audio Recorder Implementation

class AudioRecorderApp {
    constructor() {
        this.isInitialized = false;
        this.isMonitoring = false;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.monitoringInterval = null;
        this.currentSession = null;
        this.sessionCount = 0;
        this.maxRecordingTime = 2 * 60 * 60 * 1000; // 2 hours
        this.recordingTimeout = null;
        
        // Simple target: Valorant only
        this.targetApps = [
            { name: 'Valorant', processName: 'VALORANT.exe' }
        ];
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateUI();
    }
    
    initializeElements() {
        this.initBtn = document.getElementById('initBtn');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.status = document.getElementById('status');
        this.monitoringStatus = document.getElementById('monitoringStatus');
        this.recordingStatus = document.getElementById('recordingStatus');
        this.currentApp = document.getElementById('currentApp');
        this.sessionsCount = document.getElementById('sessionsCount');
        this.appsList = document.getElementById('appsList');
    }
    
    setupEventListeners() {
        this.initBtn.addEventListener('click', () => this.initialize());
        this.startBtn.addEventListener('click', () => this.startMonitoring());
        this.stopBtn.addEventListener('click', () => this.stopMonitoring());
    }
    
    async initialize() {
        try {
            this.updateStatus('🎤 Initializing Simple Audio Recorder...', 'info');
            
            const permission = await window.audioRecorderSDK.requestMicrophonePermission();
            if (!permission.granted) {
                throw new Error('Microphone permission denied');
            }
            
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                } 
            });
            
            this.isInitialized = true;
            this.updateStatus('✅ Ready! Start monitoring to begin Valorant detection.', 'success');
            this.updateUI();
            
        } catch (error) {
            this.updateStatus(`❌ Initialization failed: ${error.message}`, 'error');
            console.error('Initialization error:', error);
        }
    }
    
    startMonitoring() {
        if (!this.isInitialized) {
            this.updateStatus('❌ Please initialize first', 'error');
            return;
        }
        
        this.isMonitoring = true;
        this.updateStatus('🔍 Monitoring Valorant... Simple logic: Process runs = Recording starts', 'info');
        this.updateUI();
        
        console.log('🔍 Started monitoring for Valorant (simple logic)');
    }
    
    stopMonitoring() {
        this.isMonitoring = false;
        
        if (this.isRecording) {
            this.stopRecording();
        }
        
        this.updateStatus('🛑 Monitoring stopped.', 'info');
        this.updateUI();
        this.clearDetectedApps();
    }
    
    async handleAppDetected(app) {
        if (this.isRecording) {
            console.log(`⚠️ Already recording for ${this.currentSession?.name}`);
            return;
        }
        
        console.log(`✅ ${app.name} detected! Starting recording...`);
        this.currentSession = app;
        await this.startRecording();
        this.addDetectedApp(app);
        this.updateStatus(`🔴 Recording ${app.name} (Max: 2 hours)`, 'success');
        
        // Set 2-hour timeout
        this.recordingTimeout = setTimeout(() => {
            if (this.isRecording) {
                this.updateStatus('⏰ 2-hour limit reached - stopping recording', 'info');
                this.handleAppStopped(app);
            }
        }, this.maxRecordingTime);
    }
    
    async handleAppStopped(app) {
        if (this.currentSession?.name === app.name) {
            console.log(`❌ ${app.name} stopped. Stopping recording...`);
            await this.stopRecording();
            this.removeDetectedApp(app);
            this.updateStatus(`💾 Recording saved for ${app.name}`, 'info');
        }
    }
    
    async startRecording() {
        try {
            if (!this.stream) {
                throw new Error('Audio stream not available');
            }
            
            this.audioChunks = [];
            this.mediaRecorder = new MediaRecorder(this.stream, {
                mimeType: 'audio/webm;codecs=opus'
            });
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = async () => {
                await this.saveRecording();
            };
            
            this.mediaRecorder.start(1000);
            this.isRecording = true;
            
            console.log('🔴 Recording started');
            
        } catch (error) {
            console.error('❌ Failed to start recording:', error);
            this.updateStatus(`❌ Failed to start recording: ${error.message}`, 'error');
        }
    }
    
    async stopRecording() {
        if (this.recordingTimeout) {
            clearTimeout(this.recordingTimeout);
            this.recordingTimeout = null;
        }
        
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.currentSession = null;
            console.log('🛑 Recording stopped');
        }
    }
    
    async saveRecording() {
        try {
            if (this.audioChunks.length === 0) {
                console.log('⚠️ No audio data to save');
                return;
            }
            
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm;codecs=opus' });
            const arrayBuffer = await audioBlob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const appName = this.currentSession ? 
                this.currentSession.name.replace(/[<>:"/\\|?*]/g, '_') : 'Valorant';
            const filename = `${appName}_${timestamp}.webm`;
            
            const result = await window.audioRecorderSDK.saveAudioFile(
                Array.from(uint8Array), 
                filename
            );
            
            if (result.success) {
                this.sessionCount++;
                this.updateUI();
                console.log(`✅ Recording saved: ${result.filePath}`);
                this.updateStatus(`💾 Recording saved: ${result.filePath}`, 'success');
            } else {
                console.error(`❌ Failed to save recording: ${result.error}`);
                this.updateStatus(`❌ Failed to save recording: ${result.error}`, 'error');
            }
            
        } catch (error) {
            console.error('❌ Error saving recording:', error);
            this.updateStatus(`❌ Error saving recording: ${error.message}`, 'error');
        }
    }
    
    addDetectedApp(app) {
        const appElement = document.createElement('div');
        appElement.className = 'app-item';
        appElement.id = `app-${app.processName}`;
        appElement.innerHTML = `
            <strong>${app.name}</strong>
            <div style="font-size: 0.9em; color: #6c757d;">
                Status: 🔴 Recording (Max 2 hours) | Simple logic active
            </div>
        `;
        
        if (this.appsList.children.length === 1 && 
            this.appsList.children[0].style.textAlign === 'center') {
            this.appsList.innerHTML = '';
        }
        
        this.appsList.appendChild(appElement);
    }
    
    removeDetectedApp(app) {
        const appElement = document.getElementById(`app-${app.processName}`);
        if (appElement) {
            appElement.remove();
        }
        
        if (this.appsList.children.length === 0) {
            this.clearDetectedApps();
        }
    }
    
    clearDetectedApps() {
        this.appsList.innerHTML = `
            <div style="text-align: center; color: #6c757d;">
                Waiting for Valorant to start...
            </div>
        `;
    }
    
    updateStatus(message, type = 'info') {
        this.status.textContent = message;
        this.status.className = `status ${type}`;
    }
    
    updateUI() {
        this.initBtn.disabled = this.isInitialized;
        this.startBtn.disabled = !this.isInitialized || this.isMonitoring;
        this.stopBtn.disabled = !this.isMonitoring;
        
        this.monitoringStatus.textContent = this.isMonitoring ? 'Active' : 'Stopped';
        this.recordingStatus.textContent = this.isRecording ? 'Recording' : 'Waiting';
        this.currentApp.textContent = this.currentSession ? this.currentSession.name : 'None';
        this.sessionsCount.textContent = this.sessionCount.toString();
    }
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', () => {
    const app = new AudioRecorderApp();
    window.audioApp = app;
});