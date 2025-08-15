const mongoose = require('mongoose');
const Progress = require('../models/Progress');
const Vocabulary = require('../models/Vocabulary');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get user progress overview
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { language, period = '7d' } = req.query;

    // Build query
    const query = { user: userId };
    if (language) query.language = language;

    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get progress records
    const progressRecords = await Progress.find({
      ...query,
      lastActivity: { $gte: startDate, $lte: now }
    }).sort({ lastActivity: -1 });

    // Calculate aggregate statistics
    const stats = await Progress.aggregate([
      { 
        $match: { 
          userId: mongoose.Types.ObjectId(userId),
          lastActivity: { $gte: startDate, $lte: now },
          ...(language && { language })
        }
      },
      {
        $group: {
          _id: language ? null : '$language',
          totalSessions: { $sum: '$lessons.totalCompleted' },
          totalWords: { $sum: '$vocabularyProgress.wordsLearned' },
          totalCorrect: { $sum: '$quizzes.totalCorrect' },
          totalIncorrect: { $sum: '$quizzes.totalIncorrect' },
          totalTime: { $sum: '$studyTime.totalMinutes' },
          avgAccuracy: { $avg: '$quizzes.averageScore' },
          maxStreak: { $max: '$overallProgress.longestStreak' }
        }
      }
    ]);

    // Get vocabulary mastery levels - simplified for now
    const masteryStats = [
      { _id: 1, count: 0 },
      { _id: 2, count: 0 },
      { _id: 3, count: 0 },
      { _id: 4, count: 0 },
      { _id: 5, count: 0 }
    ];

    // Get current streak
    const currentStreak = await Progress.getCurrentStreak(userId, language);

    // Get recent achievements
    const recentAchievements = await Progress.getRecentAchievements(userId, 5);

    res.status(200).json({
      success: true,
      data: {
        period,
        progressRecords,
        statistics: stats[0] || {
          totalSessions: 0,
          totalWords: 0,
          totalCorrect: 0,
          totalIncorrect: 0,
          totalTime: 0,
          avgAccuracy: 0,
          maxStreak: 0
        },
        masteryStats,
        currentStreak,
        achievements: recentAchievements
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching progress data'
    });
  }
};

// @desc    Record a learning session
// @route   POST /api/progress
// @access  Private
const recordProgress = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      language,
      sessionType,
      wordsLearned,
      correctAnswers,
      incorrectAnswers,
      timeSpent,
      difficulty,
      completedLessons = [],
      xpGained = 0
    } = req.body;

    const userId = req.user._id;

    // Find or create progress record
    let progress = await Progress.findOne({
      userId: userId,
      language: language
    });

    if (!progress) {
      // Create new progress record
      progress = new Progress({
        userId: userId,
        language: language
      });
    }

    // Update vocabulary progress
    progress.vocabularyProgress.wordsLearned += wordsLearned;
    progress.quizzes.totalCorrect += correctAnswers;
    progress.quizzes.totalIncorrect += incorrectAnswers;
    progress.quizzes.totalAttempts += (correctAnswers + incorrectAnswers);
    
    // Update average score
    const total = progress.quizzes.totalCorrect + progress.quizzes.totalIncorrect;
    progress.quizzes.averageScore = total > 0 ? Math.round((progress.quizzes.totalCorrect / total) * 100) : 0;
    
    // Update study time
    progress.studyTime.totalMinutes += timeSpent;
    progress.studyTime.thisWeek += timeSpent;
    progress.studyTime.thisMonth += timeSpent;
    
    // Add study session
    progress.addStudySession(timeSpent, [sessionType]);
    
    // Update last activity
    progress.lastActivity = new Date();
    
    await progress.save();

    // Update user's total XP and level
    const user = await User.findById(userId);
    if (user) {
      user.xp = (user.xp || 0) + xpGained;
      
      // Calculate new level (100 XP per level)
      const newLevel = Math.floor(user.xp / 100) + 1;
      const levelUp = newLevel > (user.level || 1);
      user.level = newLevel;
      
      await user.save();

      if (levelUp) {
        // Add level up achievement
        progress.achievements.push({
          name: `Level ${newLevel} Achieved!`,
          description: `Congratulations! You've reached level ${newLevel}`,
          icon: '🎯',
          category: 'milestone',
          unlockedAt: new Date()
        });
        
        await progress.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'Progress recorded successfully',
      data: progress
    });
  } catch (error) {
    console.error('Record progress error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while recording progress'
    });
  }
};

