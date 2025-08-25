const mongoose = require('mongoose');

const platformAnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  audience: {
    type: String,
    enum: ['all', 'athletes', 'coaches', 'scouts', 'sponsors', 'admins'],
    default: 'all'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null // null means no end date
  },
  isSticky: {
    type: Boolean,
    default: false // sticky announcements stay at top
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

platformAnnouncementSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient querying
platformAnnouncementSchema.index({ isActive: 1, audience: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('PlatformAnnouncement', platformAnnouncementSchema);
