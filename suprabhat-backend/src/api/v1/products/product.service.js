import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Product from './product.model.js';
import { ApiError } from '../../../utils/ApiError.js';

/**
 * Get a list of products with filtering, sorting, and pagination
 * @param {Object} options
 * @returns {Promise<Object>}
 */
const getProducts = async (options) => {
  // const { filter, sortOptions, paginationOptions } = buildQueryOptions(options);
  const { filter, sortOptions, paginationOptions } = buildPublicQueryOptions(options);
  const products = await Product.find(filter).sort(sortOptions).skip(paginationOptions.skip).limit(paginationOptions.limit).lean();
  const totalProducts = await Product.countDocuments(filter);
  return { results: products, page: paginationOptions.page, limit: paginationOptions.limit, totalPages: Math.ceil(totalProducts / paginationOptions.limit), totalResults: totalProducts };
};

/**
 * Get a single product by its ID
 * @param {mongoose.Types.ObjectId} productId
 * @returns {Promise<Product>}
 */
const getProductById = async (productId) => {
  const product = await Product.findOne({ _id: productId, isPublished: true, isDeleted: false });
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  return product;
};



/**
 * Create a new product (Admin only)
 * @param {Object} productData
 * @returns {Promise<Product>}
 */

const createProduct = async (productData) => {
  return await Product.create(productData);
};

/**
 * Update a product by its ID (Admin only)
 * @param {mongoose.Types.ObjectId} productId
 * @param {Object} updateData
 * @returns {Promise<Product>}
 */
const updateProduct = async (productId, updateData) => {
  const product = await Product.findByIdAndUpdate(productId, updateData, { new: true });
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  return product;
};


// Helper function to construct query options from request queries
const buildPublicQueryOptions = (options) => {
  const { category, sortBy, priceMin, priceMax, page, limit, searchQuery } = options;

  // This filter is for the public view and is VERY STRICT.
  const filter = {
    isPublished: true,
    isDeleted: false,
    stock: { $gt: 0 },
  };

  if (category) filter.category = category;
  if (priceMin || priceMax) {
    filter.price = {};
    if (priceMin) filter.price.$gte = priceMin;
    if (priceMax) filter.price.$lte = priceMax;
  }
  if (searchQuery) filter.$text = { $search: searchQuery };

  const sortOptions = sortBy ? { [sortBy.split(':')[0]]: sortBy.split(':')[1] === 'desc' ? -1 : 1 } : { createdAt: -1 };
  const paginationOptions = { limit: parseInt(limit, 10) || 10, page: parseInt(page, 10) || 1 };
  paginationOptions.skip = (paginationOptions.page - 1) * paginationOptions.limit;

  return { filter, sortOptions, paginationOptions };
};


const getAllProductsAdmin = async () => {
  // Admin sees EVERYTHING, including deleted items.
  const allProducts = await mongoose.model('Product').find({}).sort({ createdAt: -1 });
  return { results: allProducts, totalResults: allProducts.length };
};

// --- NEW SERVICE FUNCTION ---
const deleteProductById = async (productId) => {
  const product = await Product.findByIdAndUpdate(productId, { isDeleted: true, isPublished: false }, { new: true });
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  return product;
};

export const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  getAllProductsAdmin,
  deleteProductById,
};