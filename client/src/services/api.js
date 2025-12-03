/**
 * API Service
 *
 * Centralized service for making HTTP requests to the backend API using Axios.
 * Handles authentication tokens and provides methods for all API endpoints.
 */

import axios from 'axios';

// Base URL for API requests - using proxy configuration from package.json
const API_BASE_URL = '/api';

/**
 * Create axios instance with default configuration
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request interceptor to add authentication token to requests
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    // If token exists, add it to Authorization header
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
 * Response interceptor to handle errors
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

/**
 * Authentication API methods
 */
export const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} API response
   */
  register: (userData) => axiosInstance.post('/auth/register', userData),

  /**
   * Login user
   * @param {Object} credentials - Email and password
   * @returns {Promise} API response
   */
  login: (credentials) => axiosInstance.post('/auth/login', credentials),

  /**
   * Logout user
   * @returns {Promise} API response
   */
  logout: () => axiosInstance.post('/auth/logout')
};

/**
 * Todo API methods
 */
export const todoAPI = {
  /**
   * Get all todos with optional filters
   * @param {Object} params - Query parameters (status, priority, page, limit)
   * @returns {Promise} API response
   */
  getAll: (params = {}) => axiosInstance.get('/todos', { params }),

  /**
   * Get a specific todo by ID
   * @param {string} id - Todo ID
   * @returns {Promise} API response
   */
  getById: (id) => axiosInstance.get(`/todos/${id}`),

  /**
   * Create a new todo
   * @param {Object} todoData - Todo data
   * @returns {Promise} API response
   */
  create: (todoData) => axiosInstance.post('/todos', todoData),

  /**
   * Update a todo
   * @param {string} id - Todo ID
   * @param {Object} updates - Updated fields
   * @returns {Promise} API response
   */
  update: (id, updates) => axiosInstance.put(`/todos/${id}`, updates),

  /**
   * Delete a todo
   * @param {string} id - Todo ID
   * @returns {Promise} API response
   */
  delete: (id) => axiosInstance.delete(`/todos/${id}`)
};

/**
 * User API methods
 */
export const userAPI = {
  /**
   * Get user profile
   * @returns {Promise} API response
   */
  getProfile: () => axiosInstance.get('/users/profile'),

  /**
   * Update user profile
   * @param {Object} updates - Profile updates
   * @returns {Promise} API response
   */
  updateProfile: (updates) => axiosInstance.put('/users/profile', updates),

  /**
   * Delete user account
   * @param {string} password - User password for confirmation
   * @returns {Promise} API response
   */
  deleteAccount: (password) => axiosInstance.delete('/users/profile', { data: { password } })
};

export default axiosInstance;
