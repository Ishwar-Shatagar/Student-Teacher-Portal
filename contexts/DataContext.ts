
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Student, Submission, AttendanceRecord, EditableSubjectResult, ExamTimetableEntry, CalendarEvent, MarksAuditLogEntry, ProfessionalUser, Department, FacultyAttendance, Announcement, Assignment, AssignmentFile, AppNotification, NotificationPreferences, StudentSubmissionEntry, LeaveRequestEmail, FacultyLeaveProfile, StudentAttendanceLog } from '../types';
import { MOCK_STUDENTS_LIST, MOCK_FACULTY_FULL, MOCK_DEPARTMENTS, MOCK_FACULTY_ATTENDANCE, MOCK_ASSIGNMENTS, MOCK_LEAVE_EMAILS, MOCK_FACULTY_LEAVE_PROFILES } from '../data/mockData';
import { supabase } from '../services/supabaseClient';

declare const XLSX: any;

interface DataContextType {
  students: Student[];
  faculty: ProfessionalUser[];
  departments: Department[];
  attendanceRecords: FacultyAttendance[]; 
  announcements: Announcement[];
  submissions: Submission[];
  assignments: Assignment[];
  
  // Notifications
  notifications: AppNotification[];
  preferences: NotificationPreferences;
  sendNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  togglePreference: (key: keyof NotificationPreferences) => void;

  // Actions
  addSubmission: (submission: Submission) => void;
  submitAssignment: (assignmentId: string, files: AssignmentFile[], comment: string) => void;
  
  // Faculty Assignment Actions
  createAssignment: (assignment: Assignment) => void;
  deleteAssignment: (assignmentId: string) => void;
  getStudentSubmissionsForAssignment: (assignmentId: string) => StudentSubmissionEntry[];
  gradeAssignmentSubmission: (assignmentId: string, studentId: string, marks: number, feedback: string) => void;

  updateStudentAttendance: (studentId: string, subjectCode: string, newRecord: Partial<Omit<AttendanceRecord, 'subjectCode' | 'subjectName'>>) => void;
  
  // Core Idempotent Action
  submitFacultyAttendance: (facultyId: string, deptId: string, semester: number, subjectCode: string, section: string, total: number, present: number) => void;
  
  markStudentAttendance: (studentId: string, subjectCode: string, status: 'present' | 'absent' | 'late') => void;
  
  // Detailed Session Attendance
  studentAttendanceLogs: StudentAttendanceLog[];
  saveSessionAttendance: (logs: StudentAttendanceLog[], facultyId: string, deptId: string, semester: number) => void;

  setStudentTrainingPhoto: (studentId: string, photoUrl: string) => void;
  updateStudentDetails: (studentId: string, updatedDetails: Partial<Student>) => void;
  updateStudentMarks: (studentId: string, semester: number, subjectCode: string, newMarks: Partial<EditableSubjectResult>, facultyUser: ProfessionalUser) => void;
  
  examTimetable: ExamTimetableEntry[];
  setExamTimetable: (timetable: ExamTimetableEntry[]) => void;
  events: CalendarEvent[];
  setEvents: (newEvents: CalendarEvent[]) => void;
  marksAuditLog: MarksAuditLogEntry[];
  importStudentsFromExcel: (file: File) => Promise<void>;
  exportStudentsToExcel: () => void;
  
  createAnnouncement: (announcement: Announcement) => void;

  // Leave Management
  leaveEmails: LeaveRequestEmail[];
  facultyLeaveBalances: FacultyLeaveProfile[];
  approveLeaveRequest: (emailId: string, approverName: string, comments: string) => void;
  rejectLeaveRequest: (emailId: string, comments: string) => void;
  refreshLeaveEmails: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Mock Notifications
const MOCK_NOTIFICATIONS: AppNotification[] = [
    {
        id: 'notif-1',
        recipientId: 'all',
        recipientRole: 'student',
        title: 'Welcome to Academate',
        message: 'Explore your new dashboard features.',
        type: 'general',
        timestamp: new Date().toISOString(),
        isRead: false,
        priority: 'normal'
    }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // --- State Management ---
    const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS_LIST);
    const [faculty, setFaculty] = useState<ProfessionalUser[]>(MOCK_FACULTY_FULL);
    const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS);
    const [attendanceRecords, setAttendanceRecords] = useState<FacultyAttendance[]>(MOCK_FACULTY_ATTENDANCE);
    const [studentAttendanceLogs, setStudentAttendanceLogs] = useState<StudentAttendanceLog[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
    const [examTimetable, setExamTimetable] = useState<ExamTimetableEntry[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [marksAuditLog, setMarksAuditLog] = useState<MarksAuditLogEntry[]>([]);
    
    // Notifications State
    const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        lowAttendance: true,
        marksUpdate: true,
        assignmentReminders: true,
        announcements: true,
        generalAlerts: true
    });

    // Leave Management State
    const [leaveEmails, setLeaveEmails] = useState<LeaveRequestEmail[]>(MOCK_LEAVE_EMAILS);
    const [facultyLeaveBalances, setFacultyLeaveBalances] = useState<FacultyLeaveProfile[]>(MOCK_FACULTY_LEAVE_PROFILES);

    // --- FETCH DATA FROM SUPABASE ---
    useEffect(() => {
        const fetchSupabaseData = async () => {
            try {
                // Example: Fetch Students
                const { data: dbStudents, error: stuError } = await supabase.from('student_profiles').select('*');
                if (!stuError && dbStudents && dbStudents.length > 0) {
                    // Map DB structure to Student Interface here if schemas differ
                    // For now, we assume schema match or use fallback if empty
                    // setStudents(dbStudents); 
                }

                // Example: Fetch Announcements
                const { data: dbAnnouncements, error: annError } = await supabase.from('announcements').select('*');
                if (!annError && dbAnnouncements && dbAnnouncements.length > 0) {
                    setAnnouncements(dbAnnouncements);
                }

                // Example: Fetch Assignments
                const { data: dbAssignments, error: assError } = await supabase.from('assignments').select('*');
                if (!assError && dbAssignments && dbAssignments.length > 0) {
                    setAssignments(dbAssignments);
                }

            } catch (err) {
                console.error("Supabase Fetch Error (Using Mocks):", err);
            }
        };

        fetchSupabaseData();
    }, []);

    // --- Notification Logic ---

    const sendNotification = async (n: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
        const newNotification: AppNotification = {
            ...n,
            id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            isRead: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
        
        // Supabase Sync (Optional)
        await supabase.from('notifications').insert([newNotification]);
    };

    const markNotificationAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        supabase.from('notifications').update({ isRead: true }).eq('id', id);
    };

    const markAllAsRead = (userId: string) => {
        setNotifications(prev => prev.map(n => {
            if(n.recipientId === userId || n.recipientId === 'all' || n.recipientRole === 'all') {
                return { ...n, isRead: true };
            }
            return n;
        }));
    };

    const togglePreference = (key: keyof NotificationPreferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // --- Logic ---

    const submitFacultyAttendance = async (facultyId: string, deptId: string, semester: number, subjectCode: string, section: string, total: number, present: number) => {
        const today = new Date().toISOString().split('T')[0];
        const newRecord: FacultyAttendance = {
            id: `att-${Date.now()}`,
            facultyId,
            facultyName: faculty.find(f => f.id === facultyId)?.name || 'Unknown',
            deptId,
            semester,
            classDate: today,
            subjectCode,
            section,
            totalStudents: total,
            presentCount: present
        };

        setAttendanceRecords(prev => [newRecord, ...prev]);
        setFaculty(prev => prev.map(f => f.id === facultyId ? { ...f, classCount: f.classCount + 1 } : f));
        
        // Supabase Sync
        await supabase.from('faculty_attendance').insert([newRecord]);
    };

    const saveSessionAttendance = async (logs: StudentAttendanceLog[], facultyId: string, deptId: string, semester: number) => {
        if (logs.length === 0) return;

        const subjectCode = logs[0].subjectCode;
        const sessionDate = logs[0].date;
        const sessionId = logs[0].sessionId;

        setStudentAttendanceLogs(prev => {
            const filtered = prev.filter(l => !(l.subjectCode === subjectCode && l.date === sessionDate && l.sessionId === sessionId));
            return [...filtered, ...logs];
        });

        setStudents(prevStudents => prevStudents.map(student => {
            const log = logs.find(l => l.studentId === student.id);
            if (!log) return student;

            const updatedAttendance = student.attendance.map(rec => {
                if (rec.subjectCode === subjectCode) {
                    return {
                        ...rec,
                        totalClasses: rec.totalClasses + 1,
                        classesAttended: rec.classesAttended + (log.status === 'Present' || log.status === 'Late' ? 1 : 0)
                    };
                }
                return rec;
            });
            return { ...student, attendance: updatedAttendance };
        }));

        const presentCount = logs.filter(l => l.status === 'Present' || l.status === 'Late').length;
        submitFacultyAttendance(facultyId, deptId, semester, subjectCode, 'A', logs.length, presentCount);
        
        // Supabase Sync Logs
        await supabase.from('attendance_logs').upsert(logs);
    };

    const createAnnouncement = async (announcement: Announcement) => {
        setAnnouncements(prev => [announcement, ...prev]);
        await supabase.from('announcements').insert([announcement]);
        
        let recipientRole: 'all' | 'faculty' | 'student' = 'all';
        if (announcement.target === 'Faculty') recipientRole = 'faculty';
        else if (announcement.target.includes('Student')) recipientRole = 'student';

        sendNotification({
            recipientId: 'all',
            recipientRole: recipientRole,
            title: `New Announcement: ${announcement.title}`,
            message: announcement.body.substring(0, 60) + (announcement.body.length > 60 ? '...' : ''),
            type: 'announcement',
            priority: announcement.urgent ? 'high' : 'normal',
            link: '/hod/announcements'
        });
    };

    const addSubmission = (submission: Submission) => setSubmissions(prev => [...prev, submission]);
    
    const submitAssignment = async (assignmentId: string, files: AssignmentFile[], comment: string) => {
        const submissionData = { files, comment, timestamp: new Date().toISOString() };
        
        setAssignments(prev => prev.map(a => a.id === assignmentId ? { 
            ...a, 
            status: 'Submitted', 
            submission: submissionData
        } : a));

        // Supabase Sync
        // Assuming we have a submissions table
        await supabase.from('submissions').insert([{ assignment_id: assignmentId, ...submissionData }]);
    };

    const createAssignment = async (assignment: Assignment) => {
        setAssignments(prev => [assignment, ...prev]);
        await supabase.from('assignments').insert([assignment]);
        
        sendNotification({
            recipientId: 'all',
            recipientRole: 'student',
            title: `New Assignment: ${assignment.title}`,
            message: `Due: ${new Date(assignment.dueDate).toLocaleDateString()}`,
            type: 'assignment',
            link: '/assignment'
        });
    };

    const deleteAssignment = async (assignmentId: string) => {
        setAssignments(prev => prev.filter(a => a.id !== assignmentId));
        await supabase.from('assignments').delete().eq('id', assignmentId);
    };

    const getStudentSubmissionsForAssignment = (assignmentId: string): StudentSubmissionEntry[] => {
        const assignment = assignments.find(a => a.id === assignmentId);
        if (!assignment || !assignment.targetAudience) return [];

        const { department, semester } = assignment.targetAudience;
        const targetStudents = students.filter(s => s.department === department && s.semester === semester);

        return targetStudents.map(s => {
            const isSubmitted = (s.id.charCodeAt(s.id.length - 1) % 3 === 0); 
            
            return {
                studentId: s.id,
                studentName: s.name,
                usn: s.id,
                photoUrl: s.profilePicUrl,
                status: isSubmitted ? 'Submitted' : 'Pending',
                submissionDate: isSubmitted ? new Date(Date.now() - Math.random() * 86400000 * 2).toISOString() : undefined,
                marks: isSubmitted && Math.random() > 0.5 ? Math.floor(Math.random() * assignment.maxMarks) : undefined,
                files: isSubmitted ? [{ name: 'Assignment.pdf', url: '#', size: '1.2MB', type: 'application/pdf' }] : undefined
            };
        });
    };

    const gradeAssignmentSubmission = (assignmentId: string, studentId: string, marks: number, feedback: string) => {
        sendNotification({
            recipientId: studentId,
            recipientRole: 'student',
            title: 'Assignment Graded',
            message: `You received ${marks} marks. Feedback: ${feedback}`,
            type: 'assignment',
            link: '/assignment'
        });
    };

    const updateStudentAttendance = (studentId: string, subjectCode: string, newRecord: Partial<Omit<AttendanceRecord, 'subjectCode'>>) => { };

    const markStudentAttendance = (studentId: string, subjectCode: string, status: 'present' | 'absent' | 'late') => {
        if (status === 'absent') {
            // Logic handled in saveSessionAttendance
        }
    };

    const updateStudentMarks = async (studentId: string, semester: number, subjectCode: string, newMarks: Partial<EditableSubjectResult>, facultyUser: ProfessionalUser) => {
        setStudents(prevStudents => prevStudents.map(student => {
            if (student.id !== studentId) return student;

            const updatedHistory = student.academicHistory.map(hist => {
                if (hist.semester !== semester) return hist;

                const updatedResults = hist.editableResults.map(res => {
                    if (res.code !== subjectCode) return res;

                    // Audit Logs
                    Object.keys(newMarks).forEach(key => {
                        const k = key as keyof EditableSubjectResult;
                        if (k === 'status' || k === 'grade') return;
                        const oldValue = res[k] as number;
                        const newValue = newMarks[k] as number;
                        
                        if (oldValue !== newValue) {
                            const log: MarksAuditLogEntry = {
                                id: `log-${Date.now()}-${Math.random()}`,
                                timestamp: new Date().toISOString(),
                                facultyId: facultyUser.id,
                                facultyName: facultyUser.name,
                                studentId: student.id,
                                studentName: student.name,
                                semester: semester,
                                subjectCode: subjectCode,
                                subjectName: res.name,
                                changedField: k as any,
                                oldValue: oldValue || 0,
                                newValue: newValue || 0
                            };
                            setMarksAuditLog(prev => [log, ...prev]);
                            supabase.from('marks_audit_logs').insert([log]);
                        }
                    });

                    const merged = { ...res, ...newMarks };
                    const finalTotal = Math.round((merged.cie1 + merged.cie2)/2 + (merged.see/2)); 
                    return { ...merged, total: finalTotal };
                });

                return { ...hist, editableResults: updatedResults };
            });
            
            // Sync with Supabase (Update student profile JSONB - simplified approach)
            // await supabase.from('student_profiles').update({ academic_history: updatedHistory }).eq('id', student.id);
            
            return { ...student, academicHistory: updatedHistory };
        }));

        sendNotification({
            recipientId: studentId,
            recipientRole: 'student',
            title: 'Marks Updated',
            message: `${facultyUser.name} updated your marks for ${subjectCode}.`,
            type: 'marks',
            priority: 'normal',
            link: '/examination'
        });
    };

    const setStudentTrainingPhoto = (studentId: string, photoUrl: string) => {
         setStudents(prev => prev.map(s => s.id === studentId ? { ...s, photoForTrainingUrl: photoUrl } : s));
    };
  
    const updateStudentDetails = (studentId: string, updatedDetails: Partial<Student>) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, ...updatedDetails } : s));
    };

    const importStudentsFromExcel = async (file: File) => {
        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet);

                    const newStudents: Student[] = jsonData.map((row: any) => {
                        // Parse semester
                        const semStr = row['Semester'] || row['Sem'] || '1';
                        const sem = parseInt(semStr.toString().replace(/\D/g, ''), 10) || 1;

                        // Parse name
                        const name = row['Name'] || 'Unknown';

                        return {
                            id: row['USN'] || `TEMP-${Math.random().toString(36).substr(2, 9)}`,
                            role: 'student',
                            name: name,
                            profilePicUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                            department: row['Department'] || 'General',
                            semester: sem,
                            cgpa: parseFloat(row['CGPA'] || '0') || parseFloat((Math.random() * 4 + 6).toFixed(2)),
                            batchYear: row['Batch Year']?.toString() || new Date().getFullYear().toString(),
                            classTeacher: row['Class Teacher'] || 'N/A',
                            phone: row['Phone Number'] || row['Phone'] || '',
                            fatherPhone: row["Father's phone"] || '',
                            motherPhone: row["Mother's phone"] || '',
                            emergencyPhone: row["Father's phone"] || '',
                            email: row['Email'] || row['Email id'] || '',
                            address: row['Permanent address'] || '',
                            permanentAddress: row['Permanent address'] || '',
                            // Initialize with empty or mock data to avoid crashes in other views
                            academicHistory: [], 
                            attendance: [], 
                            photoForTrainingUrl: undefined
                        } as Student;
                    });

                    // Generate necessary mock data for the dashboard to function correctly with new students
                    const enrichedStudents = newStudents.map(s => {
                        // Generate mock attendance based on semester
                        const subjects = ['Mathematics', 'Core Subject 1', 'Core Subject 2', 'Lab 1', 'Elective'];
                        const attendance = subjects.map((sub, i) => ({
                            subjectCode: `SUB${s.semester}0${i+1}`,
                            subjectName: sub,
                            totalClasses: 40,
                            classesAttended: Math.floor(Math.random() * 10) + 30 // 75-100% attendance
                        }));

                        // Generate mock academic history
                        const academicHistory = [{
                            semester: s.semester,
                            sgpa: s.cgpa,
                            results: subjects.map((sub, i) => ({
                                code: `SUB${s.semester}0${i+1}`,
                                name: sub,
                                marks: Math.floor(Math.random() * 30) + 70,
                                grade: 'A'
                            })),
                            editableResults: subjects.map((sub, i) => ({
                                code: `SUB${s.semester}0${i+1}`,
                                name: sub,
                                cie1: 20, cie2: 22, assignment: 9, see: 85, total: 85, grade: 'A', status: 'saved' as const
                            }))
                        }];

                        return { ...s, attendance, academicHistory };
                    });

                    setStudents(prev => {
                        // Filter out existing students by USN to avoid duplicates
                        const existingIds = new Set(prev.map(s => s.id));
                        const uniqueNew = enrichedStudents.filter(s => !existingIds.has(s.id));
                        return [...prev, ...uniqueNew];
                    });
                    
                    alert(`Successfully imported ${enrichedStudents.length} students!`);
                    resolve();
                } catch (error) {
                    console.error("Import Error:", error);
                    alert("Failed to parse the file. Please check the format.");
                    reject(error);
                }
            };
            reader.readAsBinaryString(file);
        });
    };
    
    const exportStudentsToExcel = () => { };

    // --- Leave Management Actions ---

    const approveLeaveRequest = async (emailId: string, approverName: string, comments: string) => {
        const email = leaveEmails.find(e => e.id === emailId);
        if (!email || !email.aiParsedData || !email.facultyId) return;

        const { facultyId, aiParsedData } = email;
        const { leaveType, fromDate, toDate, days, reason } = aiParsedData;

        setLeaveEmails(prev => prev.map(e => e.id === emailId ? { ...e, status: 'approved' } : e));

        setFacultyLeaveBalances(prev => prev.map(prof => {
            if (prof.facultyId === facultyId) {
                const newHistory = {
                    id: `hist-${Date.now()}`,
                    leaveType,
                    fromDate,
                    toDate,
                    days,
                    status: 'approved' as const,
                    approvedBy: approverName,
                    reason
                };
                return {
                    ...prof,
                    takenCL: leaveType === 'CL' ? prof.takenCL + days : prof.takenCL,
                    history: [newHistory, ...prof.history]
                };
            }
            return prof;
        }));
        
        await supabase.from('leave_requests').update({ status: 'approved', approver: approverName, comments }).eq('id', emailId);
    };

    const rejectLeaveRequest = async (emailId: string, comments: string) => {
        setLeaveEmails(prev => prev.map(e => e.id === emailId ? { ...e, status: 'rejected' } : e));
        await supabase.from('leave_requests').update({ status: 'rejected', comments }).eq('id', emailId);
    };

    const refreshLeaveEmails = async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Mock new email arrival
        const newEmail: LeaveRequestEmail = {
            id: `email-${Date.now()}`,
            senderName: 'Prof. New Sender',
            senderEmail: 'new.sender@college.edu',
            facultyId: '103203',
            subject: 'Urgent CL Request',
            body: 'Requesting 1 day CL for tomorrow due to personal work.',
            receivedAt: new Date().toISOString(),
            status: 'pending',
            aiParsedData: {
                leaveType: 'CL',
                fromDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                toDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                days: 1,
                reason: 'Personal work',
                confidenceScore: 90
            }
        };
        setLeaveEmails(prev => [newEmail, ...prev]);
    };

  return React.createElement(DataContext.Provider, {
    value: { 
        students, faculty, departments, attendanceRecords, announcements, submissions, assignments,
        notifications, preferences, sendNotification, markNotificationAsRead, markAllAsRead, togglePreference,
        addSubmission, submitAssignment, updateStudentAttendance, submitFacultyAttendance, markStudentAttendance, 
        setStudentTrainingPhoto, updateStudentDetails, updateStudentMarks, 
        examTimetable, setExamTimetable, events, setEvents, marksAuditLog, 
        importStudentsFromExcel, exportStudentsToExcel, createAnnouncement,
        createAssignment, deleteAssignment, getStudentSubmissionsForAssignment, gradeAssignmentSubmission,
        leaveEmails, facultyLeaveBalances, approveLeaveRequest, rejectLeaveRequest, refreshLeaveEmails,
        studentAttendanceLogs, saveSessionAttendance
    }
  }, children);
};
