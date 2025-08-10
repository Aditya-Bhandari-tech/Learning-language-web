import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLearning } from '../contexts/LearningContext';
import '../styles/Lessons.css';

const Lessons = () => {
  const { user } = useAuth();
  const { updateProgress } = useLearning();
  const navigate = useNavigate();
  
  const [lessons, setLessons] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('French');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [loading, setLoading] = useState(true);

  // Sample lessons data - in a real app, this would come from the API
  const sampleLessons = {
    French: [
      {
        id: 1,
        title: 'Basic Greetings',
        description: 'Learn essential French greetings and introductions',
        level: 'Beginner',
        duration: '15 min',
        lessons: 5,
        completed: 3,
        type: 'vocabulary',
        difficulty: 1,
        image: '👋',
        topics: ['Greetings', 'Introductions', 'Politeness']
      },
      {
        id: 2,
        title: 'Numbers & Counting',
        description: 'Master French numbers from 1 to 100',
        level: 'Beginner',
        duration: '20 min',
        lessons: 4,
        completed: 4,
        type: 'vocabulary',
        difficulty: 1,
        image: '🔢',
        topics: ['Numbers', 'Counting', 'Basic Math']
      },
      {
        id: 3,
        title: 'Food & Dining',
        description: 'Learn vocabulary for food, restaurants, and dining',
        level: 'Intermediate',
        duration: '25 min',
        lessons: 6,
        completed: 2,
        type: 'vocabulary',
        difficulty: 2,
        image: '🍽️',
        topics: ['Food', 'Restaurants', 'Dining']
      },
      {
        id: 4,
        title: 'Travel Essentials',
        description: 'Essential phrases for traveling in French-speaking countries',
        level: 'Intermediate',
        duration: '30 min',
        lessons: 8,
        completed: 0,
        type: 'conversation',
        difficulty: 2,
        image: '✈️',
        topics: ['Travel', 'Transportation', 'Tourism']
      },
      {
        id: 5,
        title: 'Business French',
        description: 'Professional vocabulary and phrases for the workplace',
        level: 'Advanced',
        duration: '40 min',
        lessons: 10,
        completed: 0,
        type: 'business',
        difficulty: 3,
        image: '💼',
        topics: ['Business', 'Workplace', 'Professional']
      }
    ],
    Spanish: [
      {
        id: 6,
        title: 'Spanish Basics',
        description: 'Learn fundamental Spanish vocabulary and phrases',
        level: 'Beginner',
        duration: '15 min',
        lessons: 5,
        completed: 1,
        type: 'vocabulary',
        difficulty: 1,
        image: '🇪🇸',
        topics: ['Basics', 'Greetings', 'Common Phrases']
      },
      {
        id: 7,
        title: 'Family & Relationships',
        description: 'Vocabulary for family members and relationships',
        level: 'Beginner',
        duration: '20 min',
        lessons: 4,
        completed: 0,
        type: 'vocabulary',
        difficulty: 1,
        image: '👨‍👩‍👧‍👦',
        topics: ['Family', 'Relationships', 'Personal']
      }
    ],
    German: [
      {
        id: 8,
        title: 'German Fundamentals',
        description: 'Essential German vocabulary and grammar basics',
        level: 'Beginner',
        duration: '25 min',
        lessons: 6,
        completed: 0,
        type: 'grammar',
        difficulty: 1,
        image: '🇩🇪',
        topics: ['Basics', 'Grammar', 'Vocabulary']
      }
    ]
  };

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];
  const languages = ['French', 'Spanish', 'German', 'Italian', 'Japanese'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLessons(sampleLessons[selectedLanguage] || []);
      setLoading(false);
    }, 1000);
  }, [selectedLanguage]);

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
            {languages.map(lang => (
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
              {lessons.reduce((total, lesson) => total + lesson.duration.split(' ')[0], 0)}
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
                  <span className="duration">{lesson.duration}</span>
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