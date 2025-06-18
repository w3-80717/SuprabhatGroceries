import axios from 'axios';

// The base URL for our backend API.
// In a real app, this would come from an environment variable.
const API_URL = '/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
});

/**
 * Fetches a list of products from the backend.
 * @returns {Promise<Object>} The response from the API containing products.
 */
export const fetchProducts = async () => {
  // The actual data is in response.data.data
  const response = await apiClient.get('/products');
  return response.data.data; 
};