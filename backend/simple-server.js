const express = require("express");
const cors = require("cors");

const app = express();

// Enable CORS
app.use(cors({
  origin: [
    "https://growathlete-2.onrender.com",
    "https://growathlete-frontend.onrender.com",
    "https://growathlete-y2lc.onrender.com",
    "https://growathlete.onrender.com", 
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Simple test routes
app.get("/", (req, res) => {
  res.json({ 
    message: "GrowAthlete Backend API is running!", 
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

app.get("/test", (req, res) => {
  res.json({ 
    message: "Test route working!", 
    timestamp: new Date().toISOString()
  });
});

// Mock auth routes for testing
app.post("/api/auth/check-password-strength", (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required"
    });
  }

  // Simple password validation
  const errors = [];
  if (password.length < 8) errors.push("Password must be at least 8 characters long");
  if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("Password must contain at least one special character");

  const strength = Math.max(0, 100 - (errors.length * 20));

  res.json({
    success: true,
    isValid: errors.length === 0,
    errors: errors,
    warnings: [],
    strength: strength,
    strengthLevel: strength >= 80 ? "Strong" : strength >= 60 ? "Medium" : "Weak"
  });
});

app.post("/api/auth/register", (req, res) => {
  const { username, email, password } = req.body;
  
  // Simple validation
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Username, email, and password are required"
    });
  }

  // Mock successful registration
  res.json({
    success: true,
    message: "User registered successfully (mock)",
    user: { id: "mock-id", username, email, role: "athlete" },
    token: "mock-token"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
  process.exit(1);
});
