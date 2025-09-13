const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoute");
const path = require("path");
const sportsResumeRoutes = require("./routes/sportsResume");
const adminRoutes = require("./routes/adminRoutes");
const contentModerationRoutes = require("./routes/contentModeration");
const eventRoutes = require("./routes/eventRoutes");
const blogRoutes = require("./routes/blogRoutes");
const communityPostRoutes = require("./routes/communityPostRoutes");

const app = express();
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(cors({
  origin: [
    "https://growathlete-frontend.onrender.com", // Your new frontend URL
    "https://growathlete-y2lc.onrender.com", // Previous frontend URL
    "https://growathlete.onrender.com", 
    "http://localhost:5173" // Local development
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser());

// connect to DB
require("./db");

app.use("/api/auth", authRoutes);
app.use("/api/contact",contactRoutes );
app.use("/api/sports-resume", sportsResumeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/moderation", contentModerationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/community", communityPostRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send('Route not found');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend should be running on http://localhost:5173`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
  process.exit(1);
});

//comment 