const express = require('express');
const { body, query } = require('express-validator');
const vocabularyController = require('../controllers/vocabularyController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get all vocabulary words
// @route   GET /api/vocabulary
// @access  Public (but enhanced with auth)
router.get('/', optionalAuth, [
  query('language')
    .optional()
    .isIn(['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'])
    .withMessage('Invalid language'),
  query('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced'),
  query('category')
    .optional()
    .isIn(['nouns', 'verbs', 'adjectives', 'adverbs', 'phrases', 'expressions'])
    .withMessage('Invalid category'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
], asyncHandler(vocabularyController.getVocabulary));

// @desc    Get vocabulary word by ID
// @route   GET /api/vocabulary/:id
// @access  Public
router.get('/:id', asyncHandler(vocabularyController.getVocabularyById));

// @desc    Search vocabulary
// @route   GET /api/vocabulary/search/:query
// @access  Public
router.get('/search/:query', [
  query('language')
    .optional()
    .isIn(['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'])
    .withMessage('Invalid language'),
  query('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced')
], asyncHandler(vocabularyController.searchVocabulary));

// @desc    Get vocabulary by language and level
// @route   GET /api/vocabulary/language/:language/level/:level
// @access  Public
router.get('/language/:language/level/:level', 
  asyncHandler(vocabularyController.getVocabularyByLanguageAndLevel)
);

// @desc    Get random vocabulary for practice
// @route   GET /api/vocabulary/random/:count
// @access  Public
router.get('/random/:count', [
  query('language')
    .optional()
    .isIn(['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'])
    .withMessage('Invalid language'),
  query('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced')
], asyncHandler(vocabularyController.getRandomVocabulary));

// @desc    Add vocabulary to user's favorites
// @route   POST /api/vocabulary/:id/favorite
// @access  Private
router.post('/:id/favorite', 
  authenticate,
  asyncHandler(vocabularyController.toggleFavorite)
);

// @desc    Get user's favorite vocabulary
// @route   GET /api/vocabulary/user/favorites
// @access  Private
router.get('/user/favorites', 
  authenticate,
  asyncHandler(vocabularyController.getUserFavorites)
);

// @desc    Mark vocabulary as learned
// @route   POST /api/vocabulary/:id/learned
// @access  Private
router.post('/:id/learned', 
  authenticate,
  asyncHandler(vocabularyController.markAsLearned)
);

// @desc    Get user's learned vocabulary
// @route   GET /api/vocabulary/user/learned
// @access  Private
router.get('/user/learned', 
  authenticate,
  asyncHandler(vocabularyController.getUserLearned)
);

// Admin routes
// @desc    Create new vocabulary word
// @route   POST /api/vocabulary
// @access  Private (Admin only)
router.post('/', authenticate, authorize('admin'), [
  body('word')
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage('Word must be between 1 and 100 characters'),
  body('translation')
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 200 })
    .withMessage('Translation must be between 1 and 200 characters'),
  body('language')
    .isIn(['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'])
    .withMessage('Invalid language'),
  body('level')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced'),
  body('category')
    .isIn(['nouns', 'verbs', 'adjectives', 'adverbs', 'phrases', 'expressions'])
    .withMessage('Invalid category'),
  body('pronunciation')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Pronunciation cannot exceed 200 characters'),
  body('example')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Example cannot exceed 500 characters'),
  body('audioUrl')
    .optional()
    .isURL()
    .withMessage('Audio URL must be valid')
], asyncHandler(vocabularyController.createVocabulary));

// @desc    Update vocabulary word
// @route   PUT /api/vocabulary/:id
// @access  Private (Admin only)
router.put('/:id', authenticate, authorize('admin'), [
  body('word')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Word must be between 1 and 100 characters'),
  body('translation')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Translation must be between 1 and 200 characters'),
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced'),
  body('category')
    .optional()
    .isIn(['nouns', 'verbs', 'adjectives', 'adverbs', 'phrases', 'expressions'])
    .withMessage('Invalid category')
], asyncHandler(vocabularyController.updateVocabulary));

// @desc    Delete vocabulary word
// @route   DELETE /api/vocabulary/:id
// @access  Private (Admin only)
router.delete('/:id', 
  authenticate, 
  authorize('admin'), 
  asyncHandler(vocabularyController.deleteVocabulary)
);

// @desc    Get vocabulary statistics
// @route   GET /api/vocabulary/analytics/stats
// @access  Private (Admin only)
router.get('/analytics/stats', 
  authenticate, 
  authorize('admin'), 
  asyncHandler(vocabularyController.getVocabularyStats)
);

module.exports = router;
