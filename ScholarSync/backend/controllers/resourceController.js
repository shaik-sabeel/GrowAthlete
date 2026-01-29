const Resource = require('../models/Resource');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private
const getResources = async (req, res) => {
    try {
        const resources = await Resource.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a resource
// @route   POST /api/resources
// @access  Private
const createResource = async (req, res) => {
    const { title, description, link, category } = req.body;

    if (!title || !link) {
        res.status(400);
        throw new Error('Please add a title and link');
    }

    try {
        const resource = await Resource.create({
            user: req.user._id,
            title,
            description,
            link,
            category,
        });
        res.status(201).json(resource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private
const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            res.status(404);
            throw new Error('Resource not found');
        }

        if (resource.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await resource.deleteOne();

        res.json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getResources,
    createResource,
    deleteResource,
};
