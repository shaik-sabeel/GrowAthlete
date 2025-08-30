const mongoose = require('mongoose');

const trendingTopicSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  posts: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

trendingTopicSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('TrendingTopic', trendingTopicSchema);
