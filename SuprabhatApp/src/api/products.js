// src/api/products.js
import axios from 'axios';

const API_URL = 'http://192.168.1.124:8000/api/v1'; // IMPORTANT: Change to your backend server's actual IP/domain

const apiClient = axios.create({
  baseURL: API_URL,
});

/**
 * Fetches a list of products from the backend.
 * @returns {Promise<Object>} The response from the API containing products.
 */
export const fetchProducts = async () => {
  const response = await apiClient.get('/products');
  return response.data.data;
};