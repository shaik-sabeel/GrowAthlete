const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const { verifyToken } = require("../middlewares/authMiddleware");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,     
    pass: process.env.EMAIL_PASS,        
  },
});

// Endpoint to handle contact form submissions
router.post("/", async (req, res) => {
  const { firstName, lastName, email, message } = req.body;
  const name = `${firstName} ${lastName}`;
  console.log("Received contact form submission:", req.body);

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Message from ${name}`,
      text: `
        You received a new message from your website GrowAthlete:

        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      replyTo: email,  
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});


module.exports = router;