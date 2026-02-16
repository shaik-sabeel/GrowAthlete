import { useState, useEffect } from 'react';
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
        <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700 flex flex-col h-full overflow-hidden relative">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60"></div>

            <div className="p-5 border-b border-gray-700 bg-gray-800/95 sticky top-0 z-10">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-2xl">💬</span> Live Chat
                    </h3>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors uppercase tracking-wider flex items-center gap-1 border border-orange-500/30 px-3 py-1.5 rounded-lg hover:bg-orange-500/10"
                    >
                        <span>+</span> Create Room
                    </button>
                </div>
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder-gray-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors">
                        🔍
                    </span>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {loading ? (
                    <div className="text-center py-10 space-y-3">
                        <div className="w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Loading rooms...</p>
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="text-center py-12 px-6">
                        <div className="bg-gray-700/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="opacity-50 text-xl">🕸️</span>
                        </div>
                        <p className="text-gray-400 text-sm font-medium">No rooms found.</p>
                        <p className="text-gray-600 text-xs mt-1">Try creating one!</p>
                    </div>
                ) : (
                    filteredRooms.map(room => (
                        <button
                            key={room._id}
                            onClick={() => onSelectRoom(room)}
                            className={`w-full text-left p-4 rounded-xl transition-all border group relative overflow-hidden ${activeRoomId === room._id
                                ? 'bg-gradient-to-r from-orange-500/10 to-pink-500/10 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                                : 'bg-gray-800/50 hover:bg-gray-700 border-transparent hover:border-gray-600'
                                }`}
                        >
                            {activeRoomId === room._id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-pink-500"></div>
                            )}

                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-bold text-sm truncate pr-2 ${activeRoomId === room._id ? 'text-orange-400' : 'text-gray-200 group-hover:text-white'}`}>
                                    {room.name}
                                </span>
                                <span className="text-[9px] px-2 py-0.5 bg-gray-700 text-gray-400 rounded-md font-semibold uppercase tracking-wider border border-gray-600">
                                    {room.category}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 truncate mb-2">{room.description || 'No description'}</p>
                            <div className="flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeRoomId === room._id ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${activeRoomId === room._id ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium">{room.participants?.length || 0} online</span>
                            </div>
                        </button>
                    ))
                )}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-pink-500"></div>

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="text-orange-500">✦</span> Create Room
                            </h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-white transition-colors text-xl leading-none">×</button>
                        </div>
                        <form onSubmit={handleCreateRoom} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Room Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g., Marathon Runners"
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder-gray-600"
                                    value={newRoom.name}
                                    onChange={e => setNewRoom({ ...newRoom, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
                                        value={newRoom.category}
                                        onChange={e => setNewRoom({ ...newRoom, category: e.target.value })}
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    rows="3"
                                    placeholder="What is this room about?"
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none placeholder-gray-600"
                                    value={newRoom.description}
                                    onChange={e => setNewRoom({ ...newRoom, description: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 transition-all shadow-lg text-sm uppercase tracking-wide"
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
