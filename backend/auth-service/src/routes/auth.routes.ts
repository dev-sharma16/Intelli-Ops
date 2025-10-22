import { Router } from 'express';
import authControllers from './../controllers/user.controller';
import validators from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

router.post(
  '/register',
  validators.registerValidationRules,
  authControllers.registerUser
);

router.post(
  '/login',
  validators.loginValidationRules,
  authControllers.loginUser
);

router.get('/', authMiddleware, authControllers.getCurrentUser);

router.post(
  '/logout',
  authMiddleware,
  authControllers.logoutUser
)

router.post('/verfiyApiKey', authControllers.verifyApiKey);

export default router;