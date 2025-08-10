import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import lessonService from '../services/lessonService';
import vocabularyService from '../services/vocabularyService';
import progressService from '../services/progressService';

// Learning Context
const LearningContext = createContext();

// Learning Actions
const LEARNING_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_LESSONS: 'SET_LESSONS',
  SET_CURRENT_LESSON: 'SET_CURRENT_LESSON',
  SET_VOCABULARY: 'SET_VOCABULARY',
  SET_PROGRESS: 'SET_PROGRESS',
  UPDATE_LESSON_PROGRESS: 'UPDATE_LESSON_PROGRESS',
  ADD_VOCABULARY: 'ADD_VOCABULARY',
  UPDATE_VOCABULARY: 'UPDATE_VOCABULARY',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Learning Reducer
const learningReducer = (state, action) => {
  switch (action.type) {
    case LEARNING_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: { ...state.loading, [action.key]: action.payload }
      };

    case LEARNING_ACTIONS.SET_LESSONS:
      return {
        ...state,
        lessons: action.payload,
        loading: { ...state.loading, lessons: false }
      };

    case LEARNING_ACTIONS.SET_CURRENT_LESSON:
      return {
        ...state,
        currentLesson: action.payload,
        loading: { ...state.loading, currentLesson: false }
      };

    case LEARNING_ACTIONS.SET_VOCABULARY:
      return {
        ...state,
        vocabulary: action.payload,
        loading: { ...state.loading, vocabulary: false }
      };

    case LEARNING_ACTIONS.SET_PROGRESS:
      return {
        ...state,
        progress: action.payload,
        loading: { ...state.loading, progress: false }
      };

    case LEARNING_ACTIONS.UPDATE_LESSON_PROGRESS:
      return {
        ...state,
        progress: {
          ...state.progress,
          lessonProgress: state.progress.lessonProgress.map(lp =>
            lp.lessonId === action.payload.lessonId ? { ...lp, ...action.payload } : lp
          )
        }
      };

    case LEARNING_ACTIONS.ADD_VOCABULARY:
      return {
        ...state,
        vocabulary: [...state.vocabulary, action.payload]
      };

    case LEARNING_ACTIONS.UPDATE_VOCABULARY:
      return {
        ...state,
        vocabulary: state.vocabulary.map(word =>
          word._id === action.payload._id ? { ...word, ...action.payload } : word
        )
      };

    case LEARNING_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: { ...state.loading, [action.key]: false }
      };

    case LEARNING_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Initial State
const initialState = {
  lessons: [],
  currentLesson: null,
  vocabulary: [],
  progress: null,
  loading: {
    lessons: false,
    currentLesson: false,
    vocabulary: false,
    progress: false
  },
  error: null
};

// Learning Provider Component
export const LearningProvider = ({ children }) => {
  const [state, dispatch] = useReducer(learningReducer, initialState);
  const { user } = useAuth();

  // Load user progress when user changes
  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  // Fetch lessons
  const fetchLessons = async (filters = {}) => {
    try {
      dispatch({ type: LEARNING_ACTIONS.SET_LOADING, key: 'lessons', payload: true });
      dispatch({ type: LEARNING_ACTIONS.CLEAR_ERROR });

      const response = await lessonService.getLessons(filters);
      
      if (response.success) {
        dispatch({ type: LEARNING_ACTIONS.SET_LESSONS, payload: response.lessons });
        return { success: true, lessons: response.lessons };
      } else {
        dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'lessons', payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch lessons';
      dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'lessons', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Fetch lesson by ID
  const fetchLessonById = async (lessonId) => {
    try {
      dispatch({ type: LEARNING_ACTIONS.SET_LOADING, key: 'currentLesson', payload: true });
      dispatch({ type: LEARNING_ACTIONS.CLEAR_ERROR });

      const response = await lessonService.getLessonById(lessonId);
      
      if (response.success) {
        dispatch({ type: LEARNING_ACTIONS.SET_CURRENT_LESSON, payload: response.lesson });
        return { success: true, lesson: response.lesson };
      } else {
        dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'currentLesson', payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch lesson';
      dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'currentLesson', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Start lesson
  const startLesson = async (lessonId) => {
    try {
      dispatch({ type: LEARNING_ACTIONS.CLEAR_ERROR });

      const response = await lessonService.startLesson(lessonId);
      
      if (response.success) {
        dispatch({ type: LEARNING_ACTIONS.UPDATE_LESSON_PROGRESS, payload: response.progress });
        return { success: true };
      } else {
        dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'lessons', payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to start lesson';
      dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'lessons', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Complete lesson
  const completeLesson = async (lessonId, score = 0) => {
    try {
      dispatch({ type: LEARNING_ACTIONS.CLEAR_ERROR });

      const response = await lessonService.completeLesson(lessonId, score);
      
      if (response.success) {
        dispatch({ type: LEARNING_ACTIONS.UPDATE_LESSON_PROGRESS, payload: response.progress });
        // Also update overall progress
        loadProgress();
        return { success: true };
      } else {
        dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'lessons', payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to complete lesson';
      dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'lessons', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Fetch vocabulary
  const fetchVocabulary = async (filters = {}) => {
    try {
      dispatch({ type: LEARNING_ACTIONS.SET_LOADING, key: 'vocabulary', payload: true });
      dispatch({ type: LEARNING_ACTIONS.CLEAR_ERROR });

      const response = await vocabularyService.getVocabulary(filters);
      
      if (response.success) {
        dispatch({ type: LEARNING_ACTIONS.SET_VOCABULARY, payload: response.vocabulary });
        return { success: true, vocabulary: response.vocabulary };
      } else {
        dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'vocabulary', payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch vocabulary';
      dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'vocabulary', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Add vocabulary word
  const addVocabulary = async (wordData) => {
    try {
      dispatch({ type: LEARNING_ACTIONS.CLEAR_ERROR });

      const response = await vocabularyService.addVocabulary(wordData);
      
      if (response.success) {
        dispatch({ type: LEARNING_ACTIONS.ADD_VOCABULARY, payload: response.vocabulary });
        return { success: true };
      } else {
        dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'vocabulary', payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add vocabulary';
      dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'vocabulary', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Update vocabulary progress
  const updateVocabularyProgress = async (wordId, isCorrect, difficulty = null) => {
    try {
      dispatch({ type: LEARNING_ACTIONS.CLEAR_ERROR });

      const response = await vocabularyService.updateProgress(wordId, isCorrect, difficulty);
      
      if (response.success) {
        dispatch({ type: LEARNING_ACTIONS.UPDATE_VOCABULARY, payload: response.vocabulary });
        return { success: true };
      } else {
        dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'vocabulary', payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update vocabulary progress';
      dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'vocabulary', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Load user progress
  const loadProgress = async () => {
    try {
      dispatch({ type: LEARNING_ACTIONS.SET_LOADING, key: 'progress', payload: true });
      dispatch({ type: LEARNING_ACTIONS.CLEAR_ERROR });

      const response = await progressService.getUserProgress();
      
      if (response.success) {
        dispatch({ type: LEARNING_ACTIONS.SET_PROGRESS, payload: response.progress });
        return { success: true, progress: response.progress };
      } else {
        dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'progress', payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load progress';
      dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'progress', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Update study time
  const updateStudyTime = async (minutes) => {
    try {
      const response = await progressService.updateStudyTime(minutes);
      
      if (response.success) {
        dispatch({ type: LEARNING_ACTIONS.SET_PROGRESS, payload: response.progress });
        return { success: true };
      }
    } catch (error) {
      console.error('Failed to update study time:', error);
    }
  };

  // Search lessons
  const searchLessons = async (query) => {
    try {
      dispatch({ type: LEARNING_ACTIONS.SET_LOADING, key: 'lessons', payload: true });
      dispatch({ type: LEARNING_ACTIONS.CLEAR_ERROR });

      const response = await lessonService.searchLessons(query);
      
      if (response.success) {
        dispatch({ type: LEARNING_ACTIONS.SET_LESSONS, payload: response.lessons });
        return { success: true, lessons: response.lessons };
      } else {
        dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'lessons', payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to search lessons';
      dispatch({ type: LEARNING_ACTIONS.SET_ERROR, key: 'lessons', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Get vocabulary for spaced repetition
  const getSpacedRepetitionVocabulary = async (limit = 20) => {
    try {
      const response = await vocabularyService.getSpacedRepetition(limit);
      
      if (response.success) {
        return { success: true, vocabulary: response.vocabulary };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to get spaced repetition vocabulary';
      return { success: false, message: errorMessage };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: LEARNING_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    lessons: state.lessons,
    currentLesson: state.currentLesson,
    vocabulary: state.vocabulary,
    progress: state.progress,
    loading: state.loading,
    error: state.error,
    fetchLessons,
    fetchLessonById,
    startLesson,
    completeLesson,
    fetchVocabulary,
    addVocabulary,
    updateVocabularyProgress,
    loadProgress,
    updateStudyTime,
    searchLessons,
    getSpacedRepetitionVocabulary,
    clearError
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
};

// Custom hook to use learning context
export const useLearning = () => {
  const context = useContext(LearningContext);
  
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  
  return context;
};

export default LearningContext;
