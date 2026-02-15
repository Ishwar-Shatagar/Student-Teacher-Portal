
import React, { useContext, useState, useMemo, useRef } from 'react';
import { DataContext } from '../contexts/DataContext';
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext
import { Assignment, AssignmentFile, Student } from '../types'; // Import Student type
import { 
    DocumentIcon, 
    ArrowUpTrayIcon, 
    CheckCircleIcon, 
    ClockIcon, 
    ExclamationCircleIcon, 
    PaperClipIcon,
    XMarkIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

// --- Helper Components ---

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Submitted': 'bg-blue-100 text-blue-700 border-blue-200',
        'Overdue': 'bg-red-100 text-red-700 border-red-200',
        'Graded': 'bg-green-100 text-green-700 border-green-200',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    );
};

const FileIcon = ({ type }: { type: string }) => {
    // Simple icon mapper based on logic or extension could be improved
    return <DocumentIcon className="w-5 h-5 text-gray-400" />;
};

// --- Modal Component ---
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

// --- Main Page ---

const AssignmentsPage: React.FC = () => {
    const context = useContext(DataContext);
    const authContext = useContext(AuthContext); // Get Auth Context
    
    if (!context || !authContext) return <div>Loading...</div>;
    
    const { assignments, submitAssignment, students } = context;
    const { user } = authContext;

    // State
    const [filter, setFilter] = useState<'All' | 'Pending' | 'Submitted' | 'Overdue'>('All');
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null); // For viewing details
    const [submissionTarget, setSubmissionTarget] = useState<Assignment | null>(null); // For submission modal

    // Form State
    const [submissionFiles, setSubmissionFiles] = useState<File[]>([]);
    const [submissionComment, setSubmissionComment] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Identify current student details to filter assignments
    const currentStudent = useMemo(() => {
        if (user?.role === 'student') {
            return students.find(s => s.id === user.id);
        }
        return null;
    }, [user, students]);

    // Filtered Assignments Logic
    const relevantAssignments = useMemo(() => {
        if (!currentStudent) return []; // If not a student (or not found), show nothing or all (depending on policy)
        
        return assignments.filter(a => {
            // 1. Check Target Audience
            if (a.targetAudience) {
                const matchDept = a.targetAudience.department === currentStudent.department;
                const matchSem = a.targetAudience.semester === currentStudent.semester;
                // Optional: Add Section check if available in Student data
                return matchDept && matchSem;
            }
            return true; // Fallback if no target specified
        });
    }, [assignments, currentStudent]);

    // Computed Data based on RELEVANT assignments
    const stats = useMemo(() => ({
        total: relevantAssignments.length,
        pending: relevantAssignments.filter(a => a.status === 'Pending').length,
        submitted: relevantAssignments.filter(a => a.status === 'Submitted' || a.status === 'Graded').length,
        overdue: relevantAssignments.filter(a => a.status === 'Overdue').length,
    }), [relevantAssignments]);

    const filteredAssignments = useMemo(() => {
        return relevantAssignments.filter(a => {
            if (filter === 'All') return true;
            if (filter === 'Submitted') return a.status === 'Submitted' || a.status === 'Graded';
            return a.status === filter;
        }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }, [relevantAssignments, filter]);

    // Handlers
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSubmissionFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!submissionTarget) return;

        setIsUploading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const filesData: AssignmentFile[] = submissionFiles.map(f => ({
            name: f.name,
            url: '#', // Mock URL
            size: `${(f.size / 1024 / 1024).toFixed(2)} MB`,
            type: f.type
        }));

        submitAssignment(submissionTarget.id, filesData, submissionComment);
        
        setIsUploading(false);
        setSubmissionTarget(null);
        setSubmissionFiles([]);
        setSubmissionComment('');
    };

    const formatDueDate = (isoDate: string) => {
        const date = new Date(isoDate);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        let relativeStr = '';
        if (diffDays < 0) relativeStr = `Overdue by ${Math.abs(diffDays)} days`;
        else if (diffDays === 0) relativeStr = 'Due Today';
        else if (diffDays === 1) relativeStr = 'Due Tomorrow';
        else relativeStr = `Due in ${diffDays} days`;

        return {
            full: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }),
            relative: relativeStr,
            isUrgent: diffDays <= 2 && diffDays >= 0,
            isOverdue: diffDays < 0
        };
    };

    return (
        <div className="p-6 sm:p-8 min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Assignments</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                    {currentStudent 
                        ? `Showing assignments for ${currentStudent.department} Semester ${currentStudent.semester}` 
                        : 'View and submit your assignments.'}
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total', value: stats.total, icon: <DocumentIcon className="w-6 h-6" />, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Pending', value: stats.pending, icon: <ClockIcon className="w-6 h-6" />, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                    { label: 'Submitted', value: stats.submitted, icon: <CheckCircleIcon className="w-6 h-6" />, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Overdue', value: stats.overdue, icon: <ExclamationCircleIcon className="w-6 h-6" />, color: 'text-red-600', bg: 'bg-red-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-transform hover:scale-[1.02]">
                        <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between mb-6">
                <div className="bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 inline-flex shadow-sm">
                    {['All', 'Pending', 'Submitted', 'Overdue'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                                filter === f 
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Assignments Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAssignments.map(assignment => {
                    const dateInfo = formatDueDate(assignment.dueDate);
                    return (
                        <div key={assignment.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col">
                            
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <StatusBadge status={assignment.status} />
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2 leading-tight">{assignment.title}</h3>
                                    <p className="text-sm text-primary-600 font-medium cursor-pointer hover:underline">{assignment.subjectName}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-bold ${dateInfo.isOverdue ? 'text-red-600' : 'text-gray-600 dark:text-gray-300'}`}>
                                        {dateInfo.relative}
                                    </p>
                                    <p className="text-xs text-gray-400">{dateInfo.full}</p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                {assignment.description}
                            </p>

                            {/* Files Section (Preview) */}
                            {assignment.resources.length > 0 && (
                                <div className="mb-4 space-y-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase">Attachments</p>
                                    <div className="flex flex-wrap gap-2">
                                        {assignment.resources.map((file, idx) => (
                                            <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                                <FileIcon type={file.type} />
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate max-w-[120px]">{file.name}</span>
                                                    <span className="text-[10px] text-gray-400">{file.size}</span>
                                                </div>
                                                <a href={file.url} className="ml-1 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-blue-600">
                                                    <ArrowUpTrayIcon className="w-3 h-3 rotate-180" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                <div className="text-xs font-semibold text-gray-500">
                                    Max Marks: <span className="text-gray-900 dark:text-white">{assignment.maxMarks}</span>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setSelectedAssignment(assignment)}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        View Details
                                    </button>
                                    {assignment.status === 'Pending' || assignment.status === 'Overdue' ? (
                                        <button 
                                            onClick={() => setSubmissionTarget(assignment)}
                                            className="px-4 py-2 text-sm font-bold text-white bg-[#ff7043] hover:bg-[#f4511e] rounded-lg shadow-sm transition-colors"
                                        >
                                            Submit Assignment
                                        </button>
                                    ) : (
                                        <button disabled className="px-4 py-2 text-sm font-bold text-green-700 bg-green-100 rounded-lg cursor-default">
                                            {assignment.status === 'Graded' ? `Graded: ${assignment.grade}/${assignment.maxMarks}` : 'Submitted'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                {filteredAssignments.length === 0 && (
                    <div className="col-span-full p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">No assignments found.</p>
                        {relevantAssignments.length === 0 && (
                            <p className="text-xs text-gray-400 mt-1">No active assignments for your semester/department.</p>
                        )}
                    </div>
                )}
            </div>

            {/* --- Submission Modal --- */}
            <Modal 
                isOpen={!!submissionTarget} 
                onClose={() => setSubmissionTarget(null)} 
                title={`Submit: ${submissionTarget?.title}`}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File Uploader */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Files</label>
                        <div 
                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <ArrowUpTrayIcon className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-400 mt-1">PDF, DOCX, ZIP up to 10MB</p>
                            <input 
                                ref={fileInputRef} 
                                type="file" 
                                multiple 
                                className="hidden" 
                                onChange={handleFileSelect}
                            />
                        </div>
                        {/* Selected Files List */}
                        {submissionFiles.length > 0 && (
                            <ul className="mt-3 space-y-2">
                                {submissionFiles.map((f, i) => (
                                    <li key={i} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                                        <span className="truncate text-gray-700 dark:text-gray-200">{f.name}</span>
                                        <button type="button" onClick={() => setSubmissionFiles(files => files.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700">
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Comments */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comments (Optional)</label>
                        <textarea 
                            rows={3}
                            value={submissionComment}
                            onChange={e => setSubmissionComment(e.target.value)}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff7043] outline-none transition-all"
                            placeholder="Add any notes for the faculty..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button 
                            type="button" 
                            onClick={() => setSubmissionTarget(null)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isUploading || submissionFiles.length === 0}
                            className={`px-6 py-2 text-sm font-bold text-white bg-[#ff7043] hover:bg-[#f4511e] rounded-lg shadow-lg transition-all flex items-center gap-2 ${isUploading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {isUploading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Uploading...
                                </>
                            ) : 'Submit Assignment'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* --- Details Modal --- */}
            <Modal
                isOpen={!!selectedAssignment}
                onClose={() => setSelectedAssignment(null)}
                title="Assignment Details"
            >
                {selectedAssignment && (
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedAssignment.title}</h2>
                                <StatusBadge status={selectedAssignment.status} />
                            </div>
                            <p className="text-sm text-primary-600 font-medium mt-1">{selectedAssignment.subjectName} ({selectedAssignment.subjectCode})</p>
                            <div className="mt-2 text-sm text-gray-500 flex items-center gap-4">
                                <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> Due: {new Date(selectedAssignment.dueDate).toLocaleString()}</span>
                                <span>Max Marks: {selectedAssignment.maxMarks}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Description</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedAssignment.description}</p>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Resources</h4>
                            {selectedAssignment.resources.length > 0 ? (
                                <ul className="space-y-2">
                                    {selectedAssignment.resources.map((file, i) => (
                                        <li key={i} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-blue-500"><DocumentIcon className="w-5 h-5" /></div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{file.size}</p>
                                                </div>
                                            </div>
                                            <a href={file.url} className="text-sm font-medium text-primary-600 hover:underline">Download</a>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-sm text-gray-500 italic">No resources attached.</p>}
                        </div>

                        {/* Submission History Section */}
                        {selectedAssignment.submission && (
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Your Submission</h4>
                                <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 mb-2">Submitted on {new Date(selectedAssignment.submission.timestamp).toLocaleString()}</p>
                                    {selectedAssignment.submission.comment && (
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mb-3 italic">"{selectedAssignment.submission.comment}"</p>
                                    )}
                                    <div className="space-y-1">
                                        {selectedAssignment.submission.files.map((f, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                                                <PaperClipIcon className="w-4 h-4" /> {f.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {selectedAssignment.grade && (
                                    <div className="mt-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Grade: <span className="text-lg text-primary-600">{selectedAssignment.grade}</span> / {selectedAssignment.maxMarks}</p>
                                        {selectedAssignment.feedback && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Feedback: {selectedAssignment.feedback}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AssignmentsPage;
