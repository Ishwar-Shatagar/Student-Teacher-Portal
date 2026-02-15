
import React, { useContext, useState, useMemo, useRef } from 'react';
import { DataContext } from '../contexts/DataContext';
import * as Icons from '../components/common/Icons';
import { Student } from '../types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// --- Constants & Helpers ---

const DEPT_COLORS: Record<string, { bg: string; text: string; gradient: string }> = {
    'AIML': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', gradient: 'from-purple-500 to-teal-500' },
    'CSE': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', gradient: 'from-blue-500 to-indigo-600' },
    'ISE': { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300', gradient: 'from-pink-500 to-rose-500' },
    'ECE': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', gradient: 'from-orange-500 to-amber-500' },
    'EEE': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', gradient: 'from-yellow-400 to-orange-500' },
    'MECH': { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', gradient: 'from-slate-500 to-gray-600' },
    'CIVIL': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', gradient: 'from-emerald-500 to-green-600' },
};

const getDeptStyle = (dept: string) => {
    return DEPT_COLORS[dept] || { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', gradient: 'from-gray-400 to-gray-600' };
};

const ViewToggle = ({ mode, setMode }: { mode: 'grid' | 'list'; setMode: (m: 'grid' | 'list') => void }) => (
    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
        <button
            onClick={() => setMode('grid')}
            className={`p-1.5 rounded-md transition-all ${mode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            aria-label="Grid View"
        >
            <Icons.DashboardIcon className="w-5 h-5" />
        </button>
        <button
            onClick={() => setMode('list')}
            className={`p-1.5 rounded-md transition-all ${mode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            aria-label="List View"
        >
            <Icons.SortIcon className="w-5 h-5" />
        </button>
    </div>
);

// --- Detail Modal Component ---

const StudentDetailModal = ({ student, onClose }: { student: Student; onClose: () => void }) => {
    const totalClasses = student.attendance.reduce((acc, curr) => acc + curr.totalClasses, 0);
    const attendedClasses = student.attendance.reduce((acc, curr) => acc + curr.classesAttended, 0);
    const overallAttendance = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

    const academicData = student.academicHistory.map(h => ({
        semester: `Sem ${h.semester}`,
        sgpa: h.sgpa
    }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                    <div className="absolute -bottom-10 left-8">
                        <img 
                            src={student.profilePicUrl} 
                            alt={student.name} 
                            className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover bg-white"
                        />
                    </div>
                </div>
                
                <div className="pt-12 px-8 pb-8 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">{student.id}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold text-gray-600 dark:text-gray-300">{student.department}</span>
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold text-gray-600 dark:text-gray-300">Sem {student.semester}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="mb-2">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Attendance</p>
                                <p className={`text-2xl font-bold ${overallAttendance < 75 ? 'text-red-500' : 'text-green-500'}`}>{overallAttendance}%</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">CGPA</p>
                                <p className="text-xl font-bold text-blue-500">{student.cgpa}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">Contact Info</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <Icons.EmailIcon className="w-4 h-4 text-gray-400" />
                                {student.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <Icons.PhoneIcon className="w-4 h-4 text-gray-400" />
                                {student.phone || "N/A"}
                            </div>
                            <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <Icons.LocationMarkerIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                                <span className="line-clamp-2">{student.address || "No address provided"}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                             <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">Academic Trend</h3>
                             <div className="h-32 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={academicData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="semester" hide />
                                        <YAxis domain={[0, 10]} hide />
                                        <RechartsTooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ stroke: '#3B82F6', strokeWidth: 2 }}
                                        />
                                        <Line type="monotone" dataKey="sgpa" stroke="#3B82F6" strokeWidth={3} dot={{r:4, fill:'#3B82F6'}} />
                                    </LineChart>
                                </ResponsiveContainer>
                             </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Subject Attendance</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {student.attendance.map((sub, idx) => {
                                const pct = sub.totalClasses > 0 ? Math.round((sub.classesAttended / sub.totalClasses) * 100) : 0;
                                return (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate pr-2" title={sub.subjectName}>{sub.subjectCode}</span>
                                        <span className={`text-sm font-bold ${pct < 75 ? 'text-red-500' : 'text-green-600'}`}>{pct}%</span>
                                    </div>
                                )
                            })}
                            {student.attendance.length === 0 && <p className="text-sm text-gray-500 italic">No attendance records found.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Components ---

const StudentCard: React.FC<{ student: Student; onView: (student: Student) => void }> = ({ student, onView }) => {
    const deptStyle = getDeptStyle(student.department);
    const totalClasses = student.attendance.reduce((acc, curr) => acc + curr.totalClasses, 0);
    const attendedClasses = student.attendance.reduce((acc, curr) => acc + curr.classesAttended, 0);
    const attendancePct = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

    return (
        <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800 overflow-hidden">
            
            {/* Top Decor Line */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${deptStyle.gradient} opacity-80`}></div>

            <div className="flex items-start justify-between mb-4">
                {/* Avatar */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md bg-gradient-to-br ${deptStyle.gradient}`}>
                    {student.name.charAt(0)}
                </div>
                
                {/* Actions Menu Trigger */}
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Icons.SettingsIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Info */}
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {student.name}
                </h3>
                <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mt-1 tracking-wide">
                    {student.id}
                </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide ${deptStyle.bg} ${deptStyle.text}`}>
                    {student.department}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                    Sem {student.semester}
                </span>
                {attendancePct < 75 && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800">
                        Low Att.
                    </span>
                )}
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                   <span className={`w-2 h-2 rounded-full ${attendancePct >= 75 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                   Attendance: {attendancePct}%
                </div>
                <button 
                    onClick={() => onView(student)}
                    className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1"
                >
                    View Details &rarr;
                </button>
            </div>
        </div>
    );
};

const StudentRow: React.FC<{ student: Student; onView: (student: Student) => void }> = ({ student, onView }) => {
    const deptStyle = getDeptStyle(student.department);
    return (
        <div className="flex items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm bg-gradient-to-br mr-4 from-gray-400 to-gray-600">
               {student.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0 mr-4">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                    {student.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {student.id}
                </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 mr-6">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${deptStyle.bg} ${deptStyle.text}`}>
                    {student.department}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    Sem {student.semester}
                </span>
            </div>
            <div>
                 <button 
                    onClick={() => onView(student)}
                    className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-white transition-colors" 
                    title="View Details"
                >
                    <Icons.EyeIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

// --- Main Page ---

const StudentListPage: React.FC = () => {
    const context = useContext(DataContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSemester, setFilterSemester] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && context) {
            context.importStudentsFromExcel(file);
        }
        // Reset file input
        if (e.target) {
            e.target.value = '';
        }
    };

    // Filter Logic
    const filteredStudents = useMemo(() => {
        if (!context) return [];
        return context.students
            .filter(student => {
                const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
                const usnMatch = student.id.toLowerCase().includes(searchTerm.toLowerCase());
                return nameMatch || usnMatch;
            })
            .filter(student => {
                if (filterSemester === '') return true;
                return student.semester === parseInt(filterSemester, 10);
            });
    }, [context, searchTerm, filterSemester]);

    if (!context) {
        return <div className="p-8 flex items-center justify-center text-gray-500">Loading...</div>;
    }

    const uniqueSemesters = [...new Set(context.students.map(s => s.semester))].sort((a: number, b: number) => a - b);

    return (
        <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Student Directory
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Manage and monitor student performance across departments.
                    </p>
                </div>
                <div className="flex gap-2">
                    <input 
                        type="file" 
                        accept=".csv, .xlsx, .xls" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                    />
                    <button 
                        onClick={handleImportClick}
                        className="flex items-center justify-center px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-600/20 transition-transform active:scale-95"
                    >
                        <Icons.UploadIcon className="w-5 h-5 mr-2" />
                        Import Students
                    </button>
                </div>
            </div>
            
            {/* Toolbar */}
            <div className="sticky top-4 z-20 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                
                {/* Search */}
                <div className="relative w-full sm:max-w-md">
                    <Icons.SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by Name or USN..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                {/* Filters & Toggles */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative">
                        <select
                            id="semester-filter"
                            value={filterSemester}
                            onChange={e => setFilterSemester(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer"
                        >
                            <option value="">All Semesters</option>
                            {uniqueSemesters.map(sem => <option key={sem} value={sem}>Semester {sem}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    
                    <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

                    <ViewToggle mode={viewMode} setMode={setViewMode} />
                </div>
            </div>

            {/* Content Area */}
            {filteredStudents.length > 0 ? (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                            {filteredStudents.map(student => (
                                <StudentCard 
                                    key={student.id} 
                                    student={student} 
                                    onView={setSelectedStudent} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <span className="w-14 mr-4"></span>
                                <span className="flex-1 mr-4">Student Details</span>
                                <span className="hidden sm:block w-32 mr-6">Tags</span>
                                <span className="w-10">Action</span>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredStudents.map(student => (
                                    <StudentRow 
                                        key={student.id} 
                                        student={student} 
                                        onView={setSelectedStudent} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Icons.SearchIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No students found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                        Try adjusting your search terms or semester filter to find what you're looking for.
                    </p>
                    <button 
                        onClick={() => { setSearchTerm(''); setFilterSemester(''); }}
                        className="mt-6 text-primary-600 hover:text-primary-700 font-semibold"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            {/* Detail Modal */}
            {selectedStudent && (
                <StudentDetailModal 
                    student={selectedStudent} 
                    onClose={() => setSelectedStudent(null)} 
                />
            )}
        </div>
    );
};

export default StudentListPage;
