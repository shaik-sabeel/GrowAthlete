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
    // Silent deny without exposing reason
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