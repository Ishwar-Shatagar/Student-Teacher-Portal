
import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { DataContext } from '../contexts/DataContext';
import { AuthContext } from '../contexts/AuthContext';
import { analyzeTimetableImage } from '../services/geminiService';
import { ExamTimetableEntry, Assignment, ProfessionalUser, StudentSubmissionEntry } from '../types';
import { 
    CalendarIcon, 
    PlusIcon, 
    TrashIcon, 
    EyeIcon, 
    ArrowDownTrayIcon, 
    ClockIcon, 
    ExclamationTriangleIcon,
    XMarkIcon,
    PaperClipIcon,
    MagnifyingGlassIcon,
    TableCellsIcon,
    ChatBubbleLeftEllipsisIcon,
    CheckBadgeIcon,
    BellIcon,
    FunnelIcon,
    CheckCircleIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';

// --- Types & Interfaces ---

interface SubmissionExtended extends StudentSubmissionEntry {
    semester: number;
    section: string; // Derived from student data
    email: string;
}

// --- Utility Functions ---

const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            const mimeType = result.split(',')[0].split(':')[1].split(';')[0];
            resolve({ base64, mimeType });
        };
        reader.onerror = error => reject(error);
    });
};

const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(v => `"${v}"`).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const StatusBadge = ({ status }: { status: string }) => {
    let style = 'bg-gray-100 text-gray-600';
    if (status === 'Submitted' || status === 'Graded') style = 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
    else if (status === 'Pending') style = 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
    else if (status === 'Late' || status === 'Overdue') style = 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style} inline-flex items-center gap-1`}>
            {status === 'Submitted' || status === 'Graded' ? <CheckCircleIcon className="w-3 h-3" /> : 
             status === 'Pending' ? <ClockIcon className="w-3 h-3" /> : 
             <ExclamationTriangleIcon className="w-3 h-3" />}
            {status}
        </span>
    );
};

// --- Sub-Components ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose?: () => void; title: string; children?: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col transform transition-all scale-100 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
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

const SubmissionDrawer = ({ 
    assignment, 
    isOpen, 
    onClose, 
    studentSubmission, 
    onGrade 
}: { 
    assignment: Assignment | null, 
    isOpen: boolean, 
    onClose: () => void, 
    studentSubmission: SubmissionExtended | null,
    onGrade: (studentId: string, marks: number, feedback: string) => void
}) => {
    const [marks, setMarks] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>('');

    useEffect(() => {
        if (studentSubmission) {
            setMarks(studentSubmission.marks || 0);
            setFeedback(studentSubmission.feedback || '');
        }
    }, [studentSubmission]);

    if (!isOpen || !assignment || !studentSubmission) return null;

    const handleSave = () => {
        onGrade(studentSubmission.studentId, marks, feedback);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col animate-slide-in-right border-l border-gray-200 dark:border-gray-800">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Submission Details</h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                            <XMarkIcon className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <img src={studentSubmission.photoUrl} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" />
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{studentSubmission.studentName}</h3>
                            <p className="text-sm text-gray-500 font-mono">{studentSubmission.usn}</p>
                            <p className="text-xs text-gray-400">Sem {studentSubmission.semester} • Sec {studentSubmission.section}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold uppercase text-gray-500">Status</h4>
                            <StatusBadge status={studentSubmission.status} />
                        </div>
                        
                        {studentSubmission.submissionDate ? (
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300 mb-4 flex gap-2 items-center">
                                <ClockIcon className="w-4 h-4" />
                                Submitted on {new Date(studentSubmission.submissionDate).toLocaleString()}
                            </div>
                        ) : (
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-300 mb-4 flex gap-2 items-center">
                                <ExclamationTriangleIcon className="w-4 h-4" />
                                Student has not submitted yet.
                            </div>
                        )}

                        <h4 className="text-sm font-bold uppercase text-gray-500 mb-2">Attachments</h4>
                        {studentSubmission.files && studentSubmission.files.length > 0 ? (
                            <div className="space-y-2">
                                {studentSubmission.files.map((file, i) => (
                                    <a key={i} href={file.url} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <PaperClipIcon className="w-5 h-5 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{file.name}</span>
                                        </div>
                                        <ArrowDownTrayIcon className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No files attached.</p>
                        )}
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-bold uppercase text-gray-500 mb-4">Evaluation</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marks (Max: {assignment.maxMarks})</label>
                                <input 
                                    type="number" 
                                    max={assignment.maxMarks}
                                    value={marks}
                                    onChange={e => setMarks(Number(e.target.value))}
                                    className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Feedback</label>
                                <textarea 
                                    rows={4}
                                    value={feedback}
                                    onChange={e => setFeedback(e.target.value)}
                                    className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                                    placeholder="Great work on the analysis..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-lg shadow-primary-600/20 transition-transform active:scale-95">Save & Notify</button>
                </div>
            </div>
        </div>
    );
};

// --- Main Page ---

const ExamAssignmentPage: React.FC = () => {
    const context = useContext(DataContext);
    const { user } = useContext(AuthContext);

    // --- Tabs & Layout State ---
    const [activeTab, setActiveTab] = useState<'timetable' | 'assignments'>('assignments');
    const [timetableImage, setTimetableImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // --- Assignment Management State ---
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
    const [toast, setToast] = useState<{type: 'success'|'error'|'info', msg: string} | null>(null);
    
    // --- Submission List State (New) ---
    const [submissionTab, setSubmissionTab] = useState<'submitted' | 'pending'>('submitted');
    const [viewStudentId, setViewStudentId] = useState<string | null>(null);

    // --- Create Form State ---
    const [newTitle, setNewTitle] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newMarks, setNewMarks] = useState(20);
    const [newSection, setNewSection] = useState<string[]>(['A']);

    if (!context || !user) return <div>Loading...</div>;
    const { 
        examTimetable, 
        setExamTimetable, 
        createAssignment, 
        assignments, 
        deleteAssignment, 
        getStudentSubmissionsForAssignment, 
        gradeAssignmentSubmission, 
        students,
        sendNotification
    } = context;
    const facultyUser = user as ProfessionalUser;

    // --- Derived Data ---

    const myAssignments = useMemo(() => {
         return assignments
            .filter(a => a.facultyId === user.id)
            .sort((a,b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }, [assignments, user.id]);

    const selectedAssignment = useMemo(() => {
        return myAssignments.find(a => a.id === selectedAssignmentId) || null;
    }, [myAssignments, selectedAssignmentId]);

    const enrichedSubmissions: SubmissionExtended[] = useMemo(() => {
        if (!selectedAssignmentId) return [];
        const rawSubs = getStudentSubmissionsForAssignment(selectedAssignmentId);
        
        return rawSubs.map(sub => {
            const studentProfile = students.find(s => s.id === sub.studentId);
            return {
                ...sub,
                semester: studentProfile?.semester || 0,
                section: 'A', 
                email: studentProfile?.email || ''
            };
        });
    }, [selectedAssignmentId, context.assignments, students]);

    const submittedList = useMemo(() => 
        enrichedSubmissions.filter(s => s.status === 'Submitted' || s.status === 'Graded' || s.status === 'Late'),
    [enrichedSubmissions]);

    const pendingList = useMemo(() => 
        enrichedSubmissions.filter(s => s.status === 'Pending'),
    [enrichedSubmissions]);

    const stats = useMemo(() => {
        const total = enrichedSubmissions.length || 1;
        const submitted = submittedList.length;
        const pending = pendingList.length;
        const percent = Math.round((submitted / total) * 100);
        return { total, submitted, pending, percent };
    }, [enrichedSubmissions, submittedList, pendingList]);

    // --- Handlers ---

    const handleCreateAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        const subjectDetails = facultyUser.subjectsTaught.find(s => s.code === newSubject);
        if (!subjectDetails) return;

        const newAssignment: Assignment = {
            id: `assign-${Date.now()}`,
            title: newTitle,
            description: newDesc,
            subjectCode: subjectDetails.code,
            subjectName: subjectDetails.name,
            dueDate: new Date(newDate).toISOString(),
            maxMarks: Number(newMarks),
            resources: [],
            status: 'Pending',
            facultyId: user.id,
            targetAudience: {
                department: facultyUser.department,
                semester: subjectDetails.semester,
                section: newSection.length > 0 ? newSection : ['A']
            },
            createdAt: new Date().toISOString()
        };

        createAssignment(newAssignment);
        setIsCreateModalOpen(false);
        setToast({ type: 'success', msg: 'Assignment created & published!' });
        setTimeout(() => setToast(null), 3000);
        setNewTitle(''); setNewDesc(''); setNewDate('');
    };

    const handleGrade = (studentId: string, marks: number, feedback: string) => {
        if (selectedAssignmentId) {
            gradeAssignmentSubmission(selectedAssignmentId, studentId, marks, feedback);
            setToast({ type: 'success', msg: 'Grade saved successfully.' });
            setTimeout(() => setToast(null), 2000);
        }
    };

    const handleRemindStudent = (studentId: string) => {
        setToast({ type: 'info', msg: 'Reminder sent.' });
        // In real app call sendNotification here
        setTimeout(() => setToast(null), 2000);
    };

    const handleRemindAllPending = () => {
        if(pendingList.length === 0) return;
        if(window.confirm(`Send reminders to ${pendingList.length} pending students?`)) {
            setToast({ type: 'success', msg: `Reminders queued for ${pendingList.length} students.` });
            setTimeout(() => setToast(null), 3000);
        }
    };

     const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setError('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setTimetableImage(URL.createObjectURL(file));

        try {
            const { base64, mimeType } = await fileToBase64(file);
            const extractedData = await analyzeTimetableImage(base64, mimeType);
            setExamTimetable(extractedData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setTimetableImage(null);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render ---

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-[60] px-6 py-3 rounded-lg shadow-xl text-white font-semibold animate-slide-in flex items-center gap-2 ${
                    toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                }`}>
                    {toast.type === 'info' && <BellIcon className="w-5 h-5 animate-bounce" />}
                    {toast.msg}
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Exam & Assignment Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Create assignments, grade submissions, and manage exam schedules.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <button 
                            onClick={() => setActiveTab('assignments')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'assignments' ? 'bg-primary-600 text-white shadow' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            Assignments
                        </button>
                        <button 
                            onClick={() => setActiveTab('timetable')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'timetable' ? 'bg-primary-600 text-white shadow' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            Timetable
                        </button>
                    </div>
                    {activeTab === 'assignments' && (
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 transition-transform active:scale-95"
                        >
                            <PlusIcon className="w-5 h-5" /> New Assignment
                        </button>
                    )}
                </div>
            </div>

            {activeTab === 'assignments' && (
                <div className="space-y-8 animate-fade-in">
                    
                    {/* 1. Active Assignments List */}
                    <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
                        <div className="flex gap-4 min-w-max">
                            {myAssignments.map(assign => {
                                const subCount = getStudentSubmissionsForAssignment(assign.id).filter(s => s.status !== 'Pending').length;
                                const totalCount = getStudentSubmissionsForAssignment(assign.id).length || 1;
                                const percent = Math.round((subCount / totalCount) * 100);
                                const isSelected = selectedAssignmentId === assign.id;

                                return (
                                    <div 
                                        key={assign.id}
                                        onClick={() => { setSelectedAssignmentId(assign.id); setSubmissionTab('submitted'); }}
                                        className={`relative min-w-[280px] p-5 rounded-2xl border cursor-pointer transition-all duration-200 group flex flex-col
                                            ${isSelected 
                                                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 ring-1 ring-primary-500 shadow-md' 
                                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 shadow-sm hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wide rounded-full">
                                                {assign.subjectCode}
                                            </span>
                                            {isSelected && <CheckBadgeIcon className="w-5 h-5 text-primary-600" />}
                                        </div>
                                        
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate mb-1" title={assign.title}>{assign.title}</h3>
                                        
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                            <ClockIcon className="w-4 h-4" />
                                            <span>Due: {new Date(assign.dueDate).toLocaleDateString()}</span>
                                        </div>
                                        
                                        <div className="mt-auto">
                                            <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
                                                <span>Progress</span>
                                                <span>{percent}% ({subCount}/{totalCount})</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-500 ${percent === 100 ? 'bg-green-500' : 'bg-primary-500'}`} 
                                                    style={{ width: `${percent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                             {/* Add New Placeholer */}
                            <div 
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex flex-col items-center justify-center min-w-[120px] p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-400 hover:text-primary-500 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 cursor-pointer transition-all"
                            >
                                <PlusIcon className="w-8 h-8 mb-2" />
                                <span className="text-xs font-bold">New Assignment</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Submission List Section */}
                    {selectedAssignmentId && selectedAssignment ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-up flex flex-col min-h-[500px]">
                            
                            {/* Header Info */}
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                        {selectedAssignment.title}
                                        <span className={`text-xs px-2 py-0.5 rounded border ${new Date(selectedAssignment.dueDate) < new Date() ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                                            {new Date(selectedAssignment.dueDate) < new Date() ? 'Closed' : 'Active'}
                                        </span>
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">{selectedAssignment.subjectName} • Max Marks: {selectedAssignment.maxMarks}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => deleteAssignment(selectedAssignment.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Assignment">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
                                <button
                                    onClick={() => setSubmissionTab('submitted')}
                                    className={`pb-3 pt-4 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${submissionTab === 'submitted' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                                >
                                    Submitted <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 px-2 py-0.5 rounded-full text-xs">{stats.submitted}</span>
                                </button>
                                <button
                                    onClick={() => setSubmissionTab('pending')}
                                    className={`pb-3 pt-4 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${submissionTab === 'pending' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                                >
                                    Pending <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 px-2 py-0.5 rounded-full text-xs">{stats.pending}</span>
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1 p-0">
                                {/* Submitted View */}
                                {submissionTab === 'submitted' && (
                                    <>
                                        {submittedList.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left text-sm whitespace-nowrap">
                                                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 font-semibold">
                                                        <tr>
                                                            <th className="p-4 pl-6">Student</th>
                                                            <th className="p-4">Class</th>
                                                            <th className="p-4">Status</th>
                                                            <th className="p-4">Submitted At</th>
                                                            <th className="p-4 text-center">Files</th>
                                                            <th className="p-4 text-center">Marks</th>
                                                            <th className="p-4 pr-6 text-right">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                        {submittedList.map(sub => (
                                                            <tr key={sub.studentId} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                                <td className="p-4 pl-6">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                                                            {sub.studentName.charAt(0)}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold text-gray-900 dark:text-white">{sub.studentName}</p>
                                                                            <p className="text-xs text-gray-500 font-mono">{sub.usn}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 text-gray-600 dark:text-gray-300">
                                                                    Sem {sub.semester} - {sub.section}
                                                                </td>
                                                                <td className="p-4"><StatusBadge status={sub.status} /></td>
                                                                <td className="p-4 text-gray-500">
                                                                    {new Date(sub.submissionDate!).toLocaleString()}
                                                                </td>
                                                                <td className="p-4 text-center">
                                                                    {sub.files && sub.files.length > 0 ? (
                                                                        <div className="flex justify-center gap-1">
                                                                            {sub.files.map((f, i) => (
                                                                                <a key={i} href={f.url} title={f.name} className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                                                                                    <PaperClipIcon className="w-4 h-4" />
                                                                                </a>
                                                                            ))}
                                                                        </div>
                                                                    ) : <span className="text-gray-300">-</span>}
                                                                </td>
                                                                <td className="p-4 text-center font-semibold text-gray-700 dark:text-gray-200">
                                                                    {sub.marks !== undefined ? `${sub.marks}/${selectedAssignment.maxMarks}` : '-'}
                                                                </td>
                                                                <td className="p-4 pr-6 text-right">
                                                                    <button 
                                                                        onClick={() => setViewStudentId(sub.studentId)}
                                                                        className="px-3 py-1.5 text-xs font-semibold text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                                                                    >
                                                                        {sub.status === 'Graded' ? 'View / Edit' : 'Grade'}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                                    <ArrowDownTrayIcon className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No submissions yet</h3>
                                                <p className="text-gray-500 max-w-xs mt-1">Students are yet to submit this assignment.</p>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Pending View */}
                                {submissionTab === 'pending' && (
                                    <>
                                        {pendingList.length > 0 ? (
                                            <div>
                                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border-b border-yellow-100 dark:border-yellow-900/30 flex justify-between items-center">
                                                    <div className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
                                                        <ExclamationTriangleIcon className="w-5 h-5" />
                                                        <span>{pendingList.length} students pending submission.</span>
                                                    </div>
                                                    <button onClick={handleRemindAllPending} className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-lg shadow-sm hover:bg-yellow-50 transition-colors flex items-center gap-2">
                                                        <BellIcon className="w-4 h-4" /> Remind All
                                                    </button>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 font-semibold">
                                                            <tr>
                                                                <th className="p-4 pl-6">Student</th>
                                                                <th className="p-4">Class</th>
                                                                <th className="p-4">Status</th>
                                                                <th className="p-4">Due Date</th>
                                                                <th className="p-4 pr-6 text-right">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                            {pendingList.map(sub => (
                                                                <tr key={sub.studentId} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                                    <td className="p-4 pl-6">
                                                                        <div className="flex items-center gap-3">
                                                                            <img src={sub.photoUrl} className="w-9 h-9 rounded-full object-cover bg-gray-200" />
                                                                            <div>
                                                                                <p className="font-bold text-gray-900 dark:text-white">{sub.studentName}</p>
                                                                                <p className="text-xs text-gray-500 font-mono">{sub.usn}</p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 text-gray-600 dark:text-gray-300">Sem {sub.semester} - {sub.section}</td>
                                                                    <td className="p-4"><StatusBadge status="Pending" /></td>
                                                                    <td className="p-4 text-red-500 font-medium text-xs">
                                                                        {new Date(selectedAssignment.dueDate) < new Date() ? 'Overdue' : `Due ${new Date(selectedAssignment.dueDate).toLocaleDateString()}`}
                                                                    </td>
                                                                    <td className="p-4 pr-6 text-right">
                                                                        <button 
                                                                            onClick={() => handleRemindStudent(sub.studentId)}
                                                                            className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1 ml-auto"
                                                                        >
                                                                            <EnvelopeIcon className="w-3 h-3" /> Remind
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-500">
                                                    <CheckBadgeIcon className="w-10 h-10" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Caught Up!</h3>
                                                <p className="text-gray-500 max-w-xs mt-1">Every student has submitted this assignment.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl bg-gray-50 dark:bg-gray-800/50 text-gray-400 transition-all">
                            <TableCellsIcon className="w-16 h-16 mb-4 opacity-50" />
                            <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300">No Assignment Selected</h3>
                            <p className="text-sm mt-1">Select an assignment from the list above to view submissions and grade students.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'timetable' && (
                 <div className="space-y-6 animate-fade-in">
                    {/* Timetable Uploader (Existing Logic Preserved) */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Upload Timetable</h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Upload an image (JPG, PNG) of the official exam schedule. AI will automatically extract dates and subjects.
                                </p>
                                {error && <div className="p-4 mb-4 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2"><ExclamationTriangleIcon className="w-5 h-5" /> {error}</div>}
                                <label className="cursor-pointer inline-flex items-center gap-3 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-600/20 transition-all">
                                    {isLoading ? <span className="animate-pulse">Analyzing...</span> : 'Choose Image'}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isLoading} />
                                </label>
                            </div>
                            {timetableImage && (
                                <div className="w-full md:w-1/3 bg-gray-100 dark:bg-gray-900 rounded-xl p-2 shadow-inner">
                                    <img src={timetableImage} alt="Preview" className="w-full h-48 object-contain rounded-lg" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Extracted Timetable Table */}
                    {examTimetable.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Extracted Schedule</h3>
                                <button onClick={() => setExamTimetable([])} className="text-red-500 hover:text-red-700 text-sm font-semibold">Clear</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 font-semibold uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Time</th>
                                            <th className="p-4">Subject</th>
                                            <th className="p-4">Code</th>
                                            <th className="p-4 text-center">Sem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {examTimetable.map((entry, i) => (
                                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                                <td className="p-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                    {new Date(entry.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                </td>
                                                <td className="p-4 text-gray-500">{entry.time}</td>
                                                <td className="p-4 font-semibold text-primary-600">{entry.subjectName}</td>
                                                <td className="p-4 font-mono text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded w-fit">{entry.subjectCode}</td>
                                                <td className="p-4 text-center">{entry.semester}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                 </div>
            )}

            {/* --- Modals & Drawers --- */}
            
            {/* Create Assignment Modal */}
            <Modal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                title="Create New Assignment"
            >
                <form onSubmit={handleCreateAssignment} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                            <select 
                                required
                                value={newSubject}
                                onChange={e => setNewSubject(e.target.value)}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="">Select Subject</option>
                                {facultyUser.subjectsTaught.map(s => <option key={s.code} value={s.code}>{s.name} ({s.code})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                            <input 
                                type="datetime-local" 
                                required
                                value={newDate}
                                onChange={e => setNewDate(e.target.value)}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input 
                            type="text" 
                            required
                            placeholder="e.g., Lab Report 1"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea 
                            rows={3}
                            placeholder="Instructions for students..."
                            value={newDesc}
                            onChange={e => setNewDesc(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                        ></textarea>
                    </div>

                    <div className="flex gap-5">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Max Marks</label>
                            <input 
                                type="number" 
                                min={1}
                                value={newMarks}
                                onChange={e => setNewMarks(Number(e.target.value))}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div className="flex-1">
                             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Target Section</label>
                             <div className="flex gap-2 mt-2">
                                 {['A', 'B', 'C'].map(sec => (
                                     <button
                                        type="button"
                                        key={sec}
                                        onClick={() => setNewSection(prev => prev.includes(sec) ? prev.filter(s => s!==sec) : [...prev, sec])}
                                        className={`px-3 py-1 rounded-lg text-sm font-semibold border ${newSection.includes(sec) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600'}`}
                                     >
                                         {sec}
                                     </button>
                                 ))}
                             </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                        <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-600/20">Create & Publish</button>
                    </div>
                </form>
            </Modal>
            
            {/* Detailed Submission Drawer */}
            <SubmissionDrawer 
                assignment={selectedAssignment || null}
                isOpen={!!viewStudentId}
                onClose={() => setViewStudentId(null)}
                studentSubmission={viewStudentId ? enrichedSubmissions.find(s => s.studentId === viewStudentId) || null : null}
                onGrade={handleGrade}
            />

        </div>
    );
};

export default ExamAssignmentPage;
