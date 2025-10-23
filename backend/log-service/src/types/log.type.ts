import { Document } from "mongoose"

export interface ILog extends Document {
  userId: string,
  projectId: string,
  level: 'info' | 'warn' | 'error' | 'critical';
  message: string,
  source: string,
  meta: object,
  timestamp: Date,
  createdAt: Date,
  processed: boolean,
  analyzed: boolean,
}
