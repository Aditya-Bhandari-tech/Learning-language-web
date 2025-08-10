const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Language learning specific fields
  nativeLanguage: {
    type: String,
    default: 'English'
  },
  learningLanguages: [{
    language: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    startDate: {
      type: Date,
      default: Date.now
    }
  }],
  preferences: {
    studyGoal: {
      type: Number, // minutes per day
      default: 15
    },
    reminderTime: {
      type: String,
      default: '18:00'
    },
    enableReminders: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    }
  },
  // Gamification
  stats: {
    totalPoints: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastStudyDate: {
      type: Date,
      default: null
    },
    wordsLearned: {
      type: Number,
      default: 0
    },
    lessonsCompleted: {
      type: Number,
      default: 0
    },
    quizzesTaken: {
      type: Number,
      default: 0
    },
    studyTimeTotal: {
      type: Number, // in minutes
      default: 0
    }
  },
  achievements: [{
    name: String,
    description: String,
    icon: String,
    unlockedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ 'learningLanguages.language': 1 });

// Virtual for user level based on points
userSchema.virtual('level').get(function() {
  const points = this.stats.totalPoints;
  if (points < 100) return 1;
  if (points < 500) return 2;
  if (points < 1500) return 3;
  if (points < 3000) return 4;
  return 5;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to update study streak
userSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastStudy = this.stats.lastStudyDate;
  
  if (!lastStudy) {
    // First time studying
    this.stats.currentStreak = 1;
    this.stats.longestStreak = 1;
  } else {
    const daysDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day
      this.stats.currentStreak += 1;
      if (this.stats.currentStreak > this.stats.longestStreak) {
        this.stats.longestStreak = this.stats.currentStreak;
      }
    } else if (daysDiff > 1) {
      // Streak broken
      this.stats.currentStreak = 1;
    }
    // If daysDiff === 0, same day, no change to streak
  }
  
  this.stats.lastStudyDate = today;
};

// Method to add achievement
userSchema.methods.addAchievement = function(achievement) {
  const exists = this.achievements.some(a => a.name === achievement.name);
  if (!exists) {
    this.achievements.push(achievement);
    return true;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);
