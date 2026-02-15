
import React, { useState, useContext, useMemo } from 'react';
import { DataContext } from '../contexts/DataContext';
import { AuthContext } from '../contexts/AuthContext';
import { LeaveRequestEmail, FacultyLeaveProfile } from '../types';
import { 
    InboxArrowDownIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    ClockIcon, 
    PaperClipIcon, 
    UserIcon, 
    CalendarIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ChartPieIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- Helper Components ---

const StatusBadge = ({ status }: { status: string }) => {
    switch(status) {
        case 'approved': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Approved</span>;
        case 'rejected': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Rejected</span>;
        case 'pending': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</span>;
        default: return <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">Unread</span>;
    }
};

const KPICard = ({ label, value, subtext, color }: any) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</p>
        <h3 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h3>
        <p className="text-xs text-gray-400 mt-1">{subtext}</p>
    </div>
);

const HistoryDrawer: React.FC<{ profile: FacultyLeaveProfile | null; onClose: () => void }> = ({ profile, onClose }) => {
    if (!profile) return null;
    
    const chartData = profile.history.reduce((acc: any[], curr) => {
        const month = new Date(curr.fromDate).toLocaleString('default', { month: 'short' });
        const existing = acc.find(item => item.month === month);
        if (existing) existing.days += curr.days;
        else acc.push({ month, days: curr.days });
        return acc;
    }, []);

    return (
        <>
            <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col transform transition-transform animate-slide-in-right">
                <div className="p-6 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.facultyName}</h2>
                            <p className="text-sm text-gray-500">{profile.department}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">&times;</button>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                            <p className="text-xs text-gray-500">Total CL</p>
                            <p className="font-bold">{profile.totalCL}</p>
                        </div>
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                            <p className="text-xs text-gray-500">Taken</p>
                            <p className="font-bold text-orange-600">{profile.takenCL}</p>
                        </div>
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                            <p className="text-xs text-gray-500">Balance</p>
                            <p className="font-bold text-green-600">{profile.totalCL - profile.takenCL}</p>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 flex-1 overflow-y-auto">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Usage Trend</h3>
                    <div className="h-32 w-full mb-6">
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <XAxis dataKey="month" tick={{fontSize: 10}} />
                                <Tooltip />
                                <Bar dataKey="days" fill="#8884d8" radius={[4,4,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Leave History</h3>
                    <div className="space-y-3">
                        {profile.history.map((entry) => (
                            <div key={entry.id} className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg text-sm">
                                <div className="flex justify-between mb-1">
                                    <span className={`font-bold uppercase ${entry.leaveType === 'CL' ? 'text-blue-600' : 'text-purple-600'}`}>{entry.leaveType}</span>
                                    <span className={`text-xs font-bold ${entry.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>{entry.status}</span>
                                </div>
                                <p className="text-gray-800 dark:text-gray-200">{entry.fromDate} to {entry.toDate} <span className="text-gray-400">({entry.days} days)</span></p>
                                <p className="text-gray-500 text-xs mt-1">Reason: {entry.reason}</p>
                                <p className="text-gray-400 text-[10px] mt-1 text-right">Approved by: {entry.approvedBy}</p>
                            </div>
                        ))}
                        {profile.history.length === 0 && <p className="text-gray-500 italic text-center">No leave history found.</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

// --- Main Page ---

const HodLeavePage: React.FC = () => {
    const { 
        leaveEmails, 
        facultyLeaveBalances, 
        approveLeaveRequest, 
        rejectLeaveRequest, 
        refreshLeaveEmails 
    } = useContext(DataContext)!;
    const { user } = useContext(AuthContext);

    // UI State
    const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<'All' | 'pending' | 'approved' | 'rejected'>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<FacultyLeaveProfile | null>(null);
    
    // Action Modal State
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
    const [comment, setComment] = useState('');

    // Derived Data
    const filteredEmails = useMemo(() => {
        return leaveEmails.filter(email => {
            const matchesFilter = filterStatus === 'All' || email.status === filterStatus;
            const matchesSearch = email.senderName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  email.subject.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        }).sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
    }, [leaveEmails, filterStatus, searchTerm]);

    const selectedEmail = useMemo(() => leaveEmails.find(e => e.id === selectedEmailId), [leaveEmails, selectedEmailId]);

    // Handlers
    const handleSync = async () => {
        setIsSyncing(true);
        await refreshLeaveEmails();
        setIsSyncing(false);
    };

    const executeAction = () => {
        if (!selectedEmail || !actionType) return;
        
        if (actionType === 'approve') {
            approveLeaveRequest(selectedEmail.id, user?.name || 'HOD', comment || 'Approved via Dashboard');
        } else {
            rejectLeaveRequest(selectedEmail.id, comment || 'Rejected');
        }
        setActionType(null);
        setComment('');
    };

    // KPI Stats
    const stats = {
        pending: leaveEmails.filter(e => e.status === 'pending').length,
        onLeave: facultyLeaveBalances.filter(f => {
             // Mock logic: check if history has today's date. 
             // For demo, just random number or 0
             return false; 
        }).length,
        lowBalance: facultyLeaveBalances.filter(f => (f.totalCL - f.takenCL) < 3).length
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
            {/* --- Left Pane: Inbox --- */}
            <div className="w-80 md:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0 z-10">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Leave Inbox</h2>
                        <button 
                            onClick={handleSync} 
                            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all ${isSyncing ? 'animate-spin text-primary-500' : 'text-gray-500'}`}
                            title="Sync Emails"
                        >
                            <ArrowPathIcon className="w-5 h-5" />
                        </button>
                    </div>
                    
                    {/* Search */}
                    <div className="relative mb-3">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search requests..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {['All', 'pending', 'approved'].map(status => (
                            <button 
                                key={status}
                                onClick={() => setFilterStatus(status as any)}
                                className={`px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors ${filterStatus === status ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredEmails.map(email => (
                        <div 
                            key={email.id}
                            onClick={() => setSelectedEmailId(email.id)}
                            className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${selectedEmailId === email.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`font-bold text-sm truncate ${email.status === 'unread' ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {email.senderName}
                                </h4>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                    {new Date(email.receivedAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{email.subject}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{email.body}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <StatusBadge status={email.status} />
                                {email.attachments && <PaperClipIcon className="w-3 h-3 text-gray-400" />}
                            </div>
                        </div>
                    ))}
                    {filteredEmails.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-sm">No emails found.</div>
                    )}
                </div>
            </div>

            {/* --- Middle Pane: Preview --- */}
            <div className="flex-1 bg-white dark:bg-gray-900 flex flex-col min-w-0">
                {selectedEmail ? (
                    <>
                        {/* Toolbar */}
                        <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                    {selectedEmail.senderName.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedEmail.senderName}</p>
                                    <p className="text-xs text-gray-500">{selectedEmail.senderEmail}</p>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400">
                                {new Date(selectedEmail.receivedAt).toLocaleString()}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {/* AI Extraction Box */}
                            {selectedEmail.aiParsedData && (
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4 mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1 bg-indigo-100 dark:bg-indigo-800 rounded text-indigo-600 dark:text-indigo-300">
                                            <ChartPieIcon className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wide text-indigo-800 dark:text-indigo-300">AI Parsed Details</span>
                                        <span className="ml-auto text-xs bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400">
                                            {selectedEmail.aiParsedData.confidenceScore}% Confidence
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-xs text-indigo-500 dark:text-indigo-400 mb-1">Leave Type</p>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">{selectedEmail.aiParsedData.leaveType}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-indigo-500 dark:text-indigo-400 mb-1">Duration</p>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">{selectedEmail.aiParsedData.days} Day(s)</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-indigo-500 dark:text-indigo-400 mb-1">Dates</p>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">{selectedEmail.aiParsedData.fromDate} <span className="text-gray-400">to</span> {selectedEmail.aiParsedData.toDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-indigo-500 dark:text-indigo-400 mb-1">Reason</p>
                                            <p className="font-bold text-gray-800 dark:text-gray-200 truncate" title={selectedEmail.aiParsedData.reason}>{selectedEmail.aiParsedData.reason}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{selectedEmail.subject}</h1>
                            
                            <div className="prose dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-8">
                                {selectedEmail.body}
                            </div>

                            {selectedEmail.attachments && (
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-3">Attachments</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedEmail.attachments.map((att, idx) => (
                                            <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <PaperClipIcon className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{att.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sticky Action Footer */}
                        {selectedEmail.status === 'pending' && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 flex-shrink-0">
                                <button 
                                    onClick={() => setActionType('reject')}
                                    className="px-4 py-2 text-sm font-bold text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                                >
                                    Reject
                                </button>
                                <button 
                                    onClick={() => setActionType('approve')}
                                    className="px-6 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-md transition-colors"
                                >
                                    Approve Request
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <InboxArrowDownIcon className="w-16 h-16 mb-4 opacity-50" />
                        <p>Select an email to read</p>
                    </div>
                )}
            </div>

            {/* --- Right Pane: CL Stats --- */}
            <div className="hidden lg:flex w-80 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex-col flex-shrink-0 overflow-y-auto p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Overview</h3>
                
                <div className="space-y-4 mb-8">
                    <KPICard label="Pending Actions" value={stats.pending} subtext="Emails requiring review" color="text-orange-600" />
                    <KPICard label="Faculty on Leave" value={stats.onLeave} subtext="Currently absent" color="text-blue-600" />
                    <KPICard label="Low Balance" value={stats.lowBalance} subtext="< 3 CL remaining" color="text-red-600" />
                </div>

                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 flex items-center justify-between">
                    Faculty Balances
                    <FunnelIcon className="w-4 h-4 text-gray-400 cursor-pointer" />
                </h3>

                <div className="space-y-2">
                    {facultyLeaveBalances.map(prof => {
                        const balance = prof.totalCL - prof.takenCL;
                        const percentage = (balance / prof.totalCL) * 100;
                        return (
                            <div 
                                key={prof.facultyId} 
                                onClick={() => setSelectedProfile(prof)}
                                className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all group"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">{prof.facultyName}</p>
                                        <p className="text-[10px] text-gray-500">{prof.department}</p>
                                    </div>
                                    <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Balance: <span className={`font-bold ${balance < 3 ? 'text-red-500' : 'text-green-600'}`}>{balance}</span> / {prof.totalCL}</span>
                                </div>
                                <div className="mt-2 h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${percentage < 20 ? 'bg-red-500' : percentage < 50 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${percentage}%` }}></div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* --- Modals & Drawers --- */}
            
            {/* Action Modal */}
            {actionType && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 capitalize">
                            {actionType} Request?
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            {actionType === 'approve' 
                                ? `This will deduct ${selectedEmail?.aiParsedData?.days} day(s) of ${selectedEmail?.aiParsedData?.leaveType} from the faculty's balance.` 
                                : 'Please provide a reason for rejection.'}
                        </p>
                        
                        <textarea 
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm mb-4 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 outline-none"
                            rows={3}
                            placeholder={actionType === 'approve' ? "Optional comments..." : "Reason for rejection..."}
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            autoFocus
                        ></textarea>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setActionType(null)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                            <button 
                                onClick={executeAction}
                                className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-md ${actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* History Drawer */}
            <HistoryDrawer profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
        </div>
    );
};

export default HodLeavePage;
