
import React, { useState, useMemo, useEffect, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import StudentInfoPage from './pages/StudentInfoPage';
import FacultyDashboard from './pages/FacultyDashboard';
import AttendancePage from './pages/AttendancePage';
import FeedbackPage from './pages/FeedbackPage';
import ProfilePage from './pages/ProfilePage';
import ExaminationPage from './pages/ExaminationPage';
import MarksManagementPage from './pages/MarksManagementPage';
import TrainingPage from './pages/TrainingPage';
import PerformancePage from './pages/PerformancePage';
import FacultyAnalyticsPage from './pages/FacultyAnalyticsPage';
import ChatPage from './pages/ChatPage';
import StudentListPage from './pages/StudentDashboard';
import TimetablePage from './pages/TimetablePage';
import ExamAssignmentPage from './pages/ExamAssignmentPage';
import EventsPage from './pages/EventsPage';
import FeesPage from './pages/FeesPage';
import { AuthContext } from './contexts/AuthContext';
import { ThemeContext } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import { ProfessionalUser, Student } from './types';
import { MOCK_STUDENTS_LIST, MOCK_FACULTY_FULL, MOCK_TEACHER } from './data/mockData';
import LoginTransition from './components/common/LoginTransition';
import AdmissionPage from './pages/AdmissionPage';
import OnlineLearningPage from './pages/OnlineLearningPage';
import PlacementPage from './pages/PlacementPage';
import CoursePage from './pages/CoursePage';
import AssignmentsPage from './pages/AssignmentsPage'; 
import SettingsPage from './pages/SettingsPage';
import { supabase } from './services/supabaseClient';

// HOD Pages
import HodDashboard from './pages/HodDashboard';
import HodStudentPage from './pages/HodStudentPage';
import HodFacultyPage from './pages/HodFacultyPage';
import HodAnnouncementsPage from './pages/HodAnnouncementsPage';
import HodReportsPage from './pages/HodReportsPage';
import HodLeavePage from './pages/HodLeavePage'; 


const PlaceholderPage: React.FC<{title: string}> = ({ title }) => (
    <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{title}</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">This page is under construction. Please check back later.</p>
    </div>
);

const App: React.FC = () => {
    const [user, setUser] = useState<Student | ProfessionalUser | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>(localStorage.getItem('theme') as 'light' | 'dark' || 'light');
    const [loading, setLoading] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const authContextValue = useMemo(() => ({
        user,
        login: async (id: string, password: string, role: 'student' | 'faculty' | 'hod_principal'): Promise<boolean> => {
            setIsLoggingIn(true);
            
            try {
                // 1. Attempt Supabase Login (RPC or Table Query)
                // Note: In a production app, use supabase.auth.signInWithPassword. 
                // Here we query tables to match the existing ID/Password logic of the legacy system.
                
                let dbUser = null;
                const { data, error } = await supabase
                    .from('user_accounts')
                    .select('*')
                    .eq('email', id) // Assuming ID maps to email or a specific ID column
                    .single();

                // If Supabase fails or returns nothing, FALLBACK to Mock Data logic (for seamless demo transition)
                if (error || !data) {
                    // console.warn("Supabase login failed, falling back to mock data", error);
                    
                    // --- MOCK FALLBACK LOGIC ---
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

                    let validUser: Student | ProfessionalUser | null = null;

                    if (role === 'student') {
                        if (password === 'students') {
                            const student = MOCK_STUDENTS_LIST.find(s => s.id.toLowerCase() === id.toLowerCase().trim());
                            if (student) validUser = student;
                        }
                    } else if (role === 'faculty') {
                        if (password === 'teacher') {
                            const teacher = MOCK_FACULTY_FULL.find(f => f.id === id.trim());
                            if (teacher) validUser = teacher;
                        }
                    } else if (role === 'hod_principal') {
                        if (id === 'ADM001' && password === 'admin') {
                             validUser = { ...MOCK_TEACHER, role: 'hod_principal', name: 'Dr. Principal', designation: 'Principal & HOD', id: 'ADM001' };
                        }
                    }

                    if (validUser) {
                        setUser(validUser);
                        localStorage.setItem('user', JSON.stringify(validUser));
                        setIsLoggingIn(false);
                        return true;
                    }
                    
                    setIsLoggingIn(false);
                    return false;
                    // --- END MOCK FALLBACK ---
                }

                // If Supabase returned data (implement real auth logic here if using DB)
                // For now, relying on fallback to keep the 'students'/'teacher' password requirement working.
                setIsLoggingIn(false);
                return false;

            } catch (err) {
                console.error("Login Error", err);
                setIsLoggingIn(false);
                return false;
            }
        },
        logout: () => {
            setUser(null);
            localStorage.removeItem('user');
            supabase.auth.signOut();
        },
        updateUser: (updatedData: Partial<Student | ProfessionalUser>) => {
            if (user) {
                const updatedUser = { ...user, ...updatedData };
                setUser(updatedUser as Student | ProfessionalUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        },
    }), [user]);

    const themeContextValue = useMemo(() => ({
        theme,
        toggleTheme: () => {
            setTheme(prevTheme => {
                const newTheme = prevTheme === 'light' ? 'dark' : 'light';
                localStorage.setItem('theme', newTheme);
                return newTheme;
            });
        },
    }), [theme]);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);
    
    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">Loading...</div>;
    }
    
    if (isLoggingIn) {
        return <LoginTransition />;
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            <ThemeContext.Provider value={themeContextValue}>
                <DataProvider>
                    <HashRouter>
                        <Routes>
                            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
                            <Route 
                                path="/*"
                                element={user ? <MainApp /> : <Navigate to="/login" />}
                            />
                        </Routes>
                    </HashRouter>
                </DataProvider>
            </ThemeContext.Provider>
        </AuthContext.Provider>
    );
};

const MainApp: React.FC = () => {
    const { user } = useContext(AuthContext);

    if (user?.role === 'student') {
        return (
            <DashboardLayout>
                <Routes>
                    <Route path="/" element={<Navigate to="/performance" />} />
                    <Route path="/dashboard" element={<Navigate to="/performance" />} />
                    <Route path="/performance" element={<PerformancePage />} />
                    <Route path="/student-info" element={<StudentInfoPage />} />
                    <Route path="/admission" element={<AdmissionPage />} />
                    <Route path="/course" element={<CoursePage />} />
                    <Route path="/fees" element={<FeesPage />} />
                    <Route path="/attendance" element={<AttendancePage />} />
                    <Route path="/online-learning" element={<OnlineLearningPage />} />
                    <Route path="/timetable" element={<TimetablePage />} />
                    <Route path="/feedback" element={<FeedbackPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/examination" element={<ExaminationPage />} />
                    <Route path="/assignment" element={<AssignmentsPage />} /> 
                    <Route path="/placements" element={<PlacementPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/manage" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/performance" />} />
                </Routes>
            </DashboardLayout>
        );
    }

    if (user?.role === 'faculty') {
        return (
            <DashboardLayout>
                <Routes>
                    <Route path="/" element={<Navigate to="/faculty-dashboard" />} />
                    <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
                    <Route path="/students" element={<StudentListPage />} />
                    <Route path="/faculty/attendance" element={<AttendancePage />} />
                    <Route path="/training" element={<TrainingPage />} />
                    <Route path="/exam-assignment" element={<ExamAssignmentPage />} />
                    <Route path="/marks" element={<MarksManagementPage />} />
                    <Route path="/feedback" element={<FeedbackPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/manage" element={<ProfilePage />} />
                    <Route path="/faculty-analytics" element={<FacultyAnalyticsPage />} />
                    <Route path="/logout" element={<Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/faculty-dashboard" />} />
                </Routes>
            </DashboardLayout>
        );
    }

    if (user?.role === 'hod_principal') {
        return (
            <DashboardLayout>
                <Routes>
                    <Route path="/" element={<Navigate to="/hod/dashboard" />} />
                    <Route path="/hod/dashboard" element={<HodDashboard />} />
                    <Route path="/hod/students" element={<HodStudentPage />} />
                    <Route path="/hod/faculty" element={<HodFacultyPage />} />
                    <Route path="/faculty/attendance" element={<AttendancePage />} />
                    <Route path="/hod/announcements" element={<HodAnnouncementsPage />} />
                    <Route path="/hod/leaves" element={<HodLeavePage />} />
                    <Route path="/hod/timetable" element={<PlaceholderPage title="Master Timetable" />} />
                    <Route path="/hod/events" element={<EventsPage />} />
                    <Route path="/hod/profile" element={<ProfilePage />} />
                    <Route path="/hod/reports" element={<HodReportsPage />} />
                    <Route path="*" element={<Navigate to="/hod/dashboard" />} />
                </Routes>
            </DashboardLayout>
        );
    }
    
    return <Navigate to="/login" />;
};


export default App;
