const mongoose = require("mongoose");

// mongoose.connect(`mongodb://127.0.0.1:27017/PhotographyProject`);
const userSchema = new mongoose.Schema({
  username:{
        type : String,
        required : true
    },
     email:{
        type : String,
        required : true,
        lowercase:true,
        unique : true
    },
    password:{
        type:String,
        required:true,
        minlength: 8,
        maxlength: 128,
        validate: {
          validator: function (value) {
            // Must contain: 1 lowercase, 1 uppercase, 1 digit, 1 special char
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/~`])[A-Za-z\d@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/~`]{8,128}$/.test(value);
          },
          message: "Password must be 8-128 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
        }
    },
  phone: {
    type: String,
    
  },
  profilePicture: {
    type: String,
   
  },
  role: {
    type: String,
    enum: ["athlete", "coach", "scout","sponsor", "admin"],
    default: "athlete",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  suspendedReason: {
    type: String,
  },
  suspendedUntil: {
    type: Date,
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
  achievements: String,
  // availability: {
  //   type: String,
  //   default: "Open to tryouts"
  // },
  // locationType: {
  //   type: String,
  //   default: "Remote/On-site"
  // },
  // nextEvent: {
  //   type: String,
  //   default: ""
  // },
  // aiBlurb: {
  //   type: String,
  //   default: ""
  // },
  // performanceDNA: {
  //   speed: { type: Number, default: 50 },
  //   endurance: { type: Number, default: 50 },
  //   agility: { type: Number, default: 50 },
  //   strength: { type: Number, default: 50 },
  //   skill: { type: Number, default: 50 }
  // }

});

module.exports = mongoose.model("User", userSchema);
