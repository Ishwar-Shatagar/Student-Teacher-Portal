
import React, { useState, useContext, useMemo, useRef, useEffect } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { AuthContext } from '../../contexts/AuthContext';
import { AppNotification, NotificationType } from '../../types';
import { Link } from 'react-router-dom';
import { 
    BellIcon, 
    CheckCircleIcon, 
    ExclamationTriangleIcon, 
    DocumentTextIcon, 
    AcademicCapIcon, 
    MegaphoneIcon,
    XMarkIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

// --- Icons Mapping ---
const getIcon = (type: NotificationType) => {
    switch (type) {
        case 'attendance': return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
        case 'marks': return <AcademicCapIcon className="w-5 h-5 text-blue-600" />;
        case 'assignment': return <DocumentTextIcon className="w-5 h-5 text-yellow-600" />;
        case 'announcement': return <MegaphoneIcon className="w-5 h-5 text-purple-600" />;
        default: return <BellIcon className="w-5 h-5 text-gray-600" />;
    }
};

const getBgColor = (type: NotificationType) => {
    switch (type) {
        case 'attendance': return 'bg-red-100 dark:bg-red-900/30';
        case 'marks': return 'bg-blue-100 dark:bg-blue-900/30';
        case 'assignment': return 'bg-yellow-100 dark:bg-yellow-900/30';
        case 'announcement': return 'bg-purple-100 dark:bg-purple-900/30';
        default: return 'bg-gray-100 dark:bg-gray-800';
    }
};

const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
};

const NotificationCenter: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { notifications, markNotificationAsRead, markAllAsRead, preferences, togglePreference } = useContext(DataContext)!;
    
    const [isOpen, setIsOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [filter, setFilter] = useState<'All' | 'Unread' | NotificationType>('All');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // --- Close Dropdown on Click Outside ---
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setShowSettings(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Filtering Logic ---
    const myNotifications = useMemo(() => {
        if (!user) return [];
        return notifications.filter(n => {
            // 1. Role Check
            if (user.role === 'faculty') {
                // Faculty only gets announcements
                return n.type === 'announcement';
            }
            // Student Logic
            const isRecipient = n.recipientId === user.id || n.recipientId === 'all' || n.recipientRole === 'all' || n.recipientRole === 'student';
            if (!isRecipient) return false;

            // 2. Preference Check (Optional notifications)
            if (n.type === 'assignment' && !preferences.assignmentReminders) return false;
            if (n.type === 'general' && !preferences.generalAlerts) return false;

            return true;
        });
    }, [notifications, user, preferences]);

    const filteredNotifications = useMemo(() => {
        return myNotifications.filter(n => {
            if (filter === 'All') return true;
            if (filter === 'Unread') return !n.isRead;
            return n.type === filter;
        }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [myNotifications, filter]);

    const unreadCount = myNotifications.filter(n => !n.isRead).length;

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-transform active:scale-95 focus:outline-none"
            >
                <BellIcon className={`w-6 h-6 ${unreadCount > 0 ? 'text-gray-700 dark:text-gray-200' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-gray-900"></span>
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 z-50 transform origin-top-right transition-all duration-200 ease-out">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                        <div className="flex gap-2">
                            {user.role === 'student' && (
                                <button 
                                    onClick={() => setShowSettings(!showSettings)}
                                    className={`p-1.5 rounded-lg transition-colors ${showSettings ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'}`}
                                >
                                    <AdjustmentsHorizontalIcon className="w-4 h-4" />
                                </button>
                            )}
                            <button 
                                onClick={() => markAllAsRead(user.id)}
                                className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                            >
                                Mark all read
                            </button>
                        </div>
                    </div>

                    {/* Settings View (Student Only) */}
                    {showSettings && user.role === 'student' ? (
                         <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alert Preferences</h4>
                                <button onClick={() => setShowSettings(false)}><XMarkIcon className="w-4 h-4 text-gray-400"/></button>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Assignment Reminders</span>
                                    <input 
                                        type="checkbox" 
                                        checked={preferences.assignmentReminders} 
                                        onChange={() => togglePreference('assignmentReminders')}
                                        className="toggle-checkbox rounded text-primary-600 focus:ring-primary-500" 
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">General Alerts</span>
                                    <input 
                                        type="checkbox" 
                                        checked={preferences.generalAlerts} 
                                        onChange={() => togglePreference('generalAlerts')}
                                        className="toggle-checkbox rounded text-primary-600 focus:ring-primary-500" 
                                    />
                                </div>
                                <div className="flex items-center justify-between opacity-50 cursor-not-allowed" title="Mandatory">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Low Attendance Alert</span>
                                    <input type="checkbox" checked disabled className="rounded text-gray-400" />
                                </div>
                                <div className="flex items-center justify-between opacity-50 cursor-not-allowed" title="Mandatory">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Marks Updates</span>
                                    <input type="checkbox" checked disabled className="rounded text-gray-400" />
                                </div>
                            </div>
                         </div>
                    ) : (
                        <>
                            {/* Filters */}
                            {user.role === 'student' && (
                                <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-100 dark:border-gray-700">
                                    {['All', 'Unread', 'marks', 'attendance', 'assignment'].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f as any)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                                filter === f 
                                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            {f.charAt(0).toUpperCase() + f.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Notification List */}
                            <div className="max-h-[350px] overflow-y-auto">
                                {filteredNotifications.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <BellIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">No notifications yet.</p>
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                        {filteredNotifications.map(n => (
                                            <li 
                                                key={n.id} 
                                                className={`relative p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${!n.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                                onClick={() => markNotificationAsRead(n.id)}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getBgColor(n.type)}`}>
                                                        {getIcon(n.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start">
                                                            <p className={`text-sm font-semibold ${n.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                                                {n.title}
                                                            </p>
                                                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{formatTime(n.timestamp)}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                                                        
                                                        {n.link && (
                                                            <Link 
                                                                to={n.link}
                                                                className="mt-2 inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                View Details &rarr;
                                                            </Link>
                                                        )}
                                                    </div>
                                                    {!n.isRead && (
                                                        <div className="self-center">
                                                            <span className="block w-2 h-2 bg-blue-500 rounded-full"></span>
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
