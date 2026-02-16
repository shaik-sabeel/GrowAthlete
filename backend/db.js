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
const mongoUri = process.env.MONGOURI || process.env.MONGODB_URI;

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
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@growathlete.local';
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123';
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
  console.log(`👑 Default admin created/checked: ${adminEmail}`);
}
//...

