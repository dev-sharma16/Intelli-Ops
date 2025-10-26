import { Request, Response, CookieOptions } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from "uuid";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

//* Auth Api Controllers
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

    res.setHeader("Authorization", `Bearer ${token}`);

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
        success: false,
        message: "Invalid email or password"
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

    res.setHeader("Authorization", `Bearer ${token}`);

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
  try {
    const user = (req as any).user
  
    const currentUser = await User.findById(user.id).select("-password");
    if(!currentUser){
      return res.status(404).json({
        success: false, 
        message: "No user found"
      })
    }
  
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: currentUser
    })
  } catch (error) {
    console.error("Internal server Error while fetching an user :",error)
    return res.status(500).json({
      success: false,
      message: "Server error while Fetching an User"
    })
  }
}

const getUserById = async (req: Request, res: Response ) => {
  try {
    const { userId } = req.body

    const user = await User.findById(userId).select("-password");
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: user
    })
  } catch (error) {
    console.error("Internal server Error while fetching an user :",error)
    return res.status(500).json({
      success: false,
      message: "Server error while Fetching an User"
    })
  }
}

const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error in logout controller:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while logging out",
    });
  }
}

const verifyApiKey = async (req: Request, res: Response) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey) return res.status(400).json({ 
      success: false, 
      message: 'API key is required' 
    });

    const user = await User.findOne({ apiKey }).select("-password");
    if (!user) return res.status(401).json({ 
      success: false, 
      valid: false, 
      message: 'Invalid API key' 
    });

    return res.json({ 
      success: true, 
      valid: true, 
      id: user._id, 
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error in logout controller:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while verfiying the ApiKey" 
    });
  }
}

//todo : move the entire project related work in the project service
//* Projects Api Controllers
const createProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; 
    const { name } = req.body;

    if (!name) return res.status(400).json({ 
      success: false,
      message: "Project name is required" 
    });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ 
      success: false, 
      message: "User not found" 
    });

    if (user.projects.length >= 2) {
      return res.status(400).json({ 
        success: false, 
        message: "You can only create up to 2 projects" 
      });
    }

    const newProject = {
      projectId: uuidv4(),
      name,
      createdAt: new Date(),
    };

    user.projects.push(newProject);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", error 
    });
  }
};

const getAllProjects = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ 
      success: false, 
      message: "User not found" 
    });

    res.status(200).json({ 
      success: true, 
      projects: user.projects 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error 
    });
  }
};

const getProjectById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { projectId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ 
      success: false, 
      message: "User not found" 
    });

    const project = user.projects.find((p) => p.projectId === projectId);
    if (!project) return res.status(404).json({ 
      success: false, 
      message: "Project not found" 
    });

    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error 
    });
  }
};

const deleteProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { projectId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ 
      success: false, 
      message: "User not found" 
    });

    const projectIndex = user.projects.findIndex((p) => p.projectId === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: "Project not found" 
      });
    }

    user.projects.splice(projectIndex, 1);
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Project deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error 
    });
  }
};

export default {
  registerUser,
  loginUser,
  getCurrentUser,
  getUserById,
  logoutUser,
  verifyApiKey,
  createProject,
  getAllProjects,
  getProjectById,
  deleteProject,
}
