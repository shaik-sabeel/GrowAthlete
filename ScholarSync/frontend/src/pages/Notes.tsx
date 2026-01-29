import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import { FaPlus, FaTrash, FaStickyNote } from 'react-icons/fa';

interface Note {
    _id: string;
    title: string;
    content: string;
    isShared: boolean;
    createdAt: string;
}

const Notes = () => {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });

    const fetchNotes = async () => {
        try {
            const { data } = await axios.get('/api/notes', {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            setNotes(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [user]);

    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/notes', newNote, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            toast.success('Note Created');
            setIsModalOpen(false);
            setNewNote({ title: '', content: '' });
            fetchNotes();
        } catch (error) {
            toast.error('Failed to create note');
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!window.confirm('Delete this note?')) return;
        try {
            await axios.delete(`/api/notes/${id}`, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            toast.success('Note Deleted');
            fetchNotes();
        } catch (error) {
            toast.error('Failed to delete note');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">My Notes</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 space-x-2 font-bold text-white bg-green-600 rounded hover:bg-green-700"
                >
                    <FaPlus /> <span>New Note</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {notes.map((note) => (
                    <div key={note._id} className="p-4 bg-gray-800 rounded-lg shadow border-t-4 border-green-500 flex flex-col justify-between h-64">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold text-white truncate">{note.title}</h3>
                                <FaStickyNote className="text-gray-600" />
                            </div>
                            <p className="text-gray-400 whitespace-pre-wrap overflow-hidden h-32">{note.content}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</span>
                            <button onClick={() => handleDeleteNote(note._id)} className="text-red-500 hover:text-red-700">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
                {notes.length === 0 && <p className="col-span-full text-center text-gray-500">No notes found.</p>}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Note">
                <form onSubmit={handleCreateNote} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Content"
                        rows={6}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white resize-none"
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        required
                    />
                    <button type="submit" className="w-full py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700">
                        Save Note
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Notes;
