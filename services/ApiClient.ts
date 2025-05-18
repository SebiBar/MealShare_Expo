import { LoginRequest, RegisterRequest } from '@/models/Auth';
import { Recipe } from '@/models/Recipe';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://3.69.25.184:8080/api', // Changed from https to http
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, etc.
// This intercepts outgoing requests and adds the token from AsyncStorage as a Bearer token.
api.interceptors.request.use(
  async (config) => {
    // Add auth token to headers if available
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, etc.)
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Authentication failed. Please log in again.');
    } else if (error.response?.status === 403) {
      console.error('You do not have permission to access this resource.');
    } else if (error.message === 'Network Error') {
      console.error('Network error. This could be a CORS issue or the server is not running.');
    } else if (!error.response) {
      console.error('Could not connect to the server. Please check if the server is running and accessible.');
    }
    return Promise.reject(error);
  }
);

// API methods organized by resource/feature
export const ApiClient = {
  // Auth
  login: (loginRequest: LoginRequest) =>
    api.post('/auth/login', loginRequest),
  register: (registerRequest: RegisterRequest) =>
    api.post('/auth/register', registerRequest),

  // Recipes
  getUserRecipes: (userId: number) =>
    api.get(`/users/${userId}/recipes`),
  createRecipe: (recipe: Recipe) =>
    api.post('/recipes', recipe),
  updateRecipe: (recipeId: number, recipe: Recipe) =>
    api.put(`/recipes/${recipeId}`, recipe),
  deleteRecipe: (recipeId: number) =>
    api.delete(`/recipes/${recipeId}`),
  getRecipeById: (recipeId: number) =>
    api.get(`/recipes/${recipeId}`),

  // Search
  search: (query: string) =>
    api.get(`/search?query=${query}`),
};

export default ApiClient;