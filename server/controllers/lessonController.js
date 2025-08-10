const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const { validationResult } = require('express-validator');

// @desc    Get all lessons with filtering, sorting, and pagination
// @route   GET /api/lessons
// @access  Public
exports.getLessons = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { language, level, category, page = 1, limit = 10 } = req.query;
  const query = { isPublished: true };

  if (language) query.language = language;
  if (level) query.level = level;
  if (category) query.category = category;

  const lessons = await Lesson.find(query)
    .sort({ order: 1, createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-exercises.correctAnswer')
    .exec();

  const count = await Lesson.countDocuments(query);

  res.json({
    success: true,
    lessons,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      total: count,
      limit: parseInt(limit)
    }
  });
};

// @desc    Get a single lesson by ID
// @route   GET /api/lessons/:id
// @access  Public
exports.getLessonById = async (req, res) => {
  const lesson = await Lesson.findOne({ _id: req.params.id, isPublished: true })
    .populate('vocabulary');

  if (!lesson) {
    return res.status(404).json({ 
      success: false,
      message: 'Lesson not found' 
    });
  }

  res.json({
    success: true,
    lesson
  });
};

// @desc    Get lessons by language and level
// @route   GET /api/lessons/language/:language/level/:level
// @access  Public
exports.getLessonsByLanguageAndLevel = async (req, res) => {
  const { language, level } = req.params;
  
  const lessons = await Lesson.find({ 
    language, 
    level, 
    isPublished: true 
  })
    .sort({ order: 1 })
    .select('-exercises.correctAnswer');

  res.json({
    success: true,
    lessons
  });
};

// @desc    Get popular/trending lessons
// @route   GET /api/lessons/popular/trending
// @access  Public
exports.getPopularLessons = async (req, res) => {
  const lessons = await Lesson.find({ isPublished: true })
    .sort({ completionCount: -1, averageRating: -1 })
    .limit(10)
    .select('-exercises.correctAnswer');

  res.json({
    success: true,
    lessons
  });
};

// @desc    Search lessons
// @route   GET /api/lessons/search/:query
// @access  Public
exports.searchLessons = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { query } = req.params;
  const { language, level } = req.query;
  
  const searchQuery = {
    isPublished: true,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } }
    ]
  };

  if (language) searchQuery.language = language;
  if (level) searchQuery.level = level;

  const lessons = await Lesson.find(searchQuery)
    .sort({ averageRating: -1, completionCount: -1 })
    .select('-exercises.correctAnswer');

  res.json({
    success: true,
    lessons
  });
};

// @desc    Start a lesson
// @route   POST /api/lessons/:id/start
// @access  Private
exports.startLesson = async (req, res) => {
  const lesson = await Lesson.findOne({ _id: req.params.id, isPublished: true });
  
  if (!lesson) {
    return res.status(404).json({ 
      success: false,
      message: 'Lesson not found' 
    });
  }

  // Check if user has already started this lesson
  let progress = await Progress.findOne({ 
    user: req.user.id, 
    itemId: req.params.id,
    itemType: 'lesson'
  });

  if (!progress) {
    progress = new Progress({
      user: req.user.id,
      itemId: req.params.id,
      itemType: 'lesson',
      language: lesson.language,
      status: 'in_progress',
      startedAt: new Date()
    });
    await progress.save();
  }

  res.json({
    success: true,
    message: 'Lesson started successfully',
    progress
  });
};

// @desc    Complete a lesson
// @route   POST /api/lessons/:id/complete
// @access  Private
exports.completeLesson = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { score, timeSpent, exercises } = req.body;
  
  const lesson = await Lesson.findOne({ _id: req.params.id, isPublished: true });
  
  if (!lesson) {
    return res.status(404).json({ 
      success: false,
      message: 'Lesson not found' 
    });
  }

  // Update or create progress
  let progress = await Progress.findOneAndUpdate(
    { 
      user: req.user.id, 
      itemId: req.params.id,
      itemType: 'lesson'
    },
    {
      status: 'completed',
      score,
      timeSpent,
      completedAt: new Date(),
      exercises: exercises || []
    },
    { upsert: true, new: true }
  );

  // Update lesson statistics
  await Lesson.findByIdAndUpdate(req.params.id, {
    $inc: { completionCount: 1 },
    $push: { scores: score }
  });

  res.json({
    success: true,
    message: 'Lesson completed successfully',
    progress
  });
};

