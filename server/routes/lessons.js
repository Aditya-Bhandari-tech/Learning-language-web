const express = require('express');
const { body, query } = require('express-validator');
const lessonController = require('../controllers/lessonController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get all lessons
// @route   GET /api/lessons
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
    .isIn(['vocabulary', 'grammar', 'conversation', 'pronunciation', 'culture', 'listening', 'reading', 'writing'])
    .withMessage('Invalid category'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
], asyncHandler(lessonController.getLessons));

// @desc    Get lesson by ID
// @route   GET /api/lessons/:id
// @access  Public (but enhanced with auth)
router.get('/:id', optionalAuth, asyncHandler(lessonController.getLessonById));

// @desc    Get lessons by language and level
// @route   GET /api/lessons/language/:language/level/:level
// @access  Public
router.get('/language/:language/level/:level', 
  optionalAuth,
  asyncHandler(lessonController.getLessonsByLanguageAndLevel)
);

// @desc    Get popular lessons
// @route   GET /api/lessons/popular/trending
// @access  Public
router.get('/popular/trending', 
  optionalAuth,
  asyncHandler(lessonController.getPopularLessons)
);

// @desc    Search lessons
// @route   GET /api/lessons/search/:query
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
], asyncHandler(lessonController.searchLessons));

// @desc    Start a lesson
// @route   POST /api/lessons/:id/start
// @access  Private
router.post('/:id/start', 
  authenticate,
  asyncHandler(lessonController.startLesson)
);

// @desc    Complete a lesson
// @route   POST /api/lessons/:id/complete
// @access  Private
router.post('/:id/complete', authenticate, [
  body('score')
    .isInt({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),
  body('timeSpent')
    .isInt({ min: 1 })
    .withMessage('Time spent must be a positive integer'),
  body('exercises')
    .optional()
    .isArray()
    .withMessage('Exercises must be an array'),
  body('exercises.*.question')
    .optional()
    .notEmpty()
    .withMessage('Exercise question is required'),
  body('exercises.*.userAnswer')
    .optional()
    .notEmpty()
    .withMessage('User answer is required'),
  body('exercises.*.correct')
    .optional()
    .isBoolean()
    .withMessage('Exercise correct status must be boolean')
], asyncHandler(lessonController.completeLesson));

// @desc    Update lesson progress
// @route   PUT /api/lessons/:id/progress
// @access  Private
router.put('/:id/progress', authenticate, [
  body('currentSection')
    .isInt({ min: 0 })
    .withMessage('Current section must be a non-negative integer'),
  body('timeSpent')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Time spent must be a non-negative integer')
], asyncHandler(lessonController.updateLessonProgress));

// @desc    Get lesson statistics
// @route   GET /api/lessons/:id/stats
// @access  Public
router.get('/:id/stats', asyncHandler(lessonController.getLessonStats));

// @desc    Rate a lesson
// @route   POST /api/lessons/:id/rate
// @access  Private
router.post('/:id/rate', authenticate, [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
], asyncHandler(lessonController.rateLesson));

// Admin routes
// @desc    Create new lesson
// @route   POST /api/lessons
// @access  Private (Admin only)
router.post('/', authenticate, authorize('admin'), [
  body('title')
    .trim()
    .notEmpty()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('language')
    .isIn(['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'])
    .withMessage('Invalid language'),
  body('level')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced'),
  body('category')
    .isIn(['vocabulary', 'grammar', 'conversation', 'pronunciation', 'culture', 'listening', 'reading', 'writing'])
    .withMessage('Invalid category'),
  body('order')
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer'),
  body('duration')
    .optional()
    .isInt({ min: 1, max: 180 })
    .withMessage('Duration must be between 1 and 180 minutes'),
  body('pointsReward')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Points reward must be between 1 and 1000')
], asyncHandler(lessonController.createLesson));

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private (Admin only)
router.put('/:id', authenticate, authorize('admin'), [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced'),
  body('category')
    .optional()
    .isIn(['vocabulary', 'grammar', 'conversation', 'pronunciation', 'culture', 'listening', 'reading', 'writing'])
    .withMessage('Invalid category'),
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('Published status must be boolean')
], asyncHandler(lessonController.updateLesson));

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Admin only)
router.delete('/:id', 
  authenticate, 
  authorize('admin'), 
  asyncHandler(lessonController.deleteLesson)
);

// @desc    Publish/Unpublish lesson
// @route   PATCH /api/lessons/:id/publish
// @access  Private (Admin only)
router.patch('/:id/publish', authenticate, authorize('admin'), [
  body('isPublished')
    .isBoolean()
    .withMessage('Published status must be boolean')
], asyncHandler(lessonController.togglePublishLesson));

// @desc    Get lesson analytics
// @route   GET /api/lessons/analytics/overview
// @access  Private (Admin only)
router.get('/analytics/overview', 
  authenticate, 
  authorize('admin'), 
  asyncHandler(lessonController.getLessonAnalytics)
);

module.exports = router;
