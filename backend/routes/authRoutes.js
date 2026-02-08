const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { verifyToken } = require("../middlewares/authMiddleware");
const { enforceRegistrationRules, enforceAdmin2FA } = require('../middlewares/auth');
const { sendWelcomeEmail } = require("../utils/mailer");
const passwordValidator = require("../utils/passwordValidator");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
        field: "email"
      });
    }

    // Validate password strength
    const passwordValidation = passwordValidator.validatePassword(password);

    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Password does not meet requirements",
        field: "password",
        errors: passwordValidation.errors,
        warnings: passwordValidation.warnings,
        strength: passwordValidation.strength
      });
    }

    // Check if password contains username or email
    const lowerPassword = password.toLowerCase();
    const lowerUsername = username.toLowerCase();
    const lowerEmail = email.toLowerCase();

    if (lowerPassword.includes(lowerUsername) || lowerPassword.includes(lowerEmail.split('@')[0])) {
      return res.status(400).json({
        success: false,
        message: "Password cannot contain your username or email",
        field: "password"
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds for better security
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(newUser.email, newUser.username);
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
      // Don't fail registration if email fails
    }

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET || 'fallback-secret-for-development-only',
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
        success: true,
        message: "User registered successfully",
        user: { id: newUser._id, username: newUser.username, role: newUser.role },
        token: token,
        passwordStrength: {
          score: passwordValidation.strength,
          level: passwordValidator.getStrengthLevel(passwordValidation.strength)
        }
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
    const t0 = Date.now();
    if (!email || !password) {
      return res.status(400).json("Email and password are required");
    }

    // Step 1: fetch user by email
    const user = await User.findOne({ email });
    const t1 = Date.now();
    if (!user) return res.status(400).json("Invalid credentials");

    // Step 2: compare password
    const isMatch = await bcrypt.compare(password, user.password);
    const t2 = Date.now();
    if (!isMatch) return res.status(400).json("Invalid credentials");

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret-for-development-only',
      { expiresIn: "1d" }
    );

    // enforce admin 2FA if required
    req.user = user;
    // Run middleware; if it sends a 401 response, stop processing to avoid hanging
    enforceAdmin2FA()(req, res, () => {});
    const t3 = Date.now();
    if (res.headersSent) {
      console.log(`Login timing: query=${t1 - t0}ms, bcrypt=${t2 - t1}ms, twoFA=${t3 - t2}ms`);
      return; // 2FA middleware already responded
    }

    res
      .cookie("token", token, {
        httpOnly: true,
<<<<<<< HEAD
        secure: true, // change to true in production with HTTPS

=======
        secure: process.env.NODE_ENV === 'production', // only secure in production/HTTPS
        
>>>>>>> 9510f0b43109953ca3e3441cf7c40ca821f9c171
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
        user: { id: user._id, username: user.username, role: user.role },
        token: token
      });
    const t4 = Date.now();
    console.log(`Login timing: query=${t1 - t0}ms, bcrypt=${t2 - t1}ms, twoFA=${t3 - t2}ms, total=${t4 - t0}ms`);
  } catch (err) {
    res.status(500).json("Server error");
  }
});

// Check password strength (for real-time validation)
router.post("/check-password-strength", (req, res) => {
  const { password, username, email } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required"
    });
  }

  const passwordValidation = passwordValidator.validatePassword(password);

  // Check if password contains username or email
  let additionalErrors = [];
  if (username) {
    const lowerPassword = password.toLowerCase();
    const lowerUsername = username.toLowerCase();
    if (lowerPassword.includes(lowerUsername)) {
      additionalErrors.push("Password cannot contain your username");
    }
  }

  if (email) {
    const lowerPassword = password.toLowerCase();
    const lowerEmail = email.toLowerCase();
    if (lowerPassword.includes(lowerEmail.split('@')[0])) {
      additionalErrors.push("Password cannot contain your email");
    }
  }

  res.json({
    success: true,
    isValid: passwordValidation.isValid && additionalErrors.length === 0,
    errors: [...passwordValidation.errors, ...additionalErrors],
    warnings: passwordValidation.warnings,
    strength: passwordValidation.strength,
    strengthLevel: passwordValidator.getStrengthLevel(passwordValidation.strength)
  });
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token").json("Logged out");
});


router.post("/update", verifyToken, async (req, res) => {
  try {
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
      phone
    } = req.body;

    // Validate user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare update data
    const updateData = {};

    // Only update fields that are provided and not empty
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    if (username !== undefined && username.trim()) updateData.username = username.trim();
    if (age !== undefined) updateData.age = age;
    if (gender !== undefined) updateData.gender = gender;
    if (location !== undefined) updateData.location = location;
    if (sport !== undefined) updateData.sport = sport;
    if (level !== undefined) updateData.level = level;
    if (bio !== undefined) updateData.bio = bio;
    if (achievements !== undefined) updateData.achievements = achievements;
    if (phone !== undefined) updateData.phone = phone;

    // Handle email update separately (check for duplicates)
    if (email !== undefined && email !== user.email) {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
      updateData.email = email;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password'); // Don't return password

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updated User:", updatedUser);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error("Error updating profile:", err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(err.errors).map(e => e.message)
      });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
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

router.get("/profile", verifyToken, async (req, res) => {
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