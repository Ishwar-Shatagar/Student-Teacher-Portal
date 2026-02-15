
// Existing types...

export interface CieMarks {
  ia1: number;
  ia2: number;
  assignment: number;
  lab?: number;
}

export interface SubjectResult {
  code: string;
  name: string;
  marks: number;
  grade: string;
  cie?: CieMarks;
}

export interface EditableSubjectResult {
    code: string;
    name: string;
    cie1: number;
    cie2: number;
    assignment?: number; // Added for VTU IA calculation
    labInternal?: number; 
    labExternal?: number; 
    see: number;
    total: number;
    grade: string;
    status?: 'saved' | 'pending' | 'locked'; 
    lastUpdated?: string;
}

export interface SemesterResult {
  semester: number;
  sgpa: number;
  results: SubjectResult[];
  editableResults: EditableSubjectResult[];
}

export interface AttendanceRecord {
    subjectCode: string;
    subjectName: string;
    totalClasses: number;
    classesAttended: number;
}

export interface Submission {
    studentId: string;
    subjectCode: string;
    fileName: string;
    fileUrl: string;
}

export interface AssignmentFile {
    name: string;
    url: string;
    size: string;
    type: string;
}

export interface AssignmentSubmission {
    files: AssignmentFile[];
    comment: string;
    timestamp: string;
}

export interface AssignmentTarget {
    department: string;
    semester: number;
    section: string[]; // e.g. ["A", "B"]
}

export interface Assignment {
    id: string;
    title: string;
    subjectCode: string;
    subjectName: string;
    description: string;
    dueDate: string; // ISO String
    maxMarks: number;
    resources: AssignmentFile[];
    status: 'Pending' | 'Submitted' | 'Overdue' | 'Graded'; // Student view status
    grade?: number;
    feedback?: string;
    submission?: AssignmentSubmission; // Student's submission
    
    // Faculty fields
    facultyId?: string;
    targetAudience?: AssignmentTarget;
    createdAt?: string;
    allowLate?: boolean;
}

export interface StudentSubmissionEntry {
    studentId: string;
    studentName: string;
    usn: string;
    photoUrl: string;
    submissionDate?: string;
    files?: AssignmentFile[];
    status: 'Pending' | 'Submitted' | 'Late' | 'Graded';
    marks?: number;
    feedback?: string;
}

export interface Student {
  id: string; // USN
  role: 'student';
  name: string;
  profilePicUrl: string;
  department: string;
  semester: number;
  cgpa: number;
  batchYear: string;
  classTeacher: string;
  phone: string;
  alternatePhone?: string; // New
  dateOfBirth?: string; // New: YYYY-MM-DD
  bloodGroup?: string; // New
  fatherName?: string; // New
  fatherPhone: string;
  motherName?: string; // New
  motherPhone: string;
  emergencyContactName?: string; // New
  emergencyContactRelation?: string; // New
  emergencyPhone: string;
  email: string;
  address: string;
  permanentAddress: string;
  academicHistory: SemesterResult[];
  attendance: AttendanceRecord[];
  photoForTrainingUrl?: string;
}

// Enhanced ProfessionalUser for Faculty/HOD
export interface ProfessionalUser {
  id: string; // Teacher ID
  role: 'faculty' | 'admin' | 'department_head' | 'hod_principal';
  name: string;
  profilePicUrl: string;
  department: string;
  designation: string;
  email: string;
  contact: string;
  subjectsTaught: { code: string; name: string; semester: number; }[];
  classCount: number; // Live count
  avgRating: number;
  joinDate: string;
}

export interface Department {
    id: string;
    name: string;
    code: string;
    facultyCount: number;
    studentCount: number;
}

export interface FacultyAttendance {
    id: string;
    facultyId: string;
    facultyName: string;
    deptId: string;
    semester: number;
    classDate: string;
    subjectCode: string;
    section: string;
    totalStudents: number;
    presentCount: number;
}

