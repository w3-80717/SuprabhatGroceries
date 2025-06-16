// File: src/api/v1/index.js

import { Router } from 'express';
import authRoutes from './auth/auth.routes.js';
import userRoutes from './users/user.routes.js';
import productRoutes from './products/product.routes.js';
import orderRoutes from './orders/order.routes.js'; // <-- ADD THIS LINE

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes); // <-- ADD THIS LINE

export default router;