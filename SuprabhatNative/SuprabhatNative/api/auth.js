import axios from 'axios';

// The base URL for our API calls is now just '/api/v1'.
const API_URL = 'http://192.168.1.10:8000/api/v1/auth';

const apiClient = axios.create({
  baseURL: API_URL,
});

/**
 * Registers a new user.
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} The user and token data.
 */
export const registerUser = async (userData) => {
  const response = await apiClient.post('/register', userData);
  // The backend ApiResponse nests the actual data in `response.data.data`
  return response.data.data;
};

/**
 * Logs in a user.
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} The user and token data.
 */
export const loginUser = async (credentials) => {
  const response = await apiClient.post('/login', credentials);
  return response.data.data;
};