
import React, { useState } from 'react';

interface SmartInsightsProps {
    insightGenerator: () => Promise<string>;
}

const SmartInsights: React.FC<SmartInsightsProps> = ({ insightGenerator }) => {
    const [insights, setInsights] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateInsights = async () => {
        setIsLoading(true);
        setInsights('');
        const result = await insightGenerator();
        setInsights(result);
        setIsLoading(false);
    };

    return (
        <div className="bg-gradient-to-r from-primary-500 to-indigo-600 dark:from-primary-800 dark:to-indigo-900 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Get AI-Powered Smart Insights</h2>
                    <p className="opacity-80 mt-1">Let Gemini analyze your performance and provide personalized advice.</p>
                </div>
                <button
                    onClick={handleGenerateInsights}
                    disabled={isLoading}
                    className="mt-4 md:mt-0 px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg shadow-md hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:shadow-lg hover:shadow-white/20 hover:[transform:perspective(800px)_translateZ(5px)_rotateX(5deg)]"
                >
                    {isLoading ? 'Generating...' : 'Generate Insights'}
                </button>
            </div>
            {isLoading && (
                 <div className="flex justify-center items-center mt-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            )}
            {insights && (
                <div className="mt-6 p-4 bg-black bg-opacity-20 rounded-lg">
                    <pre className="whitespace-pre-wrap font-sans text-sm" dangerouslySetInnerHTML={{ __html: insights.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}></pre>
                </div>
            )}
        </div>
    );
};

export default SmartInsights;
