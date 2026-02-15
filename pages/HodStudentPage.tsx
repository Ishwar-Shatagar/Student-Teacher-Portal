
import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../contexts/DataContext';
import * as Icons from '../components/common/Icons';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { Student } from '../types';

const THRESHOLD = 75;

// --- Types & Helpers ---

interface StudentStatus {
    overall: number;
    status: 'Good' | 'Low';
    lowSubjects: { name: string; percentage: number }[];
}

const getStudentStatus = (student: Student): StudentStatus => {
    // Calculate overall from aggregated totals
    const totalClasses = student.attendance.reduce((acc, curr) => acc + curr.totalClasses, 0);
    const totalAttended = student.attendance.reduce((acc, curr) => acc + curr.classesAttended, 0);
    const overall = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 100;

    const lowSubjects: { name: string; percentage: number }[] = [];
    
    // Check individual subjects
    student.attendance.forEach(sub => {
        const pct = sub.totalClasses > 0 ? (sub.classesAttended / sub.totalClasses) * 100 : 100;
        if (pct < THRESHOLD) {
            lowSubjects.push({ name: sub.subjectName, percentage: pct });
        }
    });

    // Determine status: Low if overall is low OR if ANY subject is low
    const status = (overall < THRESHOLD || lowSubjects.length > 0) ? 'Low' : 'Good';

    return { overall, status, lowSubjects };
};

const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
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

// --- Sub-Components ---

const StudentDetailModal: React.FC<{ student: Student; onClose: () => void; statusData: StudentStatus }> = ({ student, onClose, statusData }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="relative h-24 bg-gradient-to-r from-primary-500 to-primary-700">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors">
                        <Icons.SortIcon className="w-5 h-5 rotate-45" /> {/* Close X icon simulated */}
                    </button>
                    <div className="absolute -bottom-12 left-8 flex items-end">
                        <img 
                            src={student.profilePicUrl} 
                            alt={student.name} 
                            className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 object-cover"
                        />
                    </div>
                </div>
                
                <div className="pt-16 px-8 pb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">{student.id}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-center ${statusData.status === 'Low' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                            <p className="text-sm font-semibold uppercase tracking-wide">Attendance</p>
                            <p className="text-2xl font-bold">{statusData.overall.toFixed(1)}%</p>
                        </div>
                    </div>

                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Branch</p>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{student.department}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Semester</p>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{student.semester}</p>
                        </div>
                         <div>
                            <p className="text-xs text-gray-500 uppercase">Section</p>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">A</p>
                        </div>
                         <div>
                            <p className="text-xs text-gray-500 uppercase">Batch</p>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{student.batchYear}</p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-1">
                         <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <Icons.EmailIcon className="w-4 h-4"/> {student.email}
                        </p>
                         <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <Icons.PhoneIcon className="w-4 h-4"/> {student.phone || 'N/A'}
                        </p>
                    </div>

                    {/* Detailed Subject List */}
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-8 mb-4">Subject-wise Attendance</h3>
                    <div className="space-y-3">
                        {student.attendance.map((rec, idx) => {
                            const pct = rec.totalClasses > 0 ? (rec.classesAttended / rec.totalClasses) * 100 : 0;
                            const isSubjectLow = pct < THRESHOLD;
                            return (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white">{rec.subjectName}</p>
                                        <p className="text-xs text-gray-500">{rec.classesAttended}/{rec.totalClasses} classes</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                         {isSubjectLow && (
                                            <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">Low</span>
                                         )}
                                        <div className={`font-bold w-12 text-right ${isSubjectLow ? 'text-red-600' : 'text-green-600'}`}>
                                            {pct.toFixed(0)}%
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Actions Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3 justify-end">
                        <button className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            Export PDF
                        </button>
                         <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <Icons.ChatIcon className="w-4 h-4" /> Message Student
                        </button>
                         {statusData.status === 'Low' && (
                            <button className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                                Flag for Counseling
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

const HodStudentPage: React.FC = () => {
    const context = useContext(DataContext);
    
    // UI State
    const [selectedBranch, setSelectedBranch] = useState<string>('AIML');
    const [viewMode, setViewMode] = useState<'summary' | 'list'>('summary');
    const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
    const [timeframe, setTimeframe] = useState<'this_week' | 'last_week'>('this_week');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'attendance'; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
    
    // Selection for modal
    const [focusedStudent, setFocusedStudent] = useState<Student | null>(null);

    if (!context) return null;
    const { students, departments } = context;

    // Get unique branches/departments from context
    const branches = useMemo(() => {
        const depts = departments.map(d => d.code);
        // Ensure AIML is present if not in departments list for some reason, though it should be.
        if (!depts.includes('AIML')) depts.unshift('AIML');
        return depts;
    }, [departments]);

    // --- Derived Data ---

    // 1. Filtered Students (Base for everything)
    const branchStudents = useMemo(() => {
        return students.filter(s => s.department === selectedBranch || selectedBranch === 'All');
    }, [students, selectedBranch]);

    // 2. Summary Stats (Per Semester)
    const semesterSummary = useMemo(() => {
        const stats: Record<number, { avg: number, total: number, lowCount: number }> = {};
        [3, 4, 5, 6, 7, 8].forEach(sem => stats[sem] = { avg: 0, total: 0, lowCount: 0 }); // Initialize active sems

        branchStudents.forEach(s => {
            if (!stats[s.semester]) stats[s.semester] = { avg: 0, total: 0, lowCount: 0 };
            
            const { overall, status } = getStudentStatus(s);
            stats[s.semester].total += 1;
            stats[s.semester].avg += overall;
            if (status === 'Low') stats[s.semester].lowCount += 1;
        });

        // Finalize averages
        Object.keys(stats).forEach(key => {
            const sem = parseInt(key);
            if (stats[sem].total > 0) {
                stats[sem].avg = stats[sem].avg / stats[sem].total;
            }
        });

        return stats;
    }, [branchStudents]);

    // 3. List View Data
    const listStudents = useMemo(() => {
        if (viewMode !== 'list' || !selectedSemester) return [];
        
        let filtered = branchStudents.filter(s => s.semester === selectedSemester);

        // Search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(s => s.name.toLowerCase().includes(lower) || s.id.toLowerCase().includes(lower));
        }

        // Sort
        filtered.sort((a, b) => {
            const aStatus = getStudentStatus(a);
            const bStatus = getStudentStatus(b);
            
            if (sortConfig.key === 'attendance') {
                return sortConfig.direction === 'asc' 
                    ? aStatus.overall - bStatus.overall 
                    : bStatus.overall - aStatus.overall;
            } else {
                 return sortConfig.direction === 'asc' 
                    ? a.name.localeCompare(b.name) 
                    : b.name.localeCompare(a.name);
            }
        });

        return filtered;
    }, [branchStudents, viewMode, selectedSemester, searchTerm, sortConfig]);


    // --- Handlers ---

    const handleViewDetails = (semester: number) => {
        setSelectedSemester(semester);
        setViewMode('list');
        setSearchTerm(''); // Reset search on entry
    };

    const handleBackToSummary = () => {
        setViewMode('summary');
        setSelectedSemester(null);
    };

    const handleSort = (key: 'name' | 'attendance') => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleExportList = () => {
        const exportData = listStudents.map(s => {
            const { overall, status } = getStudentStatus(s);
            const subjectCols: any = {};
            s.attendance.forEach((att, i) => {
                subjectCols[`Subject_${i+1}`] = `${att.subjectName}: ${((att.classesAttended/att.totalClasses)*100).toFixed(1)}%`;
            });
            return {
                USN: s.id,
                Name: s.name,
                Branch: s.department,
                Semester: s.semester,
                Email: s.email,
                Overall_Attendance: overall.toFixed(2),
                Status: status,
                ...subjectCols
            };
        });
        exportToCSV(exportData, `Attendance_Sem${selectedSemester}_${selectedBranch}.csv`);
    };


    // --- Renderers ---

    const SummaryView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {Object.entries(semesterSummary).map(([semStr, data]: [string, { avg: number, total: number, lowCount: number }]) => {
                const sem = parseInt(semStr);
                if (data.total === 0) return null; // Hide empty semesters
                
                // Simulating sparkline data based on timeframe toggle for visual feedback
                const trendData = timeframe === 'this_week' 
                    ? [{v: data.avg-2}, {v: data.avg+1}, {v: data.avg-1}, {v: data.avg}] 
                    : [{v: data.avg-5}, {v: data.avg-3}, {v: data.avg-4}, {v: data.avg-2}];

                return (
                    <div key={sem} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 flex flex-col transition-transform hover:scale-[1.02]">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Semester {sem}</span>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{data.avg.toFixed(1)}%</h3>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-gray-500">Low Attendance</span>
                                <p className="text-lg font-bold text-red-500">{data.lowCount} <span className="text-xs font-normal text-gray-400">/ {data.total}</span></p>
                            </div>
                        </div>
                        
                        {/* Sparkline */}
                        <div className="h-16 w-full mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <Line type="monotone" dataKey="v" stroke={data.avg < THRESHOLD ? '#EF4444' : '#10B981'} strokeWidth={3} dot={false} />
                                    <Tooltip contentStyle={{display:'none'}}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                            <button 
                                onClick={() => handleViewDetails(sem)}
                                className="w-full py-2 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-900/20 rounded-lg transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    const ListView = () => (
        <div className="animate-fade-in">
            {/* List Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button onClick={handleBackToSummary} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500">
                        <Icons.SortIcon className="w-5 h-5 rotate-90" /> {/* Back Arrow Sim */}
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Semester {selectedSemester} List</h2>
                        <p className="text-xs text-gray-500">Threshold: {THRESHOLD}% (Overall & Subject-wise)</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                        <Icons.SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search Name or USN..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border-transparent rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <button onClick={handleExportList} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="Export CSV">
                        <Icons.ExportIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                                <th className="p-4 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                                <th className="p-4 font-semibold cursor-pointer hover:text-gray-700" onClick={() => handleSort('name')}>Student Details</th>
                                <th className="p-4 font-semibold">Subject Summary</th>
                                <th className="p-4 font-semibold text-center cursor-pointer hover:text-gray-700" onClick={() => handleSort('attendance')}>Attendance %</th>
                                <th className="p-4 font-semibold text-center">Status</th>
                                <th className="p-4 font-semibold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {listStudents.map(student => {
                                const { overall, status, lowSubjects } = getStudentStatus(student);
                                return (
                                    <tr key={student.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{student.name}</p>
                                                    <p className="text-xs text-gray-500 font-mono">{student.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {student.attendance.slice(0,3).map((s, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                                                        {s.subjectCode}
                                                    </span>
                                                ))}
                                                {student.attendance.length > 3 && <span className="text-xs text-gray-400">+{student.attendance.length - 3}</span>}
                                            </div>
                                        </td>
                                        <td className={`p-4 text-center font-bold ${status === 'Low' ? 'text-red-600' : 'text-green-600'}`}>
                                            {overall.toFixed(1)}%
                                            {lowSubjects.length > 0 && status === 'Low' && overall >= THRESHOLD && (
                                                 <div className="group relative inline-block ml-2 align-middle">
                                                    <Icons.EyeIcon className="w-4 h-4 text-orange-500 cursor-help" />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg hidden group-hover:block z-10">
                                                        Low in: {lowSubjects.map(s => s.name).join(', ')}
                                                    </div>
                                                 </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${status === 'Low' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => setFocusedStudent(student)}
                                                className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-semibold text-xs px-3 py-1.5 border border-primary-200 dark:border-primary-800 rounded hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {listStudents.length === 0 && (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            No students found matching criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6 sm:p-8 h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Student Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor attendance trends across semesters and departments.</p>
                </div>
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                    <button 
                        onClick={() => setTimeframe('this_week')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all shadow-sm ${timeframe === 'this_week' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white bg-transparent shadow-none'}`}
                    >
                        This Week
                    </button>
                    <button 
                        onClick={() => setTimeframe('last_week')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all shadow-sm ${timeframe === 'last_week' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white bg-transparent shadow-none'}`}
                    >
                        Last Week
                    </button>
                </div>
            </div>

            {/* Branch Chips */}
            <div className="mb-8 flex flex-wrap gap-2 flex-shrink-0">
                {branches.map(branch => (
                    <button 
                        key={branch}
                        onClick={() => { setSelectedBranch(branch); setViewMode('summary'); }}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all transform active:scale-95 ${selectedBranch === branch ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        {branch}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-grow">
                {viewMode === 'summary' ? <SummaryView /> : <ListView />}
            </div>

            {/* Modal */}
            {focusedStudent && (
                <StudentDetailModal 
                    student={focusedStudent} 
                    onClose={() => setFocusedStudent(null)}
                    statusData={getStudentStatus(focusedStudent)}
                />
            )}
        </div>
    );
};

export default HodStudentPage;
