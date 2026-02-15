
import React, { useState, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import { AuthContext } from '../contexts/AuthContext';
import { Announcement } from '../types';
import * as Icons from '../components/common/Icons';

const HodAnnouncementsPage: React.FC = () => {
    const { createAnnouncement, announcements, departments } = useContext(DataContext)!;
    const { user } = useContext(AuthContext);
    
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [targetType, setTargetType] = useState('All'); // 'All', 'Faculty', 'Dept'
    const [selectedDept, setSelectedDept] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newAnnouncement: Announcement = {
            id: `ann-${Date.now()}`,
            title,
            body,
            target: targetType === 'Dept' ? `Department: ${selectedDept}` : targetType,
            date: new Date().toLocaleDateString(),
            author: user?.name || 'HOD',
            urgent: isUrgent,
            readCount: 0,
            sentCount: targetType === 'All' ? 150 : 25, 
        };

        // createAnnouncement inside DataContext now handles notification dispatch
        createAnnouncement(newAnnouncement);
        
        // Reset Form
        setTitle('');
        setBody('');
        setIsUrgent(false);
        setIsSending(false);
        alert(isUrgent ? 'Urgent announcement sent! Push notifications dispatched.' : 'Announcement posted successfully.');
    };

    return (
        <div className="p-6 sm:p-8 space-y-8">
             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Announcements Center</h1>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Composer */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b border-gray-100 dark:border-gray-700">Compose New</h2>
                    <form onSubmit={handleSend} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Title</label>
                            <input 
                                type="text" 
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                placeholder="e.g. Staff Meeting Rescheduled"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Target Audience</label>
                                <select 
                                    value={targetType}
                                    onChange={e => setTargetType(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    <option value="All">Entire College (Broadcast)</option>
                                    <option value="Faculty">All Faculty</option>
                                    <option value="Dept">Specific Department</option>
                                </select>
                            </div>
                            
                            {targetType === 'Dept' && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Select Department</label>
                                    <select 
                                        value={selectedDept}
                                        onChange={e => setSelectedDept(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    >
                                        <option value="">-- Select --</option>
                                        {departments.map(d => <option key={d.id} value={d.code}>{d.name}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Message Body</label>
                            <textarea 
                                required
                                rows={6}
                                value={body}
                                onChange={e => setBody(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                                placeholder="Type your message..."
                            ></textarea>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input 
                                        type="checkbox" 
                                        name="toggle" 
                                        id="urgent-toggle" 
                                        checked={isUrgent}
                                        onChange={e => setIsUrgent(e.target.checked)}
                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out checked:translate-x-full"
                                    />
                                    <label htmlFor="urgent-toggle" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${isUrgent ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}></label>
                                </div>
                                <label htmlFor="urgent-toggle" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Urgent <span className="text-xs font-normal text-gray-500">(Sends Push Notification)</span>
                                </label>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSending}
                                className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 flex items-center gap-2 ${isUrgent ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : 'bg-primary-600 hover:bg-primary-700 shadow-primary-600/30'} ${isSending ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {isSending ? 'Sending...' : (
                                    <>
                                        <Icons.MessageIcon className="w-5 h-5" /> Post Announcement
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* History Sidebar */}
                <div className="lg:col-span-1 flex flex-col h-full">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex-grow overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Sent History</h2>
                        <div className="overflow-y-auto flex-grow pr-2 space-y-4">
                            {announcements.length === 0 ? (
                                <p className="text-gray-500 text-center mt-10">No announcements yet.</p>
                            ) : (
                                announcements.map((item) => (
                                    <div key={item.id} className={`p-4 rounded-xl border ${item.urgent ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-gray-50 border-gray-100 dark:bg-gray-700/30 dark:border-gray-700'}`}>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h3>
                                            {item.urgent && <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded">Urgent</span>}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">To: {item.target}</p>
                                        <div className="flex justify-between items-center mt-3 border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <span className="text-xs text-gray-400">{item.date}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                                    <Icons.EyeIcon className="w-3 h-3" /> {item.readCount}
                                                </span>
                                                <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> {item.sentCount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
             </div>
             
             <style>{`
                .toggle-checkbox:checked {
                    right: 0;
                    border-color: #68D391;
                }
                .toggle-checkbox:checked + .toggle-label {
                    background-color: #68D391;
                }
             `}</style>
        </div>
    );
};

export default HodAnnouncementsPage;
