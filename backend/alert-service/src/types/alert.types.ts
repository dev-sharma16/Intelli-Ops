import { Document } from 'mongoose';

export interface IAlert extends Document {
  projectId: string;
  userId: string;
  message: string;
  level: 'info' | 'warn' | 'error' | 'critical';
  source: String;
  emailSent: boolean;
}
