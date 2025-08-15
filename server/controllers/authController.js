const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Progress = require('../models/Progress');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { firstName, lastName, email, password, nativeLanguage } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      nativeLanguage: nativeLanguage || 'English'
    });

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  try {
    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  try {
    const updateData = {};
    const { firstName, lastName, nativeLanguage, preferences } = req.body;

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (nativeLanguage) updateData.nativeLanguage = nativeLanguage;
    if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id).select('+password');
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password'
    });
  }
};

// @desc    Add learning language
// @route   POST /api/auth/learning-language
// @access  Private
const addLearningLanguage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { language, level = 'beginner' } = req.body;

  try {
    const user = await User.findById(req.user._id);
    
    // Check if language already exists
    const existingLanguage = user.learningLanguages.find(lang => lang.language === language);
    if (existingLanguage) {
      return res.status(400).json({
        success: false,
        message: 'Language already in learning list'
      });
    }

    // Add language
    user.learningLanguages.push({ language, level });
    await user.save();

    // Create progress tracking for this language
    await Progress.create({
      userId: user._id,
      language
    });

    res.json({
      success: true,
      message: 'Learning language added successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Add learning language error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding learning language'
    });
  }
};

// @desc    Remove learning language
// @route   DELETE /api/auth/learning-language/:language
// @access  Private
const removeLearningLanguage = async (req, res) => {
  const { language } = req.params;

  try {
    const user = await User.findById(req.user._id);
    
    // Remove language
    user.learningLanguages = user.learningLanguages.filter(
      lang => lang.language !== language
    );
    await user.save();

    // Remove progress tracking for this language
    await Progress.findOneAndDelete({
      userId: user._id,
      language
    });

    res.json({
      success: true,
      message: 'Learning language removed successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Remove learning language error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing learning language'
    });
  }
};

// @desc    Update learning language level
// @route   PUT /api/auth/learning-language/:language
// @access  Private
const updateLearningLanguageLevel = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { language } = req.params;
  const { level } = req.body;

  try {
    const user = await User.findById(req.user._id);
    
    // Find and update language level
    const learningLanguage = user.learningLanguages.find(lang => lang.language === language);
    if (!learningLanguage) {
      return res.status(404).json({
        success: false,
        message: 'Learning language not found'
      });
    }

    learningLanguage.level = level;
    await user.save();

    res.json({
      success: true,
      message: 'Learning language level updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update learning language level error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating learning language level'
    });
  }
};

// @desc    Get user achievements
// @route   GET /api/auth/achievements
// @access  Private
const getAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        achievements: user.achievements,
        totalAchievements: user.achievements.length,
        recentAchievements: user.achievements
          .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
          .slice(0, 5)
      }
    });

  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching achievements'
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/auth/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get progress for all languages
    const progressData = await Progress.find({ userId: user._id });
    
    const stats = {
      user: {
        totalPoints: user.stats.totalPoints,
        currentStreak: user.stats.currentStreak,
        longestStreak: user.stats.longestStreak,
        wordsLearned: user.stats.wordsLearned,
        lessonsCompleted: user.stats.lessonsCompleted,
        quizzesTaken: user.stats.quizzesTaken,
        studyTimeTotal: user.stats.studyTimeTotal,
        level: user.level,
        memberSince: user.createdAt
      },
      languages: progressData.map(progress => ({
        language: progress.language,
        level: progress.overallProgress.level,
        percentage: progress.overallProgress.percentage,
        totalPoints: progress.overallProgress.totalPoints,
        skillLevels: {
          speaking: progress.skills.speaking.level,
          listening: progress.skills.listening.level,
          reading: progress.skills.reading.level,
          writing: progress.skills.writing.level,
          grammar: progress.skills.grammar.level,
          vocabulary: progress.skills.vocabulary.level
        }
      })),
      achievements: user.achievements.length,
      learningLanguages: user.learningLanguages
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user statistics'
    });
  }
};

// @desc    Update user preferences
// @route   PUT /api/auth/preferences
// @access  Private
const updatePreferences = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  try {
    const user = await User.findById(req.user._id);
    
    // Update preferences
    user.preferences = { ...user.preferences, ...req.body };
    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: { preferences: user.preferences }
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating preferences'
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { password } = req.body;

  try {
    const user = await User.findById(req.user._id).select('+password');
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Delete user and associated data
    await User.findByIdAndDelete(req.user._id);
    await Progress.deleteMany({ userId: req.user._id });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting account'
    });
  }
};

// @desc    Refresh auth token
// @route   POST /api/auth/refresh
// @access  Private
const refreshToken = async (req, res) => {
  try {
    const token = generateToken(req.user._id);
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: { token }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error refreshing token'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // In a JWT setup, logout is typically handled client-side
    // Here we just return a success message
    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  addLearningLanguage,
  removeLearningLanguage,
  updateLearningLanguageLevel,
  getAchievements,
  getUserStats,
  updatePreferences,
  deleteAccount,
  refreshToken,
  logout
};
