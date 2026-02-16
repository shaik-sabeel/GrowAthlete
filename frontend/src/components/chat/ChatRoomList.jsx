import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import backendApi from '../../utils/backendApi';

const ChatRoomList = ({ onSelectRoom, activeRoomId }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newRoom, setNewRoom] = useState({ name: '', description: '', category: 'General' });

    const categories = ['General', 'Running', 'Wellness', 'Football', 'Cricket', 'Basketball', 'Tennis', 'Swimming', 'Volleyball', 'Athletics', 'Hockey', 'Other'];

    useEffect(() => {
        fetchRooms();

        // Setup socket for real-time online counts
        const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const socket = io(socketUrl, { withCredentials: true });

        socket.on('roomData', (data) => {
            setRooms(prev => prev.map(r =>
                String(r._id) === String(data.roomId)
                    ? { ...r, onlineCount: data.onlineCount }
                    : r
            ));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const response = await backendApi.get('/chatrooms');
            setRooms(response.data || []);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            const response = await backendApi.post('/chatrooms', newRoom);
            setRooms([response.data, ...rooms]);
            setShowCreateModal(false);
            setNewRoom({ name: '', description: '', category: 'General' });
            onSelectRoom(response.data);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create room');
        }
    };

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(search.toLowerCase()) ||
        room.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-gray rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Live Chat</h3>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        + Create
                    </button>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        className="w-full pl-3 pr-3 py-2 bg-gray border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-2 space-y-1">
                {loading ? (
                    <div className="text-center py-8 text-slate-500 text-sm">Loading rooms...</div>
                ) : filteredRooms.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">No rooms found</div>
                ) : (
                    filteredRooms.map(room => (
                        <button
                            key={room._id}
                            onClick={() => onSelectRoom(room)}
                            className={`w-full text-left p-3 rounded-xl transition-all ${activeRoomId === room._id
                                ? 'bg-blue-50 border border-blue-100'
                                : 'hover:bg-slate-50 border border-transparent'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-0.5">
                                <span className={`font-semibold text-sm ${activeRoomId === room._id ? 'text-white-700' : 'text-slate-800'}`}>
                                    {room.name}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium uppercase">
                                    {room.category}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{room.description || 'No description'}</p>
                            <div className="flex items-center gap-1 mt-1.5">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                    {room.onlineCount !== undefined ? room.onlineCount : 0} online
                                </span>
                            </div>
                        </button>
                    ))
                )}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Create New Room</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <form onSubmit={handleCreateRoom} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Room Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    value={newRoom.name}
                                    onChange={e => setNewRoom({ ...newRoom, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    value={newRoom.category}
                                    onChange={e => setNewRoom({ ...newRoom, category: e.target.value })}
                                >
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    rows="3"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                                    value={newRoom.description}
                                    onChange={e => setNewRoom({ ...newRoom, description: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                            >
                                Create Room
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatRoomList;
