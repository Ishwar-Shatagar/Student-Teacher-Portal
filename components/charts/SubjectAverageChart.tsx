
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SubjectData {
    name: string;
    marks: number;
}

interface SubjectAverageChartProps {
    studentData: SubjectData[];
    classData: SubjectData[];
}

const SubjectAverageChart: React.FC<SubjectAverageChartProps> = ({ studentData, classData }) => {
    const combinedData = studentData.map((s, i) => ({
        name: s.name.split(' ').map(w => w[0]).join(''), // Abbreviate subject name
        'Your Marks': s.marks,
        'Class Avg Marks': classData[i] ? classData[i].marks : 0,
    }));
    
    const isDarkMode = document.documentElement.classList.contains('dark');
    const textColor = isDarkMode ? '#E5E7EB' : '#374151';
    const tooltipBg = isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)';
    const tooltipBorder = isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)';
    const studentColor = '#f97316'; // tailwind primary-500
    const classColor = '#8b5cf6'; // tailwind violet-500


    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart
                    data={combinedData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="name" tick={{ fill: textColor }} />
                    <YAxis domain={[0, 100]} tick={{ fill: textColor }}/>
                     <Tooltip 
                        contentStyle={{ 
                            backgroundColor: tooltipBg,
                            backdropFilter: 'blur(5px)',
                            border: `1px solid ${tooltipBorder}`,
                            borderRadius: '0.75rem',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                        }}
                        cursor={{fill: 'rgba(234, 88, 12, 0.1)'}}
                    />
                    <Legend />
                    <Bar dataKey="Your Marks" fill={studentColor} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Class Avg Marks" fill={classColor} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SubjectAverageChart;
