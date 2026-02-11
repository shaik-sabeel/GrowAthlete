const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['General', 'Running', 'Wellness', 'Football', 'Cricket', 'Basketball', 'Tennis', 'Swimming', 'Volleyball', 'Athletics', 'Hockey', 'Other'],
        default: 'General'
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual for participant count
chatRoomSchema.virtual('participantCount').get(function () {
    return this.participants.length;
});

chatRoomSchema.set('toJSON', { virtuals: true });
chatRoomSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
