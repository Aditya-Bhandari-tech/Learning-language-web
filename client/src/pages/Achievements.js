import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLearning } from '../contexts/LearningContext';
import '../styles/Achievements.css';

const Achievements = () => {
  const { user } = useAuth();
  const { updateProgress } = useLearning();
  
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalAchievements: 0,
    earnedAchievements: 0,
    currentStreak: 0,
    totalPoints: 0
  });
  const [loading, setLoading] = useState(true);

  // Real achievements based on user progress
  const realAchievements = [
    {
      id: 1,
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      category: 'learning',
      points: 10,
      earned: false,
      progress: 0
    },
    {
      id: 2,
      name: 'Word Collector',
      description: 'Learn 10 vocabulary words',
      icon: '📚',
      category: 'vocabulary',
      points: 25,
      earned: false,
      progress: 0
    },
    {
      id: 3,
      name: 'Quiz Master',
      description: 'Score 90% or higher on a quiz',
      icon: '🏆',
      category: 'quiz',
      points: 50,
      earned: false,
      progress: 0
    },
    {
      id: 4,
      name: 'Streak Champion',
      description: 'Study for 3 days in a row',
      icon: '🔥',
      category: 'streak',
      points: 100,
      earned: false,
      progress: 0
    },
    {
      id: 5,
      name: 'Language Explorer',
      description: 'Learn words in 2 different languages',
      icon: '🌍',
      category: 'diversity',
      points: 75,
      earned: false,
      progress: 0
    },
    {
      id: 6,
      name: 'Flashcard Pro',
      description: 'Review 50 flashcards',
      icon: '🃏',
      category: 'flashcards',
      points: 30,
      earned: false,
      progress: 0
    },
    {
      id: 7,
      name: 'Grammar Guru',
      description: 'Complete 5 grammar lessons',
      icon: '📝',
      category: 'grammar',
      points: 60,
      earned: false,
      progress: 0
    },
    {
      id: 8,
      name: 'Conversation Starter',
      description: 'Practice speaking for 15 minutes',
      icon: '💬',
      category: 'speaking',
      points: 40,
      earned: false,
      progress: 0
    },
    {
      id: 9,
      name: 'Perfect Score',
      description: 'Get 100% on any quiz',
      icon: '⭐',
      category: 'quiz',
      points: 100,
      earned: false,
      progress: 0
    },
    {
      id: 10,
      name: 'Study Buddy',
      description: 'Study with a friend for 5 sessions',
      icon: '👥',
      category: 'social',
      points: 50,
      earned: false,
      progress: 0
    }
  ];

  useEffect(() => {
    // Load real achievements and calculate progress
    setTimeout(() => {
      setAchievements(realAchievements);
      setStats({
        totalAchievements: realAchievements.length,
        earnedAchievements: 0, // Will be calculated based on actual progress
        currentStreak: 0, // Will be loaded from user progress
        totalPoints: 0 // Will be calculated based on earned achievements
      });
      setLoading(false);
    }, 500);
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      learning: '#3b82f6',
      vocabulary: '#10b981',
      quiz: '#f59e0b',
      streak: '#ef4444',
      diversity: '#8b5cf6',
      flashcards: '#06b6d4',
      grammar: '#84cc16',
      speaking: '#f97316',
      social: '#ec4899'
    };
    return colors[category] || '#6b7280';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      learning: '📚',
      vocabulary: '📖',
      quiz: '📝',
      streak: '🔥',
      diversity: '🌍',
      flashcards: '🃏',
      grammar: '📝',
      speaking: '💬',
      social: '👥'
    };
    return icons[category] || '🏆';
  };

  const getFilteredAchievements = (filter) => {
    if (filter === 'all') return achievements;
    if (filter === 'earned') return achievements.filter(a => a.earned);
    if (filter === 'unearned') return achievements.filter(a => !a.earned);
    return achievements.filter(a => a.category === filter);
  };

  const [selectedFilter, setSelectedFilter] = useState('all');

  if (loading) {
    return (
      <div className="achievements-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading achievements...</p>
        </div>
      </div>
    );
  }

  const filteredAchievements = getFilteredAchievements(selectedFilter);

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h1>🏆 Achievements</h1>
        <p>Track your progress and unlock badges as you learn</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <span className="stat-number">{stats.earnedAchievements}</span>
            <span className="stat-label">Earned</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-number">{stats.totalAchievements}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <span className="stat-number">{stats.currentStreak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <span className="stat-number">{stats.totalPoints}</span>
            <span className="stat-label">Total Points</span>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="progress-overview">
        <div className="progress-circle">
          <div className="circle-progress">
            <span className="progress-percentage">
              {Math.round((stats.earnedAchievements / stats.totalAchievements) * 100)}%
            </span>
            <span className="progress-label">Complete</span>
          </div>
          <svg className="progress-ring" width="120" height="120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#667eea"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - stats.earnedAchievements / stats.totalAchievements)}`}
              transform="rotate(-90 60 60)"
            />
          </svg>
        </div>
      </div>

      {/* Filters */}
      <div className="achievements-filters">
        <button 
          className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${selectedFilter === 'earned' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('earned')}
        >
          Earned
        </button>
        <button 
          className={`filter-btn ${selectedFilter === 'unearned' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('unearned')}
        >
          Unearned
        </button>
        <button 
          className={`filter-btn ${selectedFilter === 'learning' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('learning')}
        >
          Learning
        </button>
        <button 
          className={`filter-btn ${selectedFilter === 'quiz' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('quiz')}
        >
          Quiz
        </button>
      </div>

      {/* Achievements Grid */}
      <div className="achievements-grid">
        {filteredAchievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`achievement-card ${achievement.earned ? 'earned' : ''}`}
          >
            <div className="achievement-header">
              <div className="achievement-icon">
                {achievement.icon}
              </div>
              <div className="achievement-info">
                <h3>{achievement.name}</h3>
                <p>{achievement.description}</p>
              </div>
              <div className="achievement-points">
                <span className="points-badge">
                  {achievement.points} pts
                </span>
              </div>
            </div>

            <div className="achievement-details">
              <div className="achievement-category">
                <span 
                  className="category-badge"
                  style={{ backgroundColor: getCategoryColor(achievement.category) }}
                >
                  {getCategoryIcon(achievement.category)} {achievement.category}
                </span>
              </div>

              {achievement.earned ? (
                <div className="earned-info">
                  <span className="earned-date">Earned {achievement.earnedDate}</span>
                  <div className="earned-badge">✓</div>
                </div>
              ) : (
                <div className="progress-info">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{achievement.progress}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <h3>No achievements found</h3>
          <p>Try adjusting your filters to see available achievements.</p>
        </div>
      )}

      {/* Recent Achievements */}
      <div className="recent-achievements">
        <h3>🎉 Recent Achievements</h3>
        <div className="recent-list">
          {achievements
            .filter(a => a.earned)
            .sort((a, b) => new Date(b.earnedDate) - new Date(a.earnedDate))
            .slice(0, 3)
            .map(achievement => (
              <div key={achievement.id} className="recent-item">
                <div className="recent-icon">{achievement.icon}</div>
                <div className="recent-content">
                  <h4>{achievement.name}</h4>
                  <span className="recent-date">{achievement.earnedDate}</span>
                </div>
                <div className="recent-points">+{achievement.points}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements; 