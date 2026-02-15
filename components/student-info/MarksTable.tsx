
import React from 'react';
import { EditableSubjectResult } from '../../types';

interface Props {
    results: EditableSubjectResult[];
}

const MarksTable: React.FC<Props> = ({ results }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Marks</h2>
                 <a href="#/examination" className="text-sm font-medium text-blue-600 dark:text-blue-400">last sem marks &gt;</a>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">SUBJECTS</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">CIE 1</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">CIE 2</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">SEE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.slice(0, 5).map(res => (
                            <tr key={res.code} className="border-b dark:border-gray-700 last:border-b-0">
                                <td className="p-4 font-medium text-gray-800 dark:text-gray-100">{res.name.split('(')[0].trim()}</td>
                                <td className="p-4 text-center text-gray-600 dark:text-gray-300">{res.cie1}</td>
                                <td className="p-4 text-center text-gray-600 dark:text-gray-300">{res.cie2}</td>
                                <td className="p-4 text-center text-gray-600 dark:text-gray-300">{res.see}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MarksTable;
