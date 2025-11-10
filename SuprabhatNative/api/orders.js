import axios from 'axios';
import { useAuthStore } from '../store/authStore.js';
const API_URL = 'http://192.168.1.124:8000/api/v1/orders';

const apiClient = axios.create({
  baseURL: API_URL,
});


// Use the same interceptor pattern to add the token
apiClient.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetches all orders for the currently logged-in user.
 */
export const fetchMyOrders = async () => {
  const response = await apiClient.get('/');
  return response.data.data;
};

/**
 * Creates a new order.
 * @param {Object} orderData - The order details including items and delivery address.
 * @returns {Promise<Object>} The created order object.
 */
export const createOrder = async (orderData) => {
  const response = await apiClient.post('/', orderData);
  return response.data.data;
};