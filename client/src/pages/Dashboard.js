import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLearning } from '../contexts/LearningContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { progress, loadProgress, loading } = useLearning();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Load user progress
    if (user) {
      loadProgress();
    }
  }, [user, loadProgress]);

  // Mock data for demonstration (would come from context/API in real app)
  const stats = {
    streak: 7,
    wordsLearned: 124,
    lessonsCompleted: 18,
    studyTimeToday: 45
  };

  const recentLessons = [
    { id: 1, title: 'Basic Greetings', progress: 100, language: 'Spanish' },
    { id: 2, title: 'Family Members', progress: 75, language: 'Spanish' },
    { id: 3, title: 'Colors and Shapes', progress: 50, language: 'Spanish' }
  ];

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Complete your first lesson', icon: '🎯', earned: true },
    { id: 2, title: 'Week Warrior', description: 'Study for 7 days straight', icon: '🔥', earned: true },
    { id: 3, title: 'Word Master', description: 'Learn 100 new words', icon: '📚', earned: true },
    { id: 4, title: 'Consistency King', description: 'Study for 30 days straight', icon: '👑', earned: false }
  ];

  if (loading.progress) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your progress...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1 className="welcome-title">
            {greeting}, {user?.firstName}! 👋
          </h1>
          <p className="welcome-subtitle">
            Ready to continue your {user?.learningLanguages?.[0]?.language || 'language'} learning journey?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.streak}</h3>
              <p className="stat-label">Day Streak</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.wordsLearned}</h3>
              <p className="stat-label">Words Learned</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.lessonsCompleted}</h3>
              <p className="stat-label">Lessons Completed</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.studyTimeToday}m</h3>
              <p className="stat-label">Study Time Today</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Continue Learning Section */}
          <div className="main-content">
            <div className="section">
              <h2 className="section-title">Continue Learning</h2>
              <div className="continue-learning-card">
                <div className="lesson-info">
                  <h3>Next Lesson: Numbers 1-20</h3>
                  <p>Spanish • Beginner</p>
                  <div className="lesson-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '0%' }}></div>
                    </div>
                    <span className="progress-text">0% complete</span>
                  </div>
                </div>
                <Link to="/lessons" className="btn btn-primary">
                  Start Lesson
                </Link>
              </div>
            </div>

            {/* Recent Lessons */}
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Recent Lessons</h2>
                <Link to="/lessons" className="view-all-link">View All</Link>
              </div>
              <div className="lessons-list">
                {recentLessons.map(lesson => (
                  <div key={lesson.id} className="lesson-item">
                    <div className="lesson-details">
                      <h4>{lesson.title}</h4>
                      <p>{lesson.language}</p>
                      <div className="lesson-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${lesson.progress}%` }}></div>
                        </div>
                        <span className="progress-text">{lesson.progress}% complete</span>
                      </div>
                    </div>
                    <Link to={`/lessons/${lesson.id}`} className="btn btn-outline btn-sm">
                      {lesson.progress === 100 ? 'Review' : 'Continue'}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="section">
              <h2 className="section-title">Quick Actions</h2>
              <div className="quick-actions">
                <Link to="/flashcards" className="action-card">
                  <div className="action-icon">🎴</div>
                  <div className="action-content">
                    <h4>Practice Flashcards</h4>
                    <p>Review vocabulary words</p>
                  </div>
                </Link>
                
                <Link to="/quiz" className="action-card">
                  <div className="action-icon">🧠</div>
                  <div className="action-content">
                    <h4>Take a Quiz</h4>
                    <p>Test your knowledge</p>
                  </div>
                </Link>
                
                <Link to="/vocabulary" className="action-card">
                  <div className="action-icon">📝</div>
                  <div className="action-content">
                    <h4>Vocabulary List</h4>
                    <p>Manage your words</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            {/* Daily Goal */}
            <div className="sidebar-card">
              <h3>Daily Goal</h3>
              <div className="goal-progress">
                <div className="goal-circle">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="30" fill="none" stroke="var(--gray-200)" strokeWidth="8"/>
                    <circle 
                      cx="40" 
                      cy="40" 
                      r="30" 
                      fill="none" 
                      stroke="var(--primary-color)" 
                      strokeWidth="8"
                      strokeDasharray="188.4"
                      strokeDashoffset="94.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="goal-text">
                    <span className="goal-number">50%</span>
                  </div>
                </div>
                <p className="goal-description">
                  45/90 minutes studied today
                </p>
              </div>
            </div>

            {/* Achievements */}
            <div className="sidebar-card">
              <div className="sidebar-header">
                <h3>Achievements</h3>
                <Link to="/profile" className="view-all-link">View All</Link>
              </div>
              <div className="achievements-list">
                {achievements.slice(0, 3).map(achievement => (
                  <div key={achievement.id} className={`achievement-item ${achievement.earned ? 'earned' : 'locked'}`}>
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-info">
                      <h4>{achievement.title}</h4>
                      <p>{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="sidebar-card">
              <h3>This Week</h3>
              <div className="weekly-stats">
                <div className="weekly-stat">
                  <span className="stat-value">5</span>
                  <span className="stat-label">Lessons</span>
                </div>
                <div className="weekly-stat">
                  <span className="stat-value">287</span>
                  <span className="stat-label">Minutes</span>
                </div>
                <div className="weekly-stat">
                  <span className="stat-value">42</span>
                  <span className="stat-label">New Words</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          padding: var(--spacing-8) 0;
        }

        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: var(--spacing-4);
        }

        .welcome-section {
          margin-bottom: var(--spacing-8);
        }

        .welcome-title {
          font-size: var(--text-3xl);
          font-weight: 700;
          margin-bottom: var(--spacing-2);
        }

        .welcome-subtitle {
          color: var(--text-secondary);
          font-size: var(--text-lg);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-6);
          margin-bottom: var(--spacing-8);
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-4);
          padding: var(--spacing-6);
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-number {
          font-size: var(--text-2xl);
          font-weight: 700;
          margin: 0;
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: var(--text-sm);
          margin: 0;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--spacing-8);
        }

        .section {
          margin-bottom: var(--spacing-8);
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-6);
        }

        .section-title {
          font-size: var(--text-xl);
          font-weight: 600;
          margin: 0 0 var(--spacing-6) 0;
        }

        .view-all-link {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;
          font-size: var(--text-sm);
        }

        .view-all-link:hover {
          text-decoration: underline;
        }

        .continue-learning-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-6);
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          border-radius: var(--radius-lg);
        }

        .lesson-info h3 {
          margin: 0 0 var(--spacing-2) 0;
          font-size: var(--text-lg);
        }

        .lesson-info p {
          margin: 0 0 var(--spacing-4) 0;
          opacity: 0.9;
        }

        .lesson-progress {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
        }

        .progress-text {
          font-size: var(--text-sm);
          opacity: 0.9;
        }

        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
        }

        .lesson-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-4);
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
        }

        .lesson-details h4 {
          margin: 0 0 var(--spacing-1) 0;
          font-size: var(--text-base);
          font-weight: 600;
        }

        .lesson-details p {
          margin: 0 0 var(--spacing-3) 0;
          color: var(--text-secondary);
          font-size: var(--text-sm);
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-4);
        }

        .action-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-4);
          padding: var(--spacing-4);
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          text-decoration: none;
          color: var(--text-primary);
          transition: all var(--transition-fast);
        }

        .action-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .action-icon {
          font-size: 1.5rem;
        }

        .action-content h4 {
          margin: 0 0 var(--spacing-1) 0;
          font-size: var(--text-base);
          font-weight: 600;
        }

        .action-content p {
          margin: 0;
          color: var(--text-secondary);
          font-size: var(--text-sm);
        }

        .sidebar-card {
          padding: var(--spacing-6);
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          margin-bottom: var(--spacing-6);
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-4);
        }

        .sidebar-card h3 {
          font-size: var(--text-lg);
          font-weight: 600;
          margin: 0 0 var(--spacing-4) 0;
        }

        .goal-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-3);
        }

        .goal-circle {
          position: relative;
          transform: rotate(-90deg);
        }

        .goal-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(90deg);
          text-align: center;
        }

        .goal-number {
          font-size: var(--text-lg);
          font-weight: 700;
        }

        .goal-description {
          text-align: center;
          color: var(--text-secondary);
          font-size: var(--text-sm);
        }

        .achievements-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }

        .achievement-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          padding: var(--spacing-3);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .achievement-item.earned {
          background: rgba(16, 185, 129, 0.1);
        }

        .achievement-item.locked {
          opacity: 0.6;
        }

        .achievement-icon {
          font-size: 1.25rem;
        }

        .achievement-info h4 {
          margin: 0 0 var(--spacing-1) 0;
          font-size: var(--text-sm);
          font-weight: 600;
        }

        .achievement-info p {
          margin: 0;
          color: var(--text-secondary);
          font-size: var(--text-xs);
        }

        .weekly-stats {
          display: flex;
          justify-content: space-between;
        }

        .weekly-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-1);
        }

        .stat-value {
          font-size: var(--text-lg);
          font-weight: 700;
        }

        .weekly-stat .stat-label {
          color: var(--text-secondary);
          font-size: var(--text-xs);
        }

        @media (max-width: 768px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .continue-learning-card {
            flex-direction: column;
            text-align: center;
            gap: var(--spacing-4);
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
