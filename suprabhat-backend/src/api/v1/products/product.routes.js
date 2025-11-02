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

// Add a new route specifically for admins to get all products
router.get(
  '/admin/all', // Correct route for admin to list all products
  authMiddleware,
  adminMiddleware,
  productController.listAllProductsForAdmin
);

// Add a new route specifically for admins to delete products (soft delete)
router.delete( // New DELETE route
  '/admin/:productId', // Route: DELETE /api/v1/products/admin/:productId
  authMiddleware,
  adminMiddleware,
  validate(productValidation.productIdSchema), // Use existing productIdSchema for params validation
  productController.deleteProductById
);

export default router;