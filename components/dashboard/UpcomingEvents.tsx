
import React from 'react';

const events = [
    {
        title: "Applied Science Homework",
        type: "Assignment",
        time: "9:00 - 12:30",
        date: "2nd of February - Wednesday",
        color: "red"
    },
    {
        title: "Technology Exam",
        type: "Exam",
        time: "9:00 - 11:00",
        date: "3rd of February - Wednesday",
        color: "orange"
    },
    {
        title: "Artificial Intelligence Workshop",
        type: "Workshop",
        time: "9:00 - 12:30",
        date: "4th of February - Friday",
        color: "yellow"
    },
    {
        title: "UX Design Conference",
        type: "Event",
        time: "9:00 - 12:30",
        date: "5th of February - Tuesday",
        color: "green"
    },
];

const colorClasses = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
};

const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></svg>
);

const UpcomingEvents: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-full transform transition-transform duration-300 hover:[transform:perspective(1000px)_rotateX(1deg)_rotateY(-2deg)_scale3d(1.02,1.02,1.02)] hover:shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Upcoming Events</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">1st Feb Monday - 7th Feb Sunday</p>

            <ul className="space-y-5">
                {events.map((event, index) => (
                    <li key={index} className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white ${colorClasses[event.color as keyof typeof colorClasses]}`}>
                           <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-white">{event.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{event.date}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{event.time}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UpcomingEvents;
