import { Request, Response, NextFunction } from 'express';

export const verifyServiceKey = (req: Request, res: Response, next: NextFunction) => {
  const serviceKey = req.headers['x-service-key'];

  if (!serviceKey || serviceKey !== process.env.SERVICE_SECRET) {
    return res
      .status(403)
      .json({ success: false, message: 'Unauthorized access' });
  }

  next();
};
