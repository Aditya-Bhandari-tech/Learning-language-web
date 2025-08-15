import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLearning } from '../contexts/LearningContext';
import '../styles/Progress.css';

const Progress = () => {
  // const { user } = useAuth(); // Will be used when implementing user-specific progress
  // const { updateProgress } = useLearning(); // Will be used when implementing progress updates
  
  const [progressData, setProgressData] = useState({
    totalWords: 0,
    masteredWords: 0,
    learningWords: 0,
    quizScore: 0,
    streakDays: 0,
    totalStudyTime: 0,
    weeklyProgress: [],
    monthlyProgress: [],
    achievements: [],
    recentActivity: []
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [loading, setLoading] = useState(true);

  // Sample progress data - in a real app, this would come from the API
  const sampleProgressData = {
    totalWords: 45,
    masteredWords: 23,
    learningWords: 22,
    quizScore: 78,
    streakDays: 7,
    totalStudyTime: 12.5, // hours
    weeklyProgress: [
      { day: 'Mon', words: 5, time: 1.2 },
      { day: 'Tue', words: 8, time: 1.8 },
      { day: 'Wed', words: 3, time: 0.9 },
      { day: 'Thu', words: 12, time: 2.1 },
      { day: 'Fri', words: 6, time: 1.5 },
      { day: 'Sat', words: 9, time: 2.3 },
      { day: 'Sun', words: 4, time: 1.1 }
    ],
    monthlyProgress: [
      { week: 'Week 1', words: 25, quizzes: 3, score: 75 },
      { week: 'Week 2', words: 32, quizzes: 5, score: 82 },
      { week: 'Week 3', words: 28, quizzes: 4, score: 79 },
      { week: 'Week 4', words: 35, quizzes: 6, score: 85 }
    ],
    achievements: [
      { id: 1, name: 'First Steps', description: 'Complete your first lesson', earned: true, date: '2024-01-10' },
      { id: 2, name: 'Word Collector', description: 'Learn 50 words', earned: true, date: '2024-01-15' },
      { id: 3, name: 'Quiz Master', description: 'Score 90% on a quiz', earned: false, progress: 78 },
      { id: 4, name: 'Streak Champion', description: 'Study for 7 days in a row', earned: true, date: '2024-01-20' },
      { id: 5, name: 'Language Explorer', description: 'Learn words in 3 different languages', earned: false, progress: 2 }
    ],
    recentActivity: [
      { type: 'quiz', description: 'Completed French Quiz', score: 85, date: '2024-01-20' },
      { type: 'flashcard', description: 'Reviewed 15 flashcards', date: '2024-01-19' },
      { type: 'word', description: 'Mastered "Bonjour"', date: '2024-01-18' },
      { type: 'lesson', description: 'Completed Lesson 3', date: '2024-01-17' },
      { type: 'quiz', description: 'Completed Spanish Quiz', score: 92, date: '2024-01-16' }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProgressData(sampleProgressData);
      setLoading(false);
    }, 1000);
  }, [sampleProgressData]);

  const getProgressPercentage = () => {
    return progressData.totalWords > 0 
      ? Math.round((progressData.masteredWords / progressData.totalWords) * 100)
      : 0;
  };

  const getStreakColor = (days) => {
    if (days >= 7) return '#10b981';
    if (days >= 3) return '#f59e0b';
    return '#6b7280';
  };

  const getAchievementProgress = (achievement) => {
    if (achievement.earned) return 100;
    return achievement.progress || 0;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'quiz': return '📝';
      case 'flashcard': return '🃏';
      case 'word': return '📚';
      case 'lesson': return '📖';
      default: return '📊';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'quiz': return '#3b82f6';
      case 'flashcard': return '#10b981';
      case 'word': return '#f59e0b';
      case 'lesson': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="progress-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h1>Learning Progress</h1>
        <div className="timeframe-selector">
          <button 
            className={`timeframe-btn ${selectedTimeframe === 'week' ? 'active' : ''}`}
            onClick={() => setSelectedTimeframe('week')}
          >
            Week
          </button>
          <button 
            className={`timeframe-btn ${selectedTimeframe === 'month' ? 'active' : ''}`}
            onClick={() => setSelectedTimeframe('month')}
          >
            Month
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <span className="stat-number">{progressData.totalWords}</span>
            <span className="stat-label">Total Words</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-number">{progressData.masteredWords}</span>
            <span className="stat-label">Mastered</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <span className="stat-number">{progressData.quizScore}%</span>
            <span className="stat-label">Quiz Score</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <span className="stat-number">{progressData.streakDays}</span>
            <span className="stat-label">Day Streak</span>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="progress-overview">
        <div className="overview-card">
          <h3>Learning Progress</h3>
          <div className="progress-circle">
            <div className="circle-progress">
              <span className="progress-percentage">{getProgressPercentage()}%</span>
              <span className="progress-label">Mastered</span>
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
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - getProgressPercentage() / 100)}`}
                transform="rotate(-90 60 60)"
              />
            </svg>
          </div>
        </div>

        <div className="overview-card">
          <h3>Study Time</h3>
          <div className="study-time">
            <span className="time-number">{progressData.totalStudyTime}</span>
            <span className="time-unit">hours</span>
          </div>
          <p className="time-description">Total study time this month</p>
        </div>

        <div className="overview-card">
          <h3>Current Streak</h3>
          <div className="streak-display">
            <div 
              className="streak-circle"
              style={{ borderColor: getStreakColor(progressData.streakDays) }}
            >
              <span className="streak-number">{progressData.streakDays}</span>
              <span className="streak-label">days</span>
            </div>
          </div>
          <p className="streak-description">Keep up the great work!</p>
        </div>
      </div>

      {/* Weekly/Monthly Progress Chart */}
      <div className="chart-section">
        <h3>{selectedTimeframe === 'week' ? 'Weekly' : 'Monthly'} Progress</h3>
        <div className="chart-container">
          {selectedTimeframe === 'week' ? (
            <div className="weekly-chart">
              {progressData.weeklyProgress.map((day, index) => (
                <div key={index} className="chart-bar">
                  <div className="bar-label">{day.day}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill"
                      style={{ 
                        height: `${(day.words / 15) * 100}%`,
                        backgroundColor: '#667eea'
                      }}
                    ></div>
                  </div>
                  <div className="bar-value">{day.words}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="monthly-chart">
              {progressData.monthlyProgress.map((week, index) => (
                <div key={index} className="chart-bar">
                  <div className="bar-label">{week.week}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill"
                      style={{ 
                        height: `${(week.words / 40) * 100}%`,
                        backgroundColor: '#10b981'
                      }}
                    ></div>
                  </div>
                  <div className="bar-value">{week.words}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h3>Achievements</h3>
        <div className="achievements-grid">
          {progressData.achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.earned ? 'earned' : ''}`}
            >
              <div className="achievement-icon">
                {achievement.earned ? '🏆' : '🔒'}
              </div>
              <div className="achievement-content">
                <h4>{achievement.name}</h4>
                <p>{achievement.description}</p>
                {achievement.earned ? (
                  <span className="earned-date">Earned {achievement.date}</span>
                ) : (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${getAchievementProgress(achievement)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {progressData.recentActivity.map((activity, index) => (
            <div key={index} className="activity-item">
              <div 
                className="activity-icon"
                style={{ backgroundColor: getActivityColor(activity.type) }}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="activity-content">
                <p className="activity-description">{activity.description}</p>
                <span className="activity-date">{activity.date}</span>
                {activity.score && (
                  <span className="activity-score">Score: {activity.score}%</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress; 