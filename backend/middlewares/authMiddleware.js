const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Check for token in Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) return res.status(401).json("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json("Invalid Token");
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json("Access Denied");
  next();
};

module.exports = { verifyToken, isAdmin };
