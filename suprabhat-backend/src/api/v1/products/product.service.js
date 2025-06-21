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
   filter.isDeleted = false;
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

const getAllProductsAdmin = async () => {
  // const products = await Product.find({}).sort({ createdAt: -1 });
  // return { results: products, totalResults: products.length };

  // .findWithDeleted() is not a real Mongoose method.
  // We use .find() and then explicitly tell it to ignore the default scope.
  const products = await Product.find({}).sort({ createdAt: -1 }).setOptions({ withDeleted: true });
  // A better way is to create a static method on the model, but this is simpler for now.
  // A more robust way is to pass an option to ignore the `pre` hook, but Mongoose
  // doesn't have a built-in, easy way. The best practice is often to have a separate
  // query for admin that doesn't use the model's default find. Let's adjust this.
  
  // The SIMPLEST way is to just query directly, bypassing the hook logic for this one case.
  const allProducts = await mongoose.model('Product').find({}).sort({ createdAt: -1 });
  
  return { results: allProducts, totalResults: allProducts.length };
};

// --- NEW SERVICE FUNCTION ---
const deleteProductById = async (productId) => {
  // This is a "soft delete". We just mark the product as deleted.
  const product = await Product.findByIdAndUpdate(
    productId,
    { isDeleted: true, isPublished: false }, // Also unpublish when deleting
    { new: true }
  );
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
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