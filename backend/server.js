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

// --- CORS CONFIG ---
const defaultAllowedOrigins = [
  "https://www.growathlete.tech",
  "https://growathlete.tech",
  "http://localhost:5173",
];

// Support comma-separated env var like: https://foo.com,https://bar.com
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
// Explicitly respond to preflight
app.options('*', cors(corsOptions));

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
  console.log(`✅ Allowed CORS origins: ${allowedOrigins.join(', ')}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
  process.exit(1);
});

//comment 