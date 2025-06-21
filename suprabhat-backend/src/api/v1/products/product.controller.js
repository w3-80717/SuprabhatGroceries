import httpStatus from 'http-status';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { ApiResponse } from '../../../utils/ApiResponse.js';
import { productService } from './product.service.js';

// PUBLIC CONTROLLERS

const listProducts = asyncHandler(async (req, res) => {
  const products = await productService.getProducts(req.query);
  res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, products, 'Products retrieved successfully')
  );
});

const getProductDetails = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, product, 'Product details retrieved successfully')
  );
});

// ADMIN CONTROLLERS

const createProductByAdmin = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).json(
    new ApiResponse(httpStatus.CREATED, product, 'Product created successfully')
  );
});

const updateProductByAdmin = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.productId, req.body);
  res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, product, 'Product updated successfully')
  );
});

// Add this new controller function
const listAllProductsForAdmin = asyncHandler(async (req, res) => {
  const products = await productService.getAllProductsAdmin(); // New service function
  res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, products, 'All products retrieved for admin')
  );
});

// Add a new controller function
const deleteProductById = asyncHandler(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

export const productController = {
  listProducts,
  getProductDetails,
  createProductByAdmin,
  updateProductByAdmin,
  listAllProductsForAdmin,
  deleteProductById,
};