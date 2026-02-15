
import React, { useState, useContext } from 'react';
import { analyzeEventsDocument } from '../services/geminiService';
import { CalendarEvent } from '../types';
import * as Icons from '../components/common/Icons';
import { AuthContext } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataContext';

const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            const mimeType = result.split(',')[0].split(':')[1].split(';')[0];
            resolve({ base64, mimeType });
        };
        reader.onerror = error => reject(error);
    });
};

const EventsPage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const dataContext = useContext(DataContext);

    // Local state for the upload process itself, managed only by faculty
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    if (!dataContext || !user) {
        return <div className="p-8">Loading...</div>;
    }
    
    // Get shared events and setter from context
    const { events, setEvents } = dataContext;

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setError('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setEvents([]); // Clear previous events on new upload
        setUploadedImage(URL.createObjectURL(file));

        try {
            const { base64, mimeType } = await fileToBase64(file);
            const extractedData = await analyzeEventsDocument(base64, mimeType);
            setEvents(extractedData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setUploadedImage(null);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleClear = () => {
        setEvents([]);
        setUploadedImage(null);
        setError(null);
        const fileInput = document.getElementById('event-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };
    
    // Filter events to show only today and future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingEvents = events
        .filter(event => new Date(`${event.date}T00:00:00Z`) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


    const groupedEvents = upcomingEvents.reduce((acc, event) => {
        const dateKey = event.date;
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
    }, {} as Record<string, CalendarEvent[]>);

    const sortedDates = Object.keys(groupedEvents);

    const FacultyUploader = (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transform transition-transform duration-300 hover:[transform:perspective(1000px)_rotateX(1deg)_rotateY(-2deg)_scale3d(1.02,1.02,1.02)] hover:shadow-xl">
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Upload Calendar</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Upload an image (JPG, PNG) of a calendar, schedule, or event flyer. The AI will analyze it and list the upcoming events for all students.
                    </p>
                    <div className="flex items-center gap-4">
                        <label htmlFor="event-upload" className={`cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:shadow-lg hover:[transform:perspective(800px)_translateZ(5px)_rotateX(5deg)] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <Icons.UploadIcon className="w-5 h-5" />
                            {isLoading ? 'Analyzing...' : 'Choose File'}
                        </label>
                        <input id="event-upload" type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleFileUpload} disabled={isLoading} />
                        {events.length > 0 && (
                            <button onClick={handleClear} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold text-sm rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition-all duration-300 transform hover:shadow-md hover:[transform:perspective(800px)_translateZ(5px)_rotateX(5deg)]">
                                Clear
                            </button>
                        )}
                    </div>
                    {error && <div className="mt-4 p-3 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">{error}</div>}
                </div>
                {uploadedImage && (
                    <div className="flex-shrink-0">
                        <img src={uploadedImage} alt="Uploaded calendar" className="max-h-40 w-auto rounded-md border-2 border-gray-300 dark:border-gray-600 shadow-md" />
                    </div>
                )}
            </div>
        </div>
    );
    
    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                 {user.role === 'faculty' ? 'Manage Events Calendar' : 'College Events Calendar'}
            </h1>

            {user.role === 'faculty' && FacultyUploader}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transform transition-transform duration-300 hover:[transform:perspective(1000px)_rotateX(1deg)_rotateY(-2deg)_scale3d(1.02,1.02,1.02)] hover:shadow-xl">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Upcoming Events</h2>
                {isLoading && (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Gemini is analyzing the document...</p>
                    </div>
                )}
                {!isLoading && upcomingEvents.length > 0 && (
                    <div className="space-y-6">
                        {sortedDates.map(dateKey => (
                            <div key={dateKey}>
                                <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2 border-b pb-2 dark:border-gray-700">
                                    {new Date(`${dateKey}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </h3>
                                <div className="space-y-3">
                                    {groupedEvents[dateKey].map((event, index) => (
                                        <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <div className="bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 rounded-lg p-2 flex-shrink-0">
                                                <Icons.CalendarIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{event.title}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{event.time !== 'N/A' && event.time}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{event.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                 {!isLoading && upcomingEvents.length === 0 && (
                     <p className="text-center py-10 text-gray-500 dark:text-gray-400">
                        {user.role === 'faculty' 
                            ? (uploadedImage && !error ? "No upcoming events could be extracted from the image." : "Upload a document to schedule and view events.")
                            : "No upcoming events have been scheduled by the faculty."
                        }
                    </p>
                 )}
            </div>
        </div>
    );
};

export default EventsPage;
