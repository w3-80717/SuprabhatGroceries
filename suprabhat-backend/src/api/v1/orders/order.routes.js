// File: src/api/v1/orders/order.routes.js

import { Router } from 'express';
import { orderController } from './order.controller.js';
import validate from '../../../middlewares/validate.middleware.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';
import { orderValidation } from './order.validation.js';

const router = Router();

// All order routes are protected
router.use(authMiddleware);

router
  .route('/')
  .post(validate(orderValidation.createOrderSchema), orderController.createNewOrder)
  .get(orderController.getUserOrders);

router
    .route('/:orderId')
    .get(validate(orderValidation.getOrderSchema), orderController.getOrderDetails);

export default router;