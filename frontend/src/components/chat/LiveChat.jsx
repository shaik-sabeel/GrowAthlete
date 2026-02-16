import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import backendApi from '../../utils/backendApi';
import { getCurrentUserId } from '../../utils/auth';
import moment from 'moment';

const LiveChat = ({ room, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const socketRef = useRef();
    const messagesEndRef = useRef();
    const currentUserId = getCurrentUserId();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!room) return;

        // Initialize socket connection
        const socketUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        socketRef.current = io(socketUrl, {
            withCredentials: true
        });

        // Fetch message history
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const response = await backendApi.get(`/chatrooms/${room._id}/messages`);
                setMessages(response.data || []);
                setLoading(false);
                setTimeout(scrollToBottom, 100);
            } catch (error) {
                console.error('Error fetching messages:', error);
                setLoading(false);
            }
        };

        fetchMessages();

        // Join room
        socketRef.current.emit('joinRoom', { roomId: room._id, userId: currentUserId });

        // Listen for new messages
        socketRef.current.on('message', (message) => {
            setMessages(prev => [...prev, message]);
            setTimeout(scrollToBottom, 100);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leaveRoom', { roomId: room._id, userId: currentUserId });
                socketRef.current.disconnect();
            }
        };
    }, [room, currentUserId]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socketRef.current) return;

        socketRef.current.emit('sendMessage', {
            roomId: room._id,
            userId: currentUserId,
            content: newMessage
        });

        setNewMessage('');
    };

    if (!room) return null;

    return (
        <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700 flex flex-col h-[600px] overflow-hidden relative group">
            {/* Subtle gradient accent at the top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-pink-500 opacity-80 z-20"></div>

            <div className="p-4 border-b border-gray-700 bg-gray-800/95 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="lg:hidden text-gray-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h3 className="font-bold text-white leading-tight flex items-center gap-2">
                            {room.name}
                        </h3>
                        <p className="text-xs text-gray-400 font-medium">{room.category} · {room.participants?.length || 0} participants</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1 rounded-full border border-gray-700/50">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                    <span className="text-xs text-gray-300 font-semibold uppercase tracking-wider">Live</span>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-900/50 custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-70">
                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Loading messages...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700 shadow-inner">
                            <span className="text-2xl animate-wave">👋</span>
                        </div>
                        <p className="text-gray-400 text-sm font-medium">No messages here yet.</p>
                        <p className="text-gray-500 text-xs mt-1">Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.sender?._id === currentUserId || msg.sender === currentUserId;
                        return (
                            <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[85%] flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {!isMe && (
                                        <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden flex-shrink-0 mt-1 border border-gray-600 shadow-sm">
                                            {msg.sender?.profilePicture ? (
                                                <img src={msg.sender.profilePicture} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 font-bold text-[10px]">
                                                    {msg.sender?.username?.[0]?.toUpperCase() || '?'}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        {!isMe && <span className="text-[10px] font-bold text-gray-400 ml-1 mb-1 block uppercase tracking-wider">{msg.sender?.username}</span>}
                                        <div className={`px-4 py-2.5 text-sm shadow-md ${isMe
                                            ? 'bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-2xl rounded-tr-sm'
                                            : 'bg-gray-800 text-gray-200 rounded-2xl rounded-tl-sm border border-gray-700'
                                            }`}>
                                            {msg.content}
                                        </div>
                                        <span className={`text-[9px] text-gray-500 mt-1 block font-medium ${isMe ? 'text-right' : 'text-left'}`}>
                                            {moment(msg.timestamp).format('h:mm A')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-gray-800/95 border-t border-gray-700 sticky bottom-0 backdrop-blur-md">
                <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="w-full pl-5 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder-gray-500"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">
                            ↵
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="w-12 h-11 flex items-center justify-center bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-xl hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:brightness-110 transition-all shadow-lg disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transform active:scale-95"
                    >
                        <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LiveChat;
