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

const registerUser = async (req: Request, res: Response) => {
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

const loginUser = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({ email: email })
    if(!user){
      return res.status(404).json({
        success: false,
        message: "No user found"
      })
    }
    
    const checkPassword = await bcrypt.compare(password, user.password)
    if(!checkPassword){
      return res.status(401).json({
        
      })
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRE as string, 
      algorithm: 'HS256'
    } as SignOptions);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successfull",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    })
  } catch (error) {
    console.error("Internal server Error while logining an user :",error)
    return res.status(500).json({
      success: false,
      message: "Server error while Loging an User"
    })
  }
}

const getCurrentUser = async (req: Request, res: Response) => {
  const user = (req as any).user

  const currentUser = await User.findById(user.id);
  if(!currentUser){
    return res.status(404).json({
      succcess: false, 
      message: "No user found"
    })
  }

  return res.status(200).json({
    sucess: true,
    message: "User fetched successfully",
    user: currentUser
  })
}

export default {
  registerUser,
  loginUser,
  getCurrentUser
}
