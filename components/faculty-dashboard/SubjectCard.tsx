
import React from 'react';
import * as Icons from '../common/Icons';

interface SubjectCardProps {
    subjectName: string;
    colorClass: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subjectName, colorClass }) => {
    return (
        <div className={`bg-${colorClass} bg-opacity-50 dark:bg-opacity-20 border border-${colorClass} p-4 rounded-xl shadow transition-all duration-300 transform hover:shadow-xl hover:[transform:perspective(1000px)_rotateX(4deg)_rotateY(-5deg)_scale3d(1.05,1.05,1.05)]`}>
            <h3 className={`font-bold text-gray-800 dark:text-white mb-3`}>{subjectName}</h3>
            <div className="space-y-2">
                <a href="#" className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:underline">
                    <Icons.CourseIcon className="w-4 h-4 mr-2" />
                    View Classes
                </a>
                <a href="#" className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:underline">
                    <Icons.StudentIcon className="w-4 h-4 mr-2" />
                    View Students
                </a>
            </div>
        </div>
    );
};

export default SubjectCard;
