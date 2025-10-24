import { Router } from 'express';
import { verifyApiKey } from '../middlewares/verifyApiKey.middleware';
import logController from '../controllers/log.controller';

const router = Router();

router.post(
    '/', 
    verifyApiKey, 
    logController.createLog
);

router.get(
    '/:projectId', 
    verifyApiKey, 
    logController.getLogs
);

router.delete(
    '/:projectId', 
    verifyApiKey, 
    logController.deleteLogs
);

router.get(
    '/summary/:projectId',
    verifyApiKey, 
    logController.getLogSummary
);

export default router;