// @desc    Get learning statistics
// @route   GET /api/progress/stats
// @access  Private
const getStatistics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { language, timeframe = 'week' } = req.query;

    let dateRange;
    const now = new Date();
    
    switch (timeframe) {
      case 'day':
        dateRange = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        dateRange = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        dateRange = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        dateRange = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateRange = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Build aggregation pipeline
    const matchStage = {
      userId: mongoose.Types.ObjectId(userId),
      lastActivity: { $gte: dateRange }
    };
    
    if (language) matchStage.language = language;

    const stats = await Progress.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$lastActivity" } },
            language: language ? null : '$language'
          },
          sessions: { $sum: '$lessons.totalCompleted' },
          wordsLearned: { $sum: '$vocabularyProgress.wordsLearned' },
          timeSpent: { $sum: '$studyTime.totalMinutes' },
          accuracy: { $avg: '$quizzes.averageScore' },
          xpGained: { $sum: '$overallProgress.totalPoints' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Get vocabulary progress by difficulty - simplified
    const vocabularyProgress = [
      {
        _id: 'beginner',
        total: 0,
        mastered: 0,
        learning: 0
      },
      {
        _id: 'intermediate',
        total: 0,
        mastered: 0,
        learning: 0
      },
      {
        _id: 'advanced',
        total: 0,
        mastered: 0,
        learning: 0
      }
    ];

    // Get streaks
    const streakData = await Progress.getStreakData(userId, language);

    // Get achievements summary
    const achievementsSummary = await Progress.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $unwind: '$achievements' },
      {
        $group: {
          _id: '$achievements.category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        timeframe,
        dailyStats: stats,
        vocabularyProgress,
        streakData,
        achievementsSummary
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
};

// @desc    Get leaderboard
// @route   GET /api/progress/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const { language, timeframe = 'week', limit = 50 } = req.query;
    const userId = req.user._id;

    let dateRange;
    const now = new Date();
    
    switch (timeframe) {
      case 'week':
        dateRange = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        dateRange = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        dateRange = new Date(0); // Beginning of time
        break;
      default:
        dateRange = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const matchStage = { lastActivity: { $gte: dateRange } };
    if (language) matchStage.language = language;

    const leaderboard = await Progress.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$userId',
          totalXp: { $sum: '$overallProgress.totalPoints' },
          totalWords: { $sum: '$vocabularyProgress.wordsLearned' },
          totalTime: { $sum: '$studyTime.totalMinutes' },
          avgAccuracy: { $avg: '$quizzes.averageScore' },
          maxStreak: { $max: '$overallProgress.longestStreak' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          username: '$user.name',
          level: '$user.level',
          avatar: '$user.avatar',
          totalXp: 1,
          totalWords: 1,
          totalTime: 1,
          avgAccuracy: { $round: ['$avgAccuracy', 1] },
          maxStreak: 1,
          isCurrentUser: { $eq: ['$_id', mongoose.Types.ObjectId(userId)] }
        }
      },
      { $sort: { totalXp: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Find current user's rank if not in top results
    let userRank = leaderboard.findIndex(entry => entry.isCurrentUser) + 1;
    
    if (userRank === 0) {
      const userPosition = await Progress.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$userId',
            totalXp: { $sum: '$overallProgress.totalPoints' }
          }
        },
        { $sort: { totalXp: -1 } },
        {
          $group: {
            _id: null,
            users: { $push: { user: '$_id', xp: '$totalXp' } }
          }
        },
        {
          $project: {
            rank: {
              $add: [
                { $indexOfArray: ['$users.user', mongoose.Types.ObjectId(userId)] },
                1
              ]
            }
          }
        }
      ]);

      userRank = userPosition[0]?.rank || 0;
    }

    res.status(200).json({
      success: true,
      data: {
        leaderboard,
        userRank,
        timeframe
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard'
    });
  }
};

// @desc    Get achievements
// @route   GET /api/progress/achievements
// @access  Private
const getAchievements = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category, earned = 'all' } = req.query;

    const progressRecords = await Progress.find({ userId: userId })
      .select('achievements language lastActivity')
      .sort({ lastActivity: -1 });

    let allAchievements = [];
    progressRecords.forEach(record => {
      record.achievements.forEach(achievement => {
        allAchievements.push({
          ...achievement.toObject(),
          language: record.language,
          date: record.lastActivity
        });
      });
    });

    // Filter achievements
    if (category) {
      allAchievements = allAchievements.filter(a => a.category === category);
    }

    if (earned === 'earned') {
      allAchievements = allAchievements.filter(a => a.unlockedAt);
    } else if (earned === 'available') {
      allAchievements = allAchievements.filter(a => !a.unlockedAt);
    }

    // Sort by unlocked date, most recent first
    allAchievements.sort((a, b) => {
      if (a.unlockedAt && b.unlockedAt) {
        return new Date(b.unlockedAt) - new Date(a.unlockedAt);
      }
      if (a.unlockedAt && !b.unlockedAt) return -1;
      if (!a.unlockedAt && b.unlockedAt) return 1;
      return 0;
    });

    // Get achievement statistics
    const stats = {
      total: allAchievements.length,
      earned: allAchievements.filter(a => a.unlockedAt).length,
      totalXp: 0 // Simplified for now
    };

    res.status(200).json({
      success: true,
      data: {
        achievements: allAchievements,
        stats
      }
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching achievements'
    });
  }
};

module.exports = {
  getProgress,
  recordProgress,
  getStatistics,
  getLeaderboard,
  getAchievements
};
