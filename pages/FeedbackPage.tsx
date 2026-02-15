
import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { MOCK_TEACHERS_FOR_FEEDBACK } from '../data/mockData';
import { FeedbackSubmission, ProfessionalUser, TeacherFeedback } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RATING_CATEGORIES = [
    { id: 'teachingStyle', label: 'Teaching Style' },
    { id: 'communication', label: 'Communication' },
    { id: 'conceptClarity', label: 'Concept Clarity' },
    { id: 'interaction', label: 'Interaction' },
    { id: 'language', label: 'Language' },
] as const;

type RatingCategory = typeof RATING_CATEGORIES[number]['id'];

const initialRatings = {
    teachingStyle: 0,
    communication: 0,
    conceptClarity: 0,
    interaction: 0,
    language: 0,
};

// Mock feedback data for teacher view
const MOCK_FEEDBACK_SUMMARY = {
    totalResponses: 45,
    comments: [
        "Great interactive sessions!",
        "Could provide more real-world examples.",
        "Very clear explanations, thank you!",
    ],
    chartData: [
        { name: 'Teaching Style', rating: 4.5 },
        { name: 'Communication', rating: 4.8 },
        { name: 'Concept Clarity', rating: 4.7 },
        { name: 'Interaction', rating: 4.6 },
        { name: 'Language', rating: 4.9 },
    ]
};

const FeedbackPage: React.FC = () => {
    const { user } = useContext(AuthContext);

    if (user?.role === 'student') {
        return <StudentFeedbackView />;
    }
    
    if (user?.role === 'faculty') {
        return <TeacherFeedbackView faculty={user as ProfessionalUser} />;
    }

    return null;
};

const StudentFeedbackView: React.FC = () => {
    const [selectedTeacher, setSelectedTeacher] = useState<TeacherFeedback | null>(null);
    const [feedback, setFeedback] = useState<FeedbackSubmission | null>(null);

    const gradientClasses = [
        'bg-[linear-gradient(135deg,_#1A2A6C_0%,_#1E90FF_50%,_#00D4FF_100%)]',
        'bg-[linear-gradient(135deg,_#1E90FF_0%,_#00D4FF_50%,_#20E3B2_100%)]',
        'bg-[linear-gradient(135deg,_#00D4FF_0%,_#20E3B2_50%,_#1A2A6C_100%)]',
        'bg-[linear-gradient(135deg,_#20E3B2_0%,_#1A2A6C_50%,_#1E90FF_100%)]',
    ];

    const handleSelectTeacher = (teacher: TeacherFeedback) => {
        setSelectedTeacher(teacher);
        setFeedback({
            teacherId: teacher.id,
            ratings: { ...initialRatings },
            comment: '',
        });
    };

    const handleRatingChange = (category: RatingCategory, value: number) => {
        if (feedback) {
            setFeedback({
                ...feedback,
                ratings: { ...feedback.ratings, [category]: value }
            });
        }
    };
    
    const handleSubmit = () => {
        // In a real app, this would submit to a backend
        alert('Feedback submitted successfully!');
        setSelectedTeacher(null);
        setFeedback(null);
    };

    if (!selectedTeacher || !feedback) {
        return (
            <div className="p-4 sm:p-6 md:p-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Submit Feedback</h1>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Select a Teacher</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {MOCK_TEACHERS_FOR_FEEDBACK.map((teacher, index) => (
                            <button 
                                key={teacher.id} 
                                onClick={() => handleSelectTeacher(teacher)} 
                                className={`
                                    p-6 text-left text-white rounded-2xl shadow-lg 
                                    transition-all duration-300 ease-in-out
                                    transform hover:scale-[1.02] hover:shadow-xl
                                    bg-[length:200%_auto] bg-left-center hover:bg-right-center
                                    ${gradientClasses[index % gradientClasses.length]}
                                `}
                            >
                                <p className="font-bold text-lg">{teacher.name}</p>
                                <p className="opacity-90">{teacher.subject}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Feedback for {selectedTeacher.name}</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">
                {RATING_CATEGORIES.map(cat => (
                    <div key={cat.id}>
                        <label className="font-semibold text-gray-700 dark:text-gray-300">{cat.label}</label>
                        <div className="flex items-center space-x-2 mt-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} onClick={() => handleRatingChange(cat.id, star)} className="transition-transform hover:scale-125">
                                    <svg className={`w-8 h-8 ${feedback.ratings[cat.id] >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                <div>
                    <label htmlFor="comment" className="font-semibold text-gray-700 dark:text-gray-300">Additional Comments (Optional)</label>
                    <textarea 
                        id="comment"
                        rows={4}
                        value={feedback.comment}
                        onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                        className="w-full mt-2 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Share your thoughts..."
                    ></textarea>
                </div>
                <div className="flex justify-end space-x-4">
                    <button onClick={() => setSelectedTeacher(null)} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-all duration-300 transform hover:shadow-md hover:[transform:perspective(800px)_translateZ(5px)_rotateX(5deg)]">Cancel</button>
                    <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-all duration-300 transform hover:shadow-md hover:[transform:perspective(800px)_translateZ(5px)_rotateX(5deg)]">Submit</button>
                </div>
            </div>
        </div>
    );
};

const TeacherFeedbackView: React.FC<{faculty: ProfessionalUser}> = ({ faculty }) => {
    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">My Feedback Summary</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Machine Learning (Semester 5)</h2>
                        <p className="text-gray-500 dark:text-gray-400">{MOCK_FEEDBACK_SUMMARY.totalResponses} Responses</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:shadow-lg hover:[transform:perspective(800px)_translateZ(5px)_rotateX(5deg)]">Download PDF Report</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Average Ratings</h3>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={MOCK_FEEDBACK_SUMMARY.chartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                    <XAxis type="number" domain={[0, 5]} hide />
                                    <YAxis type="category" dataKey="name" width={120} tick={{ fill: 'var(--text-color)' }} />
                                    <Tooltip cursor={{fill: 'rgba(219, 234, 254, 0.4)'}} contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}/>
                                    <Legend />
                                    <Bar dataKey="rating" fill="#3b82f6" barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Student Comments</h3>
                        <ul className="space-y-3 max-h-72 overflow-y-auto pr-2">
                            {MOCK_FEEDBACK_SUMMARY.comments.map((comment, index) => (
                                <li key={index} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-300 italic">"{comment}"</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
