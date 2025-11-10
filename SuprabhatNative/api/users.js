import axios from 'axios';
import { useAuthStore } from '../store/authStore.js';

const API_URL = 'http://192.168.1.124:8000/api/v1/users';

const apiClient = axios.create({
  baseURL: API_URL,
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