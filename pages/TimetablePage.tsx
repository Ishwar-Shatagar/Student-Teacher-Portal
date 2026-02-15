
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { MOCK_TIMETABLE_DATA, MOCK_TIME_SLOTS } from '../data/mockData';
import { Student, TimetableEntry } from '../types';

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const subjectColors: Record<string, string> = {};
const availableColors = [
    'bg-subject-blue text-blue-800 dark:bg-blue-900/50 dark:text-subject-blue',
    'bg-subject-green text-green-800 dark:bg-green-900/50 dark:text-subject-green',
    'bg-subject-orange text-orange-800 dark:bg-orange-900/50 dark:text-subject-orange',
    'bg-subject-yellow text-yellow-800 dark:bg-yellow-900/50 dark:text-subject-yellow',
    'bg-subject-pink text-pink-800 dark:bg-pink-900/50 dark:text-subject-pink',
    'bg-subject-cyan text-cyan-800 dark:bg-cyan-900/50 dark:text-subject-cyan',
    'bg-purple-200 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    'bg-indigo-200 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
];
let colorIndex = 0;

const getColorForSubject = (subjectShort: string) => {
    if (!subjectColors[subjectShort]) {
        subjectColors[subjectShort] = availableColors[colorIndex % availableColors.length];
        colorIndex++;
    }
    return subjectColors[subjectShort];
};

const ClassCard: React.FC<{ entry: TimetableEntry }> = ({ entry }) => (
    <div className={`p-2 rounded-lg h-full flex flex-col justify-center ${getColorForSubject(entry.subjectShort)} transition-transform transform hover:scale-105`}>
        <p className="font-bold text-sm">{entry.subject}</p>
        <p className="text-xs opacity-80">{entry.teacher}</p>
        <p className="text-xs opacity-70 mt-1">{entry.time}</p>
    </div>
);

const TimetablePage: React.FC = () => {
    const { user } = useContext(AuthContext);
    
    if (!user || user.role !== 'student') {
        // Or render a view for faculty to select a semester
        return <div className="p-8">Timetable is available for students.</div>;
    }
    
    const student = user as Student;
    const semesterTimetable = MOCK_TIMETABLE_DATA[student.semester];
    
    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">My Timetable - Semester {student.semester}</h1>
            
            {semesterTimetable ? (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transform transition-transform duration-300 hover:[transform:perspective(1000px)_rotateX(1deg)_rotateY(-2deg)_scale3d(1.02,1.02,1.02)] hover:shadow-xl">
                    <div className="overflow-x-auto">
                        <div className="grid grid-cols-[auto_repeat(6,1fr)] gap-2 min-w-[800px]">
                            {/* Header Row */}
                            <div className="p-2 font-semibold text-center text-gray-600 dark:text-gray-300">Time</div>
                            {daysOfWeek.map(day => (
                                <div key={day} className="p-2 font-semibold text-center text-gray-600 dark:text-gray-300">{day}</div>
                            ))}
                            
                            {/* Timetable Rows */}
                            {MOCK_TIME_SLOTS.map(time => (
                                <React.Fragment key={time}>
                                    <div className="p-2 font-medium text-center text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
                                        {time.replace('-', ' - ')}
                                    </div>
                                    {daysOfWeek.map(day => {
                                        const entry = semesterTimetable[day]?.[time];
                                        return (
                                            <div key={`${day}-${time}`} className="p-1 border dark:border-gray-700/50 rounded-md h-24">
                                                {entry && <ClassCard entry={entry} />}
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
                    <p className="text-gray-500 dark:text-gray-400">No timetable data available for Semester {student.semester}.</p>
                </div>
            )}
        </div>
    );
};

export default TimetablePage;
