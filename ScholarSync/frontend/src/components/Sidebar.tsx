import { Link, useLocation } from 'react-router-dom';
import { FaTasks, FaStickyNote, FaProjectDiagram, FaBook, FaUser, FaSignOutAlt, FaChartPie } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const Sidebar = () => {
    const { pathname } = useLocation();
    const { logout, user } = useAuth();

    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: <FaChartPie /> },
        { name: 'Tasks', path: '/tasks', icon: <FaTasks /> },
        { name: 'Notes', path: '/notes', icon: <FaStickyNote /> },
        { name: 'Projects', path: '/projects', icon: <FaProjectDiagram /> },
        { name: 'Resources', path: '/resources', icon: <FaBook /> },
        { name: 'Profile', path: '/profile', icon: <FaUser /> },
    ];

    return (
        <div className="flex flex-col w-64 h-screen bg-gray-800 border-r border-gray-700">
            <div className="flex items-center justify-center h-16 border-b border-gray-700">
                <h1 className="text-2xl font-bold tracking-wider text-primary">ScholarSync</h1>
            </div>
            <div className="flex flex-col flex-1 p-4 space-y-2 overflow-y-auto">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={clsx(
                            'flex items-center px-4 py-3 space-x-3 transition-colors rounded-lg',
                            pathname === link.path
                                ? 'bg-primary text-white'
                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        )}
                    >
                        <span className="text-xl">{link.icon}</span>
                        <span className="font-medium">{link.name}</span>
                    </Link>
                ))}
            </div>
            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center mb-4 space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-xl font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate w-32">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
