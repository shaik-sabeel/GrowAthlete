import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import { FaPlus, FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import clsx from 'clsx';

interface Task {
    _id: string;
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    deadline: string;
    isCompleted: boolean;
}

const Tasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', deadline: '' });

    const fetchTasks = async () => {
        try {
            const { data } = await axios.get('/api/tasks', {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            setTasks(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [user]);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/tasks', newTask, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            toast.success('Task Created');
            setIsModalOpen(false);
            setNewTask({ title: '', description: '', priority: 'Medium', deadline: '' });
            fetchTasks();
        } catch (error) {
            toast.error('Failed to create task');
        }
    };

    const handleDeleteTask = async (id: string) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await axios.delete(`/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            toast.success('Task Deleted');
            fetchTasks();
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    const toggleComplete = async (task: Task) => {
        try {
            await axios.put(`/api/tasks/${task._id}`, { ...task, isCompleted: !task.isCompleted }, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            fetchTasks();
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">My Tasks</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 space-x-2 font-bold text-white bg-primary rounded hover:bg-violet-700"
                >
                    <FaPlus /> <span>New Task</span>
                </button>
            </div>

            <div className="grid gap-4">
                {tasks.map((task) => (
                    <div key={task._id} className="p-4 bg-gray-800 rounded-lg shadow flex items-center justify-between border-l-4 border-primary">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => toggleComplete(task)} className="text-2xl text-gray-400 hover:text-green-500">
                                {task.isCompleted ? <FaCheckCircle className="text-green-500" /> : <FaRegCircle />}
                            </button>
                            <div>
                                <h3 className={clsx("text-xl font-semibold text-white", task.isCompleted && "line-through text-gray-500")}>{task.title}</h3>
                                <p className="text-gray-400">{task.description}</p>
                                <div className="flex space-x-4 mt-2 text-sm">
                                    <span className={clsx("px-2 py-0.5 rounded", {
                                        'bg-red-900 text-red-200': task.priority === 'High',
                                        'bg-yellow-900 text-yellow-200': task.priority === 'Medium',
                                        'bg-green-900 text-green-200': task.priority === 'Low',
                                    })}>{task.priority}</span>
                                    {task.deadline && <span className="text-gray-500">Due: {new Date(task.deadline).toLocaleDateString()}</span>}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleDeleteTask(task._id)} className="text-red-500 hover:text-red-700">
                            <FaTrash />
                        </button>
                    </div>
                ))}
                {tasks.length === 0 && <p className="text-gray-500 text-center">No tasks found. Create one to get started!</p>}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
                <form onSubmit={handleCreateTask} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                    <select
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <input
                        type="date"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    />
                    <button type="submit" className="w-full py-2 font-bold text-white bg-primary rounded hover:bg-violet-700">
                        Create Task
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Tasks;
