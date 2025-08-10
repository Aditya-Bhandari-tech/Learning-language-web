const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('nativeLanguage')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Native language must be between 2 and 50 characters')
], asyncHandler(authController.register));

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], asyncHandler(authController.login));

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', authenticate, asyncHandler(authController.getProfile));

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', authenticate, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('nativeLanguage')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Native language must be between 2 and 50 characters'),
  body('preferences.studyGoal')
    .optional()
    .isInt({ min: 5, max: 180 })
    .withMessage('Study goal must be between 5 and 180 minutes'),
  body('preferences.reminderTime')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Reminder time must be in HH:MM format'),
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Theme must be light, dark, or auto')
], asyncHandler(authController.updateProfile));

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', authenticate, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
], asyncHandler(authController.changePassword));

// @desc    Add learning language
// @route   POST /api/auth/learning-language
// @access  Private
router.post('/learning-language', authenticate, [
  body('language')
    .notEmpty()
    .isIn(['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'])
    .withMessage('Invalid language selection'),
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced')
], asyncHandler(authController.addLearningLanguage));

// @desc    Remove learning language
// @route   DELETE /api/auth/learning-language/:language
// @access  Private
router.delete('/learning-language/:language', 
  authenticate, 
  asyncHandler(authController.removeLearningLanguage)
);

// @desc    Update learning language level
// @route   PUT /api/auth/learning-language/:language
// @access  Private
router.put('/learning-language/:language', authenticate, [
  body('level')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced')
], asyncHandler(authController.updateLearningLanguageLevel));

// @desc    Get user achievements
// @route   GET /api/auth/achievements
// @access  Private
router.get('/achievements', authenticate, asyncHandler(authController.getAchievements));

// @desc    Get user statistics
// @route   GET /api/auth/stats
// @access  Private
router.get('/stats', authenticate, asyncHandler(authController.getUserStats));

// @desc    Update user preferences
// @route   PUT /api/auth/preferences
// @access  Private
router.put('/preferences', authenticate, [
  body('studyGoal')
    .optional()
    .isInt({ min: 5, max: 180 })
    .withMessage('Study goal must be between 5 and 180 minutes'),
  body('reminderTime')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Reminder time must be in HH:MM format'),
  body('enableReminders')
    .optional()
    .isBoolean()
    .withMessage('Enable reminders must be a boolean'),
  body('theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Theme must be light, dark, or auto')
], asyncHandler(authController.updatePreferences));

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
router.delete('/account', authenticate, [
  body('password')
    .notEmpty()
    .withMessage('Password is required to delete account'),
  body('confirmation')
    .equals('DELETE')
    .withMessage('Please type DELETE to confirm account deletion')
], asyncHandler(authController.deleteAccount));

// @desc    Refresh auth token
// @route   POST /api/auth/refresh
// @access  Private
router.post('/refresh', authenticate, asyncHandler(authController.refreshToken));

// @desc    Logout user (client-side token invalidation)
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', authenticate, asyncHandler(authController.logout));

module.exports = router;
