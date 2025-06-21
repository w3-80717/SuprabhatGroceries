import axios from 'axios';
import { useAuthStore } from '@/store/authStore.js';

// Admin endpoints are prefixed with /api/v1/products/admin
const apiClient = axios.create({
  baseURL: '/api/v1', 
});

// Use an interceptor to add the auth token to every admin request
apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Fetches all products (including unpublished/out of stock) for the admin view.
 * This is different from the public fetchProducts which only gets available items.
 */
// export const fetchAllProductsAdmin = async () => {
//   // Use the public products endpoint but with query params to show all
//   const response = await apiClient.get('/products?inStock=false&isPublished=all&limit=1000');
//   return response.data.data;
// };

/**
 * Creates a new product.
 * @param {Object} productData - The data for the new product.
 */
export const createProduct = async (productData) => {
  const response = await apiClient.post('/products/admin', productData);
  return response.data.data;
};

/**
 * Updates an existing product.
 * @param {string} productId - The ID of the product to update.
 * @param {Object} updateData - The data to update.
 */
export const updateProduct = async ({ productId, updateData }) => {
  const response = await apiClient.put(`/products/admin/${productId}`, updateData);
  return response.data.data;
};

/**
 * Deletes a product.
 * @param {string} productId - The ID of the product to delete.
 */
export const deleteProduct = async (productId) => {
  // We need to build this endpoint on the backend.
  // For now, we "soft delete" by un-publishing.
  const response = await apiClient.put(`/products/admin/${productId}`, { isPublished: false });
  return response.data.data;
};

export const fetchAllProductsAdmin = async () => {
  const response = await apiClient.get('/products/admin/all'); // Use the new dedicated route
  return response.data.data;
};