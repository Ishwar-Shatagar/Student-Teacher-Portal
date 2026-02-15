
import React from 'react';
import { MOCK_TIMETABLE_DATA, MOCK_TIME_SLOTS } from '../../data/mockData';

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const subjectColors: { [key: string]: string } = {};
const availableColors = [
    'bg-red-200 text-red-800', 'bg-blue-200 text-blue-800', 'bg-yellow-200 text-yellow-800',
    'bg-green-200 text-green-800', 'bg-orange-200 text-orange-800', 'bg-purple-200 text-purple-800',
    'bg-pink-200 text-pink-800', 'bg-indigo-200 text-indigo-800'
];
let colorIndex = 0;

const getColorForSubject = (subject: string) => {
    if (!subjectColors[subject]) {
        subjectColors[subject] = availableColors[colorIndex % availableColors.length];
        colorIndex++;
    }
    return subjectColors[subject];
};


const TimetableWidget: React.FC<{ semester: number }> = ({ semester }) => {
    const semesterTimetable = MOCK_TIMETABLE_DATA[semester] || {};

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transform transition-transform duration-300 hover:[transform:perspective(1000px)_rotateX(1deg)_rotateY(-2deg)_scale3d(1.02,1.02,1.02)] hover:shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Time Table (Sem {semester})</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2 border dark:border-gray-700 w-20">Time</th>
                            {days.map(day => (
                                <th key={day} className="p-2 border dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300">{day.substring(0,3)}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_TIME_SLOTS.map(time => (
                            <tr key={time}>
                                <td className="p-2 border dark:border-gray-700 text-xs text-center text-gray-500 dark:text-gray-400">{time}</td>
                                {days.map(day => {
                                    const entry = semesterTimetable[day]?.[time];
                                    return (
                                        <td key={`${day}-${time}`} className="p-1 border dark:border-gray-700 h-14">
                                            {entry && (
                                                <div className={`p-2 rounded-lg text-left h-full flex flex-col justify-center ${getColorForSubject(entry.subject)}`}>
                                                    <p className="text-xs font-semibold">{entry.subject}</p>
                                                    <p className="text-xs opacity-75">{entry.time}</p>
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TimetableWidget;
