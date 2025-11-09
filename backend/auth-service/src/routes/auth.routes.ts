import { Router } from 'express';
import authControllers from './../controllers/user.controller';
import validators from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import { verifyServiceKey } from "../middlewares/serviceAuth.middleware"

const router = Router();

//* Auth Routes
router.post('/register', validators.registerValidationRules, authControllers.registerUser);
router.post('/login', validators.loginValidationRules, authControllers.loginUser);
router.get('/', authMiddleware, authControllers.getCurrentUser);

//* Project Routes (specific first)
router.post('/project', authMiddleware, authControllers.createProject);
router.get('/project', authMiddleware, authControllers.getAllProjects);
router.get('/project/:projectId', authMiddleware, authControllers.getProjectById);
router.delete('/project/:projectId', authMiddleware, authControllers.deleteProject);

//* Other Routes (generic last)
router.get('/:userId', verifyServiceKey, authControllers.getUserById);
router.post('/logout', authMiddleware, authControllers.logoutUser);
router.post('/verifyApiKey', verifyServiceKey, authControllers.verifyApiKey);

export default router;