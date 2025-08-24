    const express = require("express");
    const router = express.Router();
    const { verifyToken } = require("../middlewares/authMiddleware");
    const User = require("../models/User");

    router.patch("/update-level", verifyToken, async (req, res) => {
      const { level } = req.body;
      const userId = req.user.id; // From the JWT payload via verifyToken

      // Validate the incoming level
      const validLevels = ["Free", "Standard", "Premium"];
      if (!validLevels.includes(level)) {
        return res.status(400).json({ message: "Invalid membership level" });
      }

      try {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { membershipLevel: level },
          { new: true } // This option returns the updated document
        ).select("-password"); // Exclude password from the response

        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json({
          message: `Successfully updated membership to ${level}`,
          user: updatedUser,
        });
      } catch (error) {
        console.error("Error updating membership:", error);
        res.status(500).json({ message: "Server error while updating membership" });
      }
    });

    module.exports = router;