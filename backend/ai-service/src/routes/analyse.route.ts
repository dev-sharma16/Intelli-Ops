import { Router } from 'express';
import { analyzeLog } from '../controllers/analyse.controller';
import { verifyServiceKey } from '../middlewares/authMiddleware';

const router = Router();

router.post('/analyse', verifyServiceKey, analyzeLog);

export default router;
