import axios from 'axios';
import { useAuthStore } from '@/store/authStore.js';

const apiClient = axios.create({
  baseURL: '/api/v1/users', // Base URL for user-related endpoints
});

// Add a request interceptor to include the auth token in every request
apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Fetches the profile of the currently logged-in user.
 */
export const fetchMyProfile = async () => {
  const response = await apiClient.get('/me');
  return response.data.data;
};    