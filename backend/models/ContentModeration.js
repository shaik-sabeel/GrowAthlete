const mongoose = require("mongoose");

const contentModerationSchema = new mongoose.Schema({
  // Moderation settings
  autoModerationEnabled: {
    type: Boolean,
    default: true
  },
  keywordFilteringEnabled: {
    type: Boolean,
    default: true
  },
  languageFilteringEnabled: {
    type: Boolean,
    default: true
  },
  imageModerationEnabled: {
    type: Boolean,
    default: true
  },
  // Banned keywords and phrases
  bannedKeywords: [{
    keyword: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    category: {
      type: String,
      enum: ['profanity', 'hate_speech', 'violence', 'spam', 'other'],
      default: 'other'
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  // Whitelisted keywords (false positives)
  whitelistedKeywords: [{
    keyword: {
      type: String,
      required: true
    },
    reason: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Moderation thresholds
  autoFlagThreshold: {
    type: Number,
    min: 1,
    max: 10,
    default: 3
  },
  autoRemoveThreshold: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  languageScoreThreshold: {
    type: Number,
    min: 0,
    max: 100,
    default: 70
  },
  // Moderation actions history
  moderationActions: [{
    moderator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      enum: ['approve', 'reject', 'flag', 'remove', 'warn', 'suspend_user'],
      required: true
    },
    contentType: {
      type: String,
      enum: ['post', 'comment', 'blog', 'resume'],
      required: true
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    reason: String,
    notes: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  // Automated moderation results
  autoModerationResults: [{
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    contentType: {
      type: String,
      enum: ['post', 'comment', 'blog', 'resume'],
      required: true
    },
    flaggedKeywords: [String],
    languageScore: Number,
    imageModerationResult: {
      isAppropriate: Boolean,
      confidence: Number,
      categories: [String]
    },
    action: {
      type: String,
      enum: ['flag', 'remove', 'approve', 'manual_review'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  // Moderation statistics
  stats: {
    totalModerated: {
      type: Number,
      default: 0
    },
    autoModerated: {
      type: Number,
      default: 0
    },
    manuallyModerated: {
      type: Number,
      default: 0
    },
    flaggedContent: {
      type: Number,
      default: 0
    },
    removedContent: {
      type: Number,
      default: 0
    },
    falsePositives: {
      type: Number,
      default: 0
    }
  },
  // Last updated
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
contentModerationSchema.index({ 'bannedKeywords.keyword': 1 });
contentModerationSchema.index({ 'moderationActions.timestamp': -1 });
contentModerationSchema.index({ 'autoModerationResults.timestamp': -1 });

// Method to add banned keyword
contentModerationSchema.methods.addBannedKeyword = function(keyword, severity, category, addedBy) {
  this.bannedKeywords.push({
    keyword: keyword.toLowerCase(),
    severity,
    category,
    addedBy
  });
  this.lastUpdated = new Date();
  this.updatedBy = addedBy;
  return this.save();
};

// Method to remove banned keyword
contentModerationSchema.methods.removeBannedKeyword = function(keyword) {
  this.bannedKeywords = this.bannedKeywords.filter(k => k.keyword !== keyword.toLowerCase());
  this.lastUpdated = new Date();
  return this.save();
};

// Method to check if content contains banned keywords
contentModerationSchema.methods.checkBannedKeywords = function(content) {
  const contentLower = content.toLowerCase();
  const foundKeywords = [];
  
  this.bannedKeywords.forEach(banned => {
    if (banned.isActive && contentLower.includes(banned.keyword)) {
      foundKeywords.push({
        keyword: banned.keyword,
        severity: banned.severity,
        category: banned.category
      });
    }
  });
  
  return foundKeywords;
};

// Method to update moderation statistics
contentModerationSchema.methods.updateStats = function(action, isAuto = false) {
  this.stats.totalModerated += 1;
  
  if (isAuto) {
    this.stats.autoModerated += 1;
  } else {
    this.stats.manuallyModerated += 1;
  }
  
  if (action === 'flag') {
    this.stats.flaggedContent += 1;
  } else if (action === 'remove') {
    this.stats.removedContent += 1;
  }
  
  this.lastUpdated = new Date();
  return this.save();
};

module.exports = mongoose.model("ContentModeration", contentModerationSchema);