export interface StudentAttendanceLog {
    id: string;
    studentId: string;
    subjectCode: string;
    date: string; // YYYY-MM-DD
    sessionId: string; // e.g., "09:00-10:00"
    status: 'Present' | 'Absent' | 'Late';
    method: 'manual' | 'ai';
    confidence?: number;
    timestamp: string;
}

export interface Announcement {
    id: string;
    title: string;
    body: string;
    target: string;
    date: string;
    author: string;
    urgent: boolean;
    readCount: number;
    sentCount: number;
}

export interface TeacherFeedback {
    id: string;
    name: string;
    subject: string;
}

export interface FeedbackSubmission {
    teacherId: string;
    ratings: {
        teachingStyle: number;
        communication: number;
        conceptClarity: number;
        interaction: number;
        language: number;
    };
    comment: string;
}

export interface TimetableEntry {
  subject: string;
  subjectShort: string;
  teacher: string;
  time: string;
}

export interface ExamTimetableEntry {
  date: string;
  time: string;
  subjectName: string;
  subjectCode: string;
  semester: string;
}

export interface CalendarEvent {
  date: string;
  time: string;
  title: string;
  description: string;
}

export interface MarksAuditLogEntry {
  id: string;
  timestamp: string;
  facultyId: string;
  facultyName: string;
  studentId: string;
  studentName: string;
  semester: number;
  subjectCode: string;
  subjectName: string;
  changedField: 'cie1' | 'cie2' | 'assignment' | 'see' | 'labInternal' | 'labExternal';
  oldValue: number;
  newValue: number;
}

export interface PlacementRecord {
    id: number;
    company_name: string;
    company_logo?: string;
    company_website?: string;
    year: number;
    branch: string;
    role: string | null;
    highest_package: number | null;
    average_package: number | null;
    placed_count: number;
    placement_type: 'On-Campus' | 'Off-Campus' | 'Internship' | 'PPO' | 'Pool-Campus';
    location: string | null;
    notes: string | null;
    source_page: 'placement.php' | 'placement-branch-wise.php';
}

// --- Notification System Types ---

export type NotificationType = 'attendance' | 'marks' | 'assignment' | 'announcement' | 'general';

export interface AppNotification {
    id: string;
    recipientId: string; // 'all', 'faculty', 'student', or specific ID
    recipientRole?: 'student' | 'faculty' | 'all';
    title: string;
    message: string;
    type: NotificationType;
    timestamp: string;
    isRead: boolean;
    link?: string; // For action buttons
    priority?: 'high' | 'normal';
}

export interface NotificationPreferences {
    lowAttendance: boolean; // Mandatory
    marksUpdate: boolean; // Mandatory
    assignmentReminders: boolean; // Optional
    announcements: boolean; // Mandatory
    generalAlerts: boolean; // Optional
}

// --- Leave Management Types ---

export interface LeaveRequestEmail {
    id: string;
    senderName: string;
    senderEmail: string;
    facultyId?: string; // Linked if identified
    subject: string;
    body: string;
    receivedAt: string;
    status: 'unread' | 'pending' | 'approved' | 'rejected' | 'more_info';
    attachments?: { name: string; type: string; url: string }[];
    
    // AI Parsed Data (Simulated)
    aiParsedData?: {
        leaveType: 'CL' | 'ML' | 'EL' | 'LOP';
        fromDate: string;
        toDate: string;
        days: number;
        reason: string;
        confidenceScore: number; // 0-100
    };
}

export interface LeaveHistoryEntry {
    id: string;
    leaveType: 'CL' | 'ML' | 'EL' | 'LOP';
    fromDate: string;
    toDate: string;
    days: number;
    status: 'approved' | 'rejected';
    approvedBy: string;
    reason: string;
}

export interface FacultyLeaveProfile {
    facultyId: string;
    facultyName: string;
    department: string;
    totalCL: number; // e.g., 15 per year
    takenCL: number;
    history: LeaveHistoryEntry[];
}