const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Lesson description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  language: {
    type: String,
    required: [true, 'Target language is required'],
    enum: ['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic']
  },
  level: {
    type: String,
    required: [true, 'Lesson level is required'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  category: {
    type: String,
    required: [true, 'Lesson category is required'],
    enum: ['vocabulary', 'grammar', 'conversation', 'pronunciation', 'culture', 'listening', 'reading', 'writing']
  },
  // Lesson content structure
  content: {
    introduction: {
      type: String,
      maxlength: [1000, 'Introduction cannot exceed 1000 characters']
    },
    objectives: [{
      type: String,
      maxlength: [200, 'Objective cannot exceed 200 characters']
    }],
    sections: [{
      title: {
        type: String,
        required: true,
        maxlength: [100, 'Section title cannot exceed 100 characters']
      },
      type: {
        type: String,
        required: true,
        enum: ['text', 'audio', 'video', 'interactive', 'exercise']
      },
      content: {
        type: String,
        required: true
      },
      audioUrl: String,
      imageUrl: String,
      exercises: [{
        question: String,
        type: {
          type: String,
          enum: ['multiple-choice', 'fill-blank', 'matching', 'translation', 'pronunciation']
        },
        options: [String], // For multiple choice
        correctAnswer: String,
        explanation: String,
        points: {
          type: Number,
          default: 10
        }
      }]
    }]
  },
  // Vocabulary words introduced in this lesson
  vocabulary: [{
    word: {
      type: String,
      required: true
    },
    translation: {
      type: String,
      required: true
    },
    pronunciation: String,
    audioUrl: String,
    example: String,
    partOfSpeech: {
      type: String,
      enum: ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'interjection', 'pronoun']
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    }
  }],
  // Lesson metadata
  duration: {
    type: Number, // Duration in minutes
    default: 15
  },
  order: {
    type: Number, // Order within the course
    required: true
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  tags: [String],
  // Gamification
  pointsReward: {
    type: Number,
    default: 50
  },
  badgeReward: {
    name: String,
    icon: String,
    description: String
  },
  // Analytics and performance
  stats: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    completions: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: Number, // in minutes
      default: 0
    }
  },
  // Content management
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
lessonSchema.index({ language: 1, level: 1, category: 1 });
lessonSchema.index({ order: 1 });
lessonSchema.index({ isPublished: 1 });
lessonSchema.index({ tags: 1 });

// Virtual for completion rate
lessonSchema.virtual('completionRate').get(function() {
  if (this.stats.totalAttempts === 0) return 0;
  return ((this.stats.completions / this.stats.totalAttempts) * 100).toFixed(2);
});

// Virtual for difficulty based on completion rate and average score
lessonSchema.virtual('difficultyScore').get(function() {
  const completionRate = parseFloat(this.completionRate);
  const avgScore = this.stats.averageScore;
  
  if (completionRate > 80 && avgScore > 85) return 'easy';
  if (completionRate > 60 && avgScore > 70) return 'medium';
  return 'hard';
});

// Method to add attempt
lessonSchema.methods.addAttempt = function(completed = false, score = 0, timeSpent = 0) {
  this.stats.totalAttempts += 1;
  
  if (completed) {
    this.stats.completions += 1;
    
    // Update average score
    const totalScore = this.stats.averageScore * (this.stats.completions - 1) + score;
    this.stats.averageScore = Math.round(totalScore / this.stats.completions);
    
    // Update average time
    const totalTime = this.stats.averageTime * (this.stats.completions - 1) + timeSpent;
    this.stats.averageTime = Math.round(totalTime / this.stats.completions);
  }
};

// Static method to get lessons by language and level
lessonSchema.statics.findByLanguageAndLevel = function(language, level) {
  return this.find({ 
    language, 
    level, 
    isPublished: true 
  }).sort({ order: 1 });
};

// Static method to get popular lessons
lessonSchema.statics.getPopular = function(limit = 10) {
  return this.find({ isPublished: true })
    .sort({ 'stats.completions': -1 })
    .limit(limit);
};

// Pre-save middleware
lessonSchema.pre('save', function(next) {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Lesson', lessonSchema);
