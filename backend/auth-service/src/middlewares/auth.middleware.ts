import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { IDecodedToken } from "../types/user.type"

export default async function authMiddleware( req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unautherized, No token found"
      });
    }
  
    const secret = process.env.JWT_SECRET
    if(!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables")
    }
  
    const decoded = jwt.verify(token, secret) as IDecodedToken
  
    const user = await User.findById(decoded.id );
    if(!user) {
      return res.status(401).json({
        success: false,
        message: "No user found"
      })
    }
  
    (req as any).user = user;
  
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
