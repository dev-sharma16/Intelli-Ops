import { Request, Response, CookieOptions } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {name, email, password} = req.body;

    const existingUser = await User.findOne({ email });
    if(existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const apiKey = crypto.randomBytes(16).toString("hex")

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      apiKey,
      projectNo: 0,
      projects: [],
    })

    const payload = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRE as string, 
      algorithm: 'HS256'
    } as SignOptions);

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        apiKey: newUser.apiKey
      }
    });
  } catch (error) {
    console.error("Internal server Error while registering an user :",error);
    return res.status(500).json({
      success: false,
      message: "Server error while Registering an User"
    })
  }
};
