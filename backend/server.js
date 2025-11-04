const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const PlatformSettings = require("./models/PlatformSettings");
const maintenanceMiddleware = require('./middlewares/maintenance');

const app = express();

// Reduce header exposure
app.disable('x-powered-by');

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// --- CORS CONFIG: allow prod domains and localhost ---
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
    if (!origin) return callback(null, true); // Postman/curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Silent deny
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","X-Requested-With","Accept","Origin"],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// connect to DB
require("./db");

// Helper to safely mount routers with lazy require
function safeMount(pathMount, loader) {
  try {
    const router = loader();
    app.use(pathMount, router);
    console.log(`Mounted route at ${pathMount}`);
  } catch (e) {
    console.error(`Failed to mount route at ${pathMount}: ${e.message}`);
    throw e;
  }
}

// Mount routes safely (lazy require each)
safeMount("/api/auth", () => require("./routes/authRoutes"));
// central maintenance middleware using config.js
app.use(maintenanceMiddleware);
safeMount("/api/contact", () => require("./routes/contactRoute"));
safeMount("/api/sports-resume", () => require("./routes/sportsResume"));
safeMount("/api/admin", () => require("./routes/adminRoutes"));
safeMount("/api/moderation", () => require("./routes/contentModeration"));
safeMount("/api/events", () => require("./routes/eventRoutes"));
safeMount("/api/blog", () => require("./routes/blogRoutes"));
safeMount("/api/community", () => require("./routes/communityPostRoutes"));

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