const express = require('express');
const { body, query } = require('express-validator');
const progressController = require('../controllers/progressController');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// All progress routes require authentication
router.use(authenticate);

// @desc    Get user's overall progress
// @route   GET /api/progress
// @access  Private
router.get('/', asyncHandler(progressController.getProgress));

// @desc    Get user's progress by language
// @route   GET /api/progress/language/:language
// @access  Private
router.get('/language/:language', asyncHandler(progressController.getProgressByLanguage));

// @desc    Get user's learning statistics
// @route   GET /api/progress/stats
// @access  Private
router.get('/stats', [
  query('timeframe')
    .optional()
    .isIn(['week', 'month', 'year', 'all'])
    .withMessage('Timeframe must be week, month, year, or all'),
  query('language')
    .optional()
    .isIn(['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'])
    .withMessage('Invalid language')
], asyncHandler(progressController.getStats));

// @desc    Get user's learning streak
// @route   GET /api/progress/streak
// @access  Private
router.get('/streak', asyncHandler(progressController.getStreak));

// @desc    Get user's achievements
// @route   GET /api/progress/achievements
// @access  Private
router.get('/achievements', asyncHandler(progressController.getAchievements));

// @desc    Get user's recent activity
// @route   GET /api/progress/activity
// @access  Private
router.get('/activity', [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('days')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Days must be between 1 and 365')
], asyncHandler(progressController.getRecentActivity));

// @desc    Get user's weak areas
// @route   GET /api/progress/weak-areas
// @access  Private
router.get('/weak-areas', [
  query('language')
    .optional()
    .isIn(['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'])
    .withMessage('Invalid language'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Limit must be between 1 and 20')
], asyncHandler(progressController.getWeakAreas));

// @desc    Update user progress after completing an activity
// @route   POST /api/progress
// @access  Private
router.post('/', [
  body('type')
    .isIn(['lesson', 'flashcards', 'quiz', 'vocabulary'])
    .withMessage('Type must be lesson, flashcards, quiz, or vocabulary'),
  body('activityId')
    .notEmpty()
    .withMessage('Activity ID is required'),
  body('language')
    .isIn(['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'])
    .withMessage('Invalid language'),
  body('score')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),
  body('timeSpent')
    .isInt({ min: 1 })
    .withMessage('Time spent must be a positive integer'),
  body('pointsEarned')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Points earned must be non-negative'),
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object')
], asyncHandler(progressController.updateProgress));

// @desc    Update daily goal
// @route   PUT /api/progress/goal
// @access  Private
router.put('/goal', [
  body('dailyGoalMinutes')
    .isInt({ min: 1, max: 480 })
    .withMessage('Daily goal must be between 1 and 480 minutes'),
  body('dailyGoalXP')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Daily XP goal must be between 1 and 10000')
], asyncHandler(progressController.updateDailyGoal));

// @desc    Mark daily goal as completed
// @route   POST /api/progress/goal/complete
// @access  Private
router.post('/goal/complete', asyncHandler(progressController.completeDailyGoal));

// @desc    Get leaderboard
// @route   GET /api/progress/leaderboard
// @access  Private
router.get('/leaderboard', [
  query('timeframe')
    .optional()
    .isIn(['week', 'month', 'all'])
    .withMessage('Timeframe must be week, month, or all'),
  query('language')
    .optional()
    .isIn(['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'])
    .withMessage('Invalid language'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
], asyncHandler(progressController.getLeaderboard));

// @desc    Reset user progress (for testing or user request)
// @route   DELETE /api/progress/reset
// @access  Private
router.delete('/reset', [
  body('confirmReset')
    .equals('CONFIRM_RESET')
    .withMessage('Must confirm reset with CONFIRM_RESET'),
  body('language')
    .optional()
    .isIn(['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'])
    .withMessage('Invalid language')
], asyncHandler(progressController.resetProgress));

// Admin routes
// @desc    Get all users' progress overview
// @route   GET /api/progress/admin/overview
// @access  Private (Admin only)
router.get('/admin/overview', 
  authorize('admin'),
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('sortBy')
      .optional()
      .isIn(['totalXP', 'studyTime', 'streak', 'createdAt'])
      .withMessage('Invalid sort field')
  ],
  asyncHandler(progressController.getAllUsersProgress)
);

// @desc    Get platform analytics
// @route   GET /api/progress/admin/analytics
// @access  Private (Admin only)
router.get('/admin/analytics',
  authorize('admin'),
  [
    query('timeframe')
      .optional()
      .isIn(['week', 'month', 'quarter', 'year'])
      .withMessage('Timeframe must be week, month, quarter, or year')
  ],
  asyncHandler(progressController.getPlatformAnalytics)
);

// @desc    Get user progress by ID (admin)
// @route   GET /api/progress/admin/user/:userId
// @access  Private (Admin only)
router.get('/admin/user/:userId',
  authorize('admin'),
  asyncHandler(progressController.getUserProgressById)
);

module.exports = router;
