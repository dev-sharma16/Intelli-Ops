import { Request, Response } from 'express';
import { processLog } from '../services/ai.service';

export const analyzeLog = async (req: Request, res: Response) => {
  try {
    const result = await processLog(req.body);
    res.status(200).json({ success: true, result });
  } catch (error: any) {
    console.error('AI analysis failed:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
