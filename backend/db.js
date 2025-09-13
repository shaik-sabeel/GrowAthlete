const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

mongoose
  .connect(process.env.MONGOURI, mongoOptions)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    // Seed default admin if not present
    seedDefaultAdmin().catch((e) => console.error("Admin seed error:", e.message));
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    console.error("Please make sure MongoDB is running on localhost:27017");
    console.error("You can start MongoDB with: mongod");
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


