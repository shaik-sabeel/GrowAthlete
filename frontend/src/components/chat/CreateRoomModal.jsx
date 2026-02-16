import React, { useState } from 'react';
import backendApi from '../../utils/backendApi';

const CreateRoomModal = ({ onClose, onRoomCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'General',
        max_members: 50,
        visibility: 'public',
        creator_agreed_terms: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Use the correct endpoint for chat rooms
            const response = await backendApi.post('/v1/chat/rooms', formData);
            if (onRoomCreated) {
                onRoomCreated(response.data.room);
            }
            onClose();
        } catch (err) {
            console.error("Error creating room:", err);
            setError(err.response?.data?.message || "Failed to create room. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-slate-100 bg-white flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900">Create New Room</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Room Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="name"
                            required
                            maxLength={50}
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="e.g. Marathon Training"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            maxLength={200}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="What is this room about?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            >
                                <option value="General">General</option>
                                <option value="Training">Training</option>
                                <option value="Competition">Competition</option>
                                <option value="Social">Social</option>
                                <option value="Advice">Advice</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Max Members</label>
                            <input
                                type="number"
                                name="max_members"
                                min="2"
                                max="1000"
                                value={formData.max_members}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Visibility</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="public"
                                    checked={formData.visibility === 'public'}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-slate-600">Public</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="private"
                                    checked={formData.visibility === 'private'}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-slate-600">Private</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="flex items-start gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                required
                                name="creator_agreed_terms"
                                checked={formData.creator_agreed_terms}
                                onChange={(e) => setFormData(prev => ({ ...prev, creator_agreed_terms: e.target.checked }))}
                                className="mt-1 w-4 h-4 text-primary focus:ring-primary rounded border-gray-300"
                            />
                            <span className="text-sm text-slate-600">
                                I agree to the <span className="text-primary hover:underline">community guidelines</span> and creating this room.
                            </span>
                        </label>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-slate-600 font-medium text-sm hover:bg-slate-100 rounded-lg transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.creator_agreed_terms}
                            className="px-6 py-2 bg-primary text-white font-semibold text-sm rounded-lg shadow-md hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating...
                                </>
                            ) : (
                                'Create Room'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoomModal;
