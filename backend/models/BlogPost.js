const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 500
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tags: [String],
  image: {
    type: String,
    required: true
  },
  // Moderation fields
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'published', 'archived'],
    default: 'draft'
  },
  moderationNotes: String,
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,
  rejectionReason: String,
  approvalDate: Date,
  publishedAt: Date,
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
  },
  // SEO and metadata
  metaDescription: String,
  metaKeywords: [String],
  // Engagement metrics
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isApproved: {
      type: Boolean,
      default: false
    },
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
  // Flags for inappropriate content
  flags: [{
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: {
      type: String,
      enum: ['inappropriate', 'fake_news', 'plagiarism', 'spam', 'other'],
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
  }
}, {
  timestamps: true
});

// Indexes for better query performance
blogPostSchema.index({ status: 1, createdAt: -1 });
blogPostSchema.index({ author: 1, createdAt: -1 });
blogPostSchema.index({ category: 1, status: 1 });
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ isFlagged: 1, flagCount: -1 });

// Virtual for comment count
blogPostSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for like count
blogPostSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Pre-save middleware to update flag count and generate slug
blogPostSchema.pre('save', function(next) {
  this.flagCount = this.flags.length;
  this.isFlagged = this.flagCount > 0;
  
  // Generate slug if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  next();
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
