
import React, { useContext, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataContext';
import { ProfessionalUser, Student, StudentAttendanceLog } from '../types';
import * as Icons from '../components/common/Icons';
import { CameraIcon, CheckCircleIcon, XMarkIcon, UserGroupIcon, SparklesIcon, ArrowPathIcon, ArrowDownTrayIcon, Cog6ToothIcon, UserPlusIcon } from '@heroicons/react/24/outline';

// --- Helper Types ---
interface RecognizedFace {
    studentId: string;
    confidence: number;
    bbox: { x: number, y: number, w: number, h: number };
}

const AttendancePage: React.FC = () => {
    const authContext = useContext(AuthContext);
    const dataContext = useContext(DataContext);

    if (!authContext || !dataContext) return <div>Loading...</div>;

    const { user } = authContext;

    if (user?.role === 'student') {
        const student = dataContext.students.find(s => s.id === user.id);
        return student ? <StudentAttendanceView student={student} /> : <div>Student data not found.</div>;
    }
    
    // Allow Faculty, HOD, and Admin to access the management view
    if (user?.role === 'faculty' || user?.role === 'hod_principal' || user?.role === 'admin') {
        return <TeacherAttendanceView faculty={user as ProfessionalUser} />;
    }
    
    return null;
};


// ----------------- STUDENT VIEW (Preserved) -----------------

const StudentAttendanceView: React.FC<{ student: Student }> = ({ student }) => {
    const overall = student.attendance.reduce((acc, record) => {
        acc.total += record.totalClasses;
        acc.attended += record.classesAttended;
        return acc;
    }, { total: 0, attended: 0 });

    const overallPercentage = overall.total > 0 ? ((overall.attended / overall.total) * 100).toFixed(2) : '0.00';
    const isBelowThreshold = parseFloat(overallPercentage) < 85;
    
    return (
        <div className="student-attendance-view p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">My Attendance</h1>
            {isBelowThreshold && (
                    <div className="p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                    <span className="font-medium">Warning!</span> Your overall attendance is below 85%. Please attend classes regularly.
                </div>
            )}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8 flex flex-col sm:flex-row items-center justify-around gap-6">
                <div className="text-center sm:text-left">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Overall Percentage</h2>
                    <p className={`text-5xl font-bold mt-2 ${isBelowThreshold ? 'text-red-500' : 'text-green-500'}`}>{overallPercentage}%</p>
                </div>
                <div className="flex gap-8">
                    <div className="text-center">
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{overall.attended}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Attended</p>
                    </div>
                        <div className="text-center">
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{overall.total}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Classes</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Subject-wise Attendance</h2>
                    <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Subject</th>
                                <th className="p-3 font-semibold text-center text-gray-700 dark:text-gray-300">Attended</th>
                                <th className="p-3 font-semibold text-center text-gray-700 dark:text-gray-300">Total</th>
                                <th className="p-3 font-semibold text-center text-gray-700 dark:text-gray-300">Percentage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {student.attendance.map(record => {
                                const percentage = record.totalClasses > 0 ? ((record.classesAttended / record.totalClasses) * 100) : 0;
                                const isLow = percentage < 85;
                                return (
                                    <tr key={record.subjectCode} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{record.subjectName}</td>
                                        <td className="p-3 text-center text-gray-600 dark:text-gray-400">{record.classesAttended}</td>
                                        <td className="p-3 text-center text-gray-600 dark:text-gray-400">{record.totalClasses}</td>
                                        <td className={`p-3 text-center font-bold ${isLow ? 'text-red-500' : 'text-green-500'}`}>{percentage.toFixed(2)}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ----------------- TEACHER VIEW (Enhanced) -----------------

const TeacherAttendanceView: React.FC<{ faculty: ProfessionalUser }> = ({ faculty }) => {
    const dataContext = useContext(DataContext);
    
    // Header State
    const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSession, setSelectedSession] = useState('09:00-10:00');
    
    // UI State
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.65);
    
    // Data State
    const [roster, setRoster] = useState<StudentAttendanceLog[]>([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    
    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    if (!dataContext) return <div>Loading context...</div>;
    const { students, saveSessionAttendance, studentAttendanceLogs, setStudentTrainingPhoto } = dataContext;

    // Derived
    const subjectDetails = faculty.subjectsTaught.find(s => s.code === selectedSubjectCode);
    const enrolledStudents = useMemo(() => {
        if (!selectedSubjectCode) return [];
        // Filter students who have this subject in their attendance record or derived from department/sem
        // In mock data, we use semester matching for simplicity
        const targetSem = faculty.subjectsTaught.find(s => s.code === selectedSubjectCode)?.semester;
        return students.filter(s => s.semester === targetSem);
    }, [students, selectedSubjectCode, faculty.subjectsTaught]);

    // --- Effects ---

    // Load existing logs or init default roster
    useEffect(() => {
        if (!selectedSubjectCode) {
            setRoster([]);
            return;
        }

        const existingLogs = studentAttendanceLogs.filter(l => 
            l.subjectCode === selectedSubjectCode && 
            l.date === selectedDate && 
            l.sessionId === selectedSession
        );

        if (existingLogs.length > 0) {
            setRoster(existingLogs);
        } else {
            // Init empty/default
            const newRoster: StudentAttendanceLog[] = enrolledStudents.map(s => ({
                id: `log-${Date.now()}-${s.id}`,
                studentId: s.id,
                subjectCode: selectedSubjectCode,
                date: selectedDate,
                sessionId: selectedSession,
                status: 'Absent', // Default to Absent or Present based on policy. Using Absent for safety.
                method: 'manual',
                timestamp: new Date().toISOString()
            }));
            setRoster(newRoster);
        }
        setHasUnsavedChanges(false);
        setFeedback({ message: '', type: '' });

    }, [selectedSubjectCode, selectedDate, selectedSession, enrolledStudents, studentAttendanceLogs]);

    // Camera Stream Management
    useEffect(() => {
        if (isCameraOn && currentStream && videoRef.current) {
            videoRef.current.srcObject = currentStream;
            // Explicitly call play to ensure the video starts on all devices
            videoRef.current.play().catch(err => {
                console.error("Error playing video:", err);
                setCameraError("Could not play video stream.");
            });
        }
    }, [isCameraOn, currentStream]);

    // Cleanup Camera Stream on Unmount or Stream Change
    useEffect(() => {
        return () => {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [currentStream]);

    // --- Actions ---

    const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
        setRoster(prev => prev.map(log => log.studentId === studentId ? { ...log, status, timestamp: new Date().toISOString() } : log));
        setHasUnsavedChanges(true);
    };

    const handleBulkStatus = (status: 'Present' | 'Absent') => {
        setRoster(prev => prev.map(log => ({ ...log, status, timestamp: new Date().toISOString() })));
        setHasUnsavedChanges(true);
    };

    const handleSave = () => {
        if (!subjectDetails) return;
        saveSessionAttendance(roster, faculty.id, faculty.department, subjectDetails.semester);
        setHasUnsavedChanges(false);
        setFeedback({ message: 'Attendance saved successfully!', type: 'success' });
        setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
    };

    const exportReport = () => {
        if (!roster.length) return;
        const headers = "Student ID,Name,Date,Session,Status,Method,Confidence\n";
        const rows = roster.map(log => {
            const st = enrolledStudents.find(s => s.id === log.studentId);
            return `${log.studentId},${st?.name || 'Unknown'},${log.date},${log.sessionId},${log.status},${log.method},${log.confidence || ''}`;
        }).join('\n');
        
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Attendance_${selectedSubjectCode}_${selectedDate}.csv`;
        a.click();
    };

    // --- AI Logic (Real Camera Implementation) ---

    const startCamera = async () => {
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } // Prefer back camera if available
            });
            setCurrentStream(stream);
            setIsCameraOn(true);
        } catch (err) {
            console.error("Camera Start Error:", err);
            setIsCameraOn(false);
            if (err instanceof DOMException && err.name === "NotAllowedError") {
                setCameraError("Camera permission denied. Please allow camera access in your browser settings.");
            } else {
                setCameraError("Unable to access camera. Please check device settings.");
            }
        }
    };

    const stopCamera = () => {
        if (currentStream) {
            currentStream.getTracks().forEach(t => t.stop());
            setCurrentStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
    };

    const handleRecognize = () => {
        // Mock AI Recognition (Visual simulation)
        setFeedback({ message: 'Analyzing faces...', type: 'info' });
        
        setTimeout(() => {
            const recognizedIds: string[] = [];
            const newRoster = roster.map(log => {
                // Simulate 80% attendance probability
                const isPresent = Math.random() > 0.2;
                const confidence = 0.7 + (Math.random() * 0.29); // 0.70 - 0.99
                
                // Only auto-mark if confidence > threshold
                if (isPresent && confidence >= confidenceThreshold) {
                    recognizedIds.push(log.studentId);
                    return { 
                        ...log, 
                        status: 'Present' as const, 
                        method: 'ai' as const, 
                        confidence: parseFloat(confidence.toFixed(2)),
                        timestamp: new Date().toISOString() 
                    };
                }
                return log;
            });
            
            setRoster(newRoster);
            setHasUnsavedChanges(true);
            setFeedback({ message: `AI recognized ${recognizedIds.length} students.`, type: 'success' });
            if(isCameraOn) stopCamera();
        }, 1500);
    };

    const handleTrainingUpload = (studentId: string, file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setStudentTrainingPhoto(studentId, reader.result as string);
            setFeedback({ message: "Training image uploaded.", type: 'success' });
            setTimeout(() => setFeedback({ message: '', type: '' }), 2000);
        };
        reader.readAsDataURL(file);
    };

    // --- Render Components ---

    return (
        <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white font-sans">
            
            {/* 1. Attendance Management Header & Selector */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Attendance Management</h1>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap gap-6 items-center">
                     <div className="flex-1 min-w-[250px]">
                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Select Subject</label>
                        <select 
                            value={selectedSubjectCode} 
                            onChange={e => setSelectedSubjectCode(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            <option value="">-- Choose Subject --</option>
                            {faculty.subjectsTaught.map(s => (
                                <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                            ))}
                        </select>
                     </div>

                     <div className="min-w-[150px]">
                         <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Date</label>
                         <input 
                            type="date" 
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                     </div>

                     <div className="min-w-[150px]">
                         <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Session</label>
                         <select
                            value={selectedSession}
                            onChange={e => setSelectedSession(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            <option>09:00-10:00</option>
                            <option>10:00-11:00</option>
                            <option>11:15-12:15</option>
                            <option>02:00-03:00</option>
                        </select>
                     </div>
                </div>
            </div>

            {/* Feedback Toast */}
            {feedback.message && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg font-medium animate-slide-in ${
                    feedback.type === 'success' ? 'bg-green-600 text-white' : 
                    feedback.type === 'error' ? 'bg-red-600 text-white' : 
                    'bg-blue-600 text-white'
                }`}>
                    {feedback.message}
                </div>
            )}

            {selectedSubjectCode ? (
                <div className="space-y-8">
                    
                    {/* 2. Automatic Attendance Panel (AI) */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-primary-500" />
                            Automatic Attendance (AI-Powered)
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Upload a classroom photo for automatic marking or use the camera to capture live.
                                </p>
                                <div className="flex gap-4">
                                    <label className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                                        <span className="whitespace-nowrap">Choose File</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { /* Handle file */ }} />
                                    </label>
                                    <span className="text-sm text-gray-400 self-center">No file chosen</span>
                                </div>

                                <div className="flex gap-3">
                                    {!isCameraOn ? (
                                        <button onClick={startCamera} className="px-5 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md">
                                            Start Camera
                                        </button>
                                    ) : (
                                        <button onClick={stopCamera} className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md">
                                            Stop Camera
                                        </button>
                                    )}
                                    <button onClick={handleRecognize} className="px-5 py-2.5 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors shadow-md">
                                        Mark from Photo
                                    </button>
                                </div>

                                {/* Threshold Slider */}
                                <div className="pt-2">
                                    <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                                        <span>Confidence Threshold</span>
                                        <span>{confidenceThreshold}</span>
                                    </div>
                                    <input 
                                        type="range" min="0.5" max="0.99" step="0.01" 
                                        value={confidenceThreshold}
                                        onChange={e => setConfidenceThreshold(parseFloat(e.target.value))}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                    />
                                </div>
                            </div>

                            {/* Camera / Preview Area */}
                            <div className="relative bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center border border-gray-800">
                                {isCameraOn ? (
                                    <video 
                                        ref={videoRef} 
                                        autoPlay 
                                        playsInline 
                                        muted 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <div className="text-gray-500 flex flex-col items-center p-4 text-center">
                                        <CameraIcon className="w-12 h-12 mb-2 opacity-50" />
                                        <span className="text-sm">{cameraError || "Camera Off"}</span>
                                    </div>
                                )}
                                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* 3. Manual Attendance Roster */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Manual Attendance</h3>
                            <div className="flex gap-2">
                                <button onClick={() => handleBulkStatus('Present')} className="px-3 py-1.5 text-xs font-bold text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors">All Present</button>
                                <button onClick={() => handleBulkStatus('Absent')} className="px-3 py-1.5 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors">All Absent</button>
                            </div>
                        </div>

                        {/* Roster Table */}
                        <div className="p-6 overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 uppercase font-semibold">
                                    <tr>
                                        <th className="p-3 rounded-tl-lg">Student Name</th>
                                        <th className="p-3 text-right rounded-tr-lg">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {roster.map(log => {
                                        const student = enrolledStudents.find(s => s.id === log.studentId);
                                        if(!student) return null;

                                        return (
                                            <tr key={log.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${log.status === 'Absent' ? 'bg-red-50/30' : ''}`}>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <img src={student.profilePicUrl} alt="" className="w-8 h-8 rounded-full object-cover bg-gray-200" />
                                                        <div>
                                                            <p className="font-bold text-gray-900 dark:text-white">{student.name}</p>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                                                                {student.id}
                                                                {log.method === 'ai' && (
                                                                    <span className="text-[10px] px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-bold">AI {(log.confidence! * 100).toFixed(0)}%</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <div className="inline-flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                                                        {(['Present', 'Absent', 'Late'] as const).map(status => (
                                                            <button 
                                                                key={status}
                                                                onClick={() => handleStatusChange(student.id, status)}
                                                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                                                                    log.status === status 
                                                                    ? (status === 'Present' ? 'bg-green-500 text-white shadow-sm' : status === 'Absent' ? 'bg-red-500 text-white shadow-sm' : 'bg-orange-400 text-white shadow-sm')
                                                                    : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                                }`}
                                                            >
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {roster.length === 0 && (
                                        <tr><td colSpan={2} className="p-8 text-center text-gray-500">No students found for this session.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Footer Actions */}
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                            <button 
                                onClick={exportReport}
                                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white font-semibold rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                Generate Report
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={!hasUnsavedChanges}
                                className={`px-6 py-2 rounded-xl font-bold text-white transition-all shadow-lg transform active:scale-95 ${hasUnsavedChanges ? 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200' : 'bg-gray-400 cursor-not-allowed shadow-none'}`}
                            >
                                {hasUnsavedChanges ? 'Save Attendance' : 'Saved'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <UserGroupIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Session Selected</h3>
                    <p className="text-gray-500 dark:text-gray-400">Please select a subject above to manage attendance.</p>
                </div>
            )}
        </div>
    );
};

export default AttendancePage;
