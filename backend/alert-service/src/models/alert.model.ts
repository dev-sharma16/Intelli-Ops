import mongoose from 'mongoose';
import { IAlert } from "../types/alert.types"

const alertSchema = new mongoose.Schema<IAlert>(
  {
    projectId: { type: String, required: true },
    userId: { type: String, required: true },
    message: { type: String, required: true },
    level: {
      type: String,
      enum: ['info', 'warn', 'error', 'critical'],
      required: true,
    },
    source: { type: String },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Alert = mongoose.model('Alert', alertSchema);
