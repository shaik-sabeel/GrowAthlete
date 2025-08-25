const express = require("express");
const router = express.Router();
const BlogPost = require("../models/BlogPost");
const slugify = require("slugify");

// Create new blog
router.post("/", async (req, res) => {
  try {
    const { title, content, summary, author, category } = req.body;
    const slug = slugify(title, { lower: true, strict: true });

    const blog = new BlogPost({
      title,
      slug,
      content,
      summary,
      author,     // Pass User _id from frontend or authentication middleware
      category
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create blog" });
  }
});

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await BlogPost.find().populate("author", "name email").sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

// Get single blog by slug
router.get("/:slug", async (req, res) => {
  try {
    const blog = await BlogPost.findOne({ slug: req.params.slug }).populate("author", "name email");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
});

module.exports = router;
