import { Router } from 'express'
import { registerUser } from './../controllers/user.controller';
import { registerValidationRules, validateRequest } from "../middlewares/validation.middleware";

const router = Router();

router.post(
    '/register',
    registerValidationRules,
    validateRequest,
    registerUser
)

export default router;