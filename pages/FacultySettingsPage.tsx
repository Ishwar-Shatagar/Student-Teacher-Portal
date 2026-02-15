
import React, { useState, useEffect } from 'react';
import { testApiKey } from '../services/geminiService';
import { EyeIcon, EyeSlashIcon } from '../components/common/Icons';

const FacultySettingsPage: React.FC = () => {
    const [apiKey, setApiKey] = useState('');
    const [isMasked, setIsMasked] = useState(true);
    const [testResult, setTestResult] = useState<{ status: 'idle' | 'testing' | 'success' | 'error'; message: string }>({ status: 'idle', message: '' });

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            setApiKey(storedKey);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        setTestResult({ status: 'success', message: 'API Key saved successfully!' });
        setTimeout(() => setTestResult({ status: 'idle', message: '' }), 3000);
    };

    const handleTest = async () => {
        setTestResult({ status: 'testing', message: 'Testing connection...' });
        const result = await testApiKey(apiKey);
        if (result.success) {
            setTestResult({ status: 'success', message: result.message });
        } else {
            setTestResult({ status: 'error', message: result.message });
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Settings</h1>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Gemini API Key Management</h2>
                    <div className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
                        <span className="font-medium">Security Warning:</span> Do not paste keys publicly. Keys are saved in your browser's local storage and are not encrypted on a server.
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Your Gemini API Key
                        </label>
                        <div className="relative">
                            <input
                                type={isMasked ? 'password' : 'text'}
                                id="api-key"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your API key here"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button
                                onClick={() => setIsMasked(!isMasked)}
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                {isMasked ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {testResult.message && (
                        <div className={`p-3 my-4 text-sm rounded-lg ${
                            testResult.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            testResult.status === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                            {testResult.message}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-4 mt-6">
                        <button
                            onClick={handleTest}
                            disabled={testResult.status === 'testing'}
                            className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition-all duration-300 transform hover:shadow-md hover:[transform:perspective(800px)_translateZ(5px)_rotateX(5deg)]"
                        >
                            {testResult.status === 'testing' ? 'Testing...' : 'Test Connection'}
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800 transition-all duration-300 transform hover:shadow-lg hover:shadow-primary-500/40 hover:[transform:perspective(800px)_translateZ(5px)_rotateX(5deg)]"
                        >
                            Save Key
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultySettingsPage;
