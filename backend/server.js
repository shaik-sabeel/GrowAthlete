console.log("--- DEBUG: Starting server.js ---");
const express = require("express");
console.log("DEBUG: express loaded");
const cors = require("cors");
console.log("DEBUG: cors loaded");
const cookieParser = require("cookie-parser");
console.log("DEBUG: cookieParser loaded");
const mongoose = require("mongoose");
console.log("DEBUG: mongoose loaded");
const helmet = require("helmet");
console.log("DEBUG: helmet loaded");
const rateLimit = require("express-rate-limit");
console.log("DEBUG: rateLimit loaded");
const authRoutes = require("./routes/authRoutes");
console.log("DEBUG: authRoutes loaded");
const contactRoutes = require("./routes/contactRoute");
console.log("DEBUG: contactRoutes loaded");
const path = require("path");
const sportsResumeRoutes = require("./routes/sportsResume");
console.log("DEBUG: sportsResume loaded");
const adminRoutes = require("./routes/adminRoutes");
console.log("DEBUG: adminRoutes loaded");
const contentModerationRoutes = require("./routes/contentModeration");
console.log("DEBUG: contentModerationRoutes loaded");
const eventRoutes = require("./routes/eventRoutes");
console.log("DEBUG: eventRoutes loaded");
const blogRoutes = require("./routes/blogRoutes");
console.log("DEBUG: blogRoutes loaded");
const communityPostRoutes = require("./routes/communityPostRoutes");
console.log("DEBUG: communityPostRoutes loaded");
const tournamentRoutes = require("./routes/tournamentRoutes");
console.log("DEBUG: tournamentRoutes loaded");
const profileRoutes = require("./routes/profileRoutes");
console.log("DEBUG: profileRoutes loaded");
const PlatformSettings = require("./models/PlatformSettings");
console.log("DEBUG: PlatformSettings loaded");
const maintenanceMiddleware = require('./middlewares/maintenance');
console.log("DEBUG: maintenanceMiddleware loaded");

const app = express();
console.log("--- DEBUG: Express initialized ---");

// Reduce header exposure
app.disable('x-powered-by');

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


const defaultAllowedOrigins = [
  "https://www.growathlete.tech",
  "https://growathlete.tech",
  "http://localhost:5173",
];

const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);



const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envOrigins])];

const corsOptions = {
  origin: function (origin, callback) {

    // Allow server-to-server, curl, Postman (no Origin header)
    if (!origin) return callback(null, true);

    // Allow matching origins from whitelist
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Allow all Vercel preview deployments if needed
    const vercelPreview = /https?:\/\/[^.]+\.vercel\.app$/.test(origin);
    if (vercelPreview) return callback(null, true);

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Apply CORS early
app.use(cors(corsOptions));
// Explicitly respond to preflight (use regex to avoid path-to-regexp '*' issue)
app.options(/.*/, cors(corsOptions));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting - simplified for production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased limit for production
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Rate limiting for auth routes - disabled for development/testing
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 20, // Increased from 5 to 20 for production
//   message: "Too many authentication attempts, please try again later."
// });
// app.use("/api/auth", authLimiter);

// Serve static files with fallback for missing files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"), {
  fallthrough: false
}));

// Handle missing static files gracefully
app.use("/uploads", (req, res, next) => {
  console.warn(`Missing static file: ${req.path}`);
  res.status(404).json({
    error: 'File not found',
    message: 'The requested file does not exist',
    path: req.path
  });
});

app.use(express.json());
app.use(cookieParser());

// Debug middleware for CORS issues
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Simple test route (before DB connection)
app.get("/test", (req, res) => {
  res.json({
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    origin: req.headers.origin
  });
});

// CORS test route
app.get("/cors-test", (req, res) => {
  res.json({
    message: "CORS is working!",
    origin: req.headers.origin,
    method: req.method,
    headers: req.headers
  });
});

// connect to DB
console.log("--- DEBUG: Require db.js ---");
require("./db");

// Helper to safely mount routers and log failures
function safeMount(pathMount, routerInstance) {
  try {
    app.use(pathMount, routerInstance);
    console.log(`Mounted route at ${pathMount}`);
  } catch (e) {
    console.error(`Failed to mount route at ${pathMount}: ${e.message}`);
    throw e;
  }
}

// Mount routes safely
safeMount("/api/auth", authRoutes);
// central maintenance middleware using config.js
app.use(maintenanceMiddleware);
safeMount("/api/contact", contactRoutes);
safeMount("/api/sports-resume", sportsResumeRoutes);
safeMount("/api/admin", adminRoutes);
safeMount("/api/moderation", contentModerationRoutes);
safeMount("/api/events", eventRoutes);
safeMount("/api/blog", blogRoutes);
safeMount("/api/community", communityPostRoutes);
safeMount("/api/tournaments", tournamentRoutes);
safeMount("/api/profile", profileRoutes);
const chatRoomRoutes = require("./routes/chatRoomRoutes");
safeMount("/api/chatrooms", chatRoomRoutes);

// Error handling middleware (generic message only)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Handle 404 errors (generic)
app.use((req, res) => {
  res.status(404).send('Not Found');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err.message);
});