const express = require("express");
const multer = require("multer");
const path = require("path");
const SportsBlog = require("../models/SportsBlog");


const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, "resume" + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST route: create a new sports resume
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const {
      title,
      summary,
      category,
      tags,
      content,
      status,
      visibility
    } = req.body;

    const newBlogPost = new SportsBlog({
      title,
      summary,
      category,
      tags,
      content,
      status,
      visibility,
      photo: req.file ? req.file.filename : null,
    });

    await newBlogPost.save();

    res.status(201).json({ message: "Blog post saved successfully", blogPost: newBlogPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving blog post", error });
  }
});


// GET the latest resume (since only one is stored)
router.get("/resData", async (req, res) => {
  try {
    const blog = await SportsBlog.findOne().sort({ createdAt: -1 }); // get latest one
    if (!blog) {
      return res.status(404).json({ message: "No blog post found" });
    }
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching blog post", error });
  }
});

router.delete("/resDel", async (req, res) => {
  try {
    // const deletedBlog = await SportsBlog.findByIdAndDelete(req.params.id);
    const deletedBlog = await SportsBlog.findOneAndDelete({}, { sort: { createdAt: -1 } });
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting blog post", error });
  }
});

module.exports = router;
