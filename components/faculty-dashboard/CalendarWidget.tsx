
import React, { useState } from 'react';

const CalendarWidget: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date(2024, 1, 1)); // February 2024

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Simple logic for Feb 2024, which starts on a Thursday
    const blanks = 3; 
    const daysInMonth = 29;

    const calendarDays = Array(blanks).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    return (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow transform transition-transform duration-300 hover:[transform:perspective(1000px)_rotateX(1deg)_rotateY(-2deg)_scale3d(1.02,1.02,1.02)] hover:shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">&lt;</button>
                <h3 className="font-semibold text-gray-800 dark:text-white">February 2024</h3>
                <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {daysOfWeek.map(day => (
                    <div key={day} className="font-medium text-gray-500">{day}</div>
                ))}
                {calendarDays.map((day, index) => (
                    <div 
                        key={index} 
                        className={`p-2 rounded-full cursor-pointer ${
                            day ? (day === 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700') : ''
                        }`}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarWidget;
