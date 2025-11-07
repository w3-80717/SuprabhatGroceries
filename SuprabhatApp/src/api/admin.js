// src/api/admin.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
  baseURL: 'http://192.168.1.124:8000/api/v1', // IMPORTANT: Change to your backend server's actual IP/domain
});

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

export const togglePublishStatus = async ({ productId, isPublished }) => {
    const response = await apiClient.put(`/products/admin/${productId}`, { isPublished });
    return response.data.data;
}

export const fetchAllProductsAdmin = async () => {
  const response = await apiClient.get('/products/admin/all');
  return response.data.data;
};

export const fetchAllOrdersAdmin = async () => {
  const response = await apiClient.get('/orders/admin');
  return response.data.data;
};

export const updateOrderStatus = async ({ orderId, status }) => {
  const response = await apiClient.put(`/orders/admin/${orderId}/status`, { status });
  return response.data.data;
};