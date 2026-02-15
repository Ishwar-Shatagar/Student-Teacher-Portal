
// Restart preview or run dev server after saving to view UI changes
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataContext';
import { Student } from '../types';
import * as Icons from '../components/common/Icons';

// Import existing bottom section components to preserve academic data view
import MarksTable from '../components/student-info/MarksTable';
import TotalGradeDetails from '../components/student-info/TotalGradeDetails';
import GradingScale from '../components/student-info/GradingScale';
import SemesterWiseResults from '../components/student-info/SemesterWiseResults';
import TimetableWidget from '../components/dashboard/TimetableWidget';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';

// --- UI Components ---

const Card = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 ${className}`}>
        {children}
    </div>
);

const SectionHeader = ({ title, icon, action }: { title: string; icon?: React.ReactNode; action?: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            {icon && <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-xl">{icon}</div>}
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
        </div>
        {action}
    </div>
);

// New: Editable Row Component
interface EditableRowProps {
    label: string;
    value: string | undefined;
    name: string;
    isEditing: boolean;
    type?: 'text' | 'date' | 'tel' | 'email' | 'select';
    options?: string[];
    readOnly?: boolean;
    onChange: (name: string, value: string) => void;
    icon?: React.ReactNode;
}

const InfoRow: React.FC<EditableRowProps> = ({ 
    label, value, name, isEditing, type = 'text', options, readOnly = false, onChange, icon 
}) => {
    return (
        <div className="flex items-center py-3 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
            <div className="flex items-center gap-3 w-1/3">
                {icon && <span className="text-gray-400">{icon}</span>}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
            </div>
            <div className="w-2/3">
                {isEditing && !readOnly ? (
                    type === 'select' ? (
                        <select 
                            value={value || ''} 
                            onChange={(e) => onChange(name, e.target.value)}
                            className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                        >
                            <option value="">Select</option>
                            {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    ) : (
                        <input 
                            type={type} 
                            value={value || ''} 
                            onChange={(e) => onChange(name, e.target.value)}
                            className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder={`Enter ${label.toLowerCase()}`}
                        />
                    )
                ) : (
                    <div className={`text-sm font-medium ${readOnly && isEditing ? 'text-gray-400' : 'text-gray-700 dark:text-gray-200'} break-words`}>
                        {value || <span className="text-gray-400 italic text-xs">Not added</span>}
                    </div>
                )}
            </div>
        </div>
    );
};

const StatBox = ({ label, value, color = "text-gray-800" }: { label: string; value: string | number; color?: string }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl flex-1">
        <span className={`text-2xl font-bold ${color} dark:text-white`}>{value}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{label}</span>
    </div>
);

// --- Main Page ---

const StudentInfoPage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const dataContext = useContext(DataContext);
    
    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Student>>({});
    const [error, setError] = useState<string | null>(null);

    // Load initial data
    useEffect(() => {
        if (user && user.role === 'student' && dataContext) {
            const student = dataContext.students.find(s => s.id === user.id);
            if (student) {
                setFormData(student);
            }
        }
    }, [user, dataContext, isEditing]); // Reset on cancel/edit toggle

    if (!dataContext || !user) return <div className="p-10 text-center">Loading Profile...</div>;

    const { students, updateStudentDetails } = dataContext;
    const student = students.find(s => s.id === user.id);

    if (!student) return <div className="p-10 text-center text-red-500">Student Record Not Found</div>;

    const latestSemester = student.academicHistory[student.academicHistory.length - 1];
    
    // Calculate Attendance
    const totalClasses = student.attendance.reduce((acc, curr) => acc + curr.totalClasses, 0);
    const attendedClasses = student.attendance.reduce((acc, curr) => acc + curr.classesAttended, 0);
    const attendancePercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

    // --- Edit Handlers ---

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const validateForm = (): boolean => {
        // Required Fields
        if (!formData.email || !formData.phone || !formData.address || !formData.emergencyContactName || !formData.emergencyPhone) {
            setError("Please fill in all required fields (Email, Phone, Address, Emergency Contact).");
            return false;
        }
        
        // Email
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Invalid email format.");
            return false;
        }

        // Phone Numbers (Basic 10 digit check)
        const phoneRegex = /^\d{10}$/;
        if (formData.phone && !phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
            setError("Phone number must be 10 digits.");
            return false;
        }

        // Future Date Check
        if (formData.dateOfBirth) {
            const dob = new Date(formData.dateOfBirth);
            if (dob > new Date()) {
                setError("Date of Birth cannot be in the future.");
                return false;
            }
        }

        return true;
    };

    const handleSave = () => {
        if (!validateForm()) return;
        
        updateStudentDetails(student.id, formData);
        setIsEditing(false);
        setError(null);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError(null);
        setFormData(student); // Revert
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-6 md:p-10 max-w-[1600px] mx-auto">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Student Profile</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your personal and academic details.</p>
                </div>
                
                {isEditing ? (
                    <div className="flex gap-3">
                        <button 
                            onClick={handleCancel}
                            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="px-5 py-2.5 bg-green-500 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:bg-green-600 transition-all active:scale-95"
                        >
                            Save Changes
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:text-orange-500 transition-all border border-gray-200 dark:border-gray-700"
                    >
                        <Icons.ManageIcon className="w-5 h-5" />
                        Edit Profile
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN: Identity & Summary (4 cols) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Profile Card */}
                    <Card className="flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-orange-100/50 to-transparent dark:from-orange-900/20 pointer-events-none"></div>
                        
                        <div className="relative mt-4 mb-6 group">
                            <div className="w-40 h-40 rounded-full p-1.5 bg-white dark:bg-gray-800 shadow-xl ring-1 ring-gray-100 dark:ring-gray-700">
                                <img 
                                    src={student.profilePicUrl} 
                                    alt={student.name} 
                                    className="w-full h-full rounded-full object-cover transform transition-transform group-hover:scale-105" 
                                />
                            </div>
                            <span className="absolute bottom-2 right-4 w-5 h-5 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full"></span>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h2>
                        <span className="mt-2 px-4 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-mono rounded-full">
                            {student.id}
                        </span>

                        <div className="flex items-center gap-3 mt-6 w-full justify-center">
                            <span className="px-4 py-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold uppercase tracking-wide">
                                {student.department}
                            </span>
                            <span className="px-4 py-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 text-xs font-bold uppercase tracking-wide">
                                Sem {student.semester}
                            </span>
                        </div>

                        <div className="w-full mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex gap-4">
                                <StatBox label="CGPA" value={student.cgpa} />
                                <StatBox label="Attendance" value={`${attendancePercentage}%`} color={attendancePercentage < 75 ? "text-red-500" : "text-green-500"} />
                                <StatBox label="Batch" value={student.batchYear.split('-')[0]} />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Detailed Info (8 cols) */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* A) Personal Information */}
                    <Card>
                        <SectionHeader title="Personal Information" icon={<Icons.StudentIcon className="w-5 h-5" />} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                            <InfoRow label="Date of Birth" value={formData.dateOfBirth} name="dateOfBirth" isEditing={isEditing} onChange={handleInputChange} type="date" icon={<Icons.CalendarIcon className="w-4 h-4"/>} />
                            <InfoRow label="Blood Group" value={formData.bloodGroup} name="bloodGroup" isEditing={isEditing} onChange={handleInputChange} type="select" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} icon={<div className="w-4 text-center font-bold">🩸</div>} />
                            <InfoRow label="Email Address" value={formData.email} name="email" isEditing={isEditing} onChange={handleInputChange} type="email" icon={<Icons.EmailIcon className="w-4 h-4"/>} />
                            <InfoRow label="Phone Number" value={formData.phone} name="phone" isEditing={isEditing} onChange={handleInputChange} type="tel" icon={<Icons.PhoneIcon className="w-4 h-4"/>} />
                            <InfoRow label="Alternate Phone" value={formData.alternatePhone} name="alternatePhone" isEditing={isEditing} onChange={handleInputChange} type="tel" icon={<Icons.PhoneIcon className="w-4 h-4"/>} />
                            <InfoRow label="Class Teacher" value={formData.classTeacher} name="classTeacher" isEditing={isEditing} onChange={handleInputChange} readOnly icon={<Icons.FacultyIcon className="w-4 h-4"/>} />
                            <InfoRow label="Department" value={formData.department} name="department" isEditing={isEditing} onChange={handleInputChange} readOnly icon={<Icons.CourseIcon className="w-4 h-4"/>} />
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* B) Family Information */}
                        <Card className="h-full">
                            <SectionHeader title="Family Details" icon={<Icons.HODIcon className="w-5 h-5" />} />
                            <div className="space-y-2">
                                <InfoRow label="Father Name" value={formData.fatherName} name="fatherName" isEditing={isEditing} onChange={handleInputChange} />
                                <InfoRow label="Father Phone" value={formData.fatherPhone} name="fatherPhone" isEditing={isEditing} onChange={handleInputChange} type="tel" />
                                <InfoRow label="Mother Name" value={formData.motherName} name="motherName" isEditing={isEditing} onChange={handleInputChange} />
                                <InfoRow label="Mother Phone" value={formData.motherPhone} name="motherPhone" isEditing={isEditing} onChange={handleInputChange} type="tel" />
                            </div>
                        </Card>

                        {/* C) Emergency Contact */}
                        <Card className="h-full border-l-4 border-l-orange-400">
                            <SectionHeader title="Emergency" icon={<div className="font-bold text-lg">!</div>} />
                            <div className="space-y-2">
                                <InfoRow label="Contact Name" value={formData.emergencyContactName} name="emergencyContactName" isEditing={isEditing} onChange={handleInputChange} />
                                <InfoRow label="Relation" value={formData.emergencyContactRelation} name="emergencyContactRelation" isEditing={isEditing} onChange={handleInputChange} />
                                <InfoRow label="Phone Number" value={formData.emergencyPhone} name="emergencyPhone" isEditing={isEditing} onChange={handleInputChange} type="tel" />
                            </div>
                        </Card>
                    </div>

                    {/* D) Address Details */}
                    <Card>
                        <SectionHeader title="Address Details" icon={<Icons.LocationMarkerIcon className="w-5 h-5" />} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-2xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-xs font-bold text-gray-400 uppercase">Current Address</span>
                                </div>
                                {isEditing ? (
                                    <textarea 
                                        className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                        rows={4}
                                        value={formData.address || ''}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        placeholder="Enter full address..."
                                    />
                                ) : (
                                    <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{student.address || 'Not provided'}</p>
                                )}
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-2xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-xs font-bold text-gray-400 uppercase">Permanent Address</span>
                                </div>
                                 {isEditing ? (
                                    <textarea 
                                        className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                        rows={4}
                                        value={formData.permanentAddress || ''}
                                        onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                                        placeholder="Enter permanent address..."
                                    />
                                ) : (
                                    <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{student.permanentAddress || 'Same as current'}</p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Academic Section - Preserved Layout */}
            {latestSemester && (
                <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Performance</h2>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-500">Semester {student.semester}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <MarksTable results={latestSemester.editableResults} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <SemesterWiseResults academicHistory={student.academicHistory} />
                                <TotalGradeDetails results={latestSemester.results} />
                            </div>
                            <GradingScale />
                        </div>
                        <div className="lg:col-span-1 space-y-8">
                            <TimetableWidget semester={student.semester} />
                            <UpcomingEvents />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentInfoPage;