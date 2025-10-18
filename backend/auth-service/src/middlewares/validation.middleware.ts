import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from 'express';

const validateRequest = ( req: Request, res: Response, next: NextFunction ) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

const registerValidationRules = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  validateRequest
];

const loginValidationRules = [
  body('email')
    .notEmpty()
    .withMessage("Email id required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  validateRequest
];

export default {
  registerValidationRules,
  loginValidationRules
}
