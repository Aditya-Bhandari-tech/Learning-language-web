import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLearning } from '../contexts/LearningContext';
import '../styles/Quiz.css';

const Quiz = () => {
  // const { user } = useAuth(); // Will be used when implementing user-specific features
  const { updateProgress } = useLearning();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sample quiz questions - in a real app, these would come from the API
  const [questions] = useState([
    {
      id: 1,
      question: "What does 'Bonjour' mean in English?",
      options: ["Goodbye", "Hello", "Thank you", "Please"],
      correctAnswer: 1,
      explanation: "Bonjour is the French word for 'Hello'"
    },
    {
      id: 2,
      question: "Which of these is the Spanish word for 'house'?",
      options: ["Casa", "Perro", "Libro", "Agua"],
      correctAnswer: 0,
      explanation: "Casa means 'house' in Spanish"
    },
    {
      id: 3,
      question: "What is the German word for 'bread'?",
      options: ["Wasser", "Brot", "Käse", "Fleisch"],
      correctAnswer: 1,
      explanation: "Brot is the German word for 'bread'"
    },
    {
      id: 4,
      question: "Which Italian word means 'good'?",
      options: ["Male", "Bene", "Cattivo", "Grande"],
      correctAnswer: 1,
      explanation: "Bene means 'good' in Italian"
    },
    {
      id: 5,
      question: "What does 'Arigato' mean in Japanese?",
      options: ["Hello", "Goodbye", "Thank you", "Please"],
      correctAnswer: 2,
      explanation: "Arigato means 'Thank you' in Japanese"
    }
  ]);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      // Handle timeout - mark as incorrect
      const question = questions[currentQuestion];
      const correct = false;
      
      setSelectedAnswer(null);
      setIsCorrect(false);
      
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setTimeLeft(30);
        } else {
          setShowResult(true);
          // Update progress
          const progressData = {
            quizCompleted: true,
            score: score,
            totalQuestions: questions.length,
            percentage: (score / questions.length) * 100
          };
          updateProgress(progressData);
        }
      }, 2000);
    }
  }, [timeLeft, showResult, currentQuestion, questions, score, updateProgress]);

  const handleAnswer = (selectedIndex) => {
    const question = questions[currentQuestion];
    const correct = selectedIndex === question.correctAnswer;
    
    setSelectedAnswer(selectedIndex);
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(30);
      } else {
        setShowResult(true);
        setQuizCompleted(true);
        // Update progress
        const progressData = {
          quizCompleted: true,
          score: correct ? score + 1 : score,
          totalQuestions: questions.length,
          percentage: ((correct ? score + 1 : score) / questions.length) * 100
        };
        updateProgress(progressData);
      }
    }, 2000);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimeLeft(30);
    setQuizCompleted(false);
  };

  const getOptionClass = (index) => {
    if (selectedAnswer === null) return 'quiz-option';
    if (index === questions[currentQuestion].correctAnswer) return 'quiz-option correct';
    if (selectedAnswer === index && index !== questions[currentQuestion].correctAnswer) return 'quiz-option incorrect';
    return 'quiz-option';
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = (score / questions.length) * 100;
    const getResultMessage = () => {
      if (percentage >= 80) return "Excellent! You're a language master!";
      if (percentage >= 60) return "Good job! Keep practicing!";
      if (percentage >= 40) return "Not bad! You're making progress!";
      return "Keep studying! Practice makes perfect!";
    };

    return (
      <div className="quiz-container">
        <div className="quiz-result">
          <h2>Quiz Complete!</h2>
          <div className="result-stats">
            <div className="stat-item">
              <span className="stat-number">{score}</span>
              <span className="stat-label">Correct Answers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{questions.length}</span>
              <span className="stat-label">Total Questions</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{percentage.toFixed(0)}%</span>
              <span className="stat-label">Score</span>
            </div>
          </div>
          <p className="result-message">{getResultMessage()}</p>
          <div className="result-actions">
            <button onClick={restartQuiz} className="btn btn-primary">
              Try Again
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress">
          <span className="progress-text">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="quiz-timer">
          <div className="timer-circle">
            <span className="timer-text">{timeLeft}s</span>
          </div>
        </div>
      </div>

      <div className="quiz-content">
        <h2 className="question-text">{question.question}</h2>
        
        <div className="options-container">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={getOptionClass(index)}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>

        {selectedAnswer !== null && (
          <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="feedback-icon">
              {isCorrect ? '✓' : '✗'}
            </div>
            <div className="feedback-content">
              <h4>{isCorrect ? 'Correct!' : 'Incorrect!'}</h4>
              <p>{question.explanation}</p>
            </div>
          </div>
        )}
      </div>

      <div className="quiz-footer">
        <div className="score-display">
          <span>Score: {score}/{questions.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Quiz; 