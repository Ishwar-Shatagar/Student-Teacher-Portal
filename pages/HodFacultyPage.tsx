
import React, { useState, useContext, useMemo } from 'react';
import { DataContext } from '../contexts/DataContext';
import { ProfessionalUser, Department } from '../types';
import * as Icons from '../components/common/Icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const HodFacultyPage: React.FC = () => {
    const context = useContext(DataContext);
    const [selectedDept, setSelectedDept] = useState<string>('All');
    const [search, setSearch] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState<ProfessionalUser | null>(null);

    if (!context) return null;
    const { faculty, departments, attendanceRecords } = context;

    // Filter Logic
    const filteredFaculty = faculty.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
        const matchesDept = selectedDept === 'All' || f.department === selectedDept;
        return matchesSearch && matchesDept;
    });

    // Stats Calculation for Detail View
    const getFacultyStats = (facId: string) => {
        const records = attendanceRecords.filter(r => r.facultyId === facId);
        const last5 = records.slice(0, 5).sort((a,b) => new Date(b.classDate).getTime() - new Date(a.classDate).getTime());
        
        // Chart Data (Classes per day for last 7 days)
        const today = new Date();
        const chartData = [];
        for(let i=6; i>=0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const count = records.filter(r => r.classDate === dateStr).length;
            chartData.push({ date: dateStr.slice(5), count }); // MM-DD
        }

        return { last5, chartData };
    };

    const FacultyDetailDrawer = ({ teacher, onClose }: { teacher: ProfessionalUser, onClose: () => void }) => {
        const { last5, chartData } = getFacultyStats(teacher.id);

        return (
            <>
                <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose}></div>
                <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-white dark:bg-gray-900 shadow-2xl z-50 p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <Icons.SortIcon className="w-6 h-6 rotate-90" />
                    </button>

                    <div className="flex flex-col items-center mt-8 mb-8">
                        <img src={teacher.profilePicUrl} alt={teacher.name} className="w-28 h-28 rounded-full object-cover ring-4 ring-primary-100 dark:ring-primary-900" />
                        <h2 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">{teacher.name}</h2>
                        <p className="text-primary-600 dark:text-primary-400 font-medium">{teacher.designation}</p>
                        <div className="flex gap-4 mt-4 text-sm text-gray-500">
                             <span className="flex items-center gap-1"><Icons.EmailIcon className="w-4 h-4"/> {teacher.email}</span>
                             <span className="flex items-center gap-1"><Icons.PhoneIcon className="w-4 h-4"/> {teacher.contact}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{teacher.classCount}</p>
                            <p className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 mt-1">Total Classes</p>
                        </div>
                         <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
                            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{teacher.avgRating}</p>
                            <p className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 mt-1">Avg Rating</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Activity (Last 7 Days)</h3>
                        <div className="h-48 w-full">
                            <ResponsiveContainer>
                                <BarChart data={chartData}>
                                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                                    <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Last 5 Classes</h3>
                        <div className="space-y-3">
                            {last5.map((rec, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{rec.subjectCode}</p>
                                        <p className="text-xs text-gray-500">{rec.classDate} • Sem {rec.semester}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-bold text-green-600 dark:text-green-400">{rec.presentCount}/{rec.totalStudents}</span>
                                        <span className="text-xs text-gray-400">Present</span>
                                    </div>
                                </div>
                            ))}
                            {last5.length === 0 && <p className="text-gray-500 text-sm italic">No recent classes found.</p>}
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="flex h-full flex-col md:flex-row overflow-hidden">
            {/* Sidebar for Departments */}
            <div className="w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Departments</h2>
                    <ul className="space-y-2">
                        <li>
                            <button 
                                onClick={() => setSelectedDept('All')}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${selectedDept === 'All' ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                All Departments
                            </button>
                        </li>
                        {departments.map(dept => (
                            <li key={dept.id}>
                                <button 
                                    onClick={() => setSelectedDept(dept.code)} // Matching code 'AIML', 'CSE' etc
                                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${selectedDept === dept.code ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                >
                                    <span>{dept.name}</span>
                                    <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">{dept.facultyCount}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Faculty Members <span className="text-gray-400 font-normal text-lg">({filteredFaculty.length})</span></h1>
                    <div className="relative w-full sm:w-64">
                        <Icons.SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search name..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredFaculty.map((f) => (
                        <div 
                            key={f.id} 
                            onClick={() => setSelectedFaculty(f)}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 cursor-pointer hover:shadow-lg hover:border-primary-500 transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <img src={f.profilePicUrl} alt="" className="w-16 h-16 rounded-full object-cover bg-gray-100" />
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{f.name}</h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">{f.designation} • {f.department}</p>
                                    <div className="flex gap-2 mt-2">
                                        {f.subjectsTaught.slice(0, 2).map((s, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded">{s.code}</span>
                                        ))}
                                        {f.subjectsTaught.length > 2 && <span className="text-xs text-gray-400 self-center">+{f.subjectsTaught.length - 2}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs">Classes Taken</p>
                                    <p className="font-bold text-gray-900 dark:text-white">{f.classCount}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500 text-xs">Rating</p>
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-gray-900 dark:text-white">{f.avgRating}</span>
                                        <Icons.SparklesIcon className="w-3 h-3 text-yellow-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedFaculty && <FacultyDetailDrawer teacher={selectedFaculty} onClose={() => setSelectedFaculty(null)} />}
        </div>
    );
};

export default HodFacultyPage;
