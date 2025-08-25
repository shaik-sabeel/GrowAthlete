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
const communityPostRoutes = require("./routes/communityPostRoutes");

const app = express();
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
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
app.use("/api/community", communityPostRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

//comment