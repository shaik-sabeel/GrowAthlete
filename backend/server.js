const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoute");
const path = require("path");
const sportsResumeRoutes = require("./routes/sportsResume");
const adminRoutes = require("./routes/adminRoutes");
const contentModerationRoutes = require("./routes/contentModeration");
const eventRoutes = require("./routes/eventRoutes");
const blogRoutes = require("./routes/blogRoutes");
const communityPostRoutes = require("./routes/communityPostRoutes");
const PlatformSettings = require("./models/PlatformSettings");
const maintenanceMiddleware = require('./middlewares/maintenance');

const app = express();

// Trust proxy for production deployment (Render, Heroku, etc.)
app.set('trust proxy', 1);

// Production optimizations
if (process.env.NODE_ENV === 'production') {
  // Disable X-Powered-By header for security
  app.disable('x-powered-by');
  
  // Set production-specific settings
  app.set('env', 'production');
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      connectSrc: ["'self'", "https://api.newscatcherapi.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for health checks
  skip: (req) => req.path === '/test' || req.path === '/',
  // Use X-Forwarded-For header when available (for proxy setups)
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});
app.use(limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  // Use X-Forwarded-For header when available (for proxy setups)
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});
app.use("/api/auth", authLimiter);

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

app.use(cors({
  origin: [
    "https://grow-athlete.vercel.app", // Your Vercel frontend URL
    "https://growathlete-2.onrender.com", // Previous frontend URL
    "https://growathlete-frontend.onrender.com", // Previous frontend URL
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

// Simple test route (before DB connection)
app.get("/test", (req, res) => {
  res.json({ 
    message: "Backend is working!", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// connect to DB
require("./db");

app.use("/api/auth", authRoutes);
// central maintenance middleware using config.js
app.use(maintenanceMiddleware);
app.use("/api/contact",contactRoutes );
app.use("/api/sports-resume", sportsResumeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/moderation", contentModerationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/community", communityPostRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "GrowAthlete Backend API is running!", 
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Additional health check for load balancers
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

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