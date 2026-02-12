// routes/eventRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Event = require("../models/Event");
const AdBanner = require("../models/AdBanner");
const { enforceUploadConstraints } = require('../middlewares/upload');

const router = express.Router();

// Configure multer for memory storage (for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { uploadToCloudinary, isCloudinaryConfigured } = require('../utils/cloudStorage');

// Create Event - UPDATED TO INCLUDE REQUIRED FIELDS
router.post("/create", upload.single("image"), enforceUploadConstraints(), async (req, res) => {
  try {
    // Extract more fields based on your Event model schema
    const { title, description, date, endDate, location, sport, category, organizer, organizerName, organizerEmail } = req.body;

    // Basic validation
    if (!title || !description || !date || !location || !sport || !category || !organizerName || !organizerEmail) {
      return res.status(400).json({ error: "Missing required event fields" });
    }

    let imageUrl = null;
    if (req.file) {
      if (isCloudinaryConfigured()) {
        const result = await uploadToCloudinary(req.file, 'growathlete/events');
        imageUrl = result.url;
      } else {
        // Fallback logic if needed, or error. 
        // Since we switched to memoryStorage, 'req.file.filename' doesn't exist.
        // We would need the fallbackToLocal utility if we want to support local without Cloudinary keys.
        // For now, assuming Cloudinary is the goal. 
        const { fallbackToLocal } = require('../utils/cloudStorage');
        const localResult = fallbackToLocal(req.file, 'uploads/events/');
        imageUrl = localResult.url;
      }
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
      image: imageUrl,
      status: "approved" // Default to approved for immediate display in calendar/list
    });

    console.log("Creating Event with Image URL:", imageUrl); // VERIFICATION LOG

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