import express from 'express';
import alertController  from './../controllers/alert.controller';
import { verifyServiceKey } from '../middlewares/authMiddleware' 

const router = express.Router();

router.post('/create', verifyServiceKey, alertController.createAlert);

export default router;
