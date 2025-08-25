const express = require("express");
const multer = require("multer");
const path = require("path");
const Event = require("../models/Event");
const AdBanner = require("../models/AdBanner");

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/events"); // folder to save event images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage });

// Create Event
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      image: req.file ? `/uploads/events/${req.file.filename}` : null,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get All Events (only upcoming and ongoing events)
router.get("/", async (req, res) => {
  try {
    const currentDate = new Date();
    
    // Find events that are published and haven't ended yet
    const events = await Event.find({
      status: { $in: ["published", "approved"] },
      date: { $gte: currentDate } // Only show events with dates >= current date/time
    }).sort({ date: 1 });
    
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get Event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

// Public: Active ads for community page
router.get("/public/ads", async (req, res) => {
  try {
    const ads = await AdBanner.find({ active: true }).sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json(ads);
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({ error: "Server error" });
  }
});

