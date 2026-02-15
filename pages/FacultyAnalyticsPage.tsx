
import React, { useContext, useMemo, useState, useCallback } from 'react';
import { DataContext } from '../contexts/DataContext';
import ChatWidget from '../components/common/ChatWidget';
import { getFacultyAnalytics } from '../services/geminiService';
import { Content } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const FacultyAnalyticsPage: React.FC = () => {
    const context = useContext(DataContext);
    const [chatHistory, setChatHistory] = useState<Content[]>([]);
    
    const analyticsData = useMemo(() => {
        if (!context) return null;
        const { students } = context;

        const cgpaDistribution = students.reduce((acc, student) => {
            const bracket = Math.floor(student.cgpa);
            const key = `${bracket}-${bracket + 0.9}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const passFail = students.reduce((acc, student) => {
            if (student.cgpa >= 4) acc.pass++; else acc.fail++;
            return acc;
        }, { pass: 0, fail: 0 });

        const cgpaDistData = Object.entries(cgpaDistribution).map(([name, value]) => ({ name, count: value })).sort((a,b) => a.name.localeCompare(b.name));
        const passFailData = [{name: 'Pass', value: passFail.pass}, {name: 'Fail', value: passFail.fail}];

        return { cgpaDistData, passFailData };
    }, [context]);

    const handleSendMessage = useCallback(async (message: string, history: Content[]) => {
        const contextString = `
            CGPA Distribution: ${JSON.stringify(analyticsData?.cgpaDistData)}
            Pass/Fail Ratio: ${JSON.stringify(analyticsData?.passFailData)}
        `;
        return await getFacultyAnalytics(contextString, history, message);
    }, [analyticsData]);

    if (!context || !analyticsData) return <div className="p-8">Loading...</div>;

    const COLORS = ['#0088FE', '#FF8042'];
    
    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Batch Analytics</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">Analyze overall student performance and get AI insights.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transform transition-transform duration-300 hover:[transform:perspective(1000px)_rotateX(1deg)_rotateY(-2deg)_scale3d(1.02,1.02,1.02)] hover:shadow-xl">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">CGPA Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData.cgpaDistData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" name="No. of Students"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transform transition-transform duration-300 hover:[transform:perspective(1000px)_rotateX(1deg)_rotateY(-2deg)_scale3d(1.02,1.02,1.02)] hover:shadow-xl">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Pass / Fail Ratio</h2>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={analyticsData.passFailData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {analyticsData.passFailData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <ChatWidget
                title="Faculty AI Assistant"
                initialMessage="Hello! I can help you analyze the student data presented in these charts. What would you like to know?"
                suggestions={["What's the key takeaway?", "Which students are at risk?", "Suggest an intervention plan."]}
                onSendMessage={handleSendMessage}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                isFaculty={true}
            />
        </div>
    );
};

export default FacultyAnalyticsPage;
