// middlewares/membershipMiddleware.js
const User = require('../models/User');

// This middleware checks if a user's membership is one of the allowed levels
const checkMembership = (allowedLevels) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (allowedLevels.includes(user.membershipLevel)) {
        next(); // User has the required level, proceed
      } else {
        res.status(403).json({ 
          message: 'Access Denied. This feature requires a higher membership level.' 
        });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error during membership check' });
    }
  };
};

module.exports = { checkMembership };


// // // In your routes/communityPostRoutes.js (hypothetical file)
// const { verifyToken } = require("../middlewares/authMiddleware");
// const { checkMembership } = require("../middlewares/membershipMiddleware");

// // Protect the "create post" route
// router.post(
//     "/create", 
//     verifyToken, 
//     checkMembership(["Standard", "Premium"]), // Only Standard and Premium users can pass
//     async (req, res) => {
//         // ... your logic to create a post ...
//     }
// );