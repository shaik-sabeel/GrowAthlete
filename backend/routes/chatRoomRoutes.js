const express = require('express');
const router = express.Router();
const ChatRoom = require('../models/ChatRoom');
const { verifyToken } = require('../middlewares/authMiddleware');

// Get all active chat rooms
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = { isActive: true };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        const rooms = await ChatRoom.find(query)
            .populate('createdBy', 'username profilePicture')
            .sort({ createdAt: -1 });

        res.json(rooms);
    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        res.status(500).json({ message: 'Failed to fetch chat rooms' });
    }
});

// Create a new chat room
router.post('/', verifyToken, async (req, res) => {
    try {
        const { name, description, category } = req.body;
        const createdBy = req.user.id;

        const existingRoom = await ChatRoom.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingRoom) {
            return res.status(400).json({ message: 'Room with this name already exists' });
        }

        const newRoom = new ChatRoom({
            name,
            description,
            category,
            createdBy,
            participants: [createdBy] // Creator automatically joins
        });

        await newRoom.save();

        // Populate creator info
        await newRoom.populate('createdBy', 'username profilePicture');

        res.status(201).json(newRoom);
    } catch (error) {
        console.error('Error creating chat room:', error);
        res.status(500).json({ message: 'Failed to create chat room' });
    }
});

// Join a chat room
router.post('/:id/join', verifyToken, async (req, res) => {
    try {
        const roomId = req.params.id;
        const userId = req.user.id;

        const room = await ChatRoom.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Chat room not found' });
        }

        if (!room.isActive) {
            return res.status(400).json({ message: 'This chat room is no longer active' });
        }

        // Check if already joined
        if (room.participants.includes(userId)) {
            return res.status(200).json({ message: 'Already joined', room });
        }

        room.participants.push(userId);
        await room.save();

        res.json({ message: 'Joined successfully', room });
    } catch (error) {
        console.error('Error joining chat room:', error);
        res.status(500).json({ message: 'Failed to join chat room' });
    }
});

// Leave a chat room
router.post('/:id/leave', verifyToken, async (req, res) => {
    try {
        const roomId = req.params.id;
        const userId = req.user.id;

        const room = await ChatRoom.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Chat room not found' });
        }

        // Check if joined
        const index = room.participants.indexOf(userId);
        if (index === -1) {
            return res.status(400).json({ message: 'Not a participant of this room' });
        }

        room.participants.splice(index, 1);
        await room.save();

        res.json({ message: 'Left successfully', room });
    } catch (error) {
        console.error('Error leaving chat room:', error);
        res.status(500).json({ message: 'Failed to leave chat room' });
    }
});

const Message = require('../models/Message');

// Get message history for a room
router.get('/:id/messages', async (req, res) => {
    try {
        const roomId = req.params.id;
        const messages = await Message.find({ room: roomId })
            .populate('sender', 'username profilePicture')
            .sort({ timestamp: 1 })
            .limit(100); // Limit to last 100 messages for now

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
});

module.exports = router;

