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
  summary:{ // This can act as the 'excerpt' for the card view
    type: String,
    maxlength: 500
  },
  image: { // New field for blog post image
    type: String, // Storing URL or path to the image
    default: "https://images.unsplash.com/photo-1549476462-df113d666d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8c3BvcnRzfHwxfHx8fDE3MDAwMDgwMjU&ixlib=rb-4.0.3&q=80&w=1080" // Default image
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Author should be required
  },
  category: {
    type: String,
    enum:['Cricket', 'Football','Basketball','Athletics','Swimming','Badminton','Kabaddi', 'Hockey','Nutrition','Psychology','Training'],
    required: true
  },
  tags: [String], // New field for tags (array of strings)
  readTime: { // New field for read time (in minutes)
    type: Number,
    default: 5 // Default read time if not calculated
  },
  isPremium: { // To distinguish premium content if needed
    type: Boolean,
    default: false
  },
  // Moderation fields
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'flagged', 'removed', 'published'],
    default: 'draft'
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
  timestamps: true // This will automatically add createdAt and updatedAt
});

module.exports = mongoose.model("BlogPost", blogPostSchema);