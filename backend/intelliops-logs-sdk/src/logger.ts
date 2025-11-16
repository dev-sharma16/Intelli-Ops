import axios from 'axios';

interface LogPayload {
  projectId: string;
  level: 'info' | 'warn' | 'error' | 'critical';
  message: string;
  source?: string;
  meta?: Record<string, any>;
  environment?: 'production' | 'staging' | 'development';
}

//todo : add real backend link for receiving the logs.
const LOG_SERVICE_URL = 'http://localhost:3001/api/logs';

export class IntelliOpsLogger {
  private apiKey: string;
  private projectId: string;

  constructor(apiKey: string, projectId: string) {
    if (!apiKey) throw new Error('API key is required');
    if (!projectId) throw new Error("Project ID is required");
    this.apiKey = apiKey;
    this.projectId = projectId;
  }

  async sendLog(payload: LogPayload) {
    try {
      const logData = {
        ...payload,
        projectId: this.projectId,
        source: payload.source || 'unknown',
        timestamp: new Date().toISOString(),
      };

      const response = await axios.post(LOG_SERVICE_URL, logData, {
        headers: { 
          "x-api-key": this.apiKey,
          "Content-Type": "application/json", 
        },
      });

      console.log('Log sent:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to send log:', error.message);
      throw error;
    }
  }

  info(message: string, options: Partial<LogPayload> = {}) {
    const { projectId, ...rest } = options;
    return this.sendLog({ level: "info", message, projectId: this.projectId, ...rest });
  }

  warn(message: string, options: Partial<LogPayload> = {}) {
    const { projectId, ...rest } = options;
    return this.sendLog({ level: "warn", message, projectId: this.projectId, ...rest });
  }

  error(message: string, options: Partial<LogPayload> = {}) {
    const { projectId, ...rest } = options;
    return this.sendLog({ level: "error", message, projectId: this.projectId, ...rest });
  }

  critical(message: string, options: Partial<LogPayload> = {}) {
    const { projectId, ...rest } = options;
    return this.sendLog({ level: "critical", message, projectId: this.projectId, ...rest });
  }
}

export function createIntelliOpsClient() {
  const apiKey = process.env.INTELLIOPS_API_KEY;
  const projectId = process.env.INTELLIOPS_PROJECT_ID;

  if (!apiKey || !projectId) {
    throw new Error("Missing IntelliOps environment variables: INTELLIOPS_API_KEY or INTELLIOPS_PROJECT_ID");
  }

  return new IntelliOpsLogger(apiKey, projectId);
}
