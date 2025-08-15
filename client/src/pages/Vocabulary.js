import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLearning } from '../contexts/LearningContext';
import '../styles/Vocabulary.css';

const Vocabulary = () => {
  // const { user } = useAuth(); // Will be used when implementing user-specific features
  // const { updateProgress } = useLearning(); // Will be used when implementing progress updates
  
  const [vocabulary, setVocabulary] = useState([]);
  const [filteredVocabulary, setFilteredVocabulary] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample vocabulary data - in a real app, this would come from the API
  const sampleVocabulary = [
    {
      id: 1,
      word: 'Bonjour',
      translation: 'Hello',
      language: 'French',
      difficulty: 'Beginner',
      category: 'Greetings',
      example: 'Bonjour, comment allez-vous?',
      mastered: false,
      lastReviewed: '2024-01-15'
    },
    {
      id: 2,
      word: 'Casa',
      translation: 'House',
      language: 'Spanish',
      difficulty: 'Beginner',
      category: 'Home',
      example: 'Mi casa es tu casa.',
      mastered: true,
      lastReviewed: '2024-01-10'
    },
    {
      id: 3,
      word: 'Brot',
      translation: 'Bread',
      language: 'German',
      difficulty: 'Beginner',
      category: 'Food',
      example: 'Ich esse Brot zum Frühstück.',
      mastered: false,
      lastReviewed: '2024-01-12'
    },
    {
      id: 4,
      word: 'Arigato',
      translation: 'Thank you',
      language: 'Japanese',
      difficulty: 'Beginner',
      category: 'Politeness',
      example: 'Arigato gozaimasu.',
      mastered: true,
      lastReviewed: '2024-01-08'
    },
    {
      id: 5,
      word: 'Bene',
      translation: 'Good',
      language: 'Italian',
      difficulty: 'Beginner',
      category: 'Adjectives',
      example: 'Molto bene!',
      mastered: false,
      lastReviewed: '2024-01-14'
    }
  ];

  const [newWord, setNewWord] = useState({
    word: '',
    translation: '',
    language: 'French',
    difficulty: 'Beginner',
    category: '',
    example: ''
  });

  const languages = ['French', 'Spanish', 'German', 'Italian', 'Japanese', 'Chinese', 'Korean'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const categories = ['Greetings', 'Food', 'Home', 'Travel', 'Work', 'Family', 'Politeness', 'Adjectives', 'Verbs'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVocabulary(sampleVocabulary);
      setFilteredVocabulary(sampleVocabulary);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterVocabulary();
  }, [searchTerm, selectedLanguage, selectedDifficulty, vocabulary]);

  const filterVocabulary = () => {
    let filtered = vocabulary;

    if (searchTerm) {
      filtered = filtered.filter(word => 
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(word => word.language === selectedLanguage);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(word => word.difficulty === selectedDifficulty);
    }

    setFilteredVocabulary(filtered);
  };

  const handleAddWord = (e) => {
    e.preventDefault();
    const wordToAdd = {
      ...newWord,
      id: Date.now(),
      mastered: false,
      lastReviewed: new Date().toISOString().split('T')[0]
    };

    setVocabulary([...vocabulary, wordToAdd]);
    setNewWord({
      word: '',
      translation: '',
      language: 'French',
      difficulty: 'Beginner',
      category: '',
      example: ''
    });
    setShowAddForm(false);
  };

  const handleEditWord = (e) => {
    e.preventDefault();
    const updatedVocabulary = vocabulary.map(word => 
      word.id === editingWord.id ? editingWord : word
    );
    setVocabulary(updatedVocabulary);
    setEditingWord(null);
  };

  const handleDeleteWord = (id) => {
    if (window.confirm('Are you sure you want to delete this word?')) {
      setVocabulary(vocabulary.filter(word => word.id !== id));
    }
  };

  const toggleMastered = (id) => {
    setVocabulary(vocabulary.map(word => 
      word.id === id ? { ...word, mastered: !word.mastered } : word
    ));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getLanguageColor = (language) => {
    const colors = {
      'French': '#3b82f6',
      'Spanish': '#10b981',
      'German': '#f59e0b',
      'Italian': '#ef4444',
      'Japanese': '#8b5cf6',
      'Chinese': '#dc2626',
      'Korean': '#059669'
    };
    return colors[language] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="vocabulary-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vocabulary-container">
      <div className="vocabulary-header">
        <h1>Vocabulary Manager</h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary add-word-btn"
        >
          + Add New Word
        </button>
      </div>

      <div className="vocabulary-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search words, translations, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Difficulties</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="vocabulary-stats">
        <div className="stat-card">
          <span className="stat-number">{vocabulary.length}</span>
          <span className="stat-label">Total Words</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{vocabulary.filter(w => w.mastered).length}</span>
          <span className="stat-label">Mastered</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{vocabulary.filter(w => !w.mastered).length}</span>
          <span className="stat-label">Learning</span>
        </div>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Word</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddWord} className="word-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Word</label>
                  <input
                    type="text"
                    value={newWord.word}
                    onChange={(e) => setNewWord({...newWord, word: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Translation</label>
                  <input
                    type="text"
                    value={newWord.translation}
                    onChange={(e) => setNewWord({...newWord, translation: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Language</label>
                  <select
                    value={newWord.language}
                    onChange={(e) => setNewWord({...newWord, language: e.target.value})}
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={newWord.difficulty}
                    onChange={(e) => setNewWord({...newWord, difficulty: e.target.value})}
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newWord.category}
                    onChange={(e) => setNewWord({...newWord, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Example Sentence</label>
                <textarea
                  value={newWord.example}
                  onChange={(e) => setNewWord({...newWord, example: e.target.value})}
                  placeholder="Enter an example sentence..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Add Word</button>
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingWord && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Word</h2>
              <button 
                onClick={() => setEditingWord(null)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditWord} className="word-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Word</label>
                  <input
                    type="text"
                    value={editingWord.word}
                    onChange={(e) => setEditingWord({...editingWord, word: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Translation</label>
                  <input
                    type="text"
                    value={editingWord.translation}
                    onChange={(e) => setEditingWord({...editingWord, translation: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Language</label>
                  <select
                    value={editingWord.language}
                    onChange={(e) => setEditingWord({...editingWord, language: e.target.value})}
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={editingWord.difficulty}
                    onChange={(e) => setEditingWord({...editingWord, difficulty: e.target.value})}
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={editingWord.category}
                    onChange={(e) => setEditingWord({...editingWord, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Example Sentence</label>
                <textarea
                  value={editingWord.example}
                  onChange={(e) => setEditingWord({...editingWord, example: e.target.value})}
                  placeholder="Enter an example sentence..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button 
                  type="button" 
                  onClick={() => setEditingWord(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="vocabulary-list">
        {filteredVocabulary.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No words found</h3>
            <p>Try adjusting your search or filters to find vocabulary words.</p>
          </div>
        ) : (
          filteredVocabulary.map(word => (
            <div key={word.id} className={`vocabulary-card ${word.mastered ? 'mastered' : ''}`}>
              <div className="word-header">
                <div className="word-info">
                  <h3 className="word-text">{word.word}</h3>
                  <p className="translation-text">{word.translation}</p>
                </div>
                <div className="word-actions">
                  <button
                    onClick={() => toggleMastered(word.id)}
                    className={`mastery-btn ${word.mastered ? 'mastered' : ''}`}
                    title={word.mastered ? 'Mark as learning' : 'Mark as mastered'}
                  >
                    {word.mastered ? '✓' : '○'}
                  </button>
                  <button
                    onClick={() => setEditingWord(word)}
                    className="edit-btn"
                    title="Edit word"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteWord(word.id)}
                    className="delete-btn"
                    title="Delete word"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="word-details">
                <div className="word-tags">
                  <span 
                    className="language-tag"
                    style={{ backgroundColor: getLanguageColor(word.language) }}
                  >
                    {word.language}
                  </span>
                  <span 
                    className="difficulty-tag"
                    style={{ backgroundColor: getDifficultyColor(word.difficulty) }}
                  >
                    {word.difficulty}
                  </span>
                  <span className="category-tag">{word.category}</span>
                </div>

                {word.example && (
                  <div className="example-sentence">
                    <strong>Example:</strong> {word.example}
                  </div>
                )}

                <div className="word-meta">
                  <span className="last-reviewed">
                    Last reviewed: {word.lastReviewed}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Vocabulary; 