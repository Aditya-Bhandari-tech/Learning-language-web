import React, { useState, useEffect } from 'react';
import { useLearning } from '../contexts/LearningContext';

const Flashcards = () => {
  const { getSpacedRepetitionVocabulary, updateVocabularyProgress } = useLearning();
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [vocabulary, setVocabulary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
    streak: 0
  });

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    setLoading(true);
    try {
      const result = await getSpacedRepetitionVocabulary(20);
      if (result.success) {
        setVocabulary(result.vocabulary);
        setSessionStats(prev => ({ ...prev, total: result.vocabulary.length }));
      }
    } catch (error) {
      console.error('Error loading flashcards:', error);
    }
    setLoading(false);
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = async (isCorrect) => {
    const currentWord = vocabulary[currentCard];
    
    // Update progress in backend
    await updateVocabularyProgress(currentWord._id, isCorrect);
    
    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1,
      streak: isCorrect ? prev.streak + 1 : 0
    }));
    
    // Move to next card
    if (currentCard < vocabulary.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    } else {
      // End of session
      setCurrentCard(-1);
    }
  };

  const handleRestart = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setSessionStats({ total: vocabulary.length, correct: 0, incorrect: 0, streak: 0 });
  };

  const handleNewSession = () => {
    loadFlashcards();
    setCurrentCard(0);
    setIsFlipped(false);
    setSessionStats({ total: 0, correct: 0, incorrect: 0, streak: 0 });
  };

  if (loading) {
    return (
      <div className="flashcards-loading">
        <div className="spinner"></div>
        <p>Loading your flashcards...</p>
      </div>
    );
  }

  if (vocabulary.length === 0) {
    return (
      <div className="no-flashcards">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">🎴</div>
            <h2>No Flashcards Available</h2>
            <p>You haven't learned any vocabulary words yet. Complete some lessons first!</p>
            <button onClick={loadFlashcards} className="btn btn-primary">
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Session complete
  if (currentCard === -1) {
    const accuracy = Math.round((sessionStats.correct / (sessionStats.correct + sessionStats.incorrect)) * 100);
    
    return (
      <div className="flashcards-complete">
        <div className="container">
          <div className="completion-card">
            <div className="completion-icon">🎉</div>
            <h2>Session Complete!</h2>
            <div className="session-results">
              <div className="result-stat">
                <span className="stat-number">{sessionStats.correct}</span>
                <span className="stat-label">Correct</span>
              </div>
              <div className="result-stat">
                <span className="stat-number">{sessionStats.incorrect}</span>
                <span className="stat-label">Incorrect</span>
              </div>
              <div className="result-stat">
                <span className="stat-number">{accuracy}%</span>
                <span className="stat-label">Accuracy</span>
              </div>
            </div>
            <div className="completion-actions">
              <button onClick={handleRestart} className="btn btn-outline">
                Review Again
              </button>
              <button onClick={handleNewSession} className="btn btn-primary">
                New Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const word = vocabulary[currentCard];
  const progress = Math.round(((currentCard + 1) / vocabulary.length) * 100);

  return (
    <div className="flashcards-page">
      <div className="container">
        {/* Header */}
        <div className="flashcards-header">
          <h1>Flashcards</h1>
          <div className="session-info">
            <div className="card-counter">
              {currentCard + 1} of {vocabulary.length}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">Correct</span>
            <span className="stat-value correct">{sessionStats.correct}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Incorrect</span>
            <span className="stat-value incorrect">{sessionStats.incorrect}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Streak</span>
            <span className="stat-value streak">{sessionStats.streak}</span>
          </div>
        </div>

        {/* Flashcard */}
        <div className="flashcard-container">
          <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleCardFlip}>
            <div className="card-front">
              <div className="card-content">
                <div className="word-text">{word.word}</div>
                <div className="word-info">
                  <span className="language-badge">{word.language}</span>
                  {word.partOfSpeech && (
                    <span className="pos-badge">{word.partOfSpeech}</span>
                  )}
                </div>
                {word.pronunciation && (
                  <div className="pronunciation">
                    /{word.pronunciation}/
                  </div>
                )}
              </div>
              <div className="flip-hint">Click to reveal translation</div>
            </div>
            
            <div className="card-back">
              <div className="card-content">
                <div className="translation-text">{word.translation}</div>
                {word.examples && word.examples.length > 0 && (
                  <div className="example">
                    <strong>Example:</strong> {word.examples[0]}
                  </div>
                )}
                {word.culturalNotes && (
                  <div className="cultural-note">
                    <strong>Note:</strong> {word.culturalNotes}
                  </div>
                )}
              </div>
              <div className="flip-hint">Click to see word again</div>
            </div>
          </div>
          
          {/* Answer Buttons */}
          {isFlipped && (
            <div className="answer-buttons">
              <button 
                onClick={() => handleAnswer(false)}
                className="btn btn-incorrect"
              >
                😞 Incorrect
              </button>
              <button 
                onClick={() => handleAnswer(true)}
                className="btn btn-correct"
              >
                😊 Correct
              </button>
            </div>
          )}
        </div>

        {/* Skip Button */}
        <div className="card-actions">
          <button 
            onClick={() => handleAnswer(false)}
            className="btn btn-outline btn-sm"
          >
            Skip Card
          </button>
        </div>
      </div>

      <style jsx>{`
        .flashcards-page {
          padding: var(--spacing-8) 0;
          min-height: calc(100vh - 80px);
        }

        .flashcards-loading,
        .no-flashcards,
        .flashcards-complete {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 80px);
        }

        .flashcards-loading {
          flex-direction: column;
          gap: var(--spacing-4);
        }

        .empty-state,
        .completion-card {
          text-align: center;
          max-width: 500px;
          padding: var(--spacing-8);
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }

        .empty-icon,
        .completion-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-4);
        }

        .empty-state h2,
        .completion-card h2 {
          margin-bottom: var(--spacing-4);
          font-size: var(--text-2xl);
        }

        .empty-state p {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-6);
        }

        .session-results {
          display: flex;
          justify-content: center;
          gap: var(--spacing-8);
          margin: var(--spacing-6) 0;
        }

        .result-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-1);
        }

        .result-stat .stat-number {
          font-size: var(--text-2xl);
          font-weight: 700;
          color: var(--primary-color);
        }

        .result-stat .stat-label {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .completion-actions {
          display: flex;
          gap: var(--spacing-4);
          justify-content: center;
        }

        .flashcards-header {
          text-align: center;
          margin-bottom: var(--spacing-6);
        }

        .flashcards-header h1 {
          font-size: var(--text-3xl);
          font-weight: 700;
          margin-bottom: var(--spacing-4);
        }

        .session-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-3);
          max-width: 300px;
          margin: 0 auto;
        }

        .card-counter {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--text-secondary);
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: var(--gray-200);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
          border-radius: var(--radius-full);
          transition: width 0.3s ease;
        }

        .stats-bar {
          display: flex;
          justify-content: center;
          gap: var(--spacing-8);
          margin-bottom: var(--spacing-8);
          padding: var(--spacing-4);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: var(--spacing-8);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-1);
        }

        .stat-label {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: var(--text-lg);
          font-weight: 700;
        }

        .stat-value.correct {
          color: var(--success-color);
        }

        .stat-value.incorrect {
          color: var(--error-color);
        }

        .stat-value.streak {
          color: var(--accent-color);
        }

        .flashcard-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-6);
          margin-bottom: var(--spacing-6);
        }

        .flashcard {
          position: relative;
          width: 100%;
          max-width: 500px;
          height: 350px;
          perspective: 1000px;
          cursor: pointer;
        }

        .flashcard.flipped .card-front {
          transform: rotateY(-180deg);
        }

        .flashcard.flipped .card-back {
          transform: rotateY(0deg);
        }

        .card-front,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          backface-visibility: hidden;
          transition: transform 0.6s ease-in-out;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: var(--spacing-8);
        }

        .card-back {
          transform: rotateY(180deg);
        }

        .card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          text-align: center;
        }

        .word-text,
        .translation-text {
          font-size: var(--text-4xl);
          font-weight: 700;
          margin-bottom: var(--spacing-4);
          color: var(--primary-color);
        }

        .word-info {
          display: flex;
          gap: var(--spacing-2);
          margin-bottom: var(--spacing-3);
        }

        .language-badge,
        .pos-badge {
          padding: var(--spacing-1) var(--spacing-3);
          background: var(--primary-color);
          color: white;
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 600;
          text-transform: uppercase;
        }

        .pos-badge {
          background: var(--secondary-color);
        }

        .pronunciation {
          font-style: italic;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-4);
        }

        .example,
        .cultural-note {
          margin-top: var(--spacing-4);
          padding: var(--spacing-3);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          text-align: left;
        }

        .flip-hint {
          text-align: center;
          font-size: var(--text-sm);
          color: var(--text-secondary);
          opacity: 0.7;
        }

        .answer-buttons {
          display: flex;
          gap: var(--spacing-4);
          animation: fadeInUp 0.3s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .btn-correct {
          background: var(--success-color);
          color: white;
          border: none;
          padding: var(--spacing-3) var(--spacing-6);
        }

        .btn-correct:hover {
          background: #059669;
        }

        .btn-incorrect {
          background: var(--error-color);
          color: white;
          border: none;
          padding: var(--spacing-3) var(--spacing-6);
        }

        .btn-incorrect:hover {
          background: #dc2626;
        }

        .card-actions {
          display: flex;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .flashcard {
            height: 300px;
            max-width: 100%;
          }

          .word-text,
          .translation-text {
            font-size: var(--text-2xl);
          }

          .stats-bar {
            gap: var(--spacing-4);
          }

          .session-results {
            gap: var(--spacing-4);
          }

          .answer-buttons {
            flex-direction: column;
            width: 100%;
            max-width: 300px;
          }

          .completion-actions {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Flashcards;
