import { Router } from 'express';
import { userController } from './user.controller.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';

const router = Router();

// This route is protected
router.get('/me', authMiddleware, userController.getMyProfile);

export default router;