const mongoose = require("mongoose");

// mongoose.connect(`mongodb://127.0.0.1:27017/PhotographyProject`);
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  phone: String,
  profilePicture: String,
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
    enum: ["cricket","badminton","football", "basketball", "tennis", "swimming","volleyball", "athletics","hockey", "other"],
  },
  age: String,
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
