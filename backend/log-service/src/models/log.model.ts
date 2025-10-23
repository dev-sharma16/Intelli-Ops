import mongoose from "mongoose";
import { ILog } from "../types/log.type"

const logSchema = new mongoose.Schema<ILog>(
  {
    userId: { type: String, required: true},
    projectId: { type: String, required: true},
    level: { 
      type: String,
      enum: ['info', 'warn', 'error', 'critical'], 
      required: true
    },
    message: { type: String, required: true},
    source: { type: String, required: true},
    meta: { type: Object, required: true},
    processed: { type: Boolean, default: false},
    analyzed: { type: Boolean, default: false},
  },
  { timestamps: true }
)

export const Log = mongoose.model<ILog>('Log', logSchema);