
import React, { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import SubjectCard from '../components/faculty-dashboard/SubjectCard';
import TimetableWidget from '../components/dashboard/TimetableWidget';
import { ChartBarIcon } from '../components/common/Icons';
import { DataContext } from '../contexts/DataContext';

const FacultyDashboard: React.FC = () => {
    const dataContext = useContext(DataContext);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // If using real data, map specific faculty subjects here if needed
    const subjects = [
        { name: 'Deep Learning', color: 'subject-blue' },
        { name: 'Image Processing', color: 'subject-green' },
        { name: 'Mini Project', color: 'subject-orange' },
    ];

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && dataContext) {
            dataContext.importStudentsFromExcel(file);
        }
        if(event.target) {
            event.target.value = '';
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:shadow-xl hover:[transform:perspective(1000px)_rotateX(2deg)_rotateY(-4deg)_scale3d(1.05,1.05,1.05)]">
                    <ChartBarIcon className="w-16 h-16 text-primary-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">AI-Powered Analytics</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 mb-4">
                        Dive deep into student performance data, visualize trends, and get AI-driven insights with our new analytics chatbot.
                    </p>
                    <Link to="/faculty-analytics" className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:shadow-lg hover:[transform:perspective(800px)_translateZ(5px)_rotateX(5deg)]">
                        Go to Analytics
                    </Link>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:shadow-xl hover:[transform:perspective(1000px)_rotateX(2deg)_rotateY(-4deg)_scale3d(1.05,1.05,1.05)]">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Quick Stats</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Total Students</span>
                            <span className="font-bold text-lg text-primary-600">{dataContext?.students.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Average Attendance</span>
                            <span className="font-bold text-lg text-green-500">94%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Average CGPA</span>
                            <span className="font-bold text-lg text-blue-500">8.0</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Data Management</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    Import your student roster to override the current data, or export all current student data, including marks and attendance, to an Excel file.
                </p>
                <div className="flex flex-wrap gap-4">
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        ref={fileInputRef}
                        onChange={handleFileImport}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:shadow-lg hover:[transform:perspective(800px)_translateZ(5px)_rotateX(5deg)]"
                    >
                        Import from Excel
                    </button>
                    <button
                        onClick={() => dataContext?.exportStudentsToExcel()}
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:shadow-lg hover:[transform:perspective(800px)_translateZ(5px)_rotateX(5deg)]"
                    >
                        Export to Excel
                    </button>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Subjects I'm Taking</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject, index) => (
                        <SubjectCard key={index} subjectName={subject.name} colorClass={subject.color} />
                    ))}
                </div>
            </div>
            
            <TimetableWidget semester={5} />
        </div>
    );
};

export default FacultyDashboard;
