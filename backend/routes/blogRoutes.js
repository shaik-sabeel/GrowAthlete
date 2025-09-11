const express = require("express");
const router = express.Router();
const { enforceContentModeration } = require('../middlewares/moderation');
const BlogPost = require("../models/BlogPost");
const slugify = require("slugify");
// Assuming you have a User model for populating author details
const User = require("../models/User"); // Make sure to import your User model

// Helper function to estimate read time (simple word count based)
const calculateReadTime = (content) => {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Create new blog
router.post("/", enforceContentModeration(), async (req, res) => {
  try {
    // You should get author from an authenticated user's session/token
    // For now, we'll use a placeholder or assume a test user exists
    const placeholderAuthorId = '6544955b23d90f230f305c74'; // IMPORTANT: Replace with an actual User _id from your database

    const { title, content, summary, category, image, tags, isPremium } = req.body;
    const slug = slugify(title, { lower: true, strict: true });
    const readTime = calculateReadTime(content);

    // Check if the placeholder author exists (good practice for non-mocked author IDs)
    const authorExists = await User.findById(placeholderAuthorId);
    if (!authorExists) {
      console.warn("Placeholder author ID does not exist. Using the first user found or default.");
      // Fallback: Find any user or create a default one
      const anyUser = await User.findOne();
      if (anyUser) {
        author = anyUser._id;
      } else {
        return res.status(400).json({ message: "No author found and no placeholder exists." });
      }
    } else {
        author = placeholderAuthorId;
    }


    const blog = new BlogPost({
      title,
      slug,
      content,
      summary: summary || content.substring(0, 150) + "...", // Auto-generate summary if not provided
      image, // Image can be uploaded later or passed here
      author,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [], // Process comma-separated tags
      readTime,
      isPremium: isPremium || false,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ message: "Failed to create blog post." });
  }
});

// Get all blogs (for listing)
router.get("/", async (req, res) => {
  try {
    const blogs = await BlogPost.find()
                                .populate("author", "name email profilePicture") // Populate author's name, email, and profilePicture
                                .sort({ createdAt: -1 }); // Sort by newest first
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching all blog posts:", error);
    res.status(500).json({ message: "Failed to fetch blogs." });
  }
});

// Get single blog by slug (for detailed view)
router.get("/:slug", async (req, res) => {
  try {
    const blog = await BlogPost.findOne({ slug: req.params.slug })
                               .populate("author", "name email profilePicture"); // Populate author details
    if (!blog) return res.status(404).json({ message: "Blog post not found." });
    res.json(blog);
  } catch (error) {
    console.error("Error fetching single blog post:", error);
    res.status(500).json({ message: "Failed to fetch blog post." });
  }
});

// (Optional) Update blog post
router.put("/:slug", async (req, res) => {
    try {
        const { title, content, summary, category, image, tags, isPremium } = req.body;
        const slug = slugify(title, { lower: true, strict: true }); // New slug if title changes
        const readTime = calculateReadTime(content);

        const updatedBlog = await BlogPost.findOneAndUpdate(
            { slug: req.params.slug },
            {
                title,
                slug, // Update slug in case title changed
                content,
                summary,
                image,
                category,
                tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
                readTime,
                isPremium,
            },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        ).populate("author", "name email profilePicture");

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog post not found." });
        }
        res.json(updatedBlog);
    } catch (error) {
        console.error("Error updating blog post:", error);
        res.status(500).json({ message: "Failed to update blog post." });
    }
});

// (Optional) Delete blog post
router.delete("/:slug", async (req, res) => {
    try {
        const deletedBlog = await BlogPost.findOneAndDelete({ slug: req.params.slug });
        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog post not found." });
        }
        res.status(204).json({ message: "Blog post deleted successfully." }); // 204 No Content for successful deletion
    } catch (error) {
        console.error("Error deleting blog post:", error);
        res.status(500).json({ message: "Failed to delete blog post." });
    }
});


module.exports = router;