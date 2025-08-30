const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

mongoose
  .connect("mongodb://127.0.0.1:27017/growAthleteDB", mongoOptions)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    // Seed default admin if not present
    seedDefaultAdmin().catch((e) => console.error("Admin seed error:", e.message));
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    console.error("Please make sure MongoDB is running on localhost:27017");
    console.error("You can start MongoDB with: mongod");
    process.exit(1); // Exit the process if DB connection fails
  });


async function seedDefaultAdmin() {
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@growathlete.local";
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@12345";
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


