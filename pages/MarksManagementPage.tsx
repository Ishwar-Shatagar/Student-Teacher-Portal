
import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../contexts/DataContext';
import { AuthContext } from '../contexts/AuthContext';
import { EditableSubjectResult, ProfessionalUser, MarksAuditLogEntry } from '../types';
import * as Icons from '../components/common/Icons';
import ChatWidget from '../components/common/ChatWidget';
import { getFacultyAnalytics } from '../services/geminiService';
import { Content } from '@google/genai';

// --- Components ---

const MarksStatsCards = ({ total, submitted, pending, average }: { total: number, submitted: number, pending: number, average: number }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border-l-4 border-blue-500 transform transition hover:scale-[1.02]">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Students</p>
            <div className="flex justify-between items-end mt-2">
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{total}</h3>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                    <Icons.StudentIcon className="w-6 h-6" />
                </div>
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border-l-4 border-green-500 transform transition hover:scale-[1.02]">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Saved / Submitted</p>
            <div className="flex justify-between items-end mt-2">
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{submitted}</h3>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                    <Icons.SparklesIcon className="w-6 h-6" />
                </div>
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border-l-4 border-yellow-500 transform transition hover:scale-[1.02]">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pending Entry</p>
            <div className="flex justify-between items-end mt-2">
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{pending}</h3>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400">
                    <Icons.AssignmentIcon className="w-6 h-6" />
                </div>
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border-l-4 border-purple-500 transform transition hover:scale-[1.02]">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Class Average (CIE)</p>
            <div className="flex justify-between items-end mt-2">
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{average}</h3>
                 <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
                    <Icons.ChartBarIcon className="w-6 h-6" />
                </div>
            </div>
        </div>
    </div>
);

const AuditPanel = ({ logs, onClose }: { logs: MarksAuditLogEntry[], onClose: () => void }) => (
    <>
        <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white dark:bg-gray-900 z-50 shadow-2xl transform transition-transform duration-300 flex flex-col">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Audit History</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                    <Icons.SortIcon className="w-5 h-5 rotate-45" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {logs.length === 0 ? (
                    <p className="text-gray-500 text-center mt-10">No changes recorded.</p>
                ) : (
                    logs.map((log, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                                <span>{new Date(log.timestamp).toLocaleString()}</span>
                                <span className="font-mono">{log.facultyName}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Updated <span className="font-semibold uppercase text-gray-900 dark:text-white">{log.changedField}</span> for <span className="font-medium">{log.studentName}</span>
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-sm">
                                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded line-through">{log.oldValue}</span>
                                <span>&rarr;</span>
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">{log.newValue}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </>
);

const MarksManagementPage: React.FC = () => {
    const context = useContext(DataContext);
    const authContext = useContext(AuthContext);

    // UI State
    const [year, setYear] = useState('2024-2025');
    const [programme, setProgramme] = useState('B.E. AIML');
    const [semester, setSemester] = useState<number>(3);
    const [section, setSection] = useState('A');
    const [subjectCode, setSubjectCode] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [mode, setMode] = useState<'bulk' | 'single'>('bulk');
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    
    // Data State
    const [marksData, setMarksData] = useState<{ studentId: string; studentName: string; marks: EditableSubjectResult }[]>([]);
    const [originalData, setOriginalData] = useState<string>(''); 
    const [dirtyRows, setDirtyRows] = useState<Set<string>>(new Set());
    const [showAudit, setShowAudit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{type: 'success'|'error', msg: string} | null>(null);
    
    // Chat State
    const [chatHistory, setChatHistory] = useState<Content[]>([]);

    if (!context || !authContext || !authContext.user) return <div>Loading...</div>;
    const { students, updateStudentMarks, marksAuditLog } = context;
    const currentUser = authContext.user as ProfessionalUser;

    // Derived Lists
    const subjects = useMemo(() => {
         const sampleStudent = students.find(s => s.semester === semester);
         if (!sampleStudent) return [];
         return sampleStudent.academicHistory.find(sem => sem.semester === semester)?.editableResults.map(res => ({ code: res.code, name: res.name })) || [];
    }, [semester, students]);

    // Effect: Load Data when filters change
    useEffect(() => {
        if (!subjectCode) {
            setMarksData([]);
            return;
        }

        const filteredStudents = students.filter(s => s.semester === semester && (s.department === 'AIML' || programme.includes(s.department)));
        
        const rows = filteredStudents.map(student => {
            const semResult = student.academicHistory.find(h => h.semester === semester);
            const subResult = semResult?.editableResults.find(r => r.code === subjectCode);
            
            if (subResult) {
                return {
                    studentId: student.id,
                    studentName: student.name,
                    marks: { ...subResult } 
                };
            }
            return null;
        }).filter(item => item !== null) as { studentId: string; studentName: string; marks: EditableSubjectResult }[];

        setMarksData(rows);
        setOriginalData(JSON.stringify(rows));
        setDirtyRows(new Set());
    }, [semester, subjectCode, students, programme]);


    // Helpers
    const validateMark = (val: number, max: number) => val >= 0 && val <= max;

    const handleInputChange = (studentId: string, field: keyof EditableSubjectResult, value: string, max: number) => {
        const numVal = value === '' ? 0 : parseInt(value, 10);
        
        setMarksData(prev => prev.map(row => {
            if (row.studentId === studentId) {
                return {
                    ...row,
                    marks: { ...row.marks, [field]: numVal }
                };
            }
            return row;
        }));

        setDirtyRows(prev => {
            const newSet = new Set(prev);
            newSet.add(studentId);
            return newSet;
        });
    };

    const handleSaveRow = async (studentId: string) => {
        const row = marksData.find(r => r.studentId === studentId);
        if (!row) return;

        // Updated Validation for IA (25) and Assignment (10)
        if (!validateMark(row.marks.cie1, 25) || !validateMark(row.marks.cie2, 25) || 
            !validateMark(row.marks.assignment || 0, 10) || 
            !validateMark(row.marks.see, 100)) {
            setNotification({ type: 'error', msg: 'Invalid marks. IA Max: 25, Assign Max: 10, SEE Max: 100.' });
            return;
        }

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 600)); 

        // Recalculate Total (IA1 + IA2 + Assignment)
        const totalCIE = (row.marks.cie1 || 0) + (row.marks.cie2 || 0) + (row.marks.assignment || 0);
        
        // Simplified Grade Calc
        let grade = 'F';
        const pct = (totalCIE / 60) * 100;
        if (pct >= 90) grade = 'S';
        else if (pct >= 80) grade = 'A';
        else if (pct >= 70) grade = 'B';
        else if (pct >= 60) grade = 'C';
        else if (pct >= 50) grade = 'D';
        else if (pct >= 40) grade = 'E';

        const changes: Partial<EditableSubjectResult> = {
            cie1: row.marks.cie1,
            cie2: row.marks.cie2,
            assignment: row.marks.assignment,
            see: row.marks.see,
            total: totalCIE,
            grade: grade,
            status: 'saved'
        };

        updateStudentMarks(studentId, semester, subjectCode, changes, currentUser);
        
        setDirtyRows(prev => {
            const newSet = new Set(prev);
            newSet.delete(studentId);
            return newSet;
        });
        setLoading(false);
        setNotification({ type: 'success', msg: `Marks saved for ${row.studentName}` });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSaveAll = async () => {
        if (dirtyRows.size === 0) return;
        if (!window.confirm(`Save changes for ${dirtyRows.size} students?`)) return;

        setLoading(true);
        for (const studentId of Array.from(dirtyRows)) {
           await handleSaveRow(studentId as string);
        }
        setLoading(false);
        setNotification({ type: 'success', msg: 'All changes saved successfully.' });
    };

    const handleExportCSV = () => {
        const headers = "USN,Name,SubjectCode,CIE1,CIE2,Assignment,SEE,Status";
        const rows = marksData.map(row => 
            `${row.studentId},"${row.studentName}",${subjectCode},${row.marks.cie1},${row.marks.cie2},${row.marks.assignment||0},${row.marks.see},${row.marks.status}`
        ).join('\n');
        
        const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Marks_${programme}_Sem${semester}_${subjectCode}.csv`;
        a.click();
    };

    const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const text = reader.result;
            if (typeof text !== 'string') return;

            const lines = text.split('\n').slice(1); 
            const newMarksMap = new Map<string, any>();

            lines.forEach(line => {
                const parts = line.split(',');
                const usn = parts[0];
                if (usn) {
                    newMarksMap.set(usn.trim(), {
                        cie1: parseInt(parts[3]?.trim() || '0', 10), 
                        cie2: parseInt(parts[4]?.trim() || '0', 10), 
                        assignment: parseInt(parts[5]?.trim() || '0', 10), 
                        see: parseInt(parts[6]?.trim() || '0', 10)
                    });
                }
            });

            const newlyDirtyIds = new Set<string>();

            setMarksData(prev => prev.map(row => {
                const newData = newMarksMap.get(row.studentId);
                if (newData) {
                    newlyDirtyIds.add(row.studentId);
                    return { ...row, marks: { ...row.marks, ...newData } };
                }
                return row;
            }));

            if (newlyDirtyIds.size > 0) {
                setDirtyRows(prev => {
                    const next = new Set(prev);
                    newlyDirtyIds.forEach(id => next.add(id));
                    return next;
                });
            }

            setNotification({ type: 'success', msg: 'CSV Data Imported. Please review and click Save All.' });
        };
        reader.readAsText(file);
    };

    // Filtering for Table
    const filteredRows = marksData.filter(row => 
        mode === 'single' ? (selectedStudentId ? row.studentId === selectedStudentId : true) :
        (row.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || row.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Stats
    const stats = useMemo(() => {
        const total = marksData.length;
        const submitted = marksData.filter(r => r.marks.status === 'saved').length;
        const pending = total - submitted;
        const avg = total > 0 ? Math.round(marksData.reduce((acc, curr) => acc + curr.marks.total, 0) / total) : 0;
        return { total, submitted, pending, average: avg };
    }, [marksData]);

    // Chat Bot Logic
    const handleSendMessage = useCallback(async (message: string, history: Content[]) => {
        const contextData = marksData.length > 0 
            ? `Current Subject: ${subjectCode}\nSemester: ${semester}\nData: ${JSON.stringify(marksData.map(m => ({ name: m.studentName, usn: m.studentId, marks: m.marks })))}`
            : "No data currently loaded. Please ask the faculty to select a subject.";
        
        return await getFacultyAnalytics(contextData, history, message);
    }, [marksData, subjectCode, semester]);

    return (
        <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Marks Entry</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Academic Year: <span className="font-semibold text-gray-700 dark:text-gray-300">{year}</span></p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Download Template
                    </button>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all">
                        Evaluation Guidelines
                    </button>
                </div>
            </div>

            {/* Notifications */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-slide-in ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {notification.msg}
                </div>
            )}

            {/* Controls Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8 border border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Programme</label>
                        <select value={programme} onChange={e => setProgramme(e.target.value)} className="w-full p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                            <option>B.E. AIML</option>
                            <option>B.E. CSE</option>
                            <option>B.E. ECE</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Semester</label>
                        <select value={semester} onChange={e => setSemester(parseInt(e.target.value))} className="w-full p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Section</label>
                        <select value={section} onChange={e => setSection(e.target.value)} className="w-full p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                            <option>A</option><option>B</option><option>C</option>
                        </select>
                    </div>
                    <div className="space-y-1 col-span-2">
                        <label className="text-xs font-bold uppercase text-gray-500">Subject</label>
                        <select value={subjectCode} onChange={e => setSubjectCode(e.target.value)} className="w-full p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                            <option value="">-- Select Subject --</option>
                            {subjects.map(s => <option key={s.code} value={s.code}>{s.name} ({s.code})</option>)}
                        </select>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t dark:border-gray-700">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg">
                        <button 
                            onClick={() => setMode('bulk')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'bulk' ? 'bg-white dark:bg-gray-600 shadow text-primary-600 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'}`}
                        >
                            Bulk Entry
                        </button>
                        <button 
                            onClick={() => setMode('single')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'single' ? 'bg-white dark:bg-gray-600 shadow text-primary-600 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'}`}
                        >
                            Single Student
                        </button>
                    </div>

                    {mode === 'bulk' && (
                        <div className="relative w-full md:w-64">
                             <Icons.SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                             <input 
                                type="text" 
                                placeholder="Search USN or Name..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    )}

                    {mode === 'single' && (
                        <div className="w-full md:w-64">
                             <select 
                                value={selectedStudentId} 
                                onChange={e => setSelectedStudentId(e.target.value)} 
                                className="w-full p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm"
                             >
                                <option value="">Select Student</option>
                                {marksData.map(row => <option key={row.studentId} value={row.studentId}>{row.studentName}</option>)}
                             </select>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <label className="cursor-pointer p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="Import CSV">
                            <Icons.UploadIcon className="w-5 h-5" />
                            <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
                        </label>
                        <button onClick={handleExportCSV} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="Export CSV">
                            <Icons.ExportIcon className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={handleSaveAll} 
                            disabled={dirtyRows.size === 0 || loading}
                            className={`px-6 py-2 rounded-lg font-bold text-white text-sm transition-all ${dirtyRows.size > 0 ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            {loading ? 'Saving...' : `Save All (${dirtyRows.size})`}
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <MarksStatsCards {...stats} />

            {/* Data Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative">
                {marksData.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        Please select a subject to view and enter marks.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-600 text-xs uppercase text-gray-500 dark:text-gray-400">
                                    <th className="p-4 font-semibold w-16">#</th>
                                    <th className="p-4 font-semibold w-32">USN</th>
                                    <th className="p-4 font-semibold w-48">Name</th>
                                    <th className="p-4 font-semibold text-center w-24">CIE 1 <span className="text-[10px] block">(Max 25)</span></th>
                                    <th className="p-4 font-semibold text-center w-24">CIE 2 <span className="text-[10px] block">(Max 25)</span></th>
                                    <th className="p-4 font-semibold text-center w-24">Assign <span className="text-[10px] block">(Max 10)</span></th>
                                    <th className="p-4 font-semibold text-center w-24">SEE <span className="text-[10px] block">(Max 100)</span></th>
                                    <th className="p-4 font-semibold text-center w-24">Status</th>
                                    <th className="p-4 font-semibold text-center w-32">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredRows.map((row, idx) => {
                                    const isDirty = dirtyRows.has(row.studentId);
                                    return (
                                        <tr key={row.studentId} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${isDirty ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}`}>
                                            <td className="p-4 text-gray-500">{idx + 1}</td>
                                            <td className="p-4 font-mono text-gray-600 dark:text-gray-300">{row.studentId}</td>
                                            <td className="p-4 font-medium text-gray-900 dark:text-white">{row.studentName}</td>
                                            
                                            {/* Input Cell Generator */}
                                            {[
                                                { field: 'cie1', max: 25 }, 
                                                { field: 'cie2', max: 25 }, 
                                                { field: 'assignment', max: 10 }, 
                                                { field: 'see', max: 100 }
                                            ].map(({field, max}) => {
                                                const val = row.marks[field as keyof EditableSubjectResult] as number;
                                                const isInvalid = val > max || val < 0;
                                                
                                                return (
                                                    <td key={field} className="p-2 text-center">
                                                        <input
                                                            type="number"
                                                            value={val || ''}
                                                            onChange={e => handleInputChange(row.studentId, field as keyof EditableSubjectResult, e.target.value, max)}
                                                            className={`w-16 p-1.5 text-center text-sm rounded border outline-none focus:ring-2 focus:ring-primary-500 transition-all
                                                                ${isInvalid 
                                                                    ? 'border-red-500 bg-red-50 text-red-700 focus:ring-red-500' 
                                                                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                                                                }`}
                                                            placeholder="-"
                                                        />
                                                    </td>
                                                );
                                            })}

                                            <td className="p-4 text-center">
                                                {isDirty ? (
                                                    <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-700">Unsaved</span>
                                                ) : (
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${row.marks.status === 'saved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                        {row.marks.status === 'saved' ? 'Saved' : 'Pending'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button 
                                                        onClick={() => handleSaveRow(row.studentId)}
                                                        disabled={!isDirty}
                                                        className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${isDirty ? 'text-green-600' : 'text-gray-400'}`}
                                                        title="Save"
                                                    >
                                                        <Icons.SparklesIcon className="w-5 h-5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => setShowAudit(true)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                                                        title="History"
                                                    >
                                                        <Icons.EyeIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Chat Widget for Analytics */}
            <ChatWidget 
                title="Marks Assistant"
                initialMessage="I can help you analyze the marks for this class. Try asking about average performance or specific students."
                suggestions={["Calculate class average", "List students with < 10 in CIE 1", "Fetch marks for CIE 1"]}
                onSendMessage={handleSendMessage}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                isFaculty={true}
            />

            {/* Audit Panel Sidebar */}
            {showAudit && (
                <AuditPanel 
                    logs={marksAuditLog} 
                    onClose={() => setShowAudit(false)} 
                />
            )}
        </div>
    );
};

export default MarksManagementPage;
