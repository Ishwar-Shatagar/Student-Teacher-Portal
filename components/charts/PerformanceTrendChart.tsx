
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
    semester: number;
    sgpa: number;
}

interface PerformanceTrendChartProps {
    studentData: ChartData[];
    classData: ChartData[];
}

const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({ studentData, classData }) => {
    const combinedData = studentData.map((s, i) => ({
        semester: `Sem ${s.semester}`,
        'Your SGPA': s.sgpa,
        'Class Avg SGPA': classData[i] ? classData[i].sgpa : 0,
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
                <LineChart
                    data={combinedData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="semester" tick={{ fill: textColor }} />
                    <YAxis domain={[0, 10]} tick={{ fill: textColor }} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: tooltipBg,
                            backdropFilter: 'blur(5px)',
                            border: `1px solid ${tooltipBorder}`,
                            borderRadius: '0.75rem',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                        }}
                        cursor={{ stroke: studentColor, strokeWidth: 1, strokeDasharray: '3 3' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Your SGPA" stroke={studentColor} strokeWidth={3} activeDot={{ r: 8, fill: studentColor }} dot={{ stroke: studentColor, strokeWidth: 1, r: 4 }} />
                    <Line type="monotone" dataKey="Class Avg SGPA" stroke={classColor} strokeWidth={2} activeDot={{ r: 8, fill: classColor }} dot={{ stroke: classColor, strokeWidth: 1, r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PerformanceTrendChart;
