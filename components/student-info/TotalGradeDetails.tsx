import React from 'react';
import { SubjectResult } from '../../types';

interface Props {
    results: SubjectResult[];
}

const TotalGradeDetails: React.FC<Props> = ({ results }) => {
    // This is mocked data to match the UI precisely.
    // In a real scenario, this would be calculated from `results`.
    const displayGrades = {
        'Final Grade': 'B',
        'A+': 2,
        'A': 5,
        'B+': 6,
        'B': 8,
        'C': 2,
        'D': 1,
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Total Grade Details</h2>
            <div className="overflow-x-auto">
                 <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            {Object.keys(displayGrades).map(grade => (
                                <th key={grade} className="p-3 text-sm font-medium text-gray-500 dark:text-gray-400 border-r dark:border-gray-600 last:border-r-0">{grade}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {Object.values(displayGrades).map((count, index) => (
                                <td key={index} className="p-3 font-semibold text-gray-800 dark:text-gray-100 border-r dark:border-gray-600 last:border-r-0">{count}</td>
                            ))}
                        </tr>
                    </tbody>
                 </table>
            </div>
        </div>
    );
};

export default TotalGradeDetails;