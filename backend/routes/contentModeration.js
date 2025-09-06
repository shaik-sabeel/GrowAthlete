const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const CommunityPost = require("../models/CommunityPost");
const BlogPost = require("../models/BlogPost");
const ContentModeration = require("../models/ContentModeration");
const User = require("../models/User");

// ===== COMMUNITY POST MODERATION =====

// Get all community posts for moderation
router.get("/community-posts", verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = "all",
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;

    const query = {};
    if (status !== "all") {
      query.status = status;
    }

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await CommunityPost.countDocuments(query);

    const posts = await CommunityPost.find(query)
      .populate("author", "username email role")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.json({
      posts,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error("Error fetching community posts:", error);
    res.status(500).json({ message: "Failed to fetch community posts" });
  }
});

// Moderate a community post
router.patch("/community-posts/:id/moderate", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason, notes } = req.body;

    const post = await CommunityPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let updateData = {
      status: action,
      moderationNotes: notes,
      moderatedBy: req.user.id,
      moderatedAt: new Date()
    };

    if (action === "rejected") {
      updateData.rejectionReason = reason;
    }

    const updatedPost = await CommunityPost.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("author", "username email role");

    // Log moderation action
    await logModerationAction(req.user.id, action, "post", id, reason, notes);

    res.json({
      message: `Post ${action} successfully`,
      post: updatedPost
    });
  } catch (error) {
    console.error("Error moderating post:", error);
    res.status(500).json({ message: "Failed to moderate post" });
  }
});

// Flag a community post
router.post("/community-posts/:id/flag", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, description } = req.body;

    const post = await CommunityPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already flagged this post
    const alreadyFlagged = post.flags.some(flag => 
      flag.reporter.toString() === req.user.id
    );

    if (alreadyFlagged) {
      return res.status(400).json({ message: "You have already flagged this post" });
    }

    post.flags.push({
      reporter: req.user.id,
      reason,
      description
    });

    // Auto-flag if threshold reached
    if (post.flags.length >= 3) {
      post.status = "flagged";
    }

    await post.save();

    res.json({ message: "Post flagged successfully" });
  } catch (error) {
    console.error("Error flagging post:", error);
    res.status(500).json({ message: "Failed to flag post" });
  }
});

// ===== BLOG POST MODERATION =====

// Get all blog posts for moderation
router.get("/blog-posts", verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = "all",
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;

    const query = {};
    if (status !== "all") {
      query.status = status;
    }

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await BlogPost.countDocuments(query);

    const posts = await BlogPost.find(query)
      .populate("author", "username email role")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.json({
      posts,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({ message: "Failed to fetch blog posts" });
  }
});

// Flag a blog post
router.post("/blog-posts/:id/flag", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, description } = req.body;

    const post = await BlogPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    post.flags.push({
      reporter: req.user.id,
      reason,
      description
    });

    await post.save();

    res.json({ message: "Blog post flagged successfully" });
  } catch (error) {
    console.error("Error flagging blog post:", error);
    res.status(500).json({ message: "Failed to flag blog post" });
  }
});

// Moderate a blog post
router.patch("/blog-posts/:id/moderate", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason, notes } = req.body;

    const post = await BlogPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    let updateData = {
      status: action,
      moderationNotes: notes,
      moderatedBy: req.user.id,
      moderatedAt: new Date()
    };

    if (action === "rejected") {
      updateData.rejectionReason = reason;
    } else if (action === "approved") {
      updateData.approvalDate = new Date();
    } else if (action === "published") {
      updateData.publishedAt = new Date();
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("author", "username email role");

    // Log moderation action
    await logModerationAction(req.user.id, action, "blog", id, reason, notes);

    res.json({
      message: `Blog post ${action} successfully`,
      post: updatedPost
    });
  } catch (error) {
    console.error("Error moderating blog post:", error);
    res.status(500).json({ message: "Failed to moderate blog post" });
  }
});



// ===== CONTENT FILTERING =====

// Get content moderation settings
router.get("/settings", verifyToken, isAdmin, async (req, res) => {
  try {
    let settings = await ContentModeration.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = new ContentModeration({
        updatedBy: req.user.id
      });
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    console.error("Error fetching moderation settings:", error);
    res.status(500).json({ message: "Failed to fetch moderation settings" });
  }
});

// Update content moderation settings
router.patch("/settings", verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      autoModerationEnabled,
      keywordFilteringEnabled,
      languageFilteringEnabled,
      imageModerationEnabled,
      autoFlagThreshold,
      autoRemoveThreshold,
      languageScoreThreshold
    } = req.body;

    let settings = await ContentModeration.findOne();
    
    if (!settings) {
      settings = new ContentModeration();
    }

    if (autoModerationEnabled !== undefined) settings.autoModerationEnabled = autoModerationEnabled;
    if (keywordFilteringEnabled !== undefined) settings.keywordFilteringEnabled = keywordFilteringEnabled;
    if (languageFilteringEnabled !== undefined) settings.languageFilteringEnabled = languageFilteringEnabled;
    if (imageModerationEnabled !== undefined) settings.imageModerationEnabled = imageModerationEnabled;
    if (autoFlagThreshold !== undefined) settings.autoFlagThreshold = autoFlagThreshold;
    if (autoRemoveThreshold !== undefined) settings.autoRemoveThreshold = autoRemoveThreshold;
    if (languageScoreThreshold !== undefined) settings.languageScoreThreshold = languageScoreThreshold;

    settings.lastUpdated = new Date();
    settings.updatedBy = req.user.id;

    await settings.save();

    res.json({
      message: "Moderation settings updated successfully",
      settings
    });
  } catch (error) {
    console.error("Error updating moderation settings:", error);
    res.status(500).json({ message: "Failed to update moderation settings" });
  }
});

// Add banned keyword
router.post("/banned-keywords", verifyToken, isAdmin, async (req, res) => {
  try {
    const { keyword, severity, category } = req.body;

    let settings = await ContentModeration.findOne();
    if (!settings) {
      settings = new ContentModeration();
    }

    await settings.addBannedKeyword(keyword, severity, category, req.user.id);

    res.json({
      message: "Banned keyword added successfully",
      settings
    });
  } catch (error) {
    console.error("Error adding banned keyword:", error);
    res.status(500).json({ message: "Failed to add banned keyword" });
  }
});

// Remove banned keyword
router.delete("/banned-keywords/:keyword", verifyToken, isAdmin, async (req, res) => {
  try {
    const { keyword } = req.params;

    let settings = await ContentModeration.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Moderation settings not found" });
    }

    await settings.removeBannedKeyword(keyword);

    res.json({
      message: "Banned keyword removed successfully",
      settings
    });
  } catch (error) {
    console.error("Error removing banned keyword:", error);
    res.status(500).json({ message: "Failed to remove banned keyword" });
  }
});

// Get moderation statistics
router.get("/stats", verifyToken, isAdmin, async (req, res) => {
  try {
    const settings = await ContentModeration.findOne();
    
    if (!settings) {
      return res.json({
        stats: {
          totalModerated: 0,
          autoModerated: 0,
          manuallyModerated: 0,
          flaggedContent: 0,
          removedContent: 0,
          falsePositives: 0
        }
      });
    }

    res.json({ stats: settings.stats });
  } catch (error) {
    console.error("Error fetching moderation stats:", error);
    res.status(500).json({ message: "Failed to fetch moderation statistics" });
  }
});

// ===== HELPER FUNCTIONS =====

async function logModerationAction(moderatorId, action, contentType, contentId, reason, notes) {
  try {
    let settings = await ContentModeration.findOne();
    if (!settings) {
      settings = new ContentModeration();
    }

    settings.moderationActions.push({
      moderator: moderatorId,
      action,
      contentType,
      contentId,
      reason,
      notes
    });

    await settings.updateStats(action, false);
  } catch (error) {
    console.error("Error logging moderation action:", error);
  }
}

module.exports = router;
