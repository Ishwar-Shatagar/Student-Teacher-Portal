import React from 'react';
import { MOCK_STUDENTS_LIST } from '../../data/mockData';

const ClassmatesTable: React.FC = () => {
    // Show a smaller, random subset of classmates for the demo
    const classmates = MOCK_STUDENTS_LIST.filter(s => s.semester === 3).slice(0, 5);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Classmates</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Sem</span>
                    <select className="p-1 border-none rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-semibold focus:ring-0">
                        <option>3rd</option>
                        <option>4th</option>
                        <option>5th</option>
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Ad. no</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Course</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classmates.map((student, index) => (
                            <tr key={student.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img className="w-8 h-8 rounded-full" src={student.profilePicUrl} alt={student.name} />
                                        <span className="ml-3">{student.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{student.id.slice(-4)}</td>
                                <td className="px-6 py-4">{student.email}</td>
                                <td className="px-6 py-4">{student.department}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassmatesTable;