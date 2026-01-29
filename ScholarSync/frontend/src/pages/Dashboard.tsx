import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaTasks, FaStickyNote, FaProjectDiagram, FaBook } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        tasks: 0,
        notes: 0,
        projects: 0,
        resources: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [tasksRes, notesRes, projectsRes, resourcesRes] = await Promise.all([
                    axios.get('/api/tasks', { headers: { Authorization: `Bearer ${user?.token}` } }),
                    axios.get('/api/notes', { headers: { Authorization: `Bearer ${user?.token}` } }),
                    axios.get('/api/projects', { headers: { Authorization: `Bearer ${user?.token}` } }),
                    axios.get('/api/resources', { headers: { Authorization: `Bearer ${user?.token}` } }),
                ]);

                setStats({
                    tasks: tasksRes.data.length,
                    notes: notesRes.data.length,
                    projects: projectsRes.data.length,
                    resources: resourcesRes.data.length,
                });
            } catch (error) {
                console.error('Error fetching stats', error);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    const cards = [
        { title: 'Total Tasks', value: stats.tasks, icon: <FaTasks />, color: 'bg-blue-600' },
        { title: 'My Notes', value: stats.notes, icon: <FaStickyNote />, color: 'bg-green-600' },
        { title: 'Active Projects', value: stats.projects, icon: <FaProjectDiagram />, color: 'bg-purple-600' },
        { title: 'Saved Resources', value: stats.resources, icon: <FaBook />, color: 'bg-yellow-600' },
    ];

    return (
        <div>
            <h2 className="mb-6 text-3xl font-bold text-white">Dashboard</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, index) => (
                    <div key={index} className={`p-6 rounded-lg shadow-lg ${card.color} text-white transform hover:scale-105 transition duration-300`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-semibold">{card.title}</p>
                                <p className="text-3xl font-bold">{card.value}</p>
                            </div>
                            <div className="text-4xl opacity-50">{card.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 p-6 bg-gray-800 rounded-lg">
                <h3 className="text-xl font-bold text-primary mb-4">Welcome back, {user?.name}!</h3>
                <p className="text-gray-400">Manage your academic life efficiently. Check your tasks, update projects, and share resources.</p>
            </div>
        </div>
    );
};

export default Dashboard;
