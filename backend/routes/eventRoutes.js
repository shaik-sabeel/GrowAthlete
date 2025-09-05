// routes/eventRoutes.js
const express = require("express");
const multer = require("multer");
const path = require ("path");
const Event = require("../models/Event");
const AdBanner = require("../models/AdBanner"); // Already existing

const router = express.Router();

// Configure multer storage (no change)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/events"); // folder to save event images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage });

// Create Event - UPDATED TO INCLUDE REQUIRED FIELDS (sport, category, organizer, organizerName, organizerEmail, endDate)
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    // Extract more fields based on your Event model schema
    const { title, description, date, endDate, location, sport, category, organizer, organizerName, organizerEmail } = req.body;

    // Basic validation (you should add more robust validation in a real app)
    if (!title || !description || !date || !location || !sport || !category || !organizerName || !organizerEmail) {
      return res.status(400).json({ error: "Missing required event fields" });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      endDate: endDate || date, // Use endDate if provided, otherwise default to date
      location,
      sport,     // Required in schema
      category,  // Required in schema
      organizer: organizer || new mongoose.Types.ObjectId(), // Placeholder: In a real app, get from auth'd user
      organizerName, // Required in schema
      organizerEmail, // Required in schema
      image: req.file ? `/uploads/events/${req.file.filename}` : null,
      status: "approved" // Default to approved for immediate display in calendar/list
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    // More specific error handling if it's a validation error
    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// Get All Events (only upcoming and ongoing events) - no change
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

// Get Event by ID (no change)
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
// ... rest of eventRoutes (like /public/ads, if it's actually in this file)