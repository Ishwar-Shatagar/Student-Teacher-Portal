import React from 'react';

const scales = [
    { grade: 'A+', range: '100-96' },
    { grade: 'A', range: '95-91' },
    { grade: 'B+', range: '90-86' },
    { grade: 'B', range: '85-81' },
    { grade: 'C', range: '80-76' },
    { grade: 'D', range: '75 Below' },
];

const GradingScale: React.FC = () => {
    return (
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-4 rounded-2xl shadow-md text-white">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Grading Scale</h2>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4 text-center">
                {scales.map(scale => (
                    <div key={scale.grade}>
                        <p className="font-bold text-lg">{scale.grade}</p>
                        <p className="text-xs opacity-80">{scale.range}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GradingScale;