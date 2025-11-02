// File: src/api/v1/orders/order.routes.js

import { Router } from 'express';
import { orderController } from './order.controller.js';
import validate from '../../../middlewares/validate.middleware.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';
import { adminMiddleware } from '../../../middlewares/admin.middleware.js'; // Import adminMiddleware
import { orderValidation } from './order.validation.js';

const router = Router();

// --- User-specific Routes (protected by authMiddleware) ---
router.use(authMiddleware); // Apply authMiddleware to all routes below this point

router
  .route('/')
  .post(validate(orderValidation.createOrderSchema), orderController.createNewOrder)
  .get(orderController.getUserOrders);

  router.route('/admin')
  .get(adminMiddleware, orderController.listAllOrdersForAdmin); // New admin endpoint to list all orders
router
    .route('/:orderId')
    .get(validate(orderValidation.getOrderSchema), orderController.getOrderDetails);

// --- Admin-specific Routes (protected by authMiddleware AND adminMiddleware) ---
// Note: Since `router.use(authMiddleware)` is already active, we only need to add `adminMiddleware`.


router.route('/admin/:orderId/status')
  .put(adminMiddleware, validate(orderValidation.updateOrderStatusSchema), orderController.updateOrderStatusByAdmin); // New admin endpoint to update order status

export default router;