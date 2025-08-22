const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const User = require("../models/User");

// Get all users with pagination, sorting, and filtering
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "username",
      sortOrder = "asc",
      role = "",
      search = ""
    } = req.query;

    // Build query object
    const query = {};
    
    // Role filter
    if (role && role !== "all") {
      query.role = role;
    }
    
    // Search filter (search in username, email, sport, location)
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { sport: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);

    // Get users with pagination and sorting
    const users = await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-password") // Exclude password
      .lean(); // Convert to plain JavaScript objects for better performance

    res.json({
      users,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Change user role
router.patch("/users/:id/role", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ["athlete", "coach", "scout", "sponsor", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Prevent admin from changing their own role
    if (id === req.user.id && role !== "admin") {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Role updated successfully", user });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Failed to update user role" });
  }
});

// Verify/unverify user
router.patch("/users/:id/verify", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isVerified },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      message: `User ${isVerified ? 'verified' : 'unverified'} successfully`, 
      user 
    });
  } catch (error) {
    console.error("Error updating user verification:", error);
    res.status(500).json({ message: "Failed to update user verification" });
  }
});

// Suspend/unsuspend user
router.patch("/users/:id/suspend", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isSuspended, suspendedReason, suspendedUntil } = req.body;

    // Prevent admin from suspending themselves
    if (id === req.user.id) {
      return res.status(400).json({ message: "Cannot suspend yourself" });
    }

    const updateData = { isSuspended };
    
    if (isSuspended) {
      updateData.suspendedReason = suspendedReason || "Violation of platform rules";
      updateData.suspendedUntil = suspendedUntil || new Date(Date.now() + 24 * 60 * 60 * 1000); // Default 24 hours
    } else {
      updateData.suspendedReason = undefined;
      updateData.suspendedUntil = undefined;
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      message: `User ${isSuspended ? 'suspended' : 'unsuspended'} successfully`, 
      user 
    });
  } catch (error) {
    console.error("Error updating user suspension:", error);
    res.status(500).json({ message: "Failed to update user suspension" });
  }
});

// Edit user profile (limited fields)
router.patch("/users/:id/profile", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { sport, location, level, bio } = req.body;

    // Only allow editing non-sensitive fields
    const allowedUpdates = {};
    if (sport !== undefined) allowedUpdates.sport = sport;
    if (location !== undefined) allowedUpdates.location = location;
    if (level !== undefined) allowedUpdates.level = level;
    if (bio !== undefined) allowedUpdates.bio = bio;

    const user = await User.findByIdAndUpdate(
      id,
      allowedUpdates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User profile updated successfully", user });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Failed to update user profile" });
  }
});

// Get user statistics
router.get("/stats", verifyToken, isAdmin, async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
          verified: { $sum: { $cond: ["$isVerified", 1, 0] } },
          suspended: { $sum: { $cond: ["$isSuspended", 1, 0] } }
        }
      }
    ]);

    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const suspendedUsers = await User.countDocuments({ isSuspended: true });

    res.json({
      roleStats: stats,
      totalUsers,
      verifiedUsers,
      suspendedUsers,
      pendingUsers: totalUsers - verifiedUsers - suspendedUsers
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
});

// Bulk operations (for future use)
router.post("/users/bulk-verify", verifyToken, isAdmin, async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { isVerified: true }
    );

    res.json({ 
      message: `${result.modifiedCount} users verified successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error bulk verifying users:", error);
    res.status(500).json({ message: "Failed to bulk verify users" });
  }
});

module.exports = router;


