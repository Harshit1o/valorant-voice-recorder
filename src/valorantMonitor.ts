/**
 * Simple Application Monitor for Valorant
 * Monitors Valorant process and triggers recording
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ApplicationInfo {
  name: string;
  processName: string;
  pid?: number;
  isRunning: boolean;
  startTime?: Date;
}

export interface MonitoringOptions {
  pollingInterval?: number; // milliseconds
}

export class ApplicationMonitor {
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private detectedApps: Map<string, ApplicationInfo> = new Map();
  private callbacks: {
    onAppStart: ((app: ApplicationInfo) => void)[];
    onAppStop: ((app: ApplicationInfo) => void)[];
  } = { onAppStart: [], onAppStop: [] };

  // Simple target processes - Valorant ONLY
  private readonly TARGET_PROCESSES = [
    'VALORANT.exe',
    'VALORANT-Win64-Shipping.exe'
  ];

  private options: MonitoringOptions;

  constructor(options: MonitoringOptions = {}) {
    this.options = {
      pollingInterval: 2000, // Check every 2 seconds
      ...options
    };
  }

  /**
   * Start monitoring applications
   */
  public startMonitoring(): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    console.log('🔍 Monitoring started for Valorant');

    this.monitoringInterval = setInterval(async () => {
      await this.checkRunningApplications();
    }, this.options.pollingInterval);

    this.checkRunningApplications();
  }

  /**
   * Stop monitoring applications
   */
  public stopMonitoring(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    console.log('🛑 Monitoring stopped');
  }

  /**
   * Check for running target applications
   */
  private async checkRunningApplications(): Promise<void> {
    try {
      const runningProcesses = await this.getRunningProcesses();
      const currentlyRunningApps = new Set<string>();

      for (const processName of this.TARGET_PROCESSES) {
        const isRunning = runningProcesses.some(process => 
          this.matchProcess(process, processName)
        );

        const appKey = processName.toLowerCase();
        const existingApp = this.detectedApps.get(appKey);

        if (isRunning) {
          currentlyRunningApps.add(appKey);
          
          if (!existingApp || !existingApp.isRunning) {
            const appInfo: ApplicationInfo = {
              name: this.getDisplayName(processName),
              processName: processName,
              isRunning: true,
              startTime: new Date()
            };
            
            this.detectedApps.set(appKey, appInfo);
            console.log(`✅ ${appInfo.name} started`);
            
            this.notifyAppStart(appInfo);
          }
        }
      }

      // Check for stopped applications
      for (const [appKey, appInfo] of this.detectedApps) {
        if (appInfo.isRunning && !currentlyRunningApps.has(appKey)) {
          appInfo.isRunning = false;
          console.log(`❌ ${appInfo.name} stopped`);
          
          this.notifyAppStop(appInfo);
        }
      }

    } catch (error) {
      console.error('Error checking applications:', error);
    }
  }

  /**
   * Get running processes from system
   */
  private async getRunningProcesses(): Promise<string[]> {
    try {
      const command = 'tasklist /FO CSV /NH';
      const { stdout } = await execAsync(command);
      
      return stdout
        .split('\n')
        .map(line => {
          const match = line.match(/^"([^"]+)"/);
          return match ? match[1] : '';
        })
        .filter(name => name.length > 0);
    } catch (error) {
      console.error('Error getting running processes:', error);
      return [];
    }
  }

  /**
   * Match process name with target process
   */
  private matchProcess(processName: string, targetProcess: string): boolean {
    return processName.toLowerCase().includes(targetProcess.toLowerCase()) ||
           targetProcess.toLowerCase().includes(processName.toLowerCase());
  }

  /**
   * Get display name for process
   */
  private getDisplayName(processName: string): string {
    const displayNames: { [key: string]: string } = {
      'VALORANT.exe': 'Valorant',
      'VALORANT-Win64-Shipping.exe': 'Valorant'
    };

    return displayNames[processName] || processName.replace('.exe', '');
  }

  /**
   * Register callback for application start
   */
  public onAppStart(callback: (app: ApplicationInfo) => void): void {
    this.callbacks.onAppStart.push(callback);
  }

  /**
   * Register callback for application stop
   */
  public onAppStop(callback: (app: ApplicationInfo) => void): void {
    this.callbacks.onAppStop.push(callback);
  }

  /**
   * Get currently running applications
   */
  public getRunningApps(): ApplicationInfo[] {
    return Array.from(this.detectedApps.values()).filter(app => app.isRunning);
  }

  /**
   * Check if any target application is running
   */
  public isAnyAppRunning(): boolean {
    return this.getRunningApps().length > 0;
  }

  // Notification methods
  private notifyAppStart(app: ApplicationInfo): void {
    this.callbacks.onAppStart.forEach(callback => {
      try {
        callback(app);
      } catch (error) {
        console.error('Error in app start callback:', error);
      }
    });
  }

  private notifyAppStop(app: ApplicationInfo): void {
    this.callbacks.onAppStop.forEach(callback => {
      try {
        callback(app);
      } catch (error) {
        console.error('Error in app stop callback:', error);
      }
    });
  }
}

export default ApplicationMonitor;