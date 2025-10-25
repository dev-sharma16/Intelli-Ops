import { Router } from 'express';
import authControllers from './../controllers/user.controller';
import validators from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

//* Auth Routes
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

//* Project Routes
router.post(
  '/poject',
  authMiddleware,
  authControllers.createProject
)

router.get(
  '/project',
  authMiddleware,
  authControllers.getAllProjects
)

router.get(
  '/project/:projectId',
  authMiddleware,
  authControllers.getProjectById
)

router.delete(
  '/project/:projectId',
  authMiddleware,
  authControllers.deleteProject
)

export default router;