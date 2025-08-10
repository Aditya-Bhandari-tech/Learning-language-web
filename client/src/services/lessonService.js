import axios from 'axios';
import authService from './authService';

// Create axios instance with auth headers
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class LessonService {
  // Get all lessons with optional filters
  async getLessons(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.language) params.append('language', filters.language);
      if (filters.level) params.append('level', filters.level);
      if (filters.category) params.append('category', filters.category);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const response = await api.get(`/lessons?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get lessons error:', error);
      throw error;
    }
  }

  // Get lesson by ID
  async getLessonById(id) {
    try {
      const response = await api.get(`/lessons/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get lesson by ID error:', error);
      throw error;
    }
  }

  // Search lessons
  async searchLessons(query) {
    try {
      const response = await api.get(`/lessons/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Search lessons error:', error);
      throw error;
    }
  }

  // Start a lesson
  async startLesson(lessonId) {
    try {
      const response = await api.post(`/lessons/${lessonId}/start`);
      return response.data;
    } catch (error) {
      console.error('Start lesson error:', error);
      throw error;
    }
  }

  // Complete a lesson
  async completeLesson(lessonId, score = 0) {
    try {
      const response = await api.post(`/lessons/${lessonId}/complete`, { score });
      return response.data;
    } catch (error) {
      console.error('Complete lesson error:', error);
      throw error;
    }
  }

  // Update lesson progress
  async updateProgress(lessonId, progressData) {
    try {
      const response = await api.put(`/lessons/${lessonId}/progress`, progressData);
      return response.data;
    } catch (error) {
      console.error('Update lesson progress error:', error);
      throw error;
    }
  }

  // Get lesson stats
  async getLessonStats(lessonId) {
    try {
      const response = await api.get(`/lessons/${lessonId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Get lesson stats error:', error);
      throw error;
    }
  }

  // Rate a lesson
  async rateLesson(lessonId, rating) {
    try {
      const response = await api.post(`/lessons/${lessonId}/rate`, { rating });
      return response.data;
    } catch (error) {
      console.error('Rate lesson error:', error);
      throw error;
    }
  }

  // Get recommended lessons
  async getRecommendedLessons(limit = 10) {
    try {
      const response = await api.get(`/lessons/recommended?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get recommended lessons error:', error);
      throw error;
    }
  }

  // Get lessons by category
  async getLessonsByCategory(category) {
    try {
      const response = await api.get(`/lessons/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Get lessons by category error:', error);
      throw error;
    }
  }

  // Get lesson prerequisites
  async getLessonPrerequisites(lessonId) {
    try {
      const response = await api.get(`/lessons/${lessonId}/prerequisites`);
      return response.data;
    } catch (error) {
      console.error('Get lesson prerequisites error:', error);
      throw error;
    }
  }

  // Check if user can access lesson
  async canAccessLesson(lessonId) {
    try {
      const response = await api.get(`/lessons/${lessonId}/access`);
      return response.data;
    } catch (error) {
      console.error('Check lesson access error:', error);
      throw error;
    }
  }
}

const lessonService = new LessonService();
export default lessonService;
