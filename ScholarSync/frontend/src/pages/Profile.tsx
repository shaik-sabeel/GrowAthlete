import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaEnvelope, FaUniversity } from 'react-icons/fa';

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="h-32 bg-primary"></div>
                <div className="px-6 py-4 relative">
                    <div className="absolute -top-16 left-6 border-4 border-gray-800 rounded-full bg-gray-700">
                        <div className="w-24 h-24 flex items-center justify-center text-4xl text-gray-400">
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <FaUserCircle className="w-24 h-24" />
                            )}
                        </div>
                    </div>
                    <div className="mt-10">
                        <h2 className="text-3xl font-bold text-white">{user?.name}</h2>
                        <p className="text-gray-400">Member since {new Date().getFullYear()}</p>
                    </div>

                    <div className="mt-8 space-y-6">
                        <div className="flex items-center space-x-4 text-gray-300">
                            <FaEnvelope className="text-xl" />
                            <div>
                                <p className="font-semibold text-white">Email</p>
                                <p>{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 text-gray-300">
                            <FaUniversity className="text-xl" />
                            <div>
                                <p className="font-semibold text-white">Role</p>
                                <p className="capitalize">{user?.role}</p>
                            </div>
                        </div>
                        {/* Add more fields here as needed (Bio, Academic Info) if added to User object in context */}
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-700 border-t border-gray-600">
                    <button className="text-sm font-medium text-primary hover:text-white transition-colors">Edit Profile</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
