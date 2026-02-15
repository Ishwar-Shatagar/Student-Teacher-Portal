import React, { useState, useEffect, useRef } from 'react';
import * as Icons from '../components/common/Icons';

// --- Data for Tiles ---
const codingClubs = [
    { name: "W3Schools", href: "https://www.w3schools.com/", caption: "Web tutorials", logo: <W3SchoolsLogo /> },
    { name: "HackerRank", href: "https://www.hackerrank.com/", caption: "Problem solving", logo: <HackerRankLogo /> },
    { name: "LeetCode", href: "https://leetcode.com/", caption: "Interview prep", logo: <LeetCodeLogo /> },
    { name: "GeeksforGeeks", href: "https://www.geeksforgeeks.org/", caption: "Articles & courses", logo: <GeeksforGeeksLogo /> },
    { name: "HackerEarth", href: "https://www.hackerearth.com/", caption: "Challenges & jobs", logo: <HackerEarthLogo /> },
];

const WhiteLetterLogo = ({ letter }: { letter: string }) => <span className="text-3xl font-bold text-white">{letter}</span>;

const youtubeChannels = [
    { name: "Mohsin Ali", href: "https://youtube.com/@mohsin_ali_14?si=uahf1RzkoKKkJ5cZ", caption: "College projects", logo: <WhiteLetterLogo letter="M" /> },
    { name: "Mathematics Tutor", href: "https://www.youtube.com/@MathematicsTutor", caption: "Math lectures", logo: <WhiteLetterLogo letter="M" /> },
    { name: "Afnan Marquee", href: "https://www.youtube.com/@AfnanMarquee", caption: "Web development", logo: <WhiteLetterLogo letter="A" /> },
    { name: "Priyanka Kalwad", href: "https://www.youtube.com/@PriyankaKalwad-25", caption: "VTU tutorials", logo: <WhiteLetterLogo letter="P" /> },
    { name: "VTUpadhai", href: "https://www.youtube.com/@VTUpadhai", caption: "VTU resources", logo: <WhiteLetterLogo letter="V" /> },
    { name: "Perfect Computer Engineer", href: "https://www.youtube.com/@PerfectComputerEngineer", caption: "Engineering concepts", logo: <WhiteLetterLogo letter="P" /> },
];

// --- SVG Logos (Self-contained components with updated colors) ---
function W3SchoolsLogo() { return <svg className="w-10 h-10" viewBox="0 0 40 40"><path fill="#FFFFFF" d="M21.314 18.228l-4.248 10.158-4.248-10.158-4.248 10.158h-3.398l6.097-14.58-6.097-14.58h3.398l4.248 10.158 4.248-10.158 4.248 10.158 6.097-14.58h3.398l-6.097 14.58 6.097 14.58h-3.398l-4.248-10.158z"></path></svg>; }
function HackerRankLogo() { return <svg className="w-10 h-10" viewBox="0 0 1024 1024"><path fill="#FFFFFF" d="M128 128h256v768H128V128zm512 0h256v768H640V128z"></path><path fill="#FFFFFF" d="M448 384h128v256H448V384z"></path></svg>; }
function LeetCodeLogo() { return <svg className="w-10 h-10" viewBox="0 0 24 24"><path fill="#FFFFFF" d="M20.4 13.6L12 22 3.6 13.6 12 5.2z"></path><path fill="rgba(255,255,255,0.7)" d="M12 13.8V22l-8.4-8.4zM20.4 13.6L12 22V13.8z"></path><path fill="rgba(255,255,255,0.5)" d="M3.6 13.6L12 5.2V13.8zM12 5.2l8.4 8.4V5.2z"></path><path fill="#10B981" d="M12 6.8v5.5l-3.3-3.3zM12 6.8l3.3 2.2-3.3 3.3z"></path><path fill="rgba(255,255,255,0.1)" d="M12 2L3.6 10.4l8.4 8.4 8.4-8.4z"></path><path fill="#22C55E" d="M14.6 9.4L12 11.1v-1zM9.4 9.4L12 8.1v3z"></path></svg>; }
function GeeksforGeeksLogo() { return <svg className="w-12 h-12" viewBox="0 0 24 24"><path fill="#FFFFFF" d="M11.14 20.5v-17h1.71v17zm-2.43-1.89l-5.6-4.32 1-1.35 4.8 3.7v-9.3l-4.8 3.7-1-1.35 5.6-4.32a2.64 2.64 0 0 1 3.18 0l5.6 4.32-1 1.35-4.8-3.7v9.3l4.8-3.7 1 1.35-5.6 4.32a2.64 2.64 0 0 1-3.18 0z"></path></svg>; }
function HackerEarthLogo() { return <svg className="w-10 h-10" viewBox="0 0 24 24"><path fill="#FFFFFF" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1h-2v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.64-1.28 4.95-3.28 6.46l.18-.53z"></path></svg>; }


// --- Reusable Animated Tile Component ---
interface InteractiveTileProps {
    href: string;
    logo?: React.ReactNode;
    name: string;
    caption: string;
    style?: React.CSSProperties;
}

const InteractiveTile: React.FC<InteractiveTileProps> = ({ href, logo, name, caption, style }) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${name} - ${caption}`}
            className="interactive-tile group"
            style={style}
        >
            <div className="tile-content">
                <div className="logo-container group-hover:rotate-[-3deg] group-focus-visible:rotate-[-3deg]">
                    {logo}
                </div>
                <h4 className="font-bold mt-3 text-white">{name}</h4>
                <p className="text-xs text-white/80">{caption}</p>
            </div>
        </a>
    );
};

// --- VTU Notes Card Component ---
const VTUNotesCard = ({ style }: { style?: React.CSSProperties }) => (
    <div className="notes-card" style={style}>
        <div className="notes-content">
            <h3 className="text-2xl font-bold text-white">VTUcircle Notes</h3>
            <p className="mt-2 text-white/90">Semester notes, lab manuals, important PDFs, and assignments.</p>
            <div className="mt-4 flex items-center bg-white/10 rounded-md p-1">
                <Icons.SearchIcon className="w-5 h-5 text-white/60 mx-2" />
                <input type="text" placeholder="Filter by subject..." className="bg-transparent w-full focus:outline-none text-white placeholder-white/60" />
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href="https://vtucircle.com/" target="_blank" rel="noopener noreferrer" className="notes-button bg-white/90 hover:bg-white text-blue-600">View</a>
                <a href="https://vtucircle.com/" target="_blank" rel="noopener noreferrer" className="notes-button bg-white/20 hover:bg-white/30 text-white">Download</a>
            </div>
        </div>
    </div>
);

// --- Custom Hook for Intersection Observer ---
const useOnScreen = (ref: React.RefObject<HTMLElement>, rootMargin = "0px") => {
    const [isIntersecting, setIntersecting] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIntersecting(entry.isIntersecting),
            { rootMargin }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);
    return isIntersecting;
};

// --- Main Page Component ---
const OnlineLearningPage: React.FC = () => {
    const sectionRef1 = useRef<HTMLDivElement>(null);
    const sectionRef2 = useRef<HTMLDivElement>(null);
    const sectionRef3 = useRef<HTMLDivElement>(null);
    const isVisible1 = useOnScreen(sectionRef1, "-100px");
    const isVisible2 = useOnScreen(sectionRef2, "-100px");
    const isVisible3 = useOnScreen(sectionRef3, "-100px");

    const codingClubGradients = [
        'linear-gradient(135deg, #10b981, #22c55e, #14b8a6)',
        'linear-gradient(160deg, #14b8a6, #10b981, #22c55e)',
        'linear-gradient(to top right, #22c55e, #14b8a6)',
        'linear-gradient(to bottom left, #10b981, #14b8a6)',
        'linear-gradient(200deg, #22c55e, #10b981, #14b8a6)'
    ];
    const youtubeChannelGradients = [
        'linear-gradient(135deg, #7c3aed, #6366f1, #3b82f6)',
        'linear-gradient(160deg, #8b5cf6, #7c3aed, #6366f1)',
        'linear-gradient(to top right, #3b82f6, #8b5cf6)',
        'linear-gradient(to bottom left, #6366f1, #3b82f6)',
        'linear-gradient(200deg, #8b5cf6, #3b82f6, #7c3aed)',
        'linear-gradient(135deg, #6366f1, #8b5cf6)',
    ];
    const vtuNotesGradient = 'linear-gradient(135deg, #3b82f6, #7c3aed, #06b6d4)';

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-12">
            <style>{`
                .animated-section {
                    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
                    opacity: 0;
                    transform: translateY(20px);
                }
                .animated-section.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .interactive-tile, .notes-card {
                    position: relative;
                    display: block;
                    border-radius: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), background-position 0.8s ease;
                    transform-style: preserve-3d;
                    color: #FFFFFF;
                    background-size: 200% 200%;
                    background-position: 10% 10%;
                    animation: tile-fade-in 0.5s ease-out forwards;
                    opacity: 0;
                }
                .interactive-tile { padding: 1.5rem; }
                .notes-card { padding: 2rem; }

                .interactive-tile:hover, .interactive-tile:focus-visible, .notes-card:hover, .notes-card:focus-visible {
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
                    background-position: 90% 90%;
                }
                .interactive-tile .logo-container { transition: transform 0.3s ease; }
                .tile-content, .notes-content { position: relative; z-index: 2; text-align: center; }
                .notes-content { text-align: left; }
                
                @keyframes tile-fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .notes-button { display: block; text-align: center; padding: 0.75rem 1rem; border-radius: 0.5rem; font-weight: 600; transition: all 0.2s ease; transform-style: preserve-3d; }
                .notes-button:hover { transform: scale(1.05); }

                @media (prefers-reduced-motion: reduce) {
                    .animated-section, .interactive-tile, .notes-card, .interactive-tile:hover, .interactive-tile:focus-visible, .notes-card:hover, .notes-card:focus-visible, .logo-container, .notes-button, .notes-button:hover {
                        animation: none !important;
                        transition: none !important;
                        transform: none !important;
                    }
                }
            `}</style>
            
            <section ref={sectionRef1} className={`animated-section ${isVisible1 ? 'is-visible' : ''}`}>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Coding Club</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {codingClubs.map((club, i) => (
                        <InteractiveTile 
                            key={club.name} 
                            {...club} 
                            style={{ 
                                animationDelay: `${i * 80}ms`, 
                                background: codingClubGradients[i % codingClubGradients.length] 
                            }} 
                        />
                    ))}
                </div>
            </section>
            
            <section ref={sectionRef2} className={`animated-section ${isVisible2 ? 'is-visible' : ''}`}>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Notes</h2>
                <VTUNotesCard style={{ animationDelay: `100ms`, background: vtuNotesGradient }} />
            </section>

            <section ref={sectionRef3} className={`animated-section ${isVisible3 ? 'is-visible' : ''}`}>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Recommended YouTube Channels</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                     {youtubeChannels.map((channel, i) => (
                        <InteractiveTile 
                            key={channel.name} 
                            {...channel} 
                            style={{ 
                                animationDelay: `${i * 80}ms`, 
                                background: youtubeChannelGradients[i % youtubeChannelGradients.length] 
                            }} 
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default OnlineLearningPage;
