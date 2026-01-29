import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import { FaPlus, FaTrash, FaProjectDiagram } from 'react-icons/fa';
import clsx from 'clsx';

interface Project {
    _id: string;
    name: string;
    description: string;
    status: 'Pending' | 'Ongoing' | 'Completed';
}

const Projects = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '', status: 'Pending' });

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get('/api/projects', {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            setProjects(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [user]);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/projects', newProject, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            toast.success('Project Created');
            setIsModalOpen(false);
            setNewProject({ name: '', description: '', status: 'Pending' });
            fetchProjects();
        } catch (error) {
            toast.error('Failed to create project');
        }
    };

    const handleDeleteProject = async (id: string) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            await axios.delete(`/api/projects/${id}`, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            toast.success('Project Deleted');
            fetchProjects();
        } catch (error) {
            toast.error('Failed to delete project');
        }
    };

    const updateStatus = async (project: Project, status: string) => {
        try {
            await axios.put(`/api/projects/${project._id}`, { ...project, status }, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            fetchProjects();
        } catch (error) {
            toast.error("Failed to update status");
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">Projects</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 space-x-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-700"
                >
                    <FaPlus /> <span>New Project</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {projects.map((project) => (
                    <div key={project._id} className="p-6 bg-gray-800 rounded-lg shadow border-l-4 border-purple-500">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2"> <FaProjectDiagram /> {project.name}</h3>
                                <p className="mt-2 text-gray-400">{project.description}</p>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Status:</span>
                                    <select
                                        value={project.status}
                                        onChange={(e) => updateStatus(project, e.target.value)}
                                        className={clsx("px-2 py-1 rounded text-sm outline-none border-none", {
                                            'bg-yellow-900 text-yellow-200': project.status === 'Pending',
                                            'bg-blue-900 text-blue-200': project.status === 'Ongoing',
                                            'bg-green-900 text-green-200': project.status === 'Completed',
                                        })}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                            <button onClick={() => handleDeleteProject(project._id)} className="text-red-500 hover:text-red-700">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && <p className="col-span-full text-center text-gray-500">No projects found.</p>}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
                <form onSubmit={handleCreateProject} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Project Name"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                    <select
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        value={newProject.status}
                        onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <button type="submit" className="w-full py-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-700">
                        Create Project
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Projects;
