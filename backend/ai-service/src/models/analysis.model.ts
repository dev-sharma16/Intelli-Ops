import mongoose from 'mongoose';
import { IAnalysis } from '../types/analysis.type';

const analysisSchema = new mongoose.Schema<IAnalysis>(
  {
    projectId: { type: String, required: true },
    userId: { type: String, required: true },
    message: { type: String, required: true },
    level: { type: String, required: true },
    source: { type: String, required: true },
    timestamp: { type: Date, required: true },
    aiSummary: { type: String },
    aiSuggestion: { type: String },
    severityScore: { type: Number },
  },
  { timestamps: true }
);

export const Analysis = mongoose.model<IAnalysis>('Analysis', analysisSchema);
