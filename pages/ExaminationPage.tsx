
// NOTE: After saving restart dev server / refresh preview (npm run dev). File replaced: pages/ExaminationPage.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { 
    ChartBarIcon, 
    DocumentIcon, 
    SparklesIcon, 
    ArrowUpTrayIcon, 
    CheckCircleIcon, 
    XMarkIcon 
} from '@heroicons/react/24/outline';

// --- Types ---

type TabType = 'cie' | 'assignments' | 'lab' | 'see';

interface BaseRecord {
    id: string;
    subject: string;
    subjectCode: string;
}

interface LabRecord extends BaseRecord {
    lab1: number;
    lab2: number;
    lab3: number;
    maxPerLab: number;
    total: number;
    maxTotal: number;
    percentage: number;
}

interface CieRecord extends BaseRecord {
    ia1: number;
    ia2: number;
    assignment: number;
    total: number; // IA1 + IA2 + Assignment
    maxTotal: number;
    grade: string;
}

interface SeeRecord extends BaseRecord {
    credits: number;
    gradePoints: number;
    score: number;
    result: 'Pass' | 'Fail';
    grade: string;
}

interface AssignmentRecord extends BaseRecord {
    title: string;
    dueDate: string;
    status: 'Pending' | 'Submitted' | 'Graded';
    score?: number;
}

// --- Mock Data ---

const SAMPLE_LAB_DATA: LabRecord[] = [
    { id: '1', subject: 'DS Lab', subjectCode: 'CS31L', lab1: 24, lab2: 23, lab3: 25, maxPerLab: 25, total: 72, maxTotal: 75, percentage: 96 },
    { id: '2', subject: 'OS Lab', subjectCode: 'CS32L', lab1: 22, lab2: 24, lab3: 23, maxPerLab: 25, total: 69, maxTotal: 75, percentage: 92 },
    { id: '3', subject: 'DB Lab', subjectCode: 'CS33L', lab1: 21, lab2: 22, lab3: 24, maxPerLab: 25, total: 67, maxTotal: 75, percentage: 89 },
    { id: '4', subject: 'SE Lab', subjectCode: 'CS34L', lab1: 25, lab2: 24, lab3: 25, maxPerLab: 25, total: 74, maxTotal: 75, percentage: 98.6 },
    { id: '5', subject: 'CN Lab', subjectCode: 'CS35L', lab1: 23, lab2: 22, lab3: 23, maxPerLab: 25, total: 68, maxTotal: 75, percentage: 90.6 },
];

const SAMPLE_CIE_DATA: CieRecord[] = [
    { id: '1', subject: 'Data Structures', subjectCode: 'CS301', ia1: 23, ia2: 22, assignment: 9, total: 54, maxTotal: 60, grade: 'S' },
    { id: '2', subject: 'Operating Systems', subjectCode: 'CS302', ia1: 20, ia2: 21, assignment: 8, total: 49, maxTotal: 60, grade: 'A' },
    { id: '3', subject: 'Database Systems', subjectCode: 'CS303', ia1: 18, ia2: 19, assignment: 8, total: 45, maxTotal: 60, grade: 'B+' },
    { id: '4', subject: 'Software Engg', subjectCode: 'CS304', ia1: 24, ia2: 25, assignment: 10, total: 59, maxTotal: 60, grade: 'S' },
    { id: '5', subject: 'Comp. Networks', subjectCode: 'CS305', ia1: 21, ia2: 20, assignment: 9, total: 50, maxTotal: 60, grade: 'A' },
];

const SAMPLE_ASSIGNMENTS: AssignmentRecord[] = [
    { id: '1', subject: 'Data Structures', subjectCode: 'CS301', title: 'Linked List Impl', dueDate: '2024-10-15', status: 'Graded', score: 9 },
    { id: '2', subject: 'Operating Systems', subjectCode: 'CS302', title: 'Process Scheduling', dueDate: '2024-10-20', status: 'Submitted' },
    { id: '3', subject: 'Database Systems', subjectCode: 'CS303', title: 'ER Diagram Design', dueDate: '2024-10-25', status: 'Pending' },
    { id: '4', subject: 'Software Engg', subjectCode: 'CS304', title: 'SRS Documentation', dueDate: '2024-11-01', status: 'Pending' },
];

const SAMPLE_SEE_DATA: SeeRecord[] = [
    { id: '1', subject: 'Maths III', subjectCode: 'MAT31', credits: 4, gradePoints: 9, score: 88, result: 'Pass', grade: 'A' },
    { id: '2', subject: 'Data Structures', subjectCode: 'CS32', credits: 4, gradePoints: 10, score: 92, result: 'Pass', grade: 'S' },
    { id: '3', subject: 'Analog & Digital', subjectCode: 'CS33', credits: 3, gradePoints: 8, score: 76, result: 'Pass', grade: 'B' },
    { id: '4', subject: 'Comp. Org', subjectCode: 'CS34', credits: 3, gradePoints: 7, score: 65, result: 'Pass', grade: 'C' },
];

// --- Components ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const GradeBadge = ({ grade, score }: { grade?: string; score?: number }) => {
    let colorClass = "bg-gray-100 text-gray-600";
    const val = grade || (score ? (score >= 90 ? 'S' : score >= 80 ? 'A' : score >= 70 ? 'B' : 'C') : 'F');

    if (['S', 'A+', 'A'].includes(val) || (score && score >= 80)) colorClass = "bg-green-100 text-green-700 border border-green-200";
    else if (['B+', 'B'].includes(val) || (score && score >= 60)) colorClass = "bg-blue-100 text-blue-700 border border-blue-200";
    else if (['C+', 'C', 'P'].includes(val) || (score && score >= 40)) colorClass = "bg-orange-100 text-orange-700 border border-orange-200";
    else colorClass = "bg-red-100 text-red-700 border border-red-200";

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${colorClass}`}>
            {grade || `${score}%`}
        </span>
    );
};

const TrendSparkline = ({ data }: { data: number[] }) => {
    const height = 40;
    const width = 100;
    const max = Math.max(...data, 60);
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - (d / max) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="overflow-visible">
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ff7043" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#ff7043" stopOpacity={0} />
                </linearGradient>
            </defs>
            <path d={`M0,${height} L0,${height} ${data.map((d, i) => `L${(i / (data.length - 1)) * width},${height - (d / max) * height}`).join(' ')} L${width},${height} Z`} fill="url(#gradient)" />
            <polyline points={points} fill="none" stroke="#ff7043" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {data.map((d, i) => (
                <circle key={i} cx={(i / (data.length - 1)) * width} cy={height - (d / max) * height} r="2" fill="#fff" stroke="#ff7043" strokeWidth="2" />
            ))}
        </svg>
    );
};

// --- Main Page Component ---

const ExaminationPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('cie');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedUploadSubject, setSelectedUploadSubject] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<Record<string, boolean>>({}); 

    // Stats Calculation
    const stats = useMemo(() => {
        let data: any[] = [];
        let key = 'total';
        
        if (activeTab === 'lab') { data = SAMPLE_LAB_DATA; key = 'percentage'; }
        else if (activeTab === 'cie') { data = SAMPLE_CIE_DATA; key = 'total'; }
        else if (activeTab === 'see') { data = SAMPLE_SEE_DATA; key = 'score'; }
        
        if (data.length === 0) return { average: 0, best: 'N/A', improvement: 'N/A', trend: [] };

        const scores = data.map(d => d[key] as number);
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);
        
        const bestSubject = data.find(d => d[key] === maxScore)?.subject || 'N/A';
        const improvementSubject = data.find(d => d[key] === minScore)?.subject || 'N/A';

        return {
            average: average.toFixed(1),
            best: bestSubject,
            improvement: improvementSubject,
            trend: scores
        };
    }, [activeTab]);

    // Handlers
    const handleUploadClick = (subjectId: string) => {
        setSelectedUploadSubject(subjectId);
        setIsUploadModalOpen(true);
    };

    const handleFileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUploadSubject) {
            setUploadStatus(prev => ({ ...prev, [selectedUploadSubject]: true }));
            setTimeout(() => {
                setIsUploadModalOpen(false);
                setSelectedUploadSubject(null);
            }, 500);
        }
    };

    // Render Functions
    const renderTable = () => {
        switch (activeTab) {
            case 'lab':
                return (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs uppercase text-gray-500 border-b border-gray-100">
                                <th className="px-6 py-4 font-medium bg-gray-50/50 rounded-tl-xl">Subject</th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 text-center">Lab 1</th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 text-center">Lab 2</th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 text-center">Lab 3</th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 text-center">Total</th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 text-center">Percentage</th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 rounded-tr-xl text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {SAMPLE_LAB_DATA.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{row.subject}</div>
                                        <div className="text-xs text-gray-400 font-mono mt-0.5">{row.subjectCode}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-600">{row.lab1}<span className="text-gray-300 text-xs">/{row.maxPerLab}</span></td>
                                    <td className="px-6 py-4 text-center text-gray-600">{row.lab2}<span className="text-gray-300 text-xs">/{row.maxPerLab}</span></td>
                                    <td className="px-6 py-4 text-center text-gray-600">{row.lab3}<span className="text-gray-300 text-xs">/{row.maxPerLab}</span></td>
                                    <td className="px-6 py-4 text-center font-bold text-gray-900">{row.total}</td>
                                    <td className="px-6 py-4 text-center">
                                        <GradeBadge score={row.percentage} />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {uploadStatus[row.id] ? (
                                            <span className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-green-50 text-green-700">
                                                <CheckCircleIcon className="w-4 h-4 mr-1" /> Uploaded
                                            </span>
                                        ) : (
                                            <button 
                                                onClick={() => handleUploadClick(row.id)}
                                                className="inline-flex items-center px-3 py-1.5 border border-gray-200 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:text-orange-600 hover:border-orange-200 transition-all"
                                            >
                                                <ArrowUpTrayIcon className="w-3.5 h-3.5 mr-1.5" /> Upload
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'cie':
                return (
                    <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="text-xs uppercase text-gray-500 border-b border-gray-100">
                                <th className="px-6 py-4 font-medium bg-gray-50/50 rounded-tl-xl">Subject</th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 text-center">IA 1 <span className="text-[10px] block">(Max 25)</span></th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 text-center">IA 2 <span className="text-[10px] block">(Max 25)</span></th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 text-center">Assignment <span className="text-[10px] block">(Max 10)</span></th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 text-center">Total <span className="text-[10px] block">(Max 60)</span></th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 rounded-tr-xl text-center">Grade</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-gray-100">
                            {SAMPLE_CIE_DATA.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{row.subject}</div>
                                        <div className="text-xs text-gray-400 font-mono mt-0.5">{row.subjectCode}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-600">{row.ia1}</td>
                                    <td className="px-6 py-4 text-center text-gray-600">{row.ia2}</td>
                                    <td className="px-6 py-4 text-center text-gray-600">{row.assignment}</td>
                                    <td className="px-6 py-4 text-center font-bold text-gray-900">{row.total}</td>
                                    <td className="px-6 py-4 text-center"><GradeBadge grade={row.grade} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'see':
                return (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs uppercase text-gray-500 border-b border-gray-100">
                                <th className="px-6 py-4 font-medium bg-gray-50/50 rounded-tl-xl">Subject</th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 text-center">Credits</th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 text-center">Grade Points</th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 text-center">Score</th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 rounded-tr-xl text-center">Result</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                             {SAMPLE_SEE_DATA.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                     <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{row.subject}</div>
                                        <div className="text-xs text-gray-400 font-mono mt-0.5">{row.subjectCode}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-600">{row.credits}</td>
                                    <td className="px-6 py-4 text-center text-gray-600 font-semibold">{row.gradePoints}</td>
                                    <td className="px-6 py-4 text-center text-gray-600">{row.score}/100</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">PASS</span>
                                    </td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                );
            case 'assignments':
                return (
                    <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="text-xs uppercase text-gray-500 border-b border-gray-100">
                                <th className="px-6 py-4 font-medium bg-gray-50/50 rounded-tl-xl">Assignment</th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 text-center">Due Date</th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 text-center">Status</th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 text-center">Score</th>
                                <th className="px-6 py-4 font-medium bg-gray-50/50 rounded-tr-xl text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                             {SAMPLE_ASSIGNMENTS.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{row.title}</div>
                                        <div className="text-xs text-gray-400 font-mono mt-0.5">{row.subject} ({row.subjectCode})</div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-600 text-sm">{row.dueDate}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-medium 
                                            ${row.status === 'Graded' ? 'bg-green-100 text-green-700' : 
                                              row.status === 'Submitted' ? 'bg-blue-100 text-blue-700' : 
                                              'bg-yellow-100 text-yellow-700'}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-semibold text-gray-700">
                                        {row.score ? `${row.score}/10` : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {row.status === 'Pending' ? (
                                            <button 
                                                onClick={() => handleUploadClick(row.id)}
                                                className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md shadow-sm transition-colors"
                                            >
                                                Submit
                                            </button>
                                        ) : (
                                            <button className="text-xs text-gray-400 cursor-not-allowed" disabled>View</button>
                                        )}
                                    </td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                );
        }
    };

    return (
        <div className="p-6 sm:p-10 min-h-screen bg-white dark:bg-gray-900 font-sans">
            {/* 1. Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Examination & Marks</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Manage your academic assessments, view results, and submit assignments.</p>
            </div>

            {/* 2. Tabs */}
            <div className="mb-8 overflow-x-auto">
                <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 w-min min-w-full">
                    {(['cie', 'assignments', 'lab', 'see'] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 text-sm font-semibold transition-all relative outline-none whitespace-nowrap
                                ${activeTab === tab 
                                    ? 'text-[#ff7043] border-b-2 border-[#ff7043]' 
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            {tab === 'cie' && "CIE Marks"}
                            {tab === 'assignments' && "Assignments"}
                            {tab === 'lab' && "Lab Internals"}
                            {tab === 'see' && "SEE Results"}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. Main Card (Table) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
                {/* Gradient Header */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#ff7043] via-purple-500 to-blue-500 opacity-80"></div>
                
                <div className="overflow-x-auto">
                    {renderTable()}
                </div>

                {/* Empty State Handling (Mock check) */}
                {activeTab === 'assignments' && SAMPLE_ASSIGNMENTS.length === 0 && (
                    <div className="p-12 text-center text-gray-400">No pending assignments.</div>
                )}
            </div>

            {/* 4. Stats & Trends */}
            {activeTab !== 'assignments' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Performance Card */}
                    <div className="col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex-1 w-full">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <ChartBarIcon className="w-4 h-4" /> Performance Trends
                            </h3>
                            <div className="flex items-end gap-6">
                                <div>
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.average}</span>
                                    <p className="text-xs text-gray-500 mt-1">Overall Average</p>
                                </div>
                                <div className="h-10 w-px bg-gray-200 dark:bg-gray-700"></div>
                                <div>
                                    <p className="text-xs text-gray-500">Best Subject</p>
                                    <p className="font-semibold text-green-600 text-sm truncate max-w-[120px]">{stats.best}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Needs Focus</p>
                                    <p className="font-semibold text-orange-600 text-sm truncate max-w-[120px]">{stats.improvement}</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-48 flex flex-col items-end">
                            <TrendSparkline data={stats.trend} />
                            <p className="text-[10px] text-gray-400 mt-2 text-right">Trend based on last 5 assessments</p>
                        </div>
                    </div>

                    {/* Grade Distribution Mini-Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                             <SparklesIcon className="w-4 h-4" /> Distribution
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-300">A+ / S (Excellent)</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[60%]"></div>
                                    </div>
                                    <span className="font-bold text-xs">3</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-300">A / B (Good)</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[30%]"></div>
                                    </div>
                                    <span className="font-bold text-xs">1</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-300">C (Average)</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500 w-[10%]"></div>
                                    </div>
                                    <span className="font-bold text-xs">1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Submission">
                <form onSubmit={handleFileSubmit} className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                            <DocumentIcon />
                        </div>
                        <div className="mt-2">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#ff7043] hover:text-orange-500 focus-within:outline-none">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" required />
                            </label>
                            <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG up to 10MB</p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#ff7043] rounded-lg hover:bg-orange-600 shadow-md shadow-orange-200">Submit</button>
                    </div>
                </form>
            </Modal>

            {/* Simple Footer */}
            <div className="mt-10 text-center text-xs text-gray-400">
                <p>Assessment data updated: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default ExaminationPage;
