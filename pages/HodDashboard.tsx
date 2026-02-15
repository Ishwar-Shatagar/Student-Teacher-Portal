
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataContext';
import * as Icons from '../components/common/Icons';
import { Link } from 'react-router-dom';

const HodDashboard: React.FC = () => {
    const { user } = useContext(AuthContext);
    const dataContext = useContext(DataContext);

    if (!user) return null;
    const totalStudents = dataContext?.students.length || 0;
    const totalFaculty = dataContext?.faculty.length || 0;
    const pendingLeaves = 0;

    const KPICard = ({ title, value, subtitle, icon, gradient }: any) => (
        <div className={`p-6 rounded-2xl shadow-lg text-white ${gradient} transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium opacity-90 uppercase tracking-wider">{title}</p>
                    <h3 className="text-4xl font-bold mt-2">{value}</h3>
                    <p className="text-xs mt-1 opacity-80">{subtitle}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    {icon}
                </div>
            </div>
        </div>
    );

    const QuickAction = ({ to, label, icon }: any) => (
        <Link to={to} className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 group">
            <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-gray-700 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                {icon}
            </div>
            <span className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-white">{label}</span>
        </Link>
    );

    return (
        <div className="p-6 sm:p-8 space-y-8">
            {/* Greeting */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome</h1>
                    <p className="text-gray-400">Here is your daily administrative overview.</p>
                </div>
                <div className="relative z-10 flex gap-3">
                     <button className="px-5 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold shadow-lg shadow-primary-600/30 transition-transform active:scale-95">
                        View Reports
                    </button>
                </div>
                {/* Decorative Circle */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <KPICard 
                    title="Total Students" 
                    value={totalStudents} 
                    subtitle="Across all semesters" 
                    icon={<Icons.StudentIcon className="w-6 h-6" />} 
                    gradient="bg-gradient-to-br from-blue-500 to-blue-700"
                />
                <KPICard 
                    title="Total Faculty" 
                    value={totalFaculty} 
                    subtitle="Active staff members" 
                    icon={<Icons.FacultyIcon className="w-6 h-6" />} 
                    gradient="bg-gradient-to-br from-purple-500 to-purple-700"
                />
                <KPICard 
                    title="Pending Leaves" 
                    value={pendingLeaves} 
                    subtitle="Requires approval" 
                    icon={<Icons.MessageIcon className="w-6 h-6" />} 
                    gradient="bg-gradient-to-br from-orange-500 to-orange-700"
                />
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <QuickAction to="/hod/announcements" label="Announce" icon={<Icons.MessageIcon className="w-6 h-6" />} />
                    <QuickAction to="/hod/students" label="Add Student" icon={<Icons.StudentIcon className="w-6 h-6" />} />
                    <QuickAction to="/hod/students" label="Attendance" icon={<Icons.AttendanceIcon className="w-6 h-6" />} />
                    <QuickAction to="/hod/faculty" label="Faculty List" icon={<Icons.FacultyIcon className="w-6 h-6" />} />
                    <QuickAction to="/hod/reports" label="Exports" icon={<Icons.ExportIcon className="w-6 h-6" />} />
                    <QuickAction to="/hod/events" label="New Event" icon={<Icons.EventsIcon className="w-6 h-6" />} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity Feed (Mock) */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Recent Activity</h2>
                    <div className="space-y-6">
                        {[
                            { text: 'Prof. Somashekhar uploaded marks for IVP', time: '2 hours ago', type: 'marks' },
                            { text: 'New announcement: "Tech Fest Registration"', time: '4 hours ago', type: 'announcement' },
                            { text: '3rd Sem Attendance Report generated', time: 'Yesterday', type: 'report' },
                        ].map((activity, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="mt-1 w-2 h-2 rounded-full bg-primary-500 ring-4 ring-primary-50 dark:ring-primary-900/20"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{activity.text}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                 {/* Department Overview (Mock) */}
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                         <h2 className="text-xl font-bold text-gray-800 dark:text-white">Department Status</h2>
                         <button className="text-sm text-primary-600 hover:underline">View Detail</button>
                    </div>
                    <div className="space-y-4">
                        {['AIML', 'Computer Science', 'Information Science'].map((dept, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="font-medium text-gray-700 dark:text-gray-300">{dept}</span>
                                <div className="flex gap-4 text-sm">
                                    <span className="text-green-600 dark:text-green-400 font-semibold">94% Att.</span>
                                    <span className="text-gray-500">|</span>
                                    <span className="text-blue-600 dark:text-blue-400 font-semibold">8.0 GPA</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HodDashboard;
