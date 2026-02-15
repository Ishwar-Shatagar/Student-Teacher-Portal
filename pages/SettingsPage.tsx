
import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { DataContext } from '../contexts/DataContext';
import { MoonIcon, SunIcon, BellIcon, LockClosedIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const SettingsPage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const dataContext = useContext(DataContext);
    const { preferences, togglePreference } = dataContext || { preferences: {}, togglePreference: () => {} };

    const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications'>('general');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Password update simulated successfully.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Settings</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your account preferences and security.</p>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <nav className="w-full md:w-64 space-y-2">
                    {[
                        { id: 'general', label: 'General', icon: UserIcon },
                        { id: 'notifications', label: 'Notifications', icon: BellIcon },
                        { id: 'security', label: 'Security', icon: LockClosedIcon },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium ${
                                activeTab === item.id 
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                    
                    {activeTab === 'general' && (
                        <div className="space-y-8 animate-fade-in">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Appearance</h2>
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-orange-100 text-orange-600'}`}>
                                            {theme === 'light' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">Dark Mode</p>
                                            <p className="text-xs text-gray-500">Switch between light and dark themes.</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={toggleTheme}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-primary-600' : 'bg-gray-300'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Profile Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                        <input type="text" value={user?.name} disabled className="w-full p-2.5 bg-gray-100 dark:bg-gray-700 border-none rounded-lg text-gray-500 cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                        <input type="text" value={user?.email} disabled className="w-full p-2.5 bg-gray-100 dark:bg-gray-700 border-none rounded-lg text-gray-500 cursor-not-allowed" />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">To edit personal details, please contact administration.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Notification Preferences</h2>
                            
                            {[
                                { key: 'assignmentReminders', label: 'Assignment Reminders', desc: 'Get notified when assignments are posted or due soon.' },
                                { key: 'generalAlerts', label: 'General Alerts', desc: 'Updates about college events and news.' },
                                { key: 'marksUpdate', label: 'Marks Updates', desc: 'Receive alerts when exam results are published.', disabled: true },
                                { key: 'lowAttendance', label: 'Low Attendance Warning', desc: 'Critical alerts when attendance drops below 75%.', disabled: true },
                            ].map((pref) => (
                                <div key={pref.key} className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                    <div>
                                        <p className={`font-semibold ${pref.disabled ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>{pref.label}</p>
                                        <p className="text-xs text-gray-500">{pref.desc}</p>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        // @ts-ignore
                                        checked={preferences?.[pref.key] ?? true}
                                        // @ts-ignore
                                        onChange={() => !pref.disabled && togglePreference(pref.key)}
                                        disabled={pref.disabled}
                                        className={`w-5 h-5 rounded text-primary-600 focus:ring-primary-500 border-gray-300 ${pref.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Password & Security</h2>
                            <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                                    <input 
                                        type="password" 
                                        value={oldPassword}
                                        onChange={e => setOldPassword(e.target.value)}
                                        className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                    <input 
                                        type="password" 
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                                <div className="pt-4">
                                    <button type="submit" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all transform active:scale-95">
                                        Update Password
                                    </button>
                                </div>
                            </form>

                            <div className="mt-10 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex items-start gap-3">
                                <ShieldCheckIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">Two-Factor Authentication</h4>
                                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">Add an extra layer of security to your account. Currently handled by university admin.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
