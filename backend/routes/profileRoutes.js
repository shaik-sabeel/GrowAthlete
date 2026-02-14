const express = require('express');
const router = express.Router();
const User = require('../models/User');
const CommunityPost = require('../models/CommunityPost');
const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/profile/my-profile
 * @desc    Get current user's profile data and their posts
 * @access  Private
 */
router.get('/my-profile', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user details (excluding password)
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch user's community posts (approved posts)
        const posts = await CommunityPost.find({
            author: userId
        })
            .populate('author', 'username profilePicture')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            user,
            posts
        });
    } catch (error) {
        console.error('Error fetching my profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

/**
 * @route   GET /api/profile/:id
 * @desc    Get a specific user's public profile and their posts
 * @access  Private (or Public if needed, for now Private)
 */
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const targetUserId = req.params.id;

        // Fetch user details
        const user = await User.findById(targetUserId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch user's approved community posts
        const posts = await CommunityPost.find({
            author: targetUserId,
            status: 'approved',
            isFlagged: false
        })
            .populate('author', 'username profilePicture')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            user,
            posts
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

/**
 * @route   PUT /api/profile/update
 * @desc    Update current user's profile
 * @access  Private
 */
router.put('/update', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const updateFields = req.body;

        // Remove sensitive or read-only fields if they exist in req.body
        delete updateFields.password;
        delete updateFields.role;
        delete updateFields.email; // Usually handled separately or via another route

        // If achievements is an array, stringify it before saving if needed
        // But since the model marks it as String, we should store it as JSON string
        if (updateFields.achievements && Array.isArray(updateFields.achievements)) {
            updateFields.achievements = JSON.stringify(updateFields.achievements);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
