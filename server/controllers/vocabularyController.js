const Vocabulary = require('../models/Vocabulary');
const { validationResult } = require('express-validator');

// @desc    Get all vocabulary words
// @route   GET /api/vocabulary
// @access  Public
const getVocabulary = async (req, res) => {
  try {
    const {
      language,
      difficulty,
      level,
      category,
      search,
      page = 1,
      limit = 20,
      sortBy = 'word',
      sortOrder = 'asc'
    } = req.query;

    // Build query object
    const query = { isActive: true };
    
    if (language) query.language = language;
    if (difficulty) query.difficulty = difficulty;
    if (level) query.level = level;
    if (category) query.categories = { $in: [category] };
    if (search) {
      query.$or = [
        { word: { $regex: search, $options: 'i' } },
        { translation: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const vocabulary = await Vocabulary.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip(startIndex)
      .populate('lessonId', 'title level')
      .populate('addedBy', 'username');

    // Get total count for pagination
    const total = await Vocabulary.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: vocabulary.length,
      total,
      totalPages,
      currentPage: parseInt(page),
      pagination: {
        prev: page > 1 ? parseInt(page) - 1 : null,
        next: page < totalPages ? parseInt(page) + 1 : null
      },
      data: vocabulary
    });
  } catch (error) {
    console.error('Get vocabulary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching vocabulary'
    });
  }
};

// @desc    Get single vocabulary word by ID
// @route   GET /api/vocabulary/:id
// @access  Public
const getVocabularyById = async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findById(req.params.id)
      .populate('lessonId', 'title level description')
      .populate('addedBy', 'username avatar');

    if (!vocabulary) {
      return res.status(404).json({
        success: false,
        message: 'Vocabulary word not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vocabulary
    });
  } catch (error) {
    console.error('Get vocabulary by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Vocabulary word not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching vocabulary word'
    });
  }
};

// @desc    Create new vocabulary word
// @route   POST /api/vocabulary
// @access  Private (Admin/Teacher)
const createVocabulary = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Add user who created this word
    req.body.addedBy = req.user.id;

    const vocabulary = await Vocabulary.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Vocabulary word created successfully',
      data: vocabulary
    });
  } catch (error) {
    console.error('Create vocabulary error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `This ${field} already exists for this language`
      });
    }

    // Handle validation errors
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
      message: 'Server error while creating vocabulary word'
    });
  }
};

// @desc    Update vocabulary word
// @route   PUT /api/vocabulary/:id
// @access  Private (Admin/Teacher/Creator)
const updateVocabulary = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let vocabulary = await Vocabulary.findById(req.params.id);

    if (!vocabulary) {
      return res.status(404).json({
        success: false,
        message: 'Vocabulary word not found'
      });
    }

    // Check if user owns the vocabulary word or is admin
    if (vocabulary.addedBy && 
        vocabulary.addedBy.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this vocabulary word'
      });
    }

    vocabulary = await Vocabulary.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Vocabulary word updated successfully',
      data: vocabulary
    });
  } catch (error) {
    console.error('Update vocabulary error:', error);

    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Vocabulary word not found'
      });
    }

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
      message: 'Server error while updating vocabulary word'
    });
  }
};

// @desc    Delete vocabulary word
// @route   DELETE /api/vocabulary/:id
// @access  Private (Admin/Teacher/Creator)
const deleteVocabulary = async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findById(req.params.id);

    if (!vocabulary) {
      return res.status(404).json({
        success: false,
        message: 'Vocabulary word not found'
      });
    }

    // Check if user owns the vocabulary word or is admin
    if (vocabulary.addedBy && 
        vocabulary.addedBy.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this vocabulary word'
      });
    }

    // Soft delete by setting isActive to false
    vocabulary.isActive = false;
    await vocabulary.save();

    res.status(200).json({
      success: true,
      message: 'Vocabulary word deleted successfully'
    });
  } catch (error) {
    console.error('Delete vocabulary error:', error);

    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Vocabulary word not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting vocabulary word'
    });
  }
};

// @desc    Get words due for review (spaced repetition)
// @route   GET /api/vocabulary/review/:language
// @access  Private
const getWordsForReview = async (req, res) => {
  try {
    const { language } = req.params;
    const { limit = 20 } = req.query;

    const wordsForReview = await Vocabulary.getDueForReview(req.user.id, language)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: wordsForReview.length,
      data: wordsForReview
    });
  } catch (error) {
    console.error('Get words for review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching words for review'
    });
  }
};

// @desc    Update learning data after practice
// @route   POST /api/vocabulary/:id/practice
// @access  Private
const updateLearningData = async (req, res) => {
  try {
    const { correct, responseTime = 0 } = req.body;
    
    if (typeof correct !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Correct field must be a boolean value'
      });
    }

    const vocabulary = await Vocabulary.findById(req.params.id);

    if (!vocabulary) {
      return res.status(404).json({
        success: false,
        message: 'Vocabulary word not found'
      });
    }

    // Update learning data
    vocabulary.updateLearningData(correct, responseTime);
    await vocabulary.save();

    res.status(200).json({
      success: true,
      message: 'Learning data updated successfully',
      data: {
        masteryLevel: vocabulary.learningData.masteryLevel,
        masteryStatus: vocabulary.masteryStatus,
        accuracyRate: vocabulary.accuracyRate,
        nextReview: vocabulary.learningData.nextReview
      }
    });
  } catch (error) {
    console.error('Update learning data error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Vocabulary word not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating learning data'
    });
  }
};

// @desc    Get vocabulary statistics
// @route   GET /api/vocabulary/stats/:language?
// @access  Public
const getVocabularyStats = async (req, res) => {
  try {
    const { language } = req.params;
    const matchStage = { isActive: true };
    
    if (language) {
      matchStage.language = language;
    }

    const stats = await Vocabulary.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            language: '$language',
            difficulty: '$difficulty',
            level: '$level'
          },
          count: { $sum: 1 },
          avgMastery: { $avg: '$learningData.masteryLevel' },
          totalReviews: { $sum: '$learningData.timesReviewed' }
        }
      },
      {
        $group: {
          _id: '$_id.language',
          difficulties: {
            $push: {
              difficulty: '$_id.difficulty',
              level: '$_id.level',
              count: '$count',
              avgMastery: '$avgMastery',
              totalReviews: '$totalReviews'
            }
          },
          totalWords: { $sum: '$count' },
          totalReviews: { $sum: '$totalReviews' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get vocabulary stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching vocabulary statistics'
    });
  }
};

// @desc    Get random words for quiz
// @route   GET /api/vocabulary/quiz/:language
// @access  Private
const getQuizWords = async (req, res) => {
  try {
    const { language } = req.params;
    const { difficulty, level, limit = 10 } = req.query;

    const query = { 
      language, 
      isActive: true,
      'learningData.timesReviewed': { $gt: 0 } // Only words that have been studied
    };
    
    if (difficulty) query.difficulty = difficulty;
    if (level) query.level = level;

    const words = await Vocabulary.aggregate([
      { $match: query },
      { $sample: { size: parseInt(limit) } },
      {
        $project: {
          word: 1,
          translation: 1,
          partOfSpeech: 1,
          difficulty: 1,
          level: 1,
          examples: { $slice: ['$examples', 1] }, // Only include one example
          pronunciation: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: words.length,
      data: words
    });
  } catch (error) {
    console.error('Get quiz words error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quiz words'
    });
  }
};

module.exports = {
  getVocabulary,
  getVocabularyById,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
  getWordsForReview,
  updateLearningData,
  getVocabularyStats,
  getQuizWords
};
