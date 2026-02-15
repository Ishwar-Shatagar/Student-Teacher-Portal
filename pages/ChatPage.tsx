
import React, { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getGeneralChatResponse } from '../services/geminiService';
import { GeminiIcon, TrashIcon, PaperclipIcon, SparklesIcon, SettingsIcon } from '../components/common/Icons';
import { Part, Content, GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Student, ProfessionalUser } from '../types';

// --- Icons (Local to this page for specific UI elements) ---

const SendIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

const MicIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
);

const PhoneXMarkIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 9L13 10.5a1.5 1.5 0 001.5 1.5h1m-9-9l3 3m-3-3l3-3m-3 3h6m-6 15h6" /> {/* Placeholder phone icon replacement */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// --- Helper Functions for Audio ---

function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

function createBlob(data: Float32Array): { data: string; mimeType: string } {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = Math.max(-1, Math.min(1, data[i])) * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}

// --- Helper Components ---

const TypingIndicator = () => (
    <div className="flex space-x-1 p-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);

interface MessageBubbleProps {
    role: 'user' | 'model';
    text: string;
    timestamp: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, text, timestamp }) => {
    const isUser = role === 'user';
    
    const parseMarkdown = (text: string) => {
        // Basic markdown parsing
        let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
        html = html.replace(/^\* (.*$)/gim, '<div class="flex items-start gap-2 my-1"><span class="text-orange-500 mt-1.5 text-[6px]">●</span><span>$1</span></div>'); // Lists
        html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-3 rounded-lg my-2 overflow-x-auto font-mono text-xs border border-gray-700"><code>$1</code></pre>'); // Code
        html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded font-mono text-sm text-red-500">$1</code>'); // Inline Code
        html = html.replace(/\n/g, '<br />'); // Line breaks
        return { __html: html };
    };

    return (
        <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mt-1
                    ${isUser ? 'bg-orange-100 text-orange-600' : 'bg-white dark:bg-gray-700 text-primary-600 ring-1 ring-gray-100 dark:ring-gray-600'}`}>
                    {isUser ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <GeminiIcon className="w-5 h-5" />
                    )}
                </div>

                {/* Bubble */}
                <div className="flex flex-col">
                    <div className={`relative px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-relaxed
                        ${isUser 
                            ? 'bg-[#ff7043] text-white rounded-tr-sm' 
                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-sm'
                        }`}>
                        <div dangerouslySetInnerHTML={parseMarkdown(text)} className={isUser ? 'text-white' : 'text-gray-800 dark:text-gray-200'} />
                    </div>
                    <span className={`text-[10px] text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                        {timestamp}
                    </span>
                </div>
            </div>
        </div>
    );
};

// --- Voice Assistant Modal ---

