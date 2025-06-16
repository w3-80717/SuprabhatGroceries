import { Router } from 'express';
import { productController } from './product.controller.js';
import validate from '../../../middlewares/validate.middleware.js';
import { productValidation } from './product.validation.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';
import { adminMiddleware } from '../../../middlewares/admin.middleware.js';

const router = Router();

// --- Public Routes ---
router.get('/', validate(productValidation.getProductsSchema), productController.listProducts);
router.get('/:productId', validate(productValidation.productIdSchema), productController.getProductDetails);

// --- Admin Routes ---
// Note: We've combined the admin routes here. You could also create a separate /api/v1/admin/products router.
router.post(
  '/admin', // Route: POST /api/v1/products/admin
  authMiddleware,
  adminMiddleware,
  validate(productValidation.createProductSchema),
  productController.createProductByAdmin
);

router.put(
  '/admin/:productId', // Route: PUT /api/v1/products/admin/:productId
  authMiddleware,
  adminMiddleware,
  validate(productValidation.updateProductSchema),
  productController.updateProductByAdmin
);

export default router;