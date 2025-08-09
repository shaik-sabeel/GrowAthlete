const mongoose = require("mongoose");

// mongoose.connect(`mongodb://127.0.0.1:27017/PhotographyProject`);
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  phone: Number,
  role: {
    type: String,
    enum: ["athlete", "coach", "scout","sponsor", "admin"],
    default: "athlete",
  },
  gender: {
    type: String,
    enum: ["male","female","other"],
  },
  sport: {
    type: String,
    enum: ["cricket","badminton","football", "basketball", "tennis", "swimming", "athletics","hockey", "other"],
  },
  age: {
    type: Number,
    min: 0,
  },
  location: {
    type: String,
  },
  level:{
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
  },
  bio : String,
  achievements: String

});

module.exports = mongoose.model("User", userSchema);
