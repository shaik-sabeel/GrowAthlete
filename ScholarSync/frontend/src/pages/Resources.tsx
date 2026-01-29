import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import { FaPlus, FaTrash, FaLink, FaBook } from 'react-icons/fa';

interface Resource {
    _id: string;
    title: string;
    description: string;
    link: string;
    category: string;
}

const Resources = () => {
    const { user } = useAuth();
    const [resources, setResources] = useState<Resource[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newResource, setNewResource] = useState({ title: '', description: '', link: '', category: '' });

    const fetchResources = async () => {
        try {
            const { data } = await axios.get('/api/resources', {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            setResources(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [user]);

    const handleCreateResource = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/resources', newResource, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            toast.success('Resource Added');
            setIsModalOpen(false);
            setNewResource({ title: '', description: '', link: '', category: '' });
            fetchResources();
        } catch (error) {
            toast.error('Failed to add resource');
        }
    };

    const handleDeleteResource = async (id: string) => {
        if (!window.confirm('Delete this resource?')) return;
        try {
            await axios.delete(`/api/resources/${id}`, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            toast.success('Resource Deleted');
            fetchResources();
        } catch (error) {
            toast.error('Failed to delete resource');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">Resources</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 space-x-2 font-bold text-white bg-yellow-600 rounded hover:bg-yellow-700"
                >
                    <FaPlus /> <span>Add Resource</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => (
                    <div key={resource._id} className="p-6 bg-gray-800 rounded-lg shadow border-t-4 border-yellow-500 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2"><FaBook /> {resource.title}</h3>
                                <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">{resource.category || 'General'}</span>
                            </div>

                            <p className="text-gray-400 mb-4">{resource.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                <FaLink /> Open Link
                            </a>
                            <button onClick={() => handleDeleteResource(resource._id)} className="text-red-500 hover:text-red-700">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
                {resources.length === 0 && <p className="col-span-full text-center text-gray-500">No resources found.</p>}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Resource">
                <form onSubmit={handleCreateResource} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        value={newResource.description}
                        onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    />
                    <input
                        type="url"
                        placeholder="Link URL"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        value={newResource.link}
                        onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category (e.g. Math, Science)"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        value={newResource.category}
                        onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                    />
                    <button type="submit" className="w-full py-2 font-bold text-white bg-yellow-600 rounded hover:bg-yellow-700">
                        Add Resource
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Resources;
