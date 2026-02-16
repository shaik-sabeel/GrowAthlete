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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px] overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="lg:hidden text-slate-500 hover:text-slate-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h3 className="font-bold text-slate-900 leading-tight">{room.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">{room.category} · {room.participants?.length || 0} participants</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Live</span>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-2 opacity-50">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-medium text-slate-500">Loading conversation...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-xl">👋</span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">No messages yet. Be the first to say hi!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.sender?._id === currentUserId || msg.sender === currentUserId;
                        return (
                            <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {!isMe && (
                                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 mt-1">
                                            {msg.sender?.profilePicture ? (
                                                <img src={msg.sender.profilePicture} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-[10px]">
                                                    {msg.sender?.username?.[0]?.toUpperCase() || '?'}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div>
                                        {!isMe && <span className="text-[10px] font-bold text-slate-500 ml-1 mb-1 block uppercase tracking-tight">{msg.sender?.username}</span>}
                                        <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isMe
                                            ? 'bg-blue-600 text-white rounded-tr-none ml-auto'
                                            : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                                            }`}>
                                            {msg.content}
                                        </div>
                                        <span className={`text-[9px] text-slate-400 mt-1 block ${isMe ? 'text-right' : 'text-left'}`}>
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

            <div className="p-4 bg-white border-t border-slate-100 sticky bottom-0">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-grow px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-button disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LiveChat;
