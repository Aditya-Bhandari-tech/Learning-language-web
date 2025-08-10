const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema({
  word: {
    type: String,
    required: [true, 'Word is required'],
    trim: true,
    maxlength: [100, 'Word cannot exceed 100 characters']
  },
  translation: {
    type: String,
    required: [true, 'Translation is required'],
    trim: true,
    maxlength: [200, 'Translation cannot exceed 200 characters']
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    enum: ['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic']
  },
  nativeLanguage: {
    type: String,
    default: 'English'
  },
  pronunciation: {
    phonetic: String, // IPA or phonetic transcription
    audioUrl: String, // URL to audio file
    audioSpeed: {
      type: String,
      enum: ['slow', 'normal', 'fast'],
      default: 'normal'
    }
  },
  partOfSpeech: {
    type: String,
    enum: ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'interjection', 'pronoun', 'article'],
    required: true
  },
  gender: {
    type: String,
    enum: ['masculine', 'feminine', 'neuter'],
    // Only required for languages that have grammatical gender
    required: function() {
      return ['Spanish', 'French', 'German', 'Italian', 'Portuguese'].includes(this.language);
    }
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  level: {
    type: String,
    enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], // CEFR levels
    default: 'A1'
  },
  frequency: {
    type: String,
    enum: ['common', 'uncommon', 'rare'],
    default: 'common'
  },
  categories: [{
    type: String,
    enum: [
      'greetings', 'family', 'numbers', 'colors', 'food', 'drinks', 
      'animals', 'body', 'clothing', 'house', 'transport', 'work',
      'education', 'weather', 'time', 'emotions', 'health', 'sports',
      'hobbies', 'travel', 'technology', 'nature', 'culture'
    ]
  }],
  tags: [String], // Additional flexible tags
  
  // Usage examples
  examples: [{
    sentence: {
      type: String,
      required: true,
      maxlength: [300, 'Example sentence cannot exceed 300 characters']
    },
    translation: {
      type: String,
      required: true,
      maxlength: [300, 'Example translation cannot exceed 300 characters']
    },
    audioUrl: String,
    context: String // Situation where this example might be used
  }],
  
  // Related words
  synonyms: [{
    word: String,
    translation: String
  }],
  antonyms: [{
    word: String,
    translation: String
  }],
  relatedWords: [{
    word: String,
    translation: String,
    relationship: {
      type: String,
      enum: ['conjugation', 'derivative', 'compound', 'collocation', 'idiom']
    }
  }],
  
  // Grammar information
  grammar: {
    // For verbs
    infinitive: String,
    conjugations: [{
      form: String, // e.g., 'present', 'past', 'future'
      person: String, // e.g., '1st person singular'
      conjugation: String
    }],
    
    // For nouns
    plural: String,
    
    // For adjectives
    comparative: String,
    superlative: String,
    
    // Additional notes
    notes: String
  },
  
  // Cultural context
  culturalNotes: {
    type: String,
    maxlength: [500, 'Cultural notes cannot exceed 500 characters']
  },
  
  // Learning metadata
  learningData: {
    timesReviewed: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    incorrectAnswers: {
      type: Number,
      default: 0
    },
    lastReviewed: Date,
    nextReview: Date, // Spaced repetition
    masteryLevel: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    averageResponseTime: {
      type: Number, // in seconds
      default: 0
    }
  },
  
  // Content source and validation
  source: {
    type: String,
    enum: ['official', 'community', 'ai-generated', 'imported'],
    default: 'official'
  },
  verified: {
    type: Boolean,
    default: false
  },
  reportCount: {
    type: Number,
    default: 0
  },
  
  // Lesson association
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  
  // User who added this word (for user-generated content)
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for efficient querying
vocabularySchema.index({ language: 1, difficulty: 1, categories: 1 });
vocabularySchema.index({ word: 1, language: 1 }, { unique: true });
vocabularySchema.index({ level: 1, frequency: 1 });
vocabularySchema.index({ tags: 1 });
vocabularySchema.index({ 'learningData.nextReview': 1 });

// Virtual for accuracy percentage
vocabularySchema.virtual('accuracyRate').get(function() {
  const total = this.learningData.correctAnswers + this.learningData.incorrectAnswers;
  if (total === 0) return 0;
  return ((this.learningData.correctAnswers / total) * 100).toFixed(2);
});

// Virtual for mastery status
vocabularySchema.virtual('masteryStatus').get(function() {
  const level = this.learningData.masteryLevel;
  if (level === 0) return 'new';
  if (level === 1) return 'learning';
  if (level === 2) return 'familiar';
  if (level === 3) return 'known';
  if (level === 4) return 'mastered';
  return 'expert';
});

// Method to update learning data
vocabularySchema.methods.updateLearningData = function(correct, responseTime) {
  this.learningData.timesReviewed += 1;
  this.learningData.lastReviewed = new Date();
  
  if (correct) {
    this.learningData.correctAnswers += 1;
    // Increase mastery level (max 5)
    if (this.learningData.masteryLevel < 5) {
      this.learningData.masteryLevel += 0.2;
    }
  } else {
    this.learningData.incorrectAnswers += 1;
    // Decrease mastery level (min 0)
    if (this.learningData.masteryLevel > 0) {
      this.learningData.masteryLevel = Math.max(0, this.learningData.masteryLevel - 0.1);
    }
  }
  
  // Update average response time
  const totalTime = this.learningData.averageResponseTime * (this.learningData.timesReviewed - 1) + responseTime;
  this.learningData.averageResponseTime = totalTime / this.learningData.timesReviewed;
  
  // Calculate next review date using spaced repetition
  this.calculateNextReview();
};

// Method to calculate next review date (spaced repetition algorithm)
vocabularySchema.methods.calculateNextReview = function() {
  const masteryLevel = this.learningData.masteryLevel;
  const accuracy = parseFloat(this.accuracyRate) / 100;
  
  let intervalDays;
  
  if (masteryLevel < 1) {
    intervalDays = 1; // Review tomorrow
  } else if (masteryLevel < 2) {
    intervalDays = accuracy > 0.8 ? 3 : 1;
  } else if (masteryLevel < 3) {
    intervalDays = accuracy > 0.8 ? 7 : 3;
  } else if (masteryLevel < 4) {
    intervalDays = accuracy > 0.8 ? 14 : 7;
  } else {
    intervalDays = accuracy > 0.8 ? 30 : 14;
  }
  
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + intervalDays);
  this.learningData.nextReview = nextReview;
};

// Static method to get words due for review
vocabularySchema.statics.getDueForReview = function(userId, language) {
  const now = new Date();
  return this.find({
    language,
    'learningData.nextReview': { $lte: now },
    isActive: true
  }).limit(20); // Limit to 20 words per session
};

// Static method to get words by difficulty
vocabularySchema.statics.getByDifficulty = function(language, difficulty) {
  return this.find({ 
    language, 
    difficulty, 
    isActive: true 
  }).sort({ frequency: -1, word: 1 });
};

// Static method to get words by category
vocabularySchema.statics.getByCategory = function(language, category) {
  return this.find({ 
    language, 
    categories: category, 
    isActive: true 
  }).sort({ difficulty: 1, word: 1 });
};

// Pre-save middleware to set initial next review date
vocabularySchema.pre('save', function(next) {
  if (this.isNew && !this.learningData.nextReview) {
    this.learningData.nextReview = new Date(); // Available for review immediately
  }
  next();
});

module.exports = mongoose.model('Vocabulary', vocabularySchema);
