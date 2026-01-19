import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      // Optional: redirect to login if not already there, but ProtectedRoute handles access control.
      // Doing a hard redirect might be jarring, but ensures clean slate.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/users', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (formData) =>
    api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteAvatar: () => api.delete('/users/avatar'),
  getDashboardStats: () => api.get('/users/dashboard/stats'),
  addToFavorites: (type, itemId) => api.post('/users/favorites', { type, itemId }),
  removeFromFavorites: (type, itemId) => api.delete('/users/favorites', { data: { type, itemId } }),
  getUserLikes: () => api.get('/like/user'),
  forgotPassword: (email) => api.post('/users/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/users/reset-password', { token, password }),
};

export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  getFavorites: () => api.get('/users/favorites'),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const uploadAPI = {
  image: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteImage: (publicId) => api.delete('/upload', { data: { publicId } }),
};

export const likeAPI = {
  toggleLike: (type, id) => api.post(`/like/${type}/${id}`),
  checkIfLiked: (type, id) => api.get(`/like/check/${type}/${id}`),
  getUserLikes: () => api.get('/like/user'),
};

export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  create: (data) =>
    api.post('/restaurants', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, data) =>
    api.put(`/restaurants/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/restaurants/${id}`),
  getMyRestaurants: () => api.get('/restaurants/my-restaurants'),
};

export const dishAPI = {
  getAll: (params) => api.get('/dishes', { params }),
  getById: (id) => api.get(`/dishes/${id}`),
  create: (data) =>
    api.post('/dishes', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, data) =>
    api.put(`/dishes/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/dishes/${id}`),
  like: (id) => api.post(`/dishes/${id}/like`),
};

export const recipeBookAPI = {
  getAll: (params) => api.get('/recipe-books', { params }),
  getById: (id) => api.get(`/recipe-books/${id}`),
  create: (data) =>
    api.post('/recipe-books', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, data) =>
    api.put(`/recipe-books/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/recipe-books/${id}`),
  like: (id) => api.post(`/recipe-books/${id}/like`),
  getMyRecipeBooks: () => api.get('/recipe-books/my-recipe-books'),
};

export const recipeAPI = {
  getAll: (params) => api.get('/recipes', { params }),
  getById: (id) => api.get(`/recipes/${id}`),
  create: (data) =>
    api.post('/recipes', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, data) =>
    api.put(`/recipes/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/recipes/${id}`),
  like: (id) => api.post(`/recipes/${id}/like`),
  save: (id) => api.post(`/recipes/${id}/save`),
  getMyRecipes: () => api.get('/recipes/my-recipes'),
};

export const postAPI = {
  getAll: (params) => api.get('/posts', { params }),
  getTrending: () => api.get('/posts/trending'),
  getMyPosts: () => api.get('/posts/my-posts'),
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) =>
    api.post('/posts', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, data) =>
    api.put(`/posts/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/posts/${id}`),
  like: (id) => api.post(`/posts/${id}/like`),
  addComment: (id, content) => api.post(`/posts/${id}/comments`, { content }),
  deleteComment: (id, commentId) => api.delete(`/posts/${id}/comments/${commentId}`),
};

export const cardAPI = {
  getAll: (params) => api.get('/cards', { params }),
  getMyCards: () => api.get('/cards/my-cards'),
  getById: (id) => api.get(`/cards/${id}`),
  create: (data) => api.post('/cards', data),
  update: (id, data) => api.put(`/cards/${id}`, data),
  delete: (id) => api.delete(`/cards/${id}`),
  like: (id) => api.patch(`/cards/${id}`), // Route is PATCH /cards/:id for like
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getPendingRestaurants: () => api.get('/admin/restaurants/pending'),
  approveRestaurant: (id) => api.post(`/admin/restaurants/${id}/approve`),
  rejectRestaurant: (id) => api.post(`/admin/restaurants/${id}/reject`),
  getModerationQueue: () => api.get('/admin/moderation'),
  resolveReport: (id, action) => api.post(`/admin/moderation/${id}/${action}`),
};

export default api;
