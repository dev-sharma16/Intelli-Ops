import { Document } from "mongoose"; 

export interface IAnalysis extends Document {
  projectId: string;
  userId: string;
  message: string;
  level: string;
  source: string;
  timestamp: Date;
  aiSummary?: string;
  aiSuggestion?: string;
  severityScore?: number;
}
