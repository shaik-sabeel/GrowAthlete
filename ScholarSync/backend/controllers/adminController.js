const User = require('../models/User');
const Task = require('../models/Task');
const Note = require('../models/Note');
const Project = require('../models/Project');
const Resource = require('../models/Resource');
const Announcement = require('../models/Announcement');

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const taskCount = await Task.countDocuments();
        const projectCount = await Project.countDocuments();
        const resourceCount = await Resource.countDocuments();

        res.json({
            users: userCount,
            tasks: taskCount,
            projects: projectCount,
            resources: resourceCount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getSystemStats,
    getAllUsers,
    deleteUser,
};
