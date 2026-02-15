import React from 'react';
import { SemesterResult } from '../../types';

interface Props {
    academicHistory: SemesterResult[];
}

const SemesterWiseResults: React.FC<Props> = ({ academicHistory }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Act Results / Conduct</h2>
            <div className="space-y-5">
                {academicHistory.map(sem => {
                    const percentage = Math.round(sem.sgpa * 10);
                    return (
                        <div key={sem.semester}>
                            <div className="flex justify-between items-center mb-1">
                                <p className="font-semibold text-gray-800 dark:text-gray-100">SEM {sem.semester}</p>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{percentage}%</p>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    )
                })}
                 {/* Adding Extracurriculars for UI matching from the image */}
                 <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-gray-800 dark:text-gray-100">Extracurriculars</p>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">87%</p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SemesterWiseResults;