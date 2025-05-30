// src/api/v1/routes/auth.routes.ts
import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validation.middleware';
import { registerUserSchema, loginUserSchema } from '../validators/auth.validator';

const router = Router();

router.post(
  '/register',
  validateRequest(registerUserSchema), // Validate before controller
  authController.register
);

router.post(
  '/login',
  validateRequest(loginUserSchema), // Validate before controller
  authController.login
);

// router.get('/me', /* authMiddleware, */ authController.getMe); // Add authMiddleware later

export { router as authRouter };