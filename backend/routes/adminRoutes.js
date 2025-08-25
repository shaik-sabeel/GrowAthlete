const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const User = require("../models/User");
const Event = require("../models/Event");
const SportsCategory = require("../models/SportsCategory");
const AdBanner = require("../models/AdBanner");
const { updateEventStatuses } = require("../utils/eventStatusUpdater");

// Configure multer storage for event images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/events"); // folder to save event images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage });

// Configure multer storage for ad images
const adsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/ads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadAds = multer({ 
  storage: adsStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only JPEG, PNG, WEBP images are allowed'));
  }
});

// ===== EXISTING USER MANAGEMENT ROUTES =====

// Get all users with pagination, sorting, and filtering
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "username",
      sortOrder = "asc",
      role = "",
      search = "",
      status = "all" // all, verified, unverified, suspended
    } = req.query;

    // Build query object
    const query = {};
    
    // Role filter
    if (role && role !== "all") {
      query.role = role;
    }

    // Status filter
    if (status === "verified") {
      query.isVerified = true;
    } else if (status === "unverified") {
      query.isVerified = false;
    } else if (status === "suspended") {
      query.isSuspended = true;
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

// Get single user details
router.get("/users/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
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
    const { sport, location, level, bio, achievements, phone, age, gender } = req.body;

    // Only allow editing non-sensitive fields
    const allowedUpdates = {};
    if (sport !== undefined) allowedUpdates.sport = sport;
    if (location !== undefined) allowedUpdates.location = location;
    if (level !== undefined) allowedUpdates.level = level;
    if (bio !== undefined) allowedUpdates.bio = bio;
    if (achievements !== undefined) allowedUpdates.achievements = achievements;
    if (phone !== undefined) allowedUpdates.phone = phone;
    if (age !== undefined) allowedUpdates.age = age;
    if (gender !== undefined) allowedUpdates.gender = gender;

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

// ===== SPORTS CATEGORY MANAGEMENT =====

// Get all sports categories
router.get("/sports-categories", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status = "all", featured } = req.query;
    
    let query = {};
    if (status !== "all") query.status = status;
    if (featured !== undefined) query.featured = featured === "true";

    const categories = await SportsCategory.find(query)
      .sort({ sortOrder: 1, name: 1 })
      .populate("createdBy", "username")
      .lean();

    res.json(categories);
  } catch (error) {
    console.error("Error fetching sports categories:", error);
    res.status(500).json({ message: "Failed to fetch sports categories" });
  }
});

// Create new sports category
router.post("/sports-categories", verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      icon,
      rules,
      equipment,
      skills,
      featured,
      sortOrder
    } = req.body;

    const newCategory = new SportsCategory({
      name,
      description,
      shortDescription,
      icon,
      rules: rules || [],
      equipment: equipment || [],
      skills: skills || [],
      featured: featured || false,
      sortOrder: sortOrder || 0,
      createdBy: req.user.id
    });

    await newCategory.save();
    
    res.status(201).json({
      message: "Sports category created successfully",
      category: newCategory
    });
  } catch (error) {
    console.error("Error creating sports category:", error);
    res.status(500).json({ message: "Failed to create sports category" });
  }
});

// Update sports category
router.patch("/sports-categories/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    updateData.updatedBy = req.user.id;

    const category = await SportsCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Sports category not found" });
    }

    res.json({
      message: "Sports category updated successfully",
      category
    });
  } catch (error) {
    console.error("Error updating sports category:", error);
    res.status(500).json({ message: "Failed to update sports category" });
  }
});

// Delete sports category
router.delete("/sports-categories/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category has events
    const eventCount = await Event.countDocuments({ sport: id });
    if (eventCount > 0) {
      return res.status(400).json({ 
        message: "Cannot delete category with existing events. Archive it instead." 
      });
    }

    const category = await SportsCategory.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Sports category not found" });
    }

    res.json({ message: "Sports category deleted successfully" });
  } catch (error) {
    console.error("Error deleting sports category:", error);
    res.status(500).json({ message: "Failed to delete sports category" });
  }
});

// ===== EVENT MANAGEMENT =====

// Create new event (admin)
router.post("/events", upload.single("image"), verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      date,
      time,
      location,
      sport,
      category,
      maxParticipants,
      price,
      currency,
      organizerName,
      organizerEmail,
      organizerPhone,
      tags,
      highlights,
      requirements,
      isOpen
    } = req.body;

    // Combine date and time
    const eventDateTime = new Date(`${date}T${time}`);

    const newEvent = new Event({
      title,
      description,
      shortDescription,
      date: eventDateTime,
      location,
      sport,
      category,
      maxParticipants: maxParticipants || undefined,
      price: price || 0,
      currency: currency || "USD",
      organizer: req.user.id, // Admin creating the event
      organizerName,
      organizerEmail,
      organizerPhone,
      tags: tags || [],
      highlights: highlights || [],
      requirements: requirements || [],
      status: isOpen ? "published" : "draft", // Set status based on toggle
      image: req.file ? `/uploads/events/${req.file.filename}` : null
    });

    await newEvent.save();
    
    res.status(201).json({
      message: "Event created successfully",
      event: newEvent
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Failed to create event" });
  }
});

// Get all events for admin management
router.get("/events", verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = "all",
      sport = "all",
      category = "all",
      sortBy = "date",
      sortOrder = "desc",
      search = "",
      showPastEvents = "false" // New parameter to control showing past events
    } = req.query;

    const query = {};
    
    if (status !== "all") query.status = status;
    if (sport !== "all") query.sport = sport;
    if (category !== "all") query.category = category;
    
    // Filter out past events unless explicitly requested
    if (showPastEvents !== "true") {
      query.date = { $gte: new Date() };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { organizerName: { $regex: search, $options: "i" } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Event.countDocuments(query);

    const events = await Event.find(query)
      .populate("organizer", "username email")
      .populate("approvedBy", "username")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.json({
      events,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// Get single event details
router.get("/events/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id)
      .populate("organizer", "username email role")
      .populate("approvedBy", "username")
      .populate("registrations.user", "username email role");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Failed to fetch event" });
  }
});

// Approve/reject event
router.patch("/events/:id/approve", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updateData = {
      status,
      approvalNotes: notes,
      approvedBy: req.user.id,
      approvedAt: new Date()
    };

    const event = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("organizer", "username email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      message: `Event ${status} successfully`,
      event
    });
  } catch (error) {
    console.error("Error updating event approval:", error);
    res.status(500).json({ message: "Failed to update event approval" });
  }
});

// Update event details
router.patch("/events/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const event = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("organizer", "username email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      message: "Event updated successfully",
      event
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Failed to update event" });
  }
});

// Delete event
router.delete("/events/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Failed to delete event" });
  }
});

// Update event statuses (mark past events as completed)
router.post("/events/update-statuses", verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedCount = await updateEventStatuses();
    res.json({ 
      message: `Updated ${updatedCount} events to completed status`,
      updatedCount 
    });
  } catch (error) {
    console.error("Error updating event statuses:", error);
    res.status(500).json({ message: "Failed to update event statuses" });
  }
});

// ===== EVENT ANALYTICS =====

// Get event analytics
router.get("/events/:id/analytics", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate("registrations.user", "username email role");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Calculate analytics
    const totalRegistrations = event.registrations.length;
    const attendedCount = event.registrations.filter(reg => reg.status === "attended").length;
    const cancelledCount = event.registrations.filter(reg => reg.status === "cancelled").length;
    const noShowCount = event.registrations.filter(reg => reg.status === "no-show").length;
    const pendingCount = event.registrations.filter(reg => reg.status === "registered").length;

    const registrationRate = event.maxParticipants ? 
      Math.round((totalRegistrations / event.maxParticipants) * 100) : 0;
    
    const attendanceRate = totalRegistrations > 0 ? 
      Math.round((attendedCount / totalRegistrations) * 100) : 0;

    // Registration trends (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentRegistrations = event.registrations.filter(
      reg => new Date(reg.registeredAt) >= sevenDaysAgo
    ).length;

    const analytics = {
      eventId: event._id,
      eventTitle: event.title,
      totalRegistrations,
      maxParticipants: event.maxParticipants,
      registrationRate,
      attendanceRate,
      statusBreakdown: {
        attended: attendedCount,
        cancelled: cancelledCount,
        noShow: noShowCount,
        pending: pendingCount
      },
      recentRegistrations,
      views: event.views,
      shares: event.shares,
      daysUntilEvent: event.daysUntilEvent
    };

    res.json(analytics);
  } catch (error) {
    console.error("Error fetching event analytics:", error);
    res.status(500).json({ message: "Failed to fetch event analytics" });
  }
});

// Get overall event statistics
router.get("/events/stats/overview", verifyToken, isAdmin, async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const pendingEvents = await Event.countDocuments({ status: "pending" });
    const approvedEvents = await Event.countDocuments({ status: "approved" });
    const publishedEvents = await Event.countDocuments({ status: "published" });
    const completedEvents = await Event.countDocuments({ status: "completed" });

    // Events by sport
    const eventsBySport = await Event.aggregate([
      { $group: { _id: "$sport", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Events by category
    const eventsByCategory = await Event.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Upcoming events (next 30 days)
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const upcomingEvents = await Event.countDocuments({
      date: { $gte: new Date(), $lte: thirtyDaysFromNow },
      status: { $in: ["approved", "published"] }
    });

    // Total registrations across all events
    const totalRegistrations = await Event.aggregate([
      { $group: { _id: null, total: { $sum: "$currentParticipants" } } }
    ]);

    const stats = {
      totalEvents,
      pendingEvents,
      approvedEvents,
      publishedEvents,
      completedEvents,
      upcomingEvents,
      totalRegistrations: totalRegistrations[0]?.total || 0,
      eventsBySport,
      eventsByCategory
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching event statistics:", error);
    res.status(500).json({ message: "Failed to fetch event statistics" });
  }
});

// ===== USER STATISTICS =====

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
    const pendingUsers = totalUsers - verifiedUsers - suspendedUsers;

    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get users by sport
    const sportStats = await User.aggregate([
      { $match: { sport: { $exists: true, $ne: null } } },
      { $group: { _id: "$sport", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get users by level
    const levelStats = await User.aggregate([
      { $match: { level: { $exists: true, $ne: null } } },
      { $group: { _id: "$level", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      roleStats: stats,
      totalUsers,
      verifiedUsers,
      suspendedUsers,
      pendingUsers,
      recentRegistrations,
      sportStats,
      levelStats
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
});

// ===== BULK OPERATIONS =====

// Bulk operations
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

// Bulk role change
router.post("/users/bulk-role", verifyToken, isAdmin, async (req, res) => {
  try {
    const { userIds, role } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    if (!role || !["athlete", "coach", "scout", "sponsor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Prevent changing admin roles
    const result = await User.updateMany(
      { _id: { $in: userIds }, role: { $ne: "admin" } },
      { role }
    );

    res.json({ 
      message: `${result.modifiedCount} users role changed to ${role} successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error bulk changing user roles:", error);
    res.status(500).json({ message: "Failed to bulk change user roles" });
  }
});

// Bulk suspend/unsuspend
router.post("/users/bulk-suspend", verifyToken, isAdmin, async (req, res) => {
  try {
    const { userIds, isSuspended, suspendedReason } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    const updateData = { isSuspended };
    if (isSuspended && suspendedReason) {
      updateData.suspendedReason = suspendedReason;
      updateData.suspendedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    const result = await User.updateMany(
      { _id: { $in: userIds }, _id: { $ne: req.user.id } }, // Prevent suspending self
      updateData
    );

    res.json({ 
      message: `${result.modifiedCount} users ${isSuspended ? 'suspended' : 'unsuspended'} successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error bulk suspending users:", error);
    res.status(500).json({ message: "Failed to bulk suspend users" });
  }
});

// ===== EXPORT FUNCTIONALITY =====

// Export users data (CSV format)
router.get("/users/export", verifyToken, isAdmin, async (req, res) => {
  try {
    const { role, status } = req.query;
    
    let query = {};
    if (role && role !== "all") query.role = role;
    if (status === "verified") query.isVerified = true;
    else if (status === "unverified") query.isVerified = false;
    else if (status === "suspended") query.isSuspended = true;

    const users = await User.find(query)
      .select("username email role sport location level isVerified isSuspended createdAt")
      .lean();

    // Convert to CSV format
    const csvHeader = "Username,Email,Role,Sport,Location,Level,Verified,Suspended,Created At\n";
    const csvRows = users.map(user => 
      `"${user.username}","${user.email}","${user.role}","${user.sport || ''}","${user.location || ''}","${user.level || ''}","${user.isVerified}","${user.isSuspended}","${user.createdAt}"`
    ).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users-export.csv');
    res.send(csv);
  } catch (error) {
    console.error("Error exporting users:", error);
    res.status(500).json({ message: "Failed to export users" });
  }
});

// ===== AD BANNERS MANAGEMENT =====

// Create new ad banner (with image upload)
router.post("/ads", uploadAds.single("image"), verifyToken, isAdmin, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const { title = "", linkUrl = "", active = true, sortOrder = 0 } = req.body;

    const ad = await AdBanner.create({
      title,
      linkUrl,
      active: active === "false" ? false : true,
      sortOrder: Number(sortOrder) || 0,
      image: `/uploads/ads/${req.file.filename}`,
      createdBy: req.user.id
    });

    res.status(201).json({ message: "Ad created", ad });
  } catch (error) {
    console.error("Error creating ad:", error);
    const msg = error?.message?.includes('Only JPEG') ? error.message : "Failed to create ad";
    res.status(400).json({ message: msg });
  }
});

// List ads
router.get("/ads", verifyToken, isAdmin, async (req, res) => {
  try {
    const ads = await AdBanner.find({}).sort({ sortOrder: 1, createdAt: -1 });
    res.json(ads);
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({ message: "Failed to fetch ads" });
  }
});

// Update ad
router.patch("/ads/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    if (typeof update.active !== 'undefined') {
      update.active = update.active === true || update.active === 'true';
    }
    if (typeof update.sortOrder !== 'undefined') {
      update.sortOrder = Number(update.sortOrder) || 0;
    }
    const ad = await AdBanner.findByIdAndUpdate(id, update, { new: true });
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    res.json({ message: "Ad updated", ad });
  } catch (error) {
    console.error("Error updating ad:", error);
    res.status(500).json({ message: "Failed to update ad" });
  }
});

// Delete ad
router.delete("/ads/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await AdBanner.findByIdAndDelete(id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    res.json({ message: "Ad deleted" });
  } catch (error) {
    console.error("Error deleting ad:", error);
    res.status(500).json({ message: "Failed to delete ad" });
  }
});

module.exports = router;


