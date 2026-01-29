import { ReactNode } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto p-8">
                {children}
            </div>
        </div>
    );
};

export default Layout;
