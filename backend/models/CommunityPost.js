const mongoose = require("mongoose");

const communityPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  media: [{
    url: {
      type: String,
      required: true
    },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'document'],
      default: 'image'
    }
  }],
  tags: [String],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reactions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['👍','❤️','😂','👏','🙌'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    replies: [{
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true,
        maxlength: 500
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    isFlagged: {
      type: Boolean,
      default: false
    },
    flaggedReason: String,
    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  // Moderation fields
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged', 'removed'],
    default: 'pending'
  },
  moderationNotes: String,
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,
  rejectionReason: String,
  flags: [{
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'harassment', 'fake_news', 'violence', 'other'],
      required: true
    },
    description: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isFlagged: {
    type: Boolean,
    default: false
  },
  flagCount: {
    type: Number,
    default: 0
  },
  // Content filtering
  containsInappropriateContent: {
    type: Boolean,
    default: false
  },
  inappropriateKeywords: [String],
  languageScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  }
}, {
  timestamps: true
});

// Indexes for better query performance
communityPostSchema.index({ status: 1, createdAt: -1 });
communityPostSchema.index({ author: 1, createdAt: -1 });
communityPostSchema.index({ isFlagged: 1, flagCount: -1 });
communityPostSchema.index({ 'flags.reason': 1 });

// Ensure virtuals are included when converting to JSON
communityPostSchema.set('toJSON', { virtuals: true });
communityPostSchema.set('toObject', { virtuals: true });

// Virtual for comment count
communityPostSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for like count
communityPostSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Pre-save middleware to update flag count
communityPostSchema.pre('save', function(next) {
  this.flagCount = this.flags.length;
  this.isFlagged = this.flagCount > 0;
  next();
});

module.exports = mongoose.model("CommunityPost", communityPostSchema);
//just checking if this works