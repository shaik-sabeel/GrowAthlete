const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');

// Keep track of online users in rooms
// Structure: { roomId: { userId: Set([socketId1, socketId2]) } }
const roomUsers = {};

const setupChatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected to socket:', socket.id);

        socket.on('joinRoom', async ({ roomId, userId }) => {
            try {
                if (!roomId || !userId) return;

                socket.join(roomId);
                socket.roomId = roomId;
                socket.userId = userId;

                // Track online connections
                if (!roomUsers[roomId]) {
                    roomUsers[roomId] = {};
                }
                if (!roomUsers[roomId][userId]) {
                    roomUsers[roomId][userId] = new Set();
                }
                roomUsers[roomId][userId].add(socket.id);

                const onlineCount = Object.keys(roomUsers[roomId]).length;
                console.log(`User ${userId} joined room ${roomId}. Socket: ${socket.id}. Unique Users Online: ${onlineCount}`);

                // Notify everyone about the updated online count (for sidebar/list updates)
                io.emit('roomData', {
                    roomId,
                    onlineCount
                });
            } catch (error) {
                console.error('Error joining room:', error);
            }
        });

        socket.on('sendMessage', async ({ roomId, userId, content }) => {
            try {
                const newMessage = new Message({
                    room: roomId,
                    sender: userId,
                    content
                });
                await newMessage.save();

                const populatedMessage = await Message.findById(newMessage._id)
                    .populate('sender', 'username profilePicture');

                io.to(roomId).emit('message', populatedMessage);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        const handleLeaveRoom = (roomId, userId, socketId) => {
            if (roomId && roomUsers[roomId] && roomUsers[roomId][userId]) {
                roomUsers[roomId][userId].delete(socketId);

                if (roomUsers[roomId][userId].size === 0) {
                    delete roomUsers[roomId][userId];
                }

                const onlineCount = Object.keys(roomUsers[roomId]).length;
                console.log(`User ${userId} left room ${roomId} (Socket ${socketId}). Unique Users Online: ${onlineCount}`);

                io.emit('roomData', {
                    roomId,
                    onlineCount
                });

                if (Object.keys(roomUsers[roomId]).length === 0) {
                    delete roomUsers[roomId];
                }
            }
        };

        socket.on('leaveRoom', ({ roomId, userId }) => {
            socket.leave(roomId);
            handleLeaveRoom(roomId, userId, socket.id);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected from socket:', socket.id);
            if (socket.roomId && socket.userId) {
                handleLeaveRoom(socket.roomId, socket.userId, socket.id);
            }
        });
    });
};

module.exports = setupChatSocket;
