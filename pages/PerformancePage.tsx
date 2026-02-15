
import React, { useContext, useMemo, useState, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataContext';
import { MOCK_CLASS_AVG_SGPA } from '../data/mockData';
import PerformanceTrendChart from '../components/charts/PerformanceTrendChart';
import SubjectAverageChart from '../components/charts/SubjectAverageChart';
import ChatWidget from '../components/common/ChatWidget';
import { getChartAnalysis } from '../services/geminiService';
import { Content } from '@google/genai';
import { Student } from '../types';

const PerformancePage: React.FC = () => {
    const authContext = useContext(AuthContext);
    const dataContext = useContext(DataContext);
    const [chatHistory, setChatHistory] = useState<Content[]>([]);
    
    const student = useMemo(() => {
        if (dataContext && authContext?.user) {
            return dataContext.students.find(s => s.id === authContext.user!.id);
        }
        return null;
    }, [dataContext, authContext]);

    const handleSendMessage = useCallback(async (message: string, history: Content[]) => {
        if (!student) return "Student data not found.";
        return await getChartAnalysis(student, MOCK_CLASS_AVG_SGPA, history, message);
    }, [student]);

    if (!authContext || !dataContext || !student) {
        return <div className="p-8">Loading...</div>;
    }
    
    const latestSemester = student.academicHistory.length > 0 
        ? student.academicHistory[student.academicHistory.length - 1] 
        : null;

    // Mock class average marks for demonstration
    const classAvgMarks = latestSemester ? latestSemester.results.map(r => ({
        name: r.name,
        marks: Math.min(95, r.marks + Math.floor(Math.random() * 10 - 3)),
    })) : [];
        
    const studentSgpaData = student.academicHistory.map(s => ({ semester: s.semester, sgpa: s.sgpa }));
    const classSgpaData = MOCK_CLASS_AVG_SGPA.map(s => ({ semester: s.semester, sgpa: s.avgSgpa }));

    const initialMessage = `Hi ${student.name.split(' ')[0]}! I'm Ace, your AI performance assistant. Ask me anything about your charts!`;
    const suggestions = ["Summarize my performance.", "Which subject should I focus on?", "Am I improving over time?"];

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Performance Dashboard</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">Welcome back, {student.name}. Here's an overview of your academic progress.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">SGPA Trend vs. Class Average</h2>
                    <PerformanceTrendChart studentData={studentSgpaData} classData={classSgpaData} />
                </div>
                {latestSemester && (
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Latest Semester Marks vs. Class Average (Sem {latestSemester.semester})</h2>
                        <SubjectAverageChart studentData={latestSemester.results} classData={classAvgMarks} />
                    </div>
                )}
            </div>
            
            <ChatWidget
                title="Performance AI Assistant"
                initialMessage={initialMessage}
                suggestions={suggestions}
                onSendMessage={handleSendMessage}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
            />
        </div>
    );
};

export default PerformancePage;
