import axios from 'axios';
import authService from './authService';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class VocabularyService {
  // Get vocabulary with filters
  async getVocabulary(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.language) params.append('language', filters.language);
      if (filters.level) params.append('level', filters.level);
      if (filters.category) params.append('category', filters.category);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const response = await api.get(`/vocabulary?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get vocabulary error:', error);
      throw error;
    }
  }

  // Add vocabulary word
  async addVocabulary(wordData) {
    try {
      const response = await api.post('/vocabulary', wordData);
      return response.data;
    } catch (error) {
      console.error('Add vocabulary error:', error);
      throw error;
    }
  }

  // Update vocabulary progress
  async updateProgress(wordId, isCorrect, difficulty = null) {
    try {
      const response = await api.put(`/vocabulary/${wordId}/progress`, {
        isCorrect,
        difficulty
      });
      return response.data;
    } catch (error) {
      console.error('Update vocabulary progress error:', error);
      throw error;
    }
  }

  // Get spaced repetition vocabulary
  async getSpacedRepetition(limit = 20) {
    try {
      const response = await api.get(`/vocabulary/spaced-repetition?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get spaced repetition vocabulary error:', error);
      throw error;
    }
  }

  // Search vocabulary
  async searchVocabulary(query) {
    try {
      const response = await api.get(`/vocabulary/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Search vocabulary error:', error);
      throw error;
    }
  }

  // Get vocabulary by category
  async getVocabularyByCategory(category) {
    try {
      const response = await api.get(`/vocabulary/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Get vocabulary by category error:', error);
      throw error;
    }
  }

  // Delete vocabulary word
  async deleteVocabulary(wordId) {
    try {
      const response = await api.delete(`/vocabulary/${wordId}`);
      return response.data;
    } catch (error) {
      console.error('Delete vocabulary error:', error);
      throw error;
    }
  }

  // Update vocabulary word
  async updateVocabulary(wordId, wordData) {
    try {
      const response = await api.put(`/vocabulary/${wordId}`, wordData);
      return response.data;
    } catch (error) {
      console.error('Update vocabulary error:', error);
      throw error;
    }
  }

  // Get vocabulary stats
  async getVocabularyStats() {
    try {
      const response = await api.get('/vocabulary/stats');
      return response.data;
    } catch (error) {
      console.error('Get vocabulary stats error:', error);
      throw error;
    }
  }
}

const vocabularyService = new VocabularyService();
export default vocabularyService;