// @desc    Update lesson progress
// @route   PUT /api/lessons/:id/progress
// @access  Private
exports.updateLessonProgress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentSection, timeSpent } = req.body;
  
  const progress = await Progress.findOneAndUpdate(
    { 
      user: req.user.id, 
      itemId: req.params.id,
      itemType: 'lesson'
    },
    {
      currentSection,
      $inc: { timeSpent: timeSpent || 0 },
      lastAccessedAt: new Date()
    },
    { new: true, upsert: true }
  );

  res.json({
    success: true,
    progress
  });
};

// @desc    Get lesson statistics
// @route   GET /api/lessons/:id/stats
// @access  Public
exports.getLessonStats = async (req, res) => {
  const lesson = await Lesson.findOne({ _id: req.params.id, isPublished: true })
    .select('completionCount averageRating totalRatings');
  
  if (!lesson) {
    return res.status(404).json({ 
      success: false,
      message: 'Lesson not found' 
    });
  }

  res.json({
    success: true,
    stats: {
      completions: lesson.completionCount,
      averageRating: lesson.averageRating,
      totalRatings: lesson.totalRatings
    }
  });
};

// @desc    Rate a lesson
// @route   POST /api/lessons/:id/rate
// @access  Private
exports.rateLesson = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rating, comment } = req.body;
  
  const lesson = await Lesson.findOne({ _id: req.params.id, isPublished: true });
  
  if (!lesson) {
    return res.status(404).json({ 
      success: false,
      message: 'Lesson not found' 
    });
  }

  // Check if user already rated this lesson
  const existingRatingIndex = lesson.ratings.findIndex(
    r => r.user.toString() === req.user.id
  );

  if (existingRatingIndex > -1) {
    // Update existing rating
    lesson.ratings[existingRatingIndex] = {
      user: req.user.id,
      rating,
      comment,
      createdAt: new Date()
    };
  } else {
    // Add new rating
    lesson.ratings.push({
      user: req.user.id,
      rating,
      comment,
      createdAt: new Date()
    });
  }

  // Recalculate average rating
  const totalRating = lesson.ratings.reduce((sum, r) => sum + r.rating, 0);
  lesson.averageRating = totalRating / lesson.ratings.length;
  lesson.totalRatings = lesson.ratings.length;

  await lesson.save();

  res.json({
    success: true,
    message: 'Lesson rated successfully'
  });
};

// Admin Methods
// @desc    Create new lesson
// @route   POST /api/lessons
// @access  Private (Admin)
exports.createLesson = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const lesson = new Lesson({
    ...req.body,
    createdBy: req.user.id
  });

  await lesson.save();

  res.status(201).json({
    success: true,
    lesson
  });
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private (Admin)
exports.updateLesson = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const lesson = await Lesson.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: new Date() },
    { new: true }
  );

  if (!lesson) {
    return res.status(404).json({ 
      success: false,
      message: 'Lesson not found' 
    });
  }

  res.json({
    success: true,
    lesson
  });
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Admin)
exports.deleteLesson = async (req, res) => {
  const lesson = await Lesson.findByIdAndDelete(req.params.id);

  if (!lesson) {
    return res.status(404).json({ 
      success: false,
      message: 'Lesson not found' 
    });
  }

  // Also delete related progress records
  await Progress.deleteMany({ itemId: req.params.id, itemType: 'lesson' });

  res.json({
    success: true,
    message: 'Lesson deleted successfully'
  });
};

// @desc    Toggle lesson publish status
// @route   PATCH /api/lessons/:id/publish
// @access  Private (Admin)
exports.togglePublishLesson = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { isPublished } = req.body;
  
  const lesson = await Lesson.findByIdAndUpdate(
    req.params.id,
    { isPublished, updatedAt: new Date() },
    { new: true }
  );

  if (!lesson) {
    return res.status(404).json({ 
      success: false,
      message: 'Lesson not found' 
    });
  }

  res.json({
    success: true,
    message: `Lesson ${isPublished ? 'published' : 'unpublished'} successfully`,
    lesson
  });
};

// @desc    Get lesson analytics
// @route   GET /api/lessons/analytics/overview
// @access  Private (Admin)
exports.getLessonAnalytics = async (req, res) => {
  const totalLessons = await Lesson.countDocuments();
  const publishedLessons = await Lesson.countDocuments({ isPublished: true });
  const totalCompletions = await Progress.countDocuments({ 
    itemType: 'lesson', 
    status: 'completed' 
  });

  const topLessons = await Lesson.find({ isPublished: true })
    .sort({ completionCount: -1 })
    .limit(5)
    .select('title completionCount averageRating');

  const lessonsByLanguage = await Lesson.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: '$language', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.json({
    success: true,
    analytics: {
      totalLessons,
      publishedLessons,
      totalCompletions,
      topLessons,
      lessonsByLanguage
    }
  });
};
