
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GeminiIcon, TrashIcon, PaperclipIcon, SparklesIcon, SettingsIcon } from './Icons';
import { Content } from '@google/genai';

interface ChatWidgetProps {
    title: string;
    initialMessage: string;
    suggestions: string[];
    onSendMessage: (message: string, history: Content[]) => Promise<string>;
    chatHistory: Content[];
    setChatHistory: React.Dispatch<React.SetStateAction<Content[]>>;
    isFaculty?: boolean;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ title, initialMessage, suggestions, onSendMessage, chatHistory, setChatHistory, isFaculty = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const messages: Content[] = [
        { role: 'model', parts: [{ text: initialMessage }] },
        ...chatHistory
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const newUserMessage: Content = { role: 'user', parts: [{ text: input }] };
        const currentHistory = [...chatHistory, newUserMessage];
        setChatHistory(currentHistory);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await onSendMessage(input, chatHistory);
            const modelMessage: Content = { role: 'model', parts: [{ text: responseText }] };
            setChatHistory(prev => [...prev, modelMessage]);
        } catch (error) {
            const errorMessage: Content = { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting. Please try again later." }] };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleClear = () => {
        setChatHistory([]);
    }

    const parseMarkdown = (text: string) => {
        let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/^\* (.*$)/gim, '<ul class="list-disc list-inside ml-4"><li>$1</li></ul>');
        html = html.replace(/<\/ul>\n<ul class="list-disc list-inside ml-4">/g, '');
        return { __html: html };
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-primary-600 text-white rounded-full p-4 shadow-lg hover:bg-primary-700 transition-transform transform hover:[transform:perspective(800px)_scale(1.1)_rotateY(15deg)] z-50"
                aria-label="Open AI Assistant"
            >
                <SparklesIcon className="w-8 h-8" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-8 right-8 w-96 h-[600px] bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl flex flex-col z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
                <div className="flex items-center">
                    <GeminiIcon className="w-8 h-8 text-primary-500" />
                    <div className="ml-3">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Gemini</p>
                    </div>
                </div>
                <div>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" aria-label="Close chat">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         {msg.role === 'model' && <GeminiIcon className="w-6 h-6 text-primary-500 flex-shrink-0 self-start" />}
                        <div className={`max-w-xs p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={parseMarkdown(msg.parts[0].text || '')}></div>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <GeminiIcon className="w-6 h-6 text-primary-500 flex-shrink-0" />
                        <div className="p-3 rounded-2xl bg-gray-200 dark:bg-gray-700">
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
            
            {/* Input Area */}
            <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
                {chatHistory.length === 0 && !isLoading && (
                    <div className="flex gap-2 mb-2 flex-wrap">
                        {suggestions.map(s => (
                             <button key={s} onClick={() => setInput(s)} className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-transform transform hover:[transform:perspective(800px)_translateZ(3px)]">{s}</button>
                        ))}
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <input
                        type="text" value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask anything..."
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading} className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-300 transition-transform transform hover:[transform:perspective(800px)_scale(1.1)_translateX(2px)]">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                         <button className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-transform hover:scale-110" aria-label="Upload file"><PaperclipIcon className="w-4 h-4" /></button>
                         <button onClick={handleClear} className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-transform hover:scale-110" aria-label="Clear conversation"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center gap-1">
                        <input id="use-context" type="checkbox" className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600" />
                        <label htmlFor="use-context" className="text-xs text-gray-600 dark:text-gray-400">Use chart context</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatWidget;
