const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { verifyToken } = require("../middlewares/authMiddleware");
const sendWelcomeEmail = require("../utils/mailer"); 

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username,email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username,email, password: hashedPassword, role });
    await newUser.save();
    sendWelcomeEmail(newUser.email, newUser.username);

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      "yourSecretKey",
      { expiresIn: "1d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // change to true in production with HTTPS
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ 
        message: "User registered successfully",
        user: { id: newUser._id, username: newUser.username, role: newUser.role },
        token: token
      });
  } catch (err) {
    res.status(500).json("Server error");
    console.error("Error registering user:", err);
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Invalid credentials");

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      "yourSecretKey",
      { expiresIn: "1d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // change to true in production with HTTPS
        
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ 
        message: "Login successful",
        user: { id: user._id, username: user.username, role: user.role },
        token: token
      });
  } catch (err) {
    res.status(500).json("Server error");
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token").json("Logged out");
});


router.post("/update",  async (req, res) => {
  const {
    profilePicture, 
    username, 
    age, 
    gender, 
    location, 
    sport, 
    level, 
    bio, 
    achievements, 
    email, 
    phone,
    
  } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json("User not found");
    
    const updateData = {
      profilePicture,
      username,
      age,
      gender,
      location,
      sport,
      level,
      bio,
      achievements,
      email,
      phone,
     
    };
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    );
    console.log("Updated User:", updatedUser);
    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json("Server error");
  }
});

// Profile
router.get("/all-users", verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    console.log("Fetched Users:", users);
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json("Server error");
  }
});

router.get("/profile", verifyToken, async(req, res) => {
  // res.json({ user: req.user });
  const user = await User.findById(req.user.id, '-password')
  if (!user) return res.status(404).json("User not found");
  res.status(200).json({ user });
});

router.get("/profile/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;