const mongoose = require('mongoose');

const roomRuleAcceptanceLogSchema = new mongoose.Schema({
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
    accepted_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    is_agreed: {
        type: Boolean,
        required: true,
        default: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('RoomRuleAcceptanceLog', roomRuleAcceptanceLogSchema);
