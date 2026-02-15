
import React from 'react';
import { CieMarks } from '../../types';

interface CieMarksModalProps {
    cieMarks: CieMarks;
    onClose: () => void;
}

const CieMarksModal: React.FC<CieMarksModalProps> = ({ cieMarks, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">CIE Marks Breakdown</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">&times;</button>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="font-medium text-gray-600 dark:text-gray-300">Internal Assessment 1</span>
                        <span className="font-bold text-lg text-primary-600 dark:text-primary-400">{cieMarks.ia1} / 25</span>
                    </div>
                     <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="font-medium text-gray-600 dark:text-gray-300">Internal Assessment 2</span>
                        <span className="font-bold text-lg text-primary-600 dark:text-primary-400">{cieMarks.ia2} / 25</span>
                    </div>
                     <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="font-medium text-gray-600 dark:text-gray-300">Assignment</span>
                        <span className="font-bold text-lg text-primary-600 dark:text-primary-400">{cieMarks.assignment} / 10</span>
                    </div>
                    {cieMarks.lab !== undefined && (
                        <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="font-medium text-gray-600 dark:text-gray-300">Lab</span>
                            <span className="font-bold text-lg text-primary-600 dark:text-primary-400">{cieMarks.lab} / 25</span>
                        </div>
                    )}
                </div>
                <button onClick={onClose} className="mt-8 w-full bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:shadow-md hover:[transform:perspective(800px)_translateZ(5px)_rotateX(5deg)]">Close</button>
            </div>
        </div>
    );
};

export default CieMarksModal;
