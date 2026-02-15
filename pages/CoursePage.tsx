
import React, { useState, useEffect, useRef } from 'react';
import { DEPARTMENTS_DATA, Department, FacultyMember, Lab } from '../data/courseData';
import * as Icons from '../components/common/Icons';

// --- Reusable Animated Components ---

const KPICard: React.FC<{ label: string; value: number | string; icon: React.ReactNode }> = ({ label, value, icon }) => {
    const [count, setCount] = useState(0);
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        if (typeof value === 'number') {
            let start = 0;
            const end = value;
            if (start === end) return;
            const duration = 1500;
            const incrementTime = (duration / end);
            const timer = setInterval(() => {
                start += 1;
                setCount(start);
                if (start === end) clearInterval(timer);
            }, incrementTime);
            return () => clearInterval(timer);
        }
    }, [value]);

    return (
        <div className="flex items-center p-4 bg-black/10 dark:bg-white/5 rounded-lg">
            <div className="text-primary-400">{icon}</div>
            <div className="ml-4">
                <p className="text-2xl font-bold text-black dark:text-white">{typeof value === 'number' ? count : value}</p>
                <p className="text-xs text-black dark:text-gray-400">{label}</p>
            </div>
        </div>
    );
};


interface AccordionItemProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    // Guard against empty children
    if (!React.Children.count(children) || (Array.isArray(children) && children.every(child => !child))) {
        return null;
    }

    return (
        <div className="border-b border-gray-200 dark:border-white/10">
            <button
                className="w-full flex justify-between items-center text-left py-4 px-2"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <div className="flex items-center">
                    <span className="text-primary-500 mr-3">{icon}</span>
                    <h3 className="font-semibold text-lg text-black dark:text-gray-100">{title}</h3>
                </div>
                <Icons.SortDescIcon className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? '' : '-rotate-90'}`} />
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}
            >
                <div className="p-4 prose dark:prose-invert max-w-none text-black dark:text-gray-300">{children}</div>
            </div>
        </div>
    );
};


const FacultyCard: React.FC<{ member: FacultyMember }> = ({ member }) => (
    <div className="text-center p-4 bg-black/5 dark:bg-white/5 rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-black/10 dark:hover:bg-white/10">
        <img src={member.imageUrl} alt={member.name} className="w-24 h-24 rounded-full mx-auto object-cover ring-2 ring-white/10" />
        <p className="font-bold mt-3 text-black dark:text-white">{member.name}</p>
        <p className="text-sm text-black dark:text-gray-400">{member.designation}</p>
        <p className="text-xs text-black dark:text-gray-500">{member.qualification}</p>
        <p className="text-xs text-black dark:text-gray-500">({member.specialization})</p>
    </div>
);

const LabCard: React.FC<{ lab: Lab }> = ({ lab }) => (
    <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg">
        <h4 className="font-semibold text-black dark:text-white">{lab.name}</h4>
        <p className="text-sm text-black dark:text-gray-400 mt-1">{lab.description}</p>
        {lab.equipment && lab.equipment.length > 0 && (
             <div className="mt-2">
                <p className="text-xs font-bold text-black dark:text-gray-300">Key Equipment:</p>
                <ul className="text-xs text-black dark:text-gray-400 list-disc list-inside">
                    {lab.equipment.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>
        )}
    </div>
);


const CoursePage: React.FC = () => {
    const [activeDept, setActiveDept] = useState<Department>(DEPARTMENTS_DATA[0]);
    const [isContentVisible, setIsContentVisible] = useState(true);

    const handleDeptChange = (dept: Department) => {
        setIsContentVisible(false);
        setTimeout(() => {
            setActiveDept(dept);
            setIsContentVisible(true);
        }, 300); // Match this with transition duration
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                        scroll-behavior: auto !important;
                    }
                }
            `}</style>
            <div className="glass-card p-6 sm:p-8 mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">Courses & Departments</h1>
                <p className="mt-2 text-black dark:text-gray-300">Explore the various engineering disciplines offered at our institution.</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Navigation */}
                <nav className="lg:w-1/4 xl:w-1/5">
                    <ul className="space-y-2">
                        {DEPARTMENTS_DATA.map((dept, index) => (
                            <li key={dept.id} style={{ animation: `fadeInUp 0.5s ${index * 0.08}s ease-out forwards`, opacity: 0 }}>
                                <button 
                                    onClick={() => handleDeptChange(dept)}
                                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:translate-x-1 ${
                                        activeDept.id === dept.id 
                                            ? 'bg-primary-500 text-white shadow-md' 
                                            : 'text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {dept.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Right Content Panel */}
                <main className={`flex-1 transition-opacity duration-300 ${isContentVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="glass-card p-6 sm:p-8">
                        <header className="mb-6 border-b border-gray-200 dark:border-white/10 pb-6">
                            <h2 className="text-3xl font-bold text-black dark:text-white">{activeDept.fullName}</h2>
                            <p className="text-primary-500 dark:text-primary-400 font-semibold">{activeDept.tagline}</p>
                        </header>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <KPICard label="Annual Intake" value={activeDept.kpis.intake} icon={<Icons.StudentIcon className="w-6 h-6"/>} />
                            <KPICard label="Program Duration" value={activeDept.kpis.duration} icon={<Icons.TimetableIcon className="w-6 h-6"/>} />
                            <KPICard label="Laboratories" value={activeDept.kpis.labsCount} icon={<Icons.LabIcon className="w-6 h-6"/>} />
                        </div>
                        
                        <AccordionItem title="Overview" icon={<Icons.CourseIcon className="w-6 h-6"/>} defaultOpen>{activeDept.overview}</AccordionItem>
                        <AccordionItem title="Vision" icon={<Icons.VisionIcon className="w-6 h-6"/>}>{activeDept.vision}</AccordionItem>
                        <AccordionItem title="Mission" icon={<Icons.MissionIcon className="w-6 h-6"/>}>
                            <ul className="list-disc pl-5 space-y-2">{activeDept.mission.map((m, i) => <li key={i}>{m}</li>)}</ul>
                        </AccordionItem>
                        <AccordionItem title="Program Educational Objectives (PEOs)" icon={<Icons.AchievementsIcon className="w-6 h-6"/>}>
                            <ul className="list-decimal pl-5 space-y-2">{activeDept.peos.map((peo, i) => <li key={i}>{peo}</li>)}</ul>
                        </AccordionItem>
                         <AccordionItem title="Program Specific Outcomes (PSOs)" icon={<Icons.SparklesIcon className="w-6 h-6"/>}>
                            <ul className="list-decimal pl-5 space-y-2">{activeDept.psos.map((pso, i) => <li key={i}>{pso}</li>)}</ul>
                        </AccordionItem>
                        <AccordionItem title="Program Outcomes (POs)" icon={<Icons.ProgramOutcomesIcon className="w-6 h-6"/>}>
                            <ul className="list-decimal pl-5 space-y-2">{activeDept.programOutcomes.map((po, i) => <li key={i}>{po}</li>)}</ul>
                        </AccordionItem>
                        <AccordionItem title="Head of Department" icon={<Icons.HODIcon className="w-6 h-6"/>}>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <img src={activeDept.hod.imageUrl} alt={activeDept.hod.name} className="w-24 h-24 rounded-full object-cover flex-shrink-0"/>
                                <div>
                                    <h4 className="font-bold text-lg text-black dark:text-white">{activeDept.hod.name}, <span className="font-normal text-base">{activeDept.hod.qualification}</span></h4>
                                    <p className="italic">"{activeDept.hod.message}"</p>
                                </div>
                            </div>
                        </AccordionItem>
                        <AccordionItem title="Faculty" icon={<Icons.FacultyIcon className="w-6 h-6"/>}>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {activeDept.faculty.map(member => <FacultyCard key={member.name} member={member} />)}
                            </div>
                        </AccordionItem>
                        <AccordionItem title="Laboratories" icon={<Icons.LabIcon className="w-6 h-6"/>}>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeDept.labs.map(lab => <LabCard key={lab.name} lab={lab} />)}
                            </div>
                        </AccordionItem>
                         <AccordionItem title="Curriculum Highlights" icon={<Icons.CurriculumIcon className="w-6 h-6"/>}>
                            {Object.entries(activeDept.curriculum).map(([semester, subjects]) => (
                                <div key={semester} className="mb-2">
                                    <h5 className="font-semibold text-black dark:text-white">{semester}:</h5>
                                    <p className="text-sm">{(subjects as string[]).join(', ')}</p>
                                </div>
                            ))}
                        </AccordionItem>
                         <AccordionItem title="Achievements" icon={<Icons.AchievementsIcon className="w-6 h-6"/>}>
                            <ul className="list-disc pl-5 space-y-2">{activeDept.achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
                        </AccordionItem>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CoursePage;
