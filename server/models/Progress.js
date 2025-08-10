const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    enum: ['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic']
  },
  
  // Overall progress metrics
  overallProgress: {
    level: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      default: 'A1'
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
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
    }
  },

  // Skill-specific progress
  skills: {
    speaking: {
      level: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      exercisesCompleted: {
        type: Number,
        default: 0
      },
      averageScore: {
        type: Number,
        default: 0
      },
      lastPracticed: Date
    },
    listening: {
      level: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      exercisesCompleted: {
        type: Number,
        default: 0
      },
      averageScore: {
        type: Number,
        default: 0
      },
      lastPracticed: Date
    },
    reading: {
      level: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      exercisesCompleted: {
        type: Number,
        default: 0
      },
      averageScore: {
        type: Number,
        default: 0
      },
      lastPracticed: Date
    },
    writing: {
      level: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      exercisesCompleted: {
        type: Number,
        default: 0
      },
      averageScore: {
        type: Number,
        default: 0
      },
      lastPracticed: Date
    },
    grammar: {
      level: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      exercisesCompleted: {
        type: Number,
        default: 0
      },
      averageScore: {
        type: Number,
        default: 0
      },
      lastPracticed: Date
    },
    vocabulary: {
      level: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      wordsLearned: {
        type: Number,
        default: 0
      },
      wordsMastered: {
        type: Number,
        default: 0
      },
      averageAccuracy: {
        type: Number,
        default: 0
      },
      lastPracticed: Date
    }
  },

  // Lesson progress
  lessons: {
    completed: [{
      lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
      },
      completedAt: {
        type: Date,
        default: Date.now
      },
      score: {
        type: Number,
        min: 0,
        max: 100
      },
      timeSpent: {
        type: Number // in minutes
      },
      attempts: {
        type: Number,
        default: 1
      }
    }],
    inProgress: [{
      lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
      },
      startedAt: {
        type: Date,
        default: Date.now
      },
      currentSection: {
        type: Number,
        default: 0
      },
      timeSpent: {
        type: Number,
        default: 0
      }
    }],
    totalCompleted: {
      type: Number,
      default: 0
    }
  },

  // Quiz and exercise performance
  quizzes: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    totalCorrect: {
      type: Number,
      default: 0
    },
    totalIncorrect: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    recentScores: [Number], // Last 10 scores for trend analysis
    bestScore: {
      type: Number,
      default: 0
    },
    lastQuizDate: Date
  },

  // Vocabulary progress
  vocabularyProgress: {
    wordsEncountered: {
      type: Number,
      default: 0
    },
    wordsLearning: {
      type: Number,
      default: 0
    },
    wordsMastered: {
      type: Number,
      default: 0
    },
    averageRetention: {
      type: Number,
      default: 0
    },
    weakWords: [{
      word: String,
      accuracy: Number,
      lastSeen: Date
    }],
    strongWords: [{
      word: String,
      accuracy: Number,
      masteredAt: Date
    }]
  },

  // Time-based statistics
  studyTime: {
    totalMinutes: {
      type: Number,
      default: 0
    },
    thisWeek: {
      type: Number,
      default: 0
    },
    thisMonth: {
      type: Number,
      default: 0
    },
    weeklyGoal: {
      type: Number,
      default: 105 // 15 minutes * 7 days
    },
    dailyAverage: {
      type: Number,
      default: 0
    },
    lastStudySession: Date,
    studySessions: [{
      date: {
        type: Date,
        default: Date.now
      },
      duration: Number, // in minutes
      activities: [String] // ['flashcards', 'quiz', 'lesson']
    }]
  },

  // Achievement tracking
  achievements: [{
    name: String,
    description: String,
    icon: String,
    category: {
      type: String,
      enum: ['streak', 'vocabulary', 'lessons', 'quiz', 'time', 'milestone']
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      current: Number,
      target: Number
    }
  }],

  // Weekly/Monthly summaries
  weeklySummary: {
    weekOf: Date,
    totalStudyTime: Number,
    lessonsCompleted: Number,
    wordsLearned: Number,
    quizzesTaken: Number,
    averageScore: Number,
    daysActive: Number
  },

  monthlySummary: {
    monthOf: Date,
    totalStudyTime: Number,
    lessonsCompleted: Number,
    wordsLearned: Number,
    quizzesTaken: Number,
    averageScore: Number,
    daysActive: Number,
    skillImprovements: {
      speaking: Number,
      listening: Number,
      reading: Number,
      writing: Number,
      grammar: Number,
      vocabulary: Number
    }
  },

  // Learning preferences and recommendations
  learningPattern: {
    preferredTime: String, // 'morning', 'afternoon', 'evening'
    averageSessionLength: Number, // in minutes
    strongestSkill: String,
    weakestSkill: String,
    recommendedFocus: [String]
  },

  // Milestones and goals
  goals: [{
    type: {
      type: String,
      enum: ['daily_study', 'weekly_lessons', 'vocabulary_target', 'skill_improvement', 'custom']
    },
    target: Number,
    current: Number,
    deadline: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],

  // Last activity tracking
  lastActivity: {
    type: Date,
    default: Date.now
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

// Compound indexes for efficient queries
progressSchema.index({ userId: 1, language: 1 }, { unique: true });
progressSchema.index({ 'overallProgress.level': 1 });
progressSchema.index({ 'overallProgress.totalPoints': -1 });
progressSchema.index({ 'studyTime.lastStudySession': -1 });

// Virtual for overall accuracy
progressSchema.virtual('overallAccuracy').get(function() {
  const total = this.quizzes.totalCorrect + this.quizzes.totalIncorrect;
  if (total === 0) return 0;
  return ((this.quizzes.totalCorrect / total) * 100).toFixed(2);
});

// Virtual for study consistency (days studied this week)
progressSchema.virtual('weeklyConsistency').get(function() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const recentSessions = this.studyTime.studySessions.filter(
    session => session.date >= oneWeekAgo
  );
  
  const uniqueDays = new Set(
    recentSessions.map(session => session.date.toDateString())
  );
  
  return uniqueDays.size;
});

// Method to update skill progress
progressSchema.methods.updateSkillProgress = function(skillName, score, timeSpent) {
  const skill = this.skills[skillName];
  if (!skill) return;

  skill.exercisesCompleted += 1;
  skill.lastPracticed = new Date();
  
  // Update average score
  const totalScore = skill.averageScore * (skill.exercisesCompleted - 1) + score;
  skill.averageScore = Math.round(totalScore / skill.exercisesCompleted);
  
  // Update skill level based on performance
  const improvement = Math.min(score / 10, 5); // Max 5 points per exercise
  skill.level = Math.min(100, skill.level + improvement);
  
  // Add to study time
  this.studyTime.totalMinutes += timeSpent;
  this.studyTime.thisWeek += timeSpent;
  this.studyTime.thisMonth += timeSpent;
};

// Method to complete a lesson
progressSchema.methods.completeLesson = function(lessonId, score, timeSpent, attempts = 1) {
  // Remove from in-progress if exists
  this.lessons.inProgress = this.lessons.inProgress.filter(
    lesson => !lesson.lessonId.equals(lessonId)
  );
  
  // Add to completed
  this.lessons.completed.push({
    lessonId,
    score,
    timeSpent,
    attempts
  });
  
  this.lessons.totalCompleted += 1;
  this.overallProgress.totalPoints += score;
  
  // Update overall percentage (assuming 100 total lessons for simplicity)
  this.overallProgress.percentage = Math.min(100, (this.lessons.totalCompleted / 100) * 100);
};

// Method to update vocabulary progress
progressSchema.methods.updateVocabularyProgress = function(correct, word) {
  if (correct) {
    this.quizzes.totalCorrect += 1;
    // Add to strong words if accuracy is high
    const existingStrong = this.vocabularyProgress.strongWords.find(w => w.word === word);
    if (!existingStrong) {
      this.vocabularyProgress.strongWords.push({
        word,
        accuracy: 100,
        masteredAt: new Date()
      });
      this.vocabularyProgress.wordsMastered += 1;
    }
  } else {
    this.quizzes.totalIncorrect += 1;
    // Add to weak words
    const existingWeak = this.vocabularyProgress.weakWords.find(w => w.word === word);
    if (existingWeak) {
      existingWeak.accuracy = Math.max(0, existingWeak.accuracy - 10);
      existingWeak.lastSeen = new Date();
    } else {
      this.vocabularyProgress.weakWords.push({
        word,
        accuracy: 0,
        lastSeen: new Date()
      });
    }
  }
  
  this.quizzes.totalAttempts += 1;
  this.quizzes.lastQuizDate = new Date();
  
  // Update average score
  const total = this.quizzes.totalCorrect + this.quizzes.totalIncorrect;
  this.quizzes.averageScore = Math.round((this.quizzes.totalCorrect / total) * 100);
  
  // Update recent scores (keep last 10)
  const score = correct ? 100 : 0;
  this.quizzes.recentScores.push(score);
  if (this.quizzes.recentScores.length > 10) {
    this.quizzes.recentScores.shift();
  }
  
  // Update best score
  if (score > this.quizzes.bestScore) {
    this.quizzes.bestScore = score;
  }
};

// Method to add study session
progressSchema.methods.addStudySession = function(duration, activities = []) {
  this.studyTime.studySessions.push({
    duration,
    activities
  });
  
  // Keep only last 30 sessions
  if (this.studyTime.studySessions.length > 30) {
    this.studyTime.studySessions = this.studyTime.studySessions.slice(-30);
  }
  
  this.studyTime.lastStudySession = new Date();
  this.lastActivity = new Date();
  
  // Calculate daily average (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentSessions = this.studyTime.studySessions.filter(
    session => session.date >= thirtyDaysAgo
  );
  
  const totalTime = recentSessions.reduce((sum, session) => sum + session.duration, 0);
  this.studyTime.dailyAverage = Math.round(totalTime / 30);
};

// Static method to get user progress
progressSchema.statics.getUserProgress = function(userId, language) {
  return this.findOne({ userId, language })
    .populate('lessons.completed.lessonId', 'title pointsReward')
    .populate('lessons.inProgress.lessonId', 'title');
};

// Static method to get leaderboard
progressSchema.statics.getLeaderboard = function(language, limit = 10) {
  return this.find({ language })
    .sort({ 'overallProgress.totalPoints': -1 })
    .limit(limit)
    .populate('userId', 'name avatar');
};

module.exports = mongoose.model('Progress', progressSchema);
