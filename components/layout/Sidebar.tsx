
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import * as Icons from '../common/Icons';

const managementLinks = [
    { to: '/admission', text: 'Admission', icon: <Icons.AdmissionIcon className="w-5 h-5" /> },
    { to: '/course', text: 'Course', icon: <Icons.CourseIcon className="w-5 h-5" /> },
    { to: '/fees', text: 'Fees', icon: <Icons.FeesIcon className="w-5 h-5" /> },
    { to: '/attendance', text: 'Attendance', icon: <Icons.AttendanceIcon className="w-5 h-5" /> },
    { to: '/online-learning', text: 'Online learning', icon: <Icons.OnlineLearningIcon className="w-5 h-5" /> },
    { to: '/timetable', text: 'Timetable', icon: <Icons.TimetableIcon className="w-5 h-5" /> },
    { to: '/feedback', text: 'Feedback', icon: <Icons.FeedbackIcon className="w-5 h-5" /> },
    { to: '/chat', text: 'Chat', icon: <Icons.ChatIcon className="w-5 h-5" /> },
    { to: '/examination', text: 'Examination', icon: <Icons.ExaminationIcon className="w-5 h-5" /> },
    { to: '/assignment', text: 'Assignment', icon: <Icons.AssignmentIcon className="w-5 h-5" /> },
    { to: '/placements', text: 'Placements', icon: <Icons.PlacementsIcon className="w-5 h-5" /> },
]

const studentMainLinks = [
    { to: '/performance', text: 'Performance', icon: <Icons.DashboardIcon className="w-6 h-6" /> },
    { to: '/student-info', text: 'Student Info', icon: <Icons.StudentIcon className="w-6 h-6" /> },
]

const facultyMainLinks = [
    { to: '/faculty-dashboard', text: 'Dashboard', icon: <Icons.DashboardIcon className="w-6 h-6" /> },
    { to: '/faculty-analytics', text: 'Analytics', icon: <Icons.ChartBarIcon className="w-6 h-6" /> },
    { to: '/students', text: 'Students', icon: <Icons.StudentIcon className="w-6 h-6" /> },
    { to: '/faculty/attendance', text: 'Attendance', icon: <Icons.AttendanceIcon className="w-6 h-6" /> },
    { to: '/training', text: 'Train Images', icon: <Icons.CameraIcon className="w-6 h-6" /> },
    { to: '/exam-assignment', text: 'Exam / Assignment', icon: <Icons.ExaminationIcon className="w-6 h-6" /> },
    { to: '/marks', text: 'Marks', icon: <Icons.MarksIcon className="w-6 h-6" /> },
    { to: '/feedback', text: 'Feedback', icon: <Icons.FeedbackIcon className="w-6 h-6" /> },
    { to: '/chat', text: 'Chat', icon: <Icons.ChatIcon className="w-6 h-6" /> },
    { to: '/events', text: 'Events', icon: <Icons.EventsIcon className="w-6 h-6" /> },
    { to: '/manage', text: 'Manage', icon: <Icons.ManageIcon className="w-6 h-6" /> },
]

const hodMainLinks = [
    { to: '/hod/dashboard', text: 'Dashboard', icon: <Icons.DashboardIcon className="w-6 h-6" /> },
    { to: '/hod/students', text: 'Student Mgmt', icon: <Icons.StudentIcon className="w-6 h-6" /> },
    { to: '/hod/faculty', text: 'Faculty Mgmt', icon: <Icons.FacultyIcon className="w-6 h-6" /> },
    { to: '/hod/leaves', text: 'Leave Requests & CL', icon: <Icons.MessageIcon className="w-6 h-6" /> },
    { to: '/hod/announcements', text: 'Announcements', icon: <Icons.MessageIcon className="w-6 h-6" /> },
    { to: '/hod/reports', text: 'Reports', icon: <Icons.ExportIcon className="w-6 h-6" /> },
    { to: '/hod/events', text: 'Events', icon: <Icons.EventsIcon className="w-6 h-6" /> },
    { to: '/hod/profile', text: 'My Profile', icon: <Icons.ManageIcon className="w-6 h-6" /> },
];

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const StudentNavItem: React.FC<{ to: string, text: string, icon: React.ReactNode, onClick: () => void }> = ({ to, text, icon, onClick }) => (
    <li>
        <NavLink 
            to={to} 
            className={({ isActive }) => 
                `flex items-center px-4 py-2.5 my-1 rounded-lg transition-all duration-200 text-sm font-medium transform hover:translate-x-1
                ${isActive ? 'bg-primary-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`
            }
            onClick={onClick}
        >
            <span className="w-6">{icon}</span>
            <span className="ml-3">{text}</span>
        </NavLink>
    </li>
);

const FacultyNavItem: React.FC<{ to: string, text: string, icon: React.ReactNode, onClick: () => void }> = ({ to, text, icon, onClick }) => (
     <li>
        <NavLink 
            to={to} 
            className={({ isActive }) => 
                `flex items-center px-6 py-3 my-1 rounded-lg transition-all duration-200 font-semibold transform hover:translate-x-1
                ${isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`
            }
            onClick={onClick}
        >
            {icon}
            <span className="ml-4">{text}</span>
        </NavLink>
    </li>
);

