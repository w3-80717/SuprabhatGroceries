import axios from 'axios';
import { useAuthStore } from '../store/authStore.js';
const API_URL = 'http://192.168.1.10:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
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
   await apiClient.delete(`/products/admin/${productId}`);
  return productId;
};

// This function is for toggling the isPublished flag
export const togglePublishStatus = async ({ productId, isPublished }) => {
    const response = await apiClient.put(`/products/admin/${productId}`, { isPublished });
    return response.data.data;
}

export const fetchAllProductsAdmin = async () => {
  const response = await apiClient.get('/products/admin/all'); // Use the new dedicated route
  return response.data.data;
};

// --- NEW ADMIN ORDER API FUNCTIONS ---

/**
 * Fetches all orders for the admin panel.
 * @returns {Promise<Object>} An object containing results array and totalResults.
 */
export const fetchAllOrdersAdmin = async () => {
  const response = await apiClient.get('/orders/admin');
  return response.data.data;
};

/**
 * Updates the status of a specific order.
 * @param {string} orderId - The ID of the order to update.
 * @param {string} status - The new status (e.g., 'Confirmed', 'Delivered').
 * @returns {Promise<Object>} The updated order object.
 */
export const updateOrderStatus = async ({ orderId, status }) => {
  const response = await apiClient.put(`/orders/admin/${orderId}/status`, { status });
  return response.data.data;
};