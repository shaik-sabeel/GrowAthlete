// import mongoose from "mongoose";
const mongoose = require("mongoose");
const sportsResumeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String },
  nationality: { type: String },
  email: { type: String, required: true },
  phone: { type: String },

  sport: { type: String },
  position: { type: String },
  height: { type: Number },
  weight: { type: Number },
  dominantSide: { type: String },
  currentTeam: { type: String },

  careerStats: { type: String },
  skills: [{ type: String }],       // stored as array
  achievements: [{ type: String }], // stored as array

  photo: { type: String }, // store uploaded image filename/path

  createdAt: { type: Date, default: Date.now }
});

// export default mongoose.model("SportsResume", sportsResumeSchema);
module.exports = mongoose.model("SportsResume", sportsResumeSchema);
