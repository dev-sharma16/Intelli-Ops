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
const LOG_SERVICE_URL = 'https://logservice.intelliops.com/logs';

export class IntelliOpsLogger {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('API key is required');
    this.apiKey = apiKey;
  }

  async sendLog(payload: LogPayload) {
    try {
      const logData = {
        ...payload,
        source: payload.source || 'unknown',
        environment: payload.environment || 'production',
        timestamp: new Date().toISOString(),
      };

      const response = await axios.post(LOG_SERVICE_URL, logData, {
        headers: { 'x-api-key': this.apiKey },
      });

      console.log('Log sent:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to send log:', error.message);
      throw error;
    }
  }
}
