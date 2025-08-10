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

class ProgressService {
  // Get user progress
  async getUserProgress() {
    try {
      const response = await api.get('/progress');
      return response.data;
    } catch (error) {
      console.error('Get user progress error:', error);
      throw error;
    }
  }

  // Update study time
  async updateStudyTime(minutes) {
    try {
      const response = await api.put('/progress/study-time', { minutes });
      return response.data;
    } catch (error) {
      console.error('Update study time error:', error);
      throw error;
    }
  }

  // Get progress analytics
  async getProgressAnalytics(timeframe = '30d') {
    try {
      const response = await api.get(`/progress/analytics?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      console.error('Get progress analytics error:', error);
      throw error;
    }
  }

  // Get leaderboard
  async getLeaderboard(type = 'weekly', limit = 10) {
    try {
      const response = await api.get(`/progress/leaderboard?type=${type}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get leaderboard error:', error);
      throw error;
    }
  }

  // Update learning goals
  async updateLearningGoals(goals) {
    try {
      const response = await api.put('/progress/goals', goals);
      return response.data;
    } catch (error) {
      console.error('Update learning goals error:', error);
      throw error;
    }
  }

  // Get achievement progress
  async getAchievementProgress() {
    try {
      const response = await api.get('/progress/achievements');
      return response.data;
    } catch (error) {
      console.error('Get achievement progress error:', error);
      throw error;
    }
  }

  // Get streak information
  async getStreak() {
    try {
      const response = await api.get('/progress/streak');
      return response.data;
    } catch (error) {
      console.error('Get streak error:', error);
      throw error;
    }
  }

  // Update daily activity
  async updateDailyActivity() {
    try {
      const response = await api.post('/progress/daily-activity');
      return response.data;
    } catch (error) {
      console.error('Update daily activity error:', error);
      throw error;
    }
  }
}

const progressService = new ProgressService();
export default progressService;
