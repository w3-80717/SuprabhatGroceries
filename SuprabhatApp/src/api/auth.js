// src/api/auth.js
import axios from 'axios';

// The base URL for our API calls.
// In React Native, this needs to be a full URL, not a relative path like for Vite proxy.
const API_URL = 'http://192.168.1.124:8000/api/v1/auth'; // IMPORTANT: Change to your backend server's actual IP/domain

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