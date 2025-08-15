import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLearning } from '../contexts/LearningContext';
import { getLessonsByLanguage, getAvailableLanguages } from '../data/lessons';
import '../styles/Lessons.css';

const Lessons = () => {
  const { user } = useAuth();
  const { updateProgress } = useLearning();
  const navigate = useNavigate();
  
  const [lessons, setLessons] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(user?.learningLanguages?.[0]?.language || 'Spanish');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [loading, setLoading] = useState(true);

  // Get available languages
  const availableLanguages = getAvailableLanguages();

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    // Load lessons for selected language and level
    setLoading(true);
    setTimeout(() => {
      const filteredLessons = getLessonsByLanguage(selectedLanguage, selectedLevel);
      setLessons(filteredLessons);
      setLoading(false);
    }, 500);
  }, [selectedLanguage, selectedLevel]);

  const getProgressPercentage = (lesson) => {
    return lesson.lessons > 0 ? Math.round((lesson.completed / lesson.lessons) * 100) : 0;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 1: return '#10b981';
      case 2: return '#f59e0b';
      case 3: return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'vocabulary': return '📚';
      case 'conversation': return '💬';
      case 'grammar': return '📝';
      case 'business': return '💼';
      default: return '📖';
    }
  };

  const handleLessonClick = (lesson) => {
    // Navigate to lesson or start lesson
    navigate(`/lesson/${lesson.id}`);
  };

  const filteredLessons = lessons.filter(lesson => 
    selectedLevel === 'all' || lesson.level === selectedLevel
  );

  if (loading) {
    return (
      <div className="lessons-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lessons-container">
      <div className="lessons-header">
        <h1>Language Lessons</h1>
        <p>Choose your learning path and start mastering new languages</p>
      </div>

      <div className="lessons-filters">
        <div className="filter-group">
          <label>Language</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="filter-select"
          >
            {availableLanguages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Level</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="filter-select"
          >
            {levels.map(level => (
              <option key={level} value={level}>
                {level === 'all' ? 'All Levels' : level}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="lessons-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <span className="stat-number">{lessons.length}</span>
            <span className="stat-label">Total Lessons</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-number">
              {lessons.filter(l => l.completed === l.lessons).length}
            </span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <span className="stat-number">
              {lessons.reduce((total, lesson) => total + lesson.duration, 0)}
            </span>
            <span className="stat-label">Total Minutes</span>
          </div>
        </div>
      </div>

      {filteredLessons.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No lessons found</h3>
          <p>Try adjusting your filters to find available lessons.</p>
        </div>
      ) : (
        <div className="lessons-grid">
          {filteredLessons.map(lesson => (
            <div 
              key={lesson.id} 
              className="lesson-card"
              onClick={() => handleLessonClick(lesson)}
            >
              <div className="lesson-header">
                <div className="lesson-image">
                  {lesson.image}
                </div>
                <div className="lesson-info">
                  <h3>{lesson.title}</h3>
                  <p>{lesson.description}</p>
                </div>
                <div className="lesson-type">
                  {getTypeIcon(lesson.type)}
                </div>
              </div>

              <div className="lesson-details">
                <div className="lesson-meta">
                  <span 
                    className="level-badge"
                    style={{ backgroundColor: getLevelColor(lesson.level) }}
                  >
                    {lesson.level}
                  </span>
                  <span className="duration">{lesson.duration} min</span>
                  <span className="lessons-count">{lesson.lessons} lessons</span>
                </div>

                <div className="lesson-topics">
                  {lesson.topics.map((topic, index) => (
                    <span key={index} className="topic-tag">{topic}</span>
                  ))}
                </div>

                <div className="lesson-progress">
                  <div className="progress-info">
                    <span className="progress-text">
                      {lesson.completed}/{lesson.lessons} completed
                    </span>
                    <span className="progress-percentage">
                      {getProgressPercentage(lesson)}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${getProgressPercentage(lesson)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="lesson-actions">
                  {lesson.completed === lesson.lessons ? (
                    <button className="btn btn-success" disabled>
                      ✓ Completed
                    </button>
                  ) : lesson.completed > 0 ? (
                    <button className="btn btn-primary">
                      Continue
                    </button>
                  ) : (
                    <button className="btn btn-primary">
                      Start Lesson
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="learning-tips">
        <h3>💡 Learning Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <h4>Set Daily Goals</h4>
            <p>Commit to learning a specific number of words or minutes each day</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔄</div>
            <h4>Practice Regularly</h4>
            <p>Consistency is key - even 10 minutes daily is better than hours once a week</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🎵</div>
            <h4>Use Multiple Methods</h4>
            <p>Combine flashcards, quizzes, and conversations for better retention</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lessons; 