const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const ChatMessage = require('../models/ChatMessage');
const ChatRoomMember = require('../models/ChatRoomMember');
const ChatRoom = require('../models/ChatRoom');
const xss = require('xss');

let io;

const initializeSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        },
        path: '/socket.io'
    });

    const chatNamespace = io.of('/chat');

    // Middleware for authentication
    chatNamespace.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        try {
            const secret = process.env.JWT_SECRET || 'fallback-secret-for-development-only';
            const decoded = jwt.verify(token, secret);
            socket.user = decoded; // { id: ..., role: ... }
            next();
        } catch (err) {
            console.error('Socket JWT Verify Error:', err.message);
            return next(new Error('Authentication error: Invalid token'));
        }
    });

    chatNamespace.on('connection', (socket) => {
        console.log(`User connected to chat: ${socket.user.id}`);

        // Join Room
        socket.on('joinRoom', async ({ roomId }) => {
            try {
                // Validate membership
                const membership = await ChatRoomMember.findOne({ room_id: roomId, user_id: socket.user.id, is_active: true, is_banned: false });

                if (!membership) {
                    return socket.emit('error', { message: 'You are not a member of this room' });
                }

                socket.join(roomId);
                console.log(`User ${socket.user.id} joined room ${roomId}`);
            } catch (error) {
                console.error('Join room error:', error);
                socket.emit('error', { message: 'Failed to join room' });
            }
        });

        // Send Message
        socket.on('sendMessage', async ({ roomId, content }) => {
            try {
                // sanitize content
                const sanitizedContent = xss(content);
                if (!sanitizedContent || sanitizedContent.trim().length === 0) {
                    return;
                }

                // Verify membership again
                const membership = await ChatRoomMember.findOne({ room_id: roomId, user_id: socket.user.id, is_active: true, is_banned: false });
                if (!membership) {
                    return socket.emit('error', { message: 'Not authorized to send messages to this room' });
                }

                // Persist message
                const newMessage = new ChatMessage({
                    room_id: roomId,
                    sender_user_id: socket.user.id,
                    content: sanitizedContent,
                    status: 'Sent'
                });
                await newMessage.save();

                // Broadcast
                const messagePayload = {
                    _id: newMessage._id,
                    senderId: socket.user.id,
                    content: newMessage.content,
                    timestamp: newMessage.createdAt,
                };

                chatNamespace.to(roomId).emit('message', messagePayload);
            } catch (error) {
                console.error('Send message error:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Leave Room
        socket.on('leaveRoom', ({ roomId }) => {
            socket.leave(roomId);
            console.log(`User ${socket.user.id} left room ${roomId}`);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { initializeSocket, getIO };
