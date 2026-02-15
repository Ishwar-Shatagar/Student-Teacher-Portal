import React, { useState, useContext } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { AuthContext } from '../../contexts/AuthContext';
import UpcomingEvents from '../dashboard/UpcomingEvents';
import CalendarWidget from '../faculty-dashboard/CalendarWidget';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useContext(AuthContext);

    const isFaculty = user?.role === 'faculty';

    return (
        <div className={`flex h-screen text-gray-800 dark:text-gray-200 ${isFaculty ? 'bg-faculty-sidebar' : 'bg-white dark:bg-gray-800'}`}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header setSidebarOpen={setSidebarOpen} />
                <main className={`flex-1 overflow-x-hidden overflow-y-auto ${isFaculty ? 'bg-faculty-bg' : 'bg-gray-50 dark:bg-gray-900'}`}>
                    {children}
                </main>
            </div>
            {isFaculty && (
                <div className="hidden lg:block w-80 bg-faculty-right-col dark:bg-gray-800 p-6 space-y-6 overflow-y-auto">
                    <CalendarWidget />
                    <UpcomingEvents />
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;