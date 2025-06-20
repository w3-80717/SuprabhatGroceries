import axios from 'axios';
import { useAuthStore } from '@/store/authStore.js';

const apiClient = axios.create({
  baseURL: '/api/v1/orders',
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