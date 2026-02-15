
import React from 'react';

const LoginTransition: React.FC = () => {
    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900 fade-in-animation">
                <div className="absolute inset-0 bg-grid opacity-20"></div>
                <div className="relative flex flex-col items-center justify-center text-center">
                    <div className="logo-container">
                        <div className="w-24 h-24 bg-bldeacet-blue rounded-full flex items-center justify-center glow-shadow">
                            <span className="text-white text-5xl font-bold logo-text">A</span>
                        </div>
                    </div>
                    <p className="mt-8 text-white text-lg font-semibold tracking-wider loading-text">Authenticating</p>
                </div>
            </div>
            <style>{`
                /* Keyframe Animations */
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 15px 5px rgba(255, 215, 0, 0.3), 0 0 25px 10px rgba(0, 51, 102, 0.4); }
                    50% { box-shadow: 0 0 30px 10px rgba(255, 215, 0, 0.5), 0 0 50px 20px rgba(0, 51, 102, 0.6); }
                }
                @keyframes scale-up {
                    0% { transform: scale(0.8); opacity: 0; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes text-fade-in-out {
                    0%, 100% { opacity: 0; transform: translateY(10px); }
                    20%, 80% { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse-dots {
                    0% { content: '.'; }
                    33% { content: '..'; }
                    66% { content: '...'; }
                    100% { content: '.'; }
                }
                @keyframes grid-pan {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 100% 100%; }
                }
                @keyframes fade-in-anim {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                /* Component Styling */
                .fade-in-animation {
                    animation: fade-in-anim 0.3s ease-out forwards;
                }
                .bg-grid {
                    background-image:
                        linear-gradient(rgba(255, 215, 0, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 215, 0, 0.1) 1px, transparent 1px);
                    background-size: 50px 50px;
                    animation: grid-pan 30s linear infinite;
                }
                .logo-container {
                    animation: scale-up 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
                .glow-shadow {
                    animation: glow 2.5s infinite ease-in-out;
                }
                .logo-text {
                    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
                }
                .loading-text {
                    animation: text-fade-in-out 2.5s ease-out forwards;
                    opacity: 0;
                }
                .loading-text::after {
                    display: inline-block;
                    width: 20px; /* give it some space */
                    text-align: left;
                    content: '.';
                    animation: pulse-dots 1.5s infinite steps(1, end);
                }
            `}</style>
        </>
    );
};

export default LoginTransition;
