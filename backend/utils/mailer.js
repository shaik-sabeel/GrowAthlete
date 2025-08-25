// utils/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (toEmail, name) => {
  try {
    await transporter.sendMail({
      from: `"MyApp" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "🎉 Welcome to MyApp!",
      html: `<h3>Hi ${name},</h3><p>Thanks for registering! Welcome aboard 🎉</p>`,
    });
    console.log("✅ Welcome email sent to", toEmail);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

module.exports = sendWelcomeEmail;
