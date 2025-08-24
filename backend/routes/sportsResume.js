const express = require("express");
const multer = require("multer");
const path = require("path");
const SportsResume = require("../models/SportsResume");


const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, "resume" + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST route: create a new sports resume
router.post("/", upload.single("profileImage"), async (req, res) => {
  try {
    const {
      fullName,
    dateOfBirth, // Renamed from dob for clarity consistent with V2
    gender,
    nationality,
    email,
    phone,
    address, // Added from V2
    
    // Athletic Details
    primarySport, // Renamed from sport for clarity consistent with V2
    position,
    height,
    weight,
    dominantHand, // Renamed from dominantSide for clarity consistent with V2
    currentTeam,
    
    // Education (Added from V2)
    education,
    
    // Career Stats
    careerStats,
    
    // Achievements
    achievements,
    
    // Tournament History (Added from V2)
    tournaments,
    
    // Skills and Attributes
    skills,
    
    // Certifications (Added from V2)
    certifications,
    
    // Professional References (Added from V2)
    references,
    
    // Video Links (Added from V2)
    videoLinks,
    
    // Social Media Profiles (Added from V2)
    socialMedia,
    } = req.body;

    const newResume = new SportsResume({
      fullName,
      dateOfBirth,
      gender,
      nationality,
      email,
      phone,
      address,
      primarySport,
      position,
      height,
      weight,
      dominantHand,
      currentTeam,
      education,
      careerStats,
      tournaments: tournaments ? tournaments.split(",").map((t) => t.trim()) : [],
      certifications: certifications ? certifications.split(",").map((c) => c.trim()) : [],
      references: references ? references.split(",").map((s) => s.trim()) : [],
      videoLinks: videoLinks ? videoLinks.split(",").map((v) => v.trim()) : [],
      skills: skills ? skills.split(",").map((s) => s.trim()) : [],
      socialMedia: socialMedia ? socialMedia.split(",").map((s) => s.trim()) : [],
      achievements: achievements ? achievements.split(",").map((a) => a.trim()) : [],
      profileImage: req.file ? req.file.filename : null,
    });

    await newResume.save();

    res.status(201).json({ message: "Resume saved successfully", resume: newResume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving resume", error });
  }
});


// GET the latest resume (since only one is stored)
router.get("/resData", async (req, res) => {
  try {
    const resume = await SportsResume.findOne().sort({ createdAt: -1 }); // get latest one
    if (!resume) {
      return res.status(404).json({ message: "No resume found" });
    }
    res.json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching resume", error });
  }
});

router.delete("/resDel", async (req, res) => {
  try {
    // const deletedResume = await SportsResume.findByIdAndDelete(req.params.id);
    const deletedResume = await SportsResume.findOneAndDelete({}, { sort: { createdAt: -1 } });
    if (!deletedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting resume", error });
  }
});

module.exports = router;
