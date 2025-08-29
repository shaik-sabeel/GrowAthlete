const mongoose = require("mongoose");

console.log("Testing MongoDB connection...");

mongoose
  .connect("mongodb://127.0.0.1:27017/growAthleteDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("✅ MongoDB connection successful!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("\nPossible solutions:");
    console.error("1. Make sure MongoDB is installed and running");
    console.error("2. Start MongoDB service: mongod");
    console.error("3. Check if MongoDB is running on port 27017");
    process.exit(1);
  });
