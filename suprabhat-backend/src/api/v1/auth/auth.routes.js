import { Router } from 'express';
import { authController } from './auth.controller.js';
import validate from '../../../middlewares/validate.middleware.js';
import { authValidation } from './auth.validation.js';

const router = Router();

router.post('/register', validate(authValidation.registerSchema), authController.register);
router.post('/login', validate(authValidation.loginSchema), authController.login);

export default router;