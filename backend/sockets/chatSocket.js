const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');

const setupChatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected to chat:', socket.id);

        socket.on('joinRoom', async ({ roomId, userId }) => {
            try {
                socket.join(roomId);
                console.log(`User ${userId} joined room ${roomId}`);

                // Optional: Notify others in the room
                // socket.to(roomId).emit('userJoined', { userId });
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

                // Populate sender info for the frontend
                const populatedMessage = await Message.findById(newMessage._id)
                    .populate('sender', 'username profilePicture');

                io.to(roomId).emit('message', populatedMessage);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        socket.on('leaveRoom', ({ roomId, userId }) => {
            socket.leave(roomId);
            console.log(`User ${userId} left room ${roomId}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

module.exports = setupChatSocket;