const VoiceAssistantModal: React.FC<{ onClose: () => void, user: Student | ProfessionalUser }> = ({ onClose, user }) => {
    const [status, setStatus] = useState<'connecting' | 'active' | 'error'>('connecting');
    const [errorMessage, setErrorMessage] = useState('');
    const [volume, setVolume] = useState(0); // For visualization
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);
    
    // Clean up function
    const cleanup = () => {
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current.onaudioprocess = null;
        }
        if (inputSourceRef.current) {
            inputSourceRef.current.disconnect();
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        activeSourcesRef.current.forEach(source => source.stop());
        activeSourcesRef.current.clear();
    };

    useEffect(() => {
        let isMounted = true;

        const initVoiceSession = async () => {
            try {
                const apiKey = process.env.API_KEY || localStorage.getItem('gemini_api_key') || '';
                if (!apiKey) {
                    throw new Error('API Key not found. Please set it in Settings.');
                }

                const ai = new GoogleGenAI({ apiKey });
                
                // Setup Audio Contexts
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                const inputAudioContext = new AudioContextClass({ sampleRate: 16000 });
                const outputAudioContext = new AudioContextClass({ sampleRate: 24000 });
                
                await inputAudioContext.resume();
                await outputAudioContext.resume();

                audioContextRef.current = inputAudioContext; // Store mainly for cleanup

                // Get Microphone Stream
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                
                // System Instruction
                const systemInstruction = user.role === 'student'
                    ? `You are "Ace", a friendly and encouraging academic AI tutor for ${user.name}. Keep responses concise and conversational.`
                    : `You are a professional AI assistant for faculty member ${user.name}. Provide concise and helpful responses.`;

                // Connect to Gemini Live
                const sessionPromise = ai.live.connect({
                    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                    config: {
                        responseModalities: [Modality.AUDIO],
                        systemInstruction: systemInstruction,
                        speechConfig: {
                            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                        },
                    },
                    callbacks: {
                        onopen: () => {
                            if (isMounted) setStatus('active');
                            
                            // Setup Input Processing
                            const source = inputAudioContext.createMediaStreamSource(stream);
                            const processor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                            
                            processor.onaudioprocess = (e) => {
                                const inputData = e.inputBuffer.getChannelData(0);
                                
                                // Calculate volume for visualization
                                let sum = 0;
                                for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
                                const rms = Math.sqrt(sum / inputData.length);
                                if (isMounted) setVolume(Math.min(rms * 5, 1)); // Scale up a bit

                                const pcmBlob = createBlob(inputData);
                                sessionPromise.then(session => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            };

                            source.connect(processor);
                            processor.connect(inputAudioContext.destination);
                            
                            inputSourceRef.current = source;
                            processorRef.current = processor;
                        },
                        onmessage: async (message: LiveServerMessage) => {
                            // Process Audio Output
                            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                            if (base64Audio) {
                                // Visual feedback for AI speaking (simulate volume)
                                if (isMounted) setVolume(0.8); 
                                
                                const audioBuffer = await decodeAudioData(
                                    decode(base64Audio),
                                    outputAudioContext,
                                    24000,
                                    1
                                );
                                
                                nextStartTimeRef.current = Math.max(
                                    nextStartTimeRef.current,
                                    outputAudioContext.currentTime
                                );

                                const source = outputAudioContext.createBufferSource();
                                source.buffer = audioBuffer;
                                source.connect(outputAudioContext.destination);
                                
                                source.addEventListener('ended', () => {
                                    activeSourcesRef.current.delete(source);
                                    if (activeSourcesRef.current.size === 0 && isMounted) setVolume(0);
                                });

                                source.start(nextStartTimeRef.current);
                                nextStartTimeRef.current += audioBuffer.duration;
                                activeSourcesRef.current.add(source);
                            }

                            // Handle Interruption
                            if (message.serverContent?.interrupted) {
                                activeSourcesRef.current.forEach(src => src.stop());
                                activeSourcesRef.current.clear();
                                nextStartTimeRef.current = 0;
                            }
                        },
                        onclose: () => {
                            if (isMounted) onClose();
                        },
                        onerror: (err) => {
                            console.error("Gemini Live Error:", err);
                            if (isMounted) {
                                setStatus('error');
                                setErrorMessage('Service unavailable or invalid API key. Please check Settings.');
                            }
                        }
                    }
                });

            } catch (err) {
                console.error("Initialization Error:", err);
                if (isMounted) {
                    setStatus('error');
                    setErrorMessage(err instanceof Error ? err.message : 'Failed to start voice session.');
                }
            }
        };

        initVoiceSession();

        return () => {
            isMounted = false;
            cleanup();
        };
    }, [onClose, user]);

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
            {/* Close Button */}
            <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-3 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Visualizer */}
            <div className="relative flex items-center justify-center mb-12">
                {/* Outer Glow */}
                <div 
                    className={`absolute w-64 h-64 rounded-full bg-primary-500/20 blur-3xl transition-all duration-100 ease-out`}
                    style={{ transform: `scale(${1 + volume})` }}
                ></div>
                {/* Inner Pulse */}
                <div 
                    className={`absolute w-48 h-48 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 blur-xl opacity-60 transition-all duration-100 ease-out`}
                    style={{ transform: `scale(${0.8 + volume * 0.5})` }}
                ></div>
                {/* Core */}
                <div className="relative z-10 w-32 h-32 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,0.5)] flex items-center justify-center">
                    {status === 'connecting' ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    ) : (
                        <GeminiIcon className="w-16 h-16 text-primary-600" />
                    )}
                </div>
            </div>

            {/* Status Text */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-wide">
                    {status === 'connecting' ? 'Connecting...' : status === 'error' ? 'Connection Error' : 'Listening...'}
                </h2>
                <p className="text-gray-400 text-sm px-4 max-w-md mx-auto">
                    {status === 'error' ? errorMessage : 'Go ahead, I\'m listening.'}
                </p>
            </div>

            {/* Controls */}
            <div className="mt-12 flex items-center gap-6">
                <button 
                    onClick={onClose}
                    className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

// --- Main Chat Page ---

const ChatPage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // State
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<Content[]>([]);
    const [showRightPanel, setShowRightPanel] = useState(true); 
    const [isVoiceActive, setIsVoiceActive] = useState(false);

    // Initialize Greeting
    useEffect(() => {
        if (chatHistory.length === 0 && user) {
            const greeting = user.role === 'student'
                ? `Hi ${user.name.split(' ')[0]}! I'm Ace, your AI academic assistant. How can I help you study today?`
                : `Hello ${user.name}. I'm your AI faculty assistant. How can I assist you with your work?`;
            setChatHistory([{ role: 'model', parts: [{ text: greeting }] }]);
        }
    }, [user]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, isLoading]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [input]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading || !user) return;

        const userMsg = input;
        const newUserPart: Content = { role: 'user', parts: [{ text: userMsg }] };
        
        setChatHistory(prev => [...prev, newUserPart]);
        setInput('');
        setIsLoading(true);
        
        // Reset height
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        try {
            const responseText = await getGeneralChatResponse(user as Student | ProfessionalUser, chatHistory, userMsg);
            const modelPart: Content = { role: 'model', parts: [{ text: responseText }] };
            setChatHistory(prev => [...prev, modelPart]);
        } catch (error) {
            const errorPart: Content = { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting. Please try again later." }] };
            setChatHistory(prev => [...prev, errorPart]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            alert(`Uploaded ${file.name} context. Processing...`);
        }
    };

    const quickPrompts = [
        "Explain the last lecture",
        "Solve this practice problem",
        "Generate 5 MCQs on Thermodynamics",
        "Summarize my attendance"
    ];

    // --- Render ---
    return (
        <div className="flex h-full bg-[#F9FAFB] dark:bg-gray-900 font-sans overflow-hidden relative">
            
            {isVoiceActive && user && (
                <VoiceAssistantModal 
                    onClose={() => setIsVoiceActive(false)} 
                    user={user} 
                />
            )}

            {/* Left Column: Chat Area */}
            <div className="flex-1 flex flex-col relative h-full w-full">
                
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-xl text-orange-500">
                            <GeminiIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">AI Chat Assistant</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setChatHistory([])} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors" aria-label="Clear Chat">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors lg:hidden" onClick={() => setShowRightPanel(!showRightPanel)}>
                            <SettingsIcon className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Messages Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 scroll-smooth">
                    {chatHistory.map((msg, idx) => (
                        <MessageBubble 
                            key={idx} 
                            role={(msg.role as 'user'|'model') || 'model'} 
                            text={msg.parts[0].text || ''} 
                            timestamp={new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                        />
                    ))}
                    
                    {isLoading && (
                        <div className="flex justify-start w-full mb-6">
                             <div className="flex max-w-[75%] flex-row gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm mt-1 ring-1 ring-gray-100 dark:ring-gray-600">
                                    <GeminiIcon className="w-5 h-5 text-primary-600" />
                                </div>
                                <div className="px-5 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm shadow-sm">
                                    <TypingIndicator />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Input Area - Pinned Bottom */}
                <div className="p-4 md:p-6 pt-2 bg-gradient-to-t from-[#F9FAFB] dark:from-gray-900 via-[#F9FAFB] dark:via-gray-900 to-transparent">
                    <div className="max-w-4xl mx-auto relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 flex items-end p-2 transition-shadow hover:shadow-2xl">
                        
                        {/* File Upload */}
                        <label className="p-3 text-gray-400 hover:text-[#ff7043] hover:bg-orange-50 dark:hover:bg-gray-700 rounded-full cursor-pointer transition-colors">
                            <PaperclipIcon className="w-5 h-5" />
                            <input type="file" className="hidden" onChange={handleFileUpload} />
                        </label>

                        {/* Text Input */}
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything..."
                            className="flex-1 max-h-40 min-h-[44px] py-3 px-2 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white placeholder-gray-400 resize-none overflow-y-auto"
                            rows={1}
                        />

                        {/* Actions Right */}
                        <div className="flex items-center gap-1 pb-1">
                             {/* Voice Input */}
                            <button 
                                onClick={() => setIsVoiceActive(true)}
                                className="p-2.5 text-gray-400 hover:text-[#ff7043] dark:hover:text-[#ff7043] rounded-full transition-colors hover:bg-orange-50 dark:hover:bg-gray-700" 
                                aria-label="Voice Mode"
                                title="Start Voice Conversation"
                            >
                                <MicIcon className="w-5 h-5" />
                            </button>

                            {/* Send Button */}
                            <button 
                                onClick={handleSend}
                                disabled={!input.trim() && !isLoading}
                                className={`p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95
                                    ${input.trim() 
                                        ? 'bg-[#ff7043] text-white shadow-orange-500/30' 
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                            >
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-gray-400 mt-3">
                        Gemini can make mistakes. Review generated code and important info.
                    </p>
                </div>
            </div>

            {/* Right Column: Context Panel (Responsive) */}
            <div className={`
                w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex-col overflow-y-auto
                fixed inset-y-0 right-0 z-20 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:flex
                ${showRightPanel ? 'translate-x-0 shadow-2xl lg:shadow-none' : 'translate-x-full'}
            `}>
                {/* Mobile Close Button */}
                <div className="lg:hidden p-4 flex justify-end">
                    <button onClick={() => setShowRightPanel(false)} className="p-2 text-gray-500">Close</button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Card 1: Suggested Prompts */}
                    <section>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <SparklesIcon className="w-4 h-4" /> Suggested Prompts
                        </h3>
                        <div className="flex flex-col gap-2">
                            {quickPrompts.map((prompt, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setInput(prompt)}
                                    className="text-left px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-[#ff7043]/10 hover:text-[#ff7043] border border-gray-100 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-300 transition-all duration-200"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
