
import React, { useState, useRef, useEffect } from 'react';
import { Student } from '../../types';
import { getChartAnalysis } from '../../services/geminiService';
import { GeminiIcon } from '../common/Icons';
import { Content } from '@google/genai';

interface Message {
    role: 'user' | 'model';
    parts: { text: string }[];
}

interface GeminiChartChatbotProps {
    student: Student;
    classAverageSgpa: { semester: number; avgSgpa: number }[];
}

const GeminiChartChatbot: React.FC<GeminiChartChatbotProps> = ({ student, classAverageSgpa }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', parts: [{ text: `Hi ${student.name.split(' ')[0]}! I'm Ace, your AI performance assistant. Ask me anything about your charts!` }] }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const newUserMessage: Message = { role: 'user', parts: [{ text: input }] };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        // Convert messages to the Content[] format expected by the service
        const chatHistory: Content[] = messages.map(m => ({ role: m.role, parts: m.parts }));

        try {
            const responseText = await getChartAnalysis(student, classAverageSgpa, chatHistory, input);
            const modelMessage: Message = { role: 'model', parts: [{ text: responseText }] };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            const errorMessage: Message = { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting. Please try again later." }] };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
    }
    
    const parseMarkdown = (text: string) => {
        // Simple markdown parser for bold and lists
        let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/^\* (.*$)/gim, '<ul class="list-disc list-inside ml-4"><li>$1</li></ul>');
        html = html.replace(/<\/ul>\n<ul class="list-disc list-inside ml-4">/g, ''); // Join adjacent lists
        return { __html: html };
    };

    return (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg overflow-hidden flex flex-col" style={{ height: '500px' }}>
            <div className="flex items-center p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <GeminiIcon className="w-8 h-8 text-primary-500" />
                <div className="ml-3">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Performance AI Assistant</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Gemini</p>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         {msg.role === 'model' && <GeminiIcon className="w-6 h-6 text-primary-500 flex-shrink-0 mb-1" />}
                        <div className={`max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                            <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={parseMarkdown(msg.parts[0].text)}></div>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <GeminiIcon className="w-6 h-6 text-primary-500 flex-shrink-0 mb-1" />
                        <div className="max-w-md p-3 rounded-2xl bg-gray-200 dark:bg-gray-700">
                           <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
                {messages.length <= 2 && !isLoading && (
                    <div className="flex gap-2 mb-2 flex-wrap">
                        <button onClick={() => handleSuggestionClick("Summarize my performance.")} className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">Summarize my performance</button>
                        <button onClick={() => handleSuggestionClick("Which subject should I focus on?")} className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">Which subject to focus on?</button>
                        <button onClick={() => handleSuggestionClick("Am I improving over time?")} className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">Am I improving?</button>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about your performance..."
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading} className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-primary-300">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeminiChartChatbot;
