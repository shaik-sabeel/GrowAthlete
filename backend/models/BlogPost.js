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
  summary:{
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
    enum:['Cricket', 'Football','Basketball','Athletics','Swimming','Badminton','Kabaddi','Hockey','Nutrition','Psychology','Training'],
    required: true
  },
  
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
  
}, {
  timestamps: true
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
