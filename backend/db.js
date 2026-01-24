const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

// MongoDB connection options
const mongoOptions = {
  // Modern drivers ignore these flags; safe to keep for compatibility
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

// Allow either MONGOURI or MONGODB_URI (Render often uses MONGODB_URI)
let mongoUri = process.env.MONGOURI || process.env.MONGODB_URI;

// Ensure we use the growathlete database, not MongoDB's default "test"
const DB_NAME = "growathlete";
if (mongoUri) {
  const p = mongoUri.indexOf("?");
  const base = p >= 0 ? mongoUri.slice(0, p) : mongoUri;
  const qs = p >= 0 ? mongoUri.slice(p + 1) : "";
  const m = base.match(/\/([^/?#]*)\s*$/);
  const dbInUri = (m && m[1]) ? m[1].trim() : "";
  if (!dbInUri || dbInUri === "test") {
    const baseWithoutLast = base.replace(/\/[^/?#]*\s*$/, ""); // remove /test or trailing /
    mongoUri = baseWithoutLast + "/" + DB_NAME + (qs ? "?" + qs : "");
    console.log("Using database: " + DB_NAME + (dbInUri === "test" ? ' (replaced "test")' : " (was missing in URI)"));
  }
}

mongoose
  .connect(mongoUri, mongoOptions)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    // Seed default admin if not present
    seedDefaultAdmin().catch((e) => console.error("Admin seed error:", e.message));
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    if (!mongoUri) {
      console.error("Environment variable MONGOURI or MONGODB_URI is not set.");
    }
    console.error("Please verify your MongoDB connection string and availability.");
    console.error("Continuing without database connection for now...");
    // Don't exit the process - let the server start without DB for now
    // process.exit(1); // Exit the process if DB connection fails
  });


async function seedDefaultAdmin() {
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
  const exists = await User.findOne({ email: adminEmail });
  if (exists) return;
  const hashed = await bcrypt.hash(adminPassword, 10);
  await User.create({
    username: "Administrator",
    email: adminEmail,
    password: hashed,
    role: "admin",
    isVerified: true,
  });
  console.log(`👑 Default admin created: ${adminEmail}`);
}


