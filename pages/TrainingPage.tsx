

import React, { useContext, useState, useRef } from 'react';
import { DataContext } from '../contexts/DataContext';
import { Student } from '../types';

const TrainingPage: React.FC = () => {
    const context = useContext(DataContext);
    const [feedback, setFeedback] = useState({ message: '', type: '', studentId: '' });
    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    if (!context) return <div>Loading...</div>;

    const { students, setStudentTrainingPhoto } = context;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, student: Student) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const photoUrl = reader.result as string;
                setStudentTrainingPhoto(student.id, photoUrl);
                setFeedback({ message: `Successfully updated photo for ${student.name}.`, type: 'success', studentId: student.id });
                setTimeout(() => setFeedback({ message: '', type: '', studentId: '' }), 3000);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = (studentId: string) => {
        fileInputRefs.current[studentId]?.click();
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Train Student Images</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Upload a clear photo for each student to improve face recognition accuracy.</p>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {students.map(student => (
                        <div key={student.id} className="border dark:border-gray-700 rounded-lg p-4 text-center">
                            <img 
                                src={student.photoForTrainingUrl} 
                                alt={`Training photo for ${student.name}`} 
                                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 bg-gray-200"
                            />
                            <h3 className="font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{student.id}</p>
                            
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                // FIX: The ref callback must not return a value. Using curly braces ensures an implicit `void` return.
                                ref={el => { fileInputRefs.current[student.id] = el; }}
                                onChange={(e) => handleFileChange(e, student)}
                            />
                            <button 
                                onClick={() => triggerFileInput(student.id)}
                                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:shadow-lg hover:[transform:perspective(800px)_translateZ(5px)_rotateX(5deg)]"
                            >
                                Upload Photo
                            </button>
                             {feedback.studentId === student.id && feedback.type === 'success' && (
                                <p className="text-xs text-green-500 mt-2">{feedback.message}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrainingPage;