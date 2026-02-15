
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M47.532 24.552c0-1.566-.14-3.09-.408-4.552H24.4v8.58h13.012c-.564 2.76-2.256 5.112-4.788 6.696v5.52h7.092c4.14-3.816 6.552-9.456 6.552-16.224z" fill="#4285F4" />
        <path d="M24.4 48c6.456 0 11.916-2.124 15.888-5.76l-7.092-5.52c-2.124 1.428-4.86 2.292-8.796 2.292-6.756 0-12.48-4.536-14.52-10.644H2.436v5.7c4.2 8.292 12.876 14.004 21.964 14.004z" fill="#34A853" />
        <path d="M9.88 28.644a15.39 15.39 0 010-9.288v-5.7H2.436C.864 16.74 0 20.484 0 24.4s.864 7.66 2.436 10.74l7.444-5.7z" fill="#FBBC05" />
        <path d="M24.4 9.576c3.492 0 6.6 1.2 9.048 3.504l6.276-6.276C36.312 2.184 30.852 0 24.4 0 15.312 0 6.636 5.712 2.436 14.004l7.444 5.7c2.04-6.108 7.764-10.644 14.52-10.644z" fill="#EA4335" />
    </svg>
);

const GithubIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.82c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.745 0 .267.18.577.688.48A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
    </svg>
);

const LoginPage: React.FC = () => {
    const [role, setRole] = useState<'student' | 'faculty' | 'hod_principal'>('student');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { login } = useContext(AuthContext);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        const success = await login(identifier, password, role);
        
        if (!success) {
            setError('Invalid credentials. Please check your ID and Password.');
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gray-900">
            {/* Animated Aurora Background */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%]">
                    <div className="absolute w-[45rem] h-[45rem] bg-primary-500/40 rounded-full filter blur-3xl" style={{ top: '10vh', left: '10vw', animation: 'move-blob-1 15s infinite alternate' }}></div>
                    <div className="absolute w-[35rem] h-[35rem] bg-blue-500/40 rounded-full filter blur-3xl" style={{ top: '60vh', left: '25vw', animation: 'move-blob-2 18s infinite alternate' }}></div>
                    <div className="absolute w-[38rem] h-[38rem] bg-purple-600/30 rounded-full filter blur-3xl" style={{ top: '20vh', left: '70vw', animation: 'move-blob-3 20s infinite alternate' }}></div>
                    <div className="absolute w-[30rem] h-[30rem] bg-pink-500/30 rounded-full filter blur-3xl" style={{ bottom: '5vh', left: '50vw', animation: 'move-blob-4 22s infinite alternate' }}></div>
                    <div className="absolute w-[35rem] h-[35rem] bg-teal-500/30 rounded-full filter blur-3xl" style={{ top: '5vh', right: '50vw', animation: 'move-blob-5 25s infinite alternate' }}></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
                <h1 
                    className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-500 to-blue-400 text-center mb-8 max-w-2xl leading-tight tracking-wide"
                    style={{ textShadow: '0 2px 20px rgba(251, 146, 60, 0.2), 0 2px 20px rgba(96, 165, 250, 0.2)' }}
                >
                    BLDEA’s V. P. Dr. P. G. Halakatti College of Engineering & Technology
                </h1>
                
                {/* Glossy Frosted Glass Login Card */}
                <div className="relative w-full max-w-[360px] p-8 space-y-6 bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-10">
                    
                    {/* Glass Reflection Overlay */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-2xl"></div>
                    
                    <h1 className="text-3xl font-bold text-center text-white tracking-tight relative z-10">Welcome</h1>
                    
                    {/* Role Selector */}
                    <div className="relative p-1 flex bg-black/20 border border-white/5 rounded-xl z-10">
                        <button
                            onClick={() => { setRole('student'); setError(null); setIdentifier(''); setPassword(''); }}
                            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${role === 'student' ? 'bg-gradient-to-r from-[#ff8a3d] to-[#ff6a2b] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                            Student
                        </button>
                        <button
                            onClick={() => { setRole('faculty'); setError(null); setIdentifier(''); setPassword(''); }}
                            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${role === 'faculty' ? 'bg-gradient-to-r from-[#ff8a3d] to-[#ff6a2b] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                            Faculty
                        </button>
                         <button
                            onClick={() => { setRole('hod_principal'); setError(null); setIdentifier(''); setPassword(''); }}
                            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${role === 'hod_principal' ? 'bg-gradient-to-r from-[#ff8a3d] to-[#ff6a2b] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                            HOD/Admin
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5 relative z-10">
                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200 text-xs animate-shake">
                                <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label htmlFor="identifier" className="text-xs font-medium text-gray-300 ml-1">
                                {role === 'student' ? 'USN' : role === 'faculty' ? 'Teacher ID' : 'Admin ID'}
                            </label>
                            <input
                                type="text"
                                id="identifier"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder={role === 'student' ? 'e.g., 2BL23CI054' : role === 'faculty' ? 'e.g., 103201' : 'e.g., ADM001'}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="password"
                                   className="text-xs font-medium text-gray-300 ml-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={role === 'student' ? 'Enter "students"' : role === 'faculty' ? 'Enter "teacher"' : 'Enter "admin"'}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                                required
                            />
                        </div>
                         <div className="text-right">
                            <a href="#" className="text-xs text-orange-400 hover:text-orange-300 transition-colors">Forgot Password?</a>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-[#ff8a3d] to-[#ff6a2b] text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(255,106,43,0.39)] hover:shadow-[0_6px_20px_rgba(255,106,43,0.23)] hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Sign In
                        </button>
                    </form>

                     <div className="flex items-center py-2 relative z-10">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink mx-4 text-xs text-gray-500 uppercase tracking-wider">Or continue with</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>
                    
                    <div className="flex items-center space-x-4 relative z-10">
                        <button className="flex-1 flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300">
                            <GoogleIcon />
                        </button>
                        <button className="flex-1 flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300">
                            <GithubIcon />
                        </button>
                    </div>

                    <p className="text-center text-xs text-gray-400 relative z-10">
                        Don't have an account? <a href="#" className="font-bold text-orange-400 hover:text-orange-300 transition-colors">Sign up</a>
                    </p>
                </div>
            </div>
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
                    20%, 40%, 60%, 80% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
