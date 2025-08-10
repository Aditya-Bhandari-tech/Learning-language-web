const Progress = require('../models/Progress');
const Vocabulary = require('../models/Vocabulary');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get user progress overview
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
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
      date: { $gte: startDate, $lte: now }
    }).sort({ date: -1 });

    // Calculate aggregate statistics
    const stats = await Progress.aggregate([
      { 
        $match: { 
          user: mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: now },
          ...(language && { language })
        }
      },
      {
        $group: {
          _id: language ? null : '$language',
          totalSessions: { $sum: 1 },
          totalWords: { $sum: '$wordsLearned' },
          totalCorrect: { $sum: '$correctAnswers' },
          totalIncorrect: { $sum: '$incorrectAnswers' },
          totalTime: { $sum: '$timeSpent' },
          avgAccuracy: { $avg: '$accuracy' },
          maxStreak: { $max: '$streak' }
        }
      }
    ]);

    // Get vocabulary mastery levels
    const masteryStats = await Vocabulary.aggregate([
      {
        $match: {
          isActive: true,
          ...(language && { language })
        }
      },
      {
        $group: {
          _id: '$learningData.masteryLevel',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

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

    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if progress already exists for today
    let progress = await Progress.findOne({
      user: userId,
      language,
      date: today
    });

    const accuracy = correctAnswers + incorrectAnswers > 0 
      ? (correctAnswers / (correctAnswers + incorrectAnswers)) * 100 
      : 0;

    if (progress) {
      // Update existing progress
      progress.sessions.push({
        sessionType,
        timeSpent,
        wordsLearned,
        correctAnswers,
        incorrectAnswers,
        accuracy,
        difficulty,
        completedAt: new Date()
      });
      
      progress.totalSessions += 1;
      progress.wordsLearned += wordsLearned;
      progress.correctAnswers += correctAnswers;
      progress.incorrectAnswers += incorrectAnswers;
      progress.timeSpent += timeSpent;
      progress.accuracy = ((progress.correctAnswers / (progress.correctAnswers + progress.incorrectAnswers)) * 100) || 0;
      progress.xpGained += xpGained;
      progress.completedLessons = [...new Set([...progress.completedLessons, ...completedLessons])];
      
      await progress.save();
    } else {
      // Create new progress record
      progress = await Progress.create({
        user: userId,
        language,
        date: today,
        sessions: [{
          sessionType,
          timeSpent,
          wordsLearned,
          correctAnswers,
          incorrectAnswers,
          accuracy,
          difficulty,
          completedAt: new Date()
        }],
        totalSessions: 1,
        wordsLearned,
        correctAnswers,
        incorrectAnswers,
        timeSpent,
        accuracy,
        xpGained,
        completedLessons
      });

      // Update streak
      await progress.updateStreak();
    }

    // Update user's total XP and level
    const user = await User.findById(userId);
    if (user) {
      user.xp += xpGained;
      
      // Calculate new level (100 XP per level)
      const newLevel = Math.floor(user.xp / 100) + 1;
      const levelUp = newLevel > user.level;
      user.level = newLevel;
      
      await user.save();

      if (levelUp) {
        // Add level up achievement
        progress.achievements.push({
          type: 'level_up',
          title: `Level ${newLevel} Achieved!`,
          description: `Congratulations! You've reached level ${newLevel}`,
          xpReward: 50,
          earnedAt: new Date()
        });
        
        user.xp += 50; // Bonus XP for leveling up
        await user.save();
        await progress.save();
      }
    }

    // Check for new achievements
    await progress.checkAchievements();

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
    const userId = req.user.id;
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
      user: mongoose.Types.ObjectId(userId),
      date: { $gte: dateRange }
    };
    
    if (language) matchStage.language = language;

    const stats = await Progress.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            language: language ? null : '$language'
          },
          sessions: { $sum: '$totalSessions' },
          wordsLearned: { $sum: '$wordsLearned' },
          timeSpent: { $sum: '$timeSpent' },
          accuracy: { $avg: '$accuracy' },
          xpGained: { $sum: '$xpGained' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Get vocabulary progress by difficulty
    const vocabularyProgress = await Vocabulary.aggregate([
      {
        $match: {
          isActive: true,
          'learningData.timesReviewed': { $gt: 0 },
          ...(language && { language })
        }
      },
      {
        $group: {
          _id: '$difficulty',
          total: { $sum: 1 },
          mastered: {
            $sum: {
              $cond: [{ $gte: ['$learningData.masteryLevel', 4] }, 1, 0]
            }
          },
          learning: {
            $sum: {
              $cond: [
                { $and: [
                  { $gt: ['$learningData.masteryLevel', 0] },
                  { $lt: ['$learningData.masteryLevel', 4] }
                ]}, 1, 0
              ]
            }
          }
        }
      }
    ]);

    // Get streaks
    const streakData = await Progress.getStreakData(userId, language);

    // Get achievements summary
    const achievementsSummary = await Progress.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $unwind: '$achievements' },
      {
        $group: {
          _id: '$achievements.type',
          count: { $sum: 1 },
          totalXp: { $sum: '$achievements.xpReward' }
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
    const userId = req.user.id;

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

    const matchStage = { date: { $gte: dateRange } };
    if (language) matchStage.language = language;

    const leaderboard = await Progress.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$user',
          totalXp: { $sum: '$xpGained' },
          totalWords: { $sum: '$wordsLearned' },
          totalTime: { $sum: '$timeSpent' },
          avgAccuracy: { $avg: '$accuracy' },
          maxStreak: { $max: '$streak' }
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
          username: '$user.username',
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
            _id: '$user',
            totalXp: { $sum: '$xpGained' }
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
    const userId = req.user.id;
    const { category, earned = 'all' } = req.query;

    const progressRecords = await Progress.find({ user: userId })
      .select('achievements language date')
      .sort({ date: -1 });

    let allAchievements = [];
    progressRecords.forEach(record => {
      record.achievements.forEach(achievement => {
        allAchievements.push({
          ...achievement.toObject(),
          language: record.language,
          date: record.date
        });
      });
    });

    // Filter achievements
    if (category) {
      allAchievements = allAchievements.filter(a => a.type === category);
    }

    if (earned === 'earned') {
      allAchievements = allAchievements.filter(a => a.earnedAt);
    } else if (earned === 'available') {
      allAchievements = allAchievements.filter(a => !a.earnedAt);
    }

    // Sort by earned date, most recent first
    allAchievements.sort((a, b) => {
      if (a.earnedAt && b.earnedAt) {
        return new Date(b.earnedAt) - new Date(a.earnedAt);
      }
      if (a.earnedAt && !b.earnedAt) return -1;
      if (!a.earnedAt && b.earnedAt) return 1;
      return 0;
    });

    // Get achievement statistics
    const stats = {
      total: allAchievements.length,
      earned: allAchievements.filter(a => a.earnedAt).length,
      totalXp: allAchievements
        .filter(a => a.earnedAt)
        .reduce((sum, a) => sum + a.xpReward, 0)
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
