const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    link: {
        type: String,
        required: true,
    },
    category: {
        type: String,
    },
}, {
    timestamps: true,
});

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