const HodNavItem: React.FC<{ to: string, text: string, icon: React.ReactNode, onClick: () => void }> = ({ to, text, icon, onClick }) => (
    <li>
       <NavLink 
           to={to} 
           className={({ isActive }) => 
               `flex items-center px-6 py-3 my-1 rounded-lg transition-all duration-200 font-semibold transform hover:translate-x-1
               ${isActive ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
           }
           onClick={onClick}
       >
           {icon}
           <span className="ml-4">{text}</span>
       </NavLink>
   </li>
);

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const { user, logout } = useContext(AuthContext);

    const isFaculty = user?.role === 'faculty';
    const isHod = user?.role === 'hod_principal';

    if (isHod) {
        return (
             <>
                <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
                <div className={`fixed lg:relative inset-y-0 left-0 w-64 bg-gray-900 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col`}>
                    <div className="flex flex-col items-center text-center p-6 border-b border-gray-800 bg-gray-900">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-3xl font-bold mb-3 shadow-lg text-white">
                            {user?.name.charAt(0)}
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-wide">Principal / HOD</h2>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Administration</p>
                    </div>
                    <nav className="flex-grow px-4 py-6 overflow-y-auto">
                        <ul className="space-y-2">
                           {hodMainLinks.map(link => <HodNavItem key={link.to} {...link} onClick={() => setSidebarOpen(false)} />)}
                        </ul>
                    </nav>
                    <div className="p-4 border-t border-gray-800">
                         <button onClick={logout} className="flex items-center w-full px-6 py-3 rounded-lg font-semibold text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-all duration-200 group">
                            <Icons.LogoutIcon className="w-6 h-6 group-hover:text-red-400" />
                            <span className="ml-4">Logout</span>
                        </button>
                    </div>
                </div>
            </>
        )
    }

    if (isFaculty) {
        return (
             <>
                <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
                <div className={`fixed lg:relative inset-y-0 left-0 w-64 bg-faculty-sidebar text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col`}>
                    <div className="flex flex-col items-center text-center p-6 border-b border-gray-700">
                        <img className="w-24 h-24 rounded-full object-cover mb-4" src={user?.profilePicUrl} alt={user?.name} />
                        <h2 className="text-lg font-semibold">{user?.name}</h2>
                        <p className="text-sm text-gray-400">{user?.designation}</p>
                        <select className="mt-4 w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Select Year</option>
                            <option>2024</option>
                            <option>2023</option>
                        </select>
                    </div>
                    <nav className="flex-grow px-4 py-4 overflow-y-auto">
                        <ul className="space-y-1">
                           {facultyMainLinks.map(link => <FacultyNavItem key={link.to} {...link} onClick={() => setSidebarOpen(false)} />)}
                             <li>
                                <button onClick={logout} className="flex items-center w-full px-6 py-3 my-1 rounded-lg font-semibold text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-200 transform hover:translate-x-1">
                                    <Icons.LogoutIcon className="w-6 h-6" />
                                    <span className="ml-4">Logout</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </>
        )
    }

    // Student Sidebar
    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
            <div className={`fixed lg:relative inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col shadow-lg`}>
                <div className="flex items-center justify-start h-20 px-6 border-b dark:border-gray-700">
                    <img className="h-10 w-10 rounded-full object-cover" src={user?.profilePicUrl} alt={user?.name} />
                    <div className="ml-4">
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Hi,</span>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">{user?.name}</h2>
                    </div>
                </div>
                <nav className="flex-grow px-4 py-2 overflow-y-auto">
                    <ul className="space-y-1">
                       {studentMainLinks.map(link => <StudentNavItem key={link.to} {...link} onClick={() => setSidebarOpen(false)} />)}

                        {/* Management Section */}
                        <li className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</li>
                        {managementLinks.map(link => <StudentNavItem key={link.to} {...link} onClick={() => setSidebarOpen(false)} />)}
                        
                        {/* Other Sections */}
                         <li className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">More</li>
                         <StudentNavItem to="/events" text="Events" icon={<Icons.EventsIcon className="w-6 h-6" />} onClick={() => setSidebarOpen(false)} />
                         <StudentNavItem to="/manage" text="Manage" icon={<Icons.ManageIcon className="w-6 h-6" />} onClick={() => setSidebarOpen(false)} />
                         <StudentNavItem to="/settings" text="Settings" icon={<Icons.SettingsIcon className="w-6 h-6" />} onClick={() => setSidebarOpen(false)} />
                         <li>
                             <button onClick={logout} className="flex items-center w-full px-4 py-2.5 my-1 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 transform hover:translate-x-1">
                                 <span className="w-6"><Icons.LogoutIcon className="w-6 h-6" /></span>
                                 <span className="ml-3">Logout</span>
                             </button>
                         </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
