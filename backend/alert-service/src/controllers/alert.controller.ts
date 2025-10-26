import { Request, Response } from 'express';
import { Alert } from '../models/alert.model';
import { sendAlertEmail } from '../utils/mailer';
import axios from 'axios';

const createAlert = async (req: Request, res: Response) => {
  try {
    const { projectId, userId, message, level, source, timestamp } = req.body;

    const alert = await Alert.create({
      projectId,
      userId,
      message,
      level,
      source,
      timestamp,
    });
    
    const userRes = await axios.get(`${process.env.AUTH_SERVICE_URL}/${userId}`); 
    const userEmail = userRes.data.user.email;

    if (['error', 'critical'].includes(level)) {
      await sendAlertEmail(
        userEmail,
        `🚨 [${level.toUpperCase()}] Alert from Project ${projectId}`,
        `Message: ${message}\nSource: ${source}\nTime: ${new Date(timestamp).toLocaleString()}`
      );

      alert.emailSent = true;
      await alert.save();
    }

    return res.status(201).json({ 
      success: true,
      message: "Alert send successfully",
      alert 
    });
  } catch (err: any) {
    console.error('Error creating alert:', err.message);
    return res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

export default { createAlert };