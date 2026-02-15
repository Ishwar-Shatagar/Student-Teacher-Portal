
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { DataContext } from '../contexts/DataContext';
import { Student } from '../types';
import {
    ChartBarIcon,
    TableCellsIcon,
    ArrowDownTrayIcon,
    CalendarDaysIcon,
    FunnelIcon,
    UserGroupIcon,
    ExclamationTriangleIcon,
    AcademicCapIcon,
    ClipboardDocumentCheckIcon,
    ClockIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

// --- Types ---

type ReportType = 'attendance' | 'at_risk' | 'assignments' | 'results' | 'audit';

interface ReportFilter {
    department: string;
    semester: string;
    dateRange: 'this_week' | 'this_month' | 'this_sem';
}

interface SummaryCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
}

// --- Helper Functions ---

const exportToCSV = (data: any[], filename: string) => {
    if (!data || !data.length) return;
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

// --- Components ---

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subtitle, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start justify-between transition-transform hover:scale-[1.02]">
        <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</h3>
            <p className={`text-xs mt-1 font-medium ${color}`}>{subtitle}</p>
        </div>
        <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('600', '100').replace('500', '100')} ${color} dark:bg-opacity-20`}>
            {icon}
        </div>
    </div>
);

const ScheduleDrawer: React.FC<{ isOpen: boolean; onClose: () => void; reportType: ReportType }> = ({ isOpen, onClose, reportType }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl p-6 flex flex-col animate-slide-in-right border-l border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Schedule Report</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="space-y-6 flex-1">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                            You are scheduling the <span className="font-bold uppercase">{reportType.replace('_', ' ')}</span> report.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Frequency</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['Daily', 'Weekly', 'Monthly'].map(freq => (
                                <button key={freq} className="py-2 px-4 border rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700 dark:text-gray-300 focus:ring-2 ring-primary-500 focus:bg-primary-50 focus:border-primary-500 dark:focus:bg-gray-800">
                                    {freq}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Recipients (Email)</label>
                        <textarea 
                            rows={3} 
                            className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            placeholder="principal@college.edu, hod.cse@college.edu"
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-1">Separate multiple emails with commas.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Format</label>
                        <select className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm outline-none">
                            <option>PDF (Summary)</option>
                            <option>CSV (Raw Data)</option>
                            <option>Excel (Formatted)</option>
                        </select>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                    <button onClick={() => { alert('Report Scheduled!'); onClose(); }} className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20">
                        Confirm Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

const HodReportsPage: React.FC = () => {
    const context = useContext(DataContext);
    
    // State
    const [activeReport, setActiveReport] = useState<ReportType>('attendance');
    const [filters, setFilters] = useState<ReportFilter>({
        department: 'All',
        semester: 'All',
        dateRange: 'this_sem'
    });
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [generatedData, setGeneratedData] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({});
    const [chartData, setChartData] = useState<any[]>([]);

    // Hooks
    useEffect(() => {
        if (!context) return;
        generateReport();
    }, [activeReport, filters, context]);

    if (!context) return <div>Loading...</div>;
    const { students, assignments, marksAuditLog } = context;

    // --- Report Generation Logic ---

    const generateReport = () => {
        let data: any[] = [];
        let summaryStats: any = {};
        let visualData: any[] = [];

        // Filter Students Base
        const filteredStudents = students.filter(s => 
            (filters.department === 'All' || s.department === filters.department) &&
            (filters.semester === 'All' || s.semester.toString() === filters.semester)
        );

        switch (activeReport) {
            case 'attendance':
                data = filteredStudents.map(s => {
                    const totalClasses = s.attendance.reduce((a, c) => a + c.totalClasses, 0);
                    const attended = s.attendance.reduce((a, c) => a + c.classesAttended, 0);
                    const pct = totalClasses > 0 ? (attended / totalClasses) * 100 : 0;
                    return {
                        id: s.id,
                        name: s.name,
                        dept: s.department,
                        sem: s.semester,
                        total_classes: totalClasses,
                        attended: attended,
                        percentage: pct.toFixed(1),
                        status: pct < 75 ? 'Shortage' : 'Safe'
                    };
                });

                const lowAtt = data.filter(d => parseFloat(d.percentage) < 75).length;
                const avgAtt = data.length > 0 ? data.reduce((a, b) => a + parseFloat(b.percentage), 0) / data.length : 0;
                
                summaryStats = {
                    kpi1: { title: 'Total Students', value: data.length, subtitle: 'In selected range', icon: <UserGroupIcon className="w-6 h-6"/>, color: 'text-blue-600' },
                    kpi2: { title: 'Avg Attendance', value: `${avgAtt.toFixed(1)}%`, subtitle: 'Overall average', icon: <ChartBarIcon className="w-6 h-6"/>, color: 'text-green-600' },
                    kpi3: { title: 'Below Threshold', value: lowAtt, subtitle: '< 75% Attendance', icon: <ExclamationTriangleIcon className="w-6 h-6"/>, color: 'text-red-600' }
                };

                // Histogram Data
                const ranges = { '0-50%': 0, '50-75%': 0, '75-90%': 0, '90-100%': 0 };
                data.forEach(d => {
                    const p = parseFloat(d.percentage);
                    if (p < 50) ranges['0-50%']++;
                    else if (p < 75) ranges['50-75%']++;
                    else if (p < 90) ranges['75-90%']++;
                    else ranges['90-100%']++;
                });
                visualData = Object.keys(ranges).map(key => ({ name: key, count: ranges[key as keyof typeof ranges] }));
                break;

            case 'at_risk':
                data = filteredStudents.map(s => {
                    const totalClasses = s.attendance.reduce((a, c) => a + c.totalClasses, 0);
                    const attended = s.attendance.reduce((a, c) => a + c.classesAttended, 0);
                    const attPct = totalClasses > 0 ? (attended / totalClasses) * 100 : 0;
                    
                    const latestSem = s.academicHistory[s.academicHistory.length - 1];
                    const sgpa = latestSem ? latestSem.sgpa : 0;
                    const failedSubjects = latestSem ? latestSem.results.filter(r => r.marks < 35).length : 0;

                    // Risk Logic
                    let riskScore = 0;
                    let reasons = [];
                    if (attPct < 75) { riskScore += 50; reasons.push('Low Attendance'); }
                    if (sgpa < 5.0) { riskScore += 30; reasons.push('Low SGPA'); }
                    if (failedSubjects > 0) { riskScore += 20 * failedSubjects; reasons.push(`${failedSubjects} Backlogs`); }

                    if (riskScore === 0) return null;

                    return {
                        id: s.id,
                        name: s.name,
                        dept: s.department,
                        sem: s.semester,
                        attendance: attPct.toFixed(1),
                        sgpa: sgpa,
                        risk_score: Math.min(riskScore, 100),
                        reason: reasons.join(', '),
                        severity: riskScore > 70 ? 'Critical' : 'Moderate'
                    };
                }).filter(Boolean); // Remove nulls

                summaryStats = {
                    kpi1: { title: 'At-Risk Students', value: data.length, subtitle: 'Require attention', icon: <ExclamationTriangleIcon className="w-6 h-6"/>, color: 'text-red-600' },
                    kpi2: { title: 'Critical Cases', value: data.filter(d => d.severity === 'Critical').length, subtitle: 'Immediate action needed', icon: <ClockIcon className="w-6 h-6"/>, color: 'text-orange-600' },
                    kpi3: { title: 'Intervention Rate', value: '12%', subtitle: 'Counseled this month', icon: <ClipboardDocumentCheckIcon className="w-6 h-6"/>, color: 'text-blue-600' }
                };

                visualData = [
                    { name: 'Attendance Issues', value: data.filter(d => d.reason.includes('Attendance')).length },
                    { name: 'Academic Issues', value: data.filter(d => d.reason.includes('SGPA') || d.reason.includes('Backlog')).length },
                    { name: 'Both', value: data.filter(d => d.reason.includes('Attendance') && (d.reason.includes('SGPA') || d.reason.includes('Backlog'))).length }
                ];
                break;

            case 'assignments':
                // Mock Assignment Stats derived from context + simulation
                data = assignments.map(a => {
                    // Simulate submission counts based on string hash for demo stability
                    const total = 60; // Mock class size
                    const submitted = Math.floor((a.title.length * 3) % 60); 
                    const rate = (submitted/total)*100;
                    return {
                        id: a.id,
                        title: a.title,
                        subject: a.subjectName,
                        due_date: new Date(a.dueDate).toLocaleDateString(),
                        total_students: total,
                        submitted_count: submitted,
                        submission_rate: rate.toFixed(1) + '%',
                        status: a.status
                    };
                });

                const avgSubRate = data.reduce((a, b) => a + parseFloat(b.submission_rate), 0) / (data.length || 1);
                
                summaryStats = {
                     kpi1: { title: 'Total Assignments', value: data.length, subtitle: 'Active & Past', icon: <ClipboardDocumentCheckIcon className="w-6 h-6"/>, color: 'text-blue-600' },
                     kpi2: { title: 'Avg Submission Rate', value: `${avgSubRate.toFixed(0)}%`, subtitle: 'Across all subjects', icon: <ChartBarIcon className="w-6 h-6"/>, color: 'text-green-600' },
                     kpi3: { title: 'Pending Grading', value: data.filter(d => d.status === 'Submitted').length, subtitle: 'Needs review', icon: <ClockIcon className="w-6 h-6"/>, color: 'text-orange-600' }
                };

                // Chart: Assignments by Status
                visualData = [
                    { name: 'Pending', value: data.filter(d => d.status === 'Pending').length },
                    { name: 'Submitted', value: data.filter(d => d.status === 'Submitted').length },
                    { name: 'Graded', value: data.filter(d => d.status === 'Graded').length },
                    { name: 'Overdue', value: data.filter(d => d.status === 'Overdue').length },
                ];
                break;
            
            case 'results':
                // Mock semester result processing
                 data = filteredStudents.map(s => {
                    const lastSem = s.academicHistory[s.academicHistory.length - 1];
                    return {
                        id: s.id,
                        name: s.name,
                        sem: s.semester,
                        sgpa: lastSem?.sgpa || 0,
                        result: (lastSem?.sgpa || 0) > 4 ? 'Pass' : 'Fail',
                        backlogs: (lastSem?.results.filter(r => r.marks < 35).length) || 0
                    }
                 });
                 
                 const avgGPA = data.reduce((a, b) => a + b.sgpa, 0) / (data.length || 1);
                 const passCount = data.filter(d => d.result === 'Pass').length;
                 
                 summaryStats = {
                    kpi1: { title: 'Overall Pass %', value: `${((passCount/data.length)*100).toFixed(1)}%`, subtitle: 'Current Semester', icon: <AcademicCapIcon className="w-6 h-6"/>, color: 'text-green-600' },
                    kpi2: { title: 'Average SGPA', value: avgGPA.toFixed(2), subtitle: 'Class Average', icon: <ChartBarIcon className="w-6 h-6"/>, color: 'text-blue-600' },
                    kpi3: { title: 'Backlogs', value: data.reduce((a, b) => a + b.backlogs, 0), subtitle: 'Total Subjects Failed', icon: <ExclamationTriangleIcon className="w-6 h-6"/>, color: 'text-red-600' }
                 };
                 
                 // Grade Distribution Chart
                 const grades = { '9-10': 0, '8-9': 0, '7-8': 0, '6-7': 0, '<6': 0 };
                 data.forEach(d => {
                     if(d.sgpa >= 9) grades['9-10']++;
                     else if(d.sgpa >= 8) grades['8-9']++;
                     else if(d.sgpa >= 7) grades['7-8']++;
                     else if(d.sgpa >= 6) grades['6-7']++;
                     else grades['<6']++;
                 });
                 visualData = Object.keys(grades).map(k => ({ name: k, count: grades[k as keyof typeof grades] }));
                 break;
            
            case 'audit':
                // Use mock audit logs
                data = marksAuditLog.length > 0 ? marksAuditLog.map(log => ({
                    timestamp: new Date(log.timestamp).toLocaleString(),
                    faculty: log.facultyName,
                    student: log.studentName,
                    subject: log.subjectCode,
                    change: `${log.changedField}: ${log.oldValue} -> ${log.newValue}`
                })) : [
                    // Fallback mock if empty
                    { timestamp: '2024-02-20 10:30', faculty: 'Dr. Rajesh', student: 'Rahul S', subject: 'BCS301', change: 'CIE1: 18 -> 20' },
                    { timestamp: '2024-02-20 11:15', faculty: 'Prof. Anita', student: 'Priya P', subject: 'BCS304', change: 'Assign: 8 -> 9' },
                ];
                
                summaryStats = {
                     kpi1: { title: 'Total Edits', value: data.length, subtitle: 'Last 30 Days', icon: <TableCellsIcon className="w-6 h-6"/>, color: 'text-blue-600' },
                     kpi2: { title: 'Active Faculty', value: new Set(data.map(d => d.faculty)).size, subtitle: 'Making changes', icon: <UserGroupIcon className="w-6 h-6"/>, color: 'text-purple-600' },
                     kpi3: { title: 'Affected Students', value: new Set(data.map(d => d.student)).size, subtitle: 'Records updated', icon: <UserGroupIcon className="w-6 h-6"/>, color: 'text-orange-600' }
                };
                
                // Action types chart (mocked for audit as types aren't granular in mock)
                visualData = [ { name: 'Marks Update', value: 80 }, { name: 'Attendance Edit', value: 20 } ];
                break;
        }

        setGeneratedData(data);
        setStats(summaryStats);
        setChartData(visualData);
    };

    // --- Render ---

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="p-6 sm:p-8 min-h-screen bg-gray-50 dark:bg-gray-900 space-y-8">
            {/* Header & Toolbar */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">Reports & Analytics</h1>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row gap-4 items-center justify-between">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                        <div className="relative">
                            <select 
                                value={activeReport} 
                                onChange={(e) => setActiveReport(e.target.value as ReportType)}
                                className="pl-4 pr-10 py-2.5 bg-gray-100 dark:bg-gray-700 border-transparent rounded-xl font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none appearance-none cursor-pointer"
                            >
                                <option value="attendance">Attendance Summary</option>
                                <option value="at_risk">At-Risk Students</option>
                                <option value="assignments">Assignment Report</option>
                                <option value="results">Results Snapshot</option>
                                <option value="audit">Audit Logs</option>
                            </select>
                        </div>
                        
                        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

                        <select 
                            value={filters.department}
                            onChange={(e) => setFilters({...filters, department: e.target.value})}
                            className="py-2.5 px-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-primary-500"
                        >
                            <option value="All">All Departments</option>
                            <option value="AIML">AIML</option>
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                        </select>

                        <select 
                            value={filters.semester}
                            onChange={(e) => setFilters({...filters, semester: e.target.value})}
                            className="py-2.5 px-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-primary-500"
                        >
                            <option value="All">All Semesters</option>
                            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 w-full lg:w-auto justify-end">
                         <button 
                            onClick={() => setIsScheduleOpen(true)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <CalendarDaysIcon className="w-5 h-5" /> Schedule
                        </button>
                        <button 
                            onClick={() => exportToCSV(generatedData, `${activeReport}_report.csv`)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-600/20 transition-colors"
                        >
                            <ArrowDownTrayIcon className="w-5 h-5" /> Export CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* KPI Cards */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.kpi1 && <SummaryCard {...stats.kpi1} />}
                    {stats.kpi2 && <SummaryCard {...stats.kpi2} />}
                    {stats.kpi3 && <SummaryCard {...stats.kpi3} />}
                </div>

                {/* Main Data Table */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-[500px]">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <TableCellsIcon className="w-5 h-5 text-gray-500" /> Detailed Data
                        </h3>
                        <span className="text-xs text-gray-500 font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                            {generatedData.length} Records
                        </span>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 font-semibold sticky top-0">
                                <tr>
                                    {generatedData.length > 0 && Object.keys(generatedData[0]).map(key => (
                                        <th key={key} className="px-6 py-3 border-b dark:border-gray-700">{key.replace('_', ' ')}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {generatedData.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        {Object.values(row).map((val: any, j) => (
                                            <td key={j} className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                                {/* Styling specific columns */}
                                                {['Critical', 'Fail', 'Overdue', 'Shortage'].includes(val) ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                        {val}
                                                    </span>
                                                ) : ['Safe', 'Pass', 'Graded'].includes(val) ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                        {val}
                                                    </span>
                                                ) : (
                                                    val
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {generatedData.length === 0 && (
                            <div className="h-full flex items-center justify-center text-gray-400">No data available for selected filters.</div>
                        )}
                    </div>
                </div>

                {/* Visual Analytics */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <ChartBarIcon className="w-5 h-5 text-gray-500" /> 
                        {activeReport === 'at_risk' ? 'Risk Factor Breakdown' : 'Distribution Analysis'}
                    </h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            {activeReport === 'at_risk' || activeReport === 'assignments' ? (
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            ) : (
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        cursor={{fill: 'transparent'}}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Scheduling Drawer */}
            <ScheduleDrawer 
                isOpen={isScheduleOpen} 
                onClose={() => setIsScheduleOpen(false)} 
                reportType={activeReport} 
            />
        </div>
    );
};

export default HodReportsPage;
