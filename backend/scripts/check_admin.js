
const mongoose = require("mongoose");
const User = require("../models/User");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoUri = process.env.MONGOURI || process.env.MONGODB_URI;

if (!mongoUri) {
    console.error("No MongoDB URI found in environment variables.");
    process.exit(1);
}

mongoose
    .connect(mongoUri)
    .then(async () => {
        console.log("Connected to MongoDB.");
        try {
            const admins = await User.find({ role: "admin" }).select("username email");
            if (admins.length === 0) {
                console.log("No admin users found.");
            } else {
                console.log("Admin Users found:");
                admins.forEach(admin => {
                    console.log(`- Username: ${admin.username}, Email: ${admin.email}`);
                });
            }
        } catch (err) {
            console.error("Error querying admins:", err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch((err) => {
        console.error("Connection error:", err);
    });
