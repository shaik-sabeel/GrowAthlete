const mongoose = require('mongoose');

const chatRoomMemberSchema = new mongoose.Schema({
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    joined_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true,
        required: true
    },
    is_banned: {
        type: Boolean,
        default: false,
        required: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Ensure a user can only be in a room once (uniqueness)
chatRoomMemberSchema.index({ room_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('ChatRoomMember', chatRoomMemberSchema);
