
import React from 'react';

interface DashboardCardProps {
    title: string;
    value: string;
    subtitle?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, subtitle }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between transition-all duration-300 transform hover:shadow-xl hover:[transform:perspective(1000px)_rotateX(2deg)_rotateY(-4deg)_scale3d(1.05,1.05,1.05)]">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
                <p className="text-4xl font-bold text-gray-800 dark:text-white mt-2">{value}</p>
            </div>
            {subtitle && <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">{subtitle}</p>}
        </div>
    );
};

export default DashboardCard;
