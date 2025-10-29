import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export const verifyApiKey = async ( req: Request, res: Response, next: NextFunction ) => {
  const apiKey = req.headers['x-api-key'] as string;
  if (!apiKey)
    return res
      .status(401)
      .json({ success: false, message: 'API key is required' });

  try {
    const response = await axios.post(
      // `${process.env.AUTH_SERVICE_URL}/verifyApiKey`
      "http://localhost:3000/api/auth/verifyApiKey",
      {},
      {
        headers: {
          'x-api-key': apiKey,
          'x-service-key': process.env.SERVICE_SECRET || ''
        }
      }
    );

    if (!response.data.valid) {
      return res .status(403).json({ 
        success: false,
        message: 'Invalid API key' 
      });
    }

    (req as any).user = {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
    };

    next();
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Auth verification failed',
      error: err.message,
    });
  }
};
