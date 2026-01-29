import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaUsers, FaTrash, FaDatabase } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface SystemStats {
    users: number;
    tasks: number;
    projects: number;
    resources: number;
}

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            const statsRes = await axios.get('/api/admin/stats', config);
            const usersRes = await axios.get('/api/admin/users', config);
            setStats(statsRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch admin data. Are you an admin?');
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            toast.success('User deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    if (!user || user.role !== 'admin') {
        return <div className="text-white text-center mt-10">Access Denied. Admins only.</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <p className="text-gray-400">Total Users</p>
                    <p className="text-3xl text-white font-bold">{stats?.users || 0}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-green-500">
                    <p className="text-gray-400">Total Tasks</p>
                    <p className="text-3xl text-white font-bold">{stats?.tasks || 0}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-purple-500">
                    <p className="text-gray-400">Total Projects</p>
                    <p className="text-3xl text-white font-bold">{stats?.projects || 0}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-yellow-500">
                    <p className="text-gray-400">Total Resources</p>
                    <p className="text-3xl text-white font-bold">{stats?.resources || 0}</p>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">User Management</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow">
                <table className="w-full text-left text-gray-400">
                    <thead className="bg-gray-700 text-gray-200">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-750">
                                <td className="p-4 text-white">{u.name}</td>
                                <td className="p-4">{u.email}</td>
                                <td className="p-4 capitalize">{u.role}</td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleDeleteUser(u._id)}
                                        className="text-red-500 hover:text-red-400"
                                        disabled={u.role === 'admin'}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
