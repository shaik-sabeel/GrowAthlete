const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

// Connect to MongoDB (supports MONGOURI or MONGODB_URI)
mongoose.connect(process.env.MONGOURI || process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new User({
      username: "admin",
      email: "admin@growathlete.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      sport: "other",
      level: "advanced"
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@growathlete.com");
    console.log("🔑 Password: admin123");
    console.log("👤 Role: admin");
    
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    mongoose.connection.close();
  }
}

createAdminUser();
