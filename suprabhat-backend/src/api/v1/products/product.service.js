import httpStatus from 'http-status';
import Product from './product.model.js';
import { ApiError } from '../../../utils/ApiError.js';

/**
 * Get a list of products with filtering, sorting, and pagination
 * @param {Object} options
 * @returns {Promise<Object>}
 */
const getProducts = async (options) => {
  const { filter, sortOptions, paginationOptions } = buildQueryOptions(options);

  const products = await Product.find(filter)
    .sort(sortOptions)
    .skip(paginationOptions.skip)
    .limit(paginationOptions.limit)
    .lean(); // .lean() for faster queries, returns plain JS objects

  const totalProducts = await Product.countDocuments(filter);

  return {
    results: products,
    page: paginationOptions.page,
    limit: paginationOptions.limit,
    totalPages: Math.ceil(totalProducts / paginationOptions.limit),
    totalResults: totalProducts,
  };
};

/**
 * Get a single product by its ID
 * @param {mongoose.Types.ObjectId} productId
 * @returns {Promise<Product>}
 */
const getProductById = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return product;
};

/**
 * Create a new product (Admin only)
 * @param {Object} productData
 * @returns {Promise<Product>}
 */
const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

/**
 * Update a product by its ID (Admin only)
 * @param {mongoose.Types.ObjectId} productId
 * @param {Object} updateData
 * @returns {Promise<Product>}
 */
const updateProduct = async (productId, updateData) => {
  const product = await getProductById(productId); // Ensures product exists
  Object.assign(product, updateData);
  await product.save();
  return product;
};


// Helper function to construct query options from request queries
const buildQueryOptions = (options) => {
  const {
    category,
    sortBy,
    priceMin,
    priceMax,
    page,
    limit,
    searchQuery,
    inStock,
  } = options;

  const filter = {};
  // For public view, only show published products that are in stock
  filter.isPublished = true;
  if(inStock === undefined || inStock === 'true') {
      filter.stock = { $gt: 0 };
  }

  if (category) filter.category = category;
  if (priceMin || priceMax) {
    filter.price = {};
    if (priceMin) filter.price.$gte = priceMin;
    if (priceMax) filter.price.$lte = priceMax;
  }
  if (searchQuery) {
    filter.$text = { $search: searchQuery };
  }

  const sortOptions = {};
  if (sortBy) {
    const [key, order] = sortBy.split(':');
    sortOptions[key] = order === 'desc' ? -1 : 1;
  } else {
    sortOptions.createdAt = -1; // Default sort
  }

  const paginationOptions = {
    limit,
    page,
    skip: (page - 1) * limit,
  };

  return { filter, sortOptions, paginationOptions };
};


export const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
};