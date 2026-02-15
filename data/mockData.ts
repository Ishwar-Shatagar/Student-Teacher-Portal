
import { Student, ProfessionalUser, TeacherFeedback, SemesterResult, AttendanceRecord, EditableSubjectResult, TimetableEntry, Department, FacultyAttendance, Assignment, LeaveRequestEmail, FacultyLeaveProfile, AssignmentTarget } from '../types';

// --- 1. DEPARTMENTS ---
export const MOCK_DEPARTMENTS: Department[] = [
    { id: 'dept-1', name: 'Artificial Intelligence & Machine Learning', code: 'AIML', facultyCount: 12, studentCount: 120 },
    { id: 'dept-2', name: 'Computer Science & Engineering', code: 'CSE', facultyCount: 25, studentCount: 180 },
    { id: 'dept-3', name: 'Information Science', code: 'ISE', facultyCount: 10, studentCount: 60 },
    { id: 'dept-4', name: 'Electronics & Communication', code: 'ECE', facultyCount: 15, studentCount: 120 },
];

// --- 2. FACULTY DATA ---
export const MOCK_FACULTY_FULL: ProfessionalUser[] = [
    { 
        id: '103201', role: 'faculty', name: 'Mr. Somashekhar Dhanyal', profilePicUrl: 'https://ui-avatars.com/api/?name=Somashekhar+Dhanyal&background=random', 
        department: 'AIML', designation: 'Asst. Professor', email: 'somashekhar.d@bldeacet.ac.in', contact: '9876543201', 
        subjectsTaught: [
            { code: 'BAI701', name: 'Deep Learning', semester: 7 },
            { code: 'BAI701L', name: 'Deep Learning Lab', semester: 7 },
            { code: 'BCI515D', name: 'Image Processing', semester: 5 }, 
            { code: 'BCI586', name: 'Mini Project', semester: 5 }, 
            { code: 'BAIL504', name: 'Data Visualization Lab', semester: 5 }
        ], 
        classCount: 45, avgRating: 4.8, joinDate: '2020-01-01' 
    },
    { 
        id: '103202', role: 'faculty', name: 'Mrs. Poornima Mamadapur', profilePicUrl: 'https://ui-avatars.com/api/?name=Poornima+Mamadapur&background=random', 
        department: 'AIML', designation: 'Asst. Professor', email: 'poornima.m@bldeacet.ac.in', contact: '9876543202', 
        subjectsTaught: [
            { code: 'BAI702', name: 'Machine Learning II', semester: 7 }, 
            { code: 'BCS304', name: 'Data Structures', semester: 3 }, 
            { code: 'BCSL305', name: 'Data Structures Lab', semester: 3 }
        ], 
        classCount: 42, avgRating: 4.7, joinDate: '2020-01-01' 
    },
    { 
        id: '103203', role: 'faculty', name: 'Dr. Sumangala Biradar', profilePicUrl: 'https://ui-avatars.com/api/?name=Sumangala+Biradar&background=random', 
        department: 'AIML', designation: 'Professor', email: 'sumangala.b@bldeacet.ac.in', contact: '9876543203', 
        subjectsTaught: [
            { code: 'BCS703', name: 'Cryptography', semester: 7 }, 
            { code: 'BCSL305', name: 'Data Structures Lab', semester: 3 }
        ], 
        classCount: 38, avgRating: 4.9, joinDate: '2015-01-01' 
    },
    { 
        id: '103204', role: 'faculty', name: 'Mr. Shrinivas Amate', profilePicUrl: 'https://ui-avatars.com/api/?name=Shrinivas+Amate&background=random', 
        department: 'AIML', designation: 'Asst. Professor', email: 'shrinivas.a@bldeacet.ac.in', contact: '9876543204', 
        subjectsTaught: [
            { code: 'BCS714D', name: 'Big Data Analytics', semester: 7 }, 
            { code: 'BAIL358D', name: 'PHP Programming', semester: 3 }, 
            { code: 'BCS502', name: 'Computer Networks', semester: 5 }, 
            { code: 'BCS503', name: 'CN Lab', semester: 5 }
        ], 
        classCount: 40, avgRating: 4.6, joinDate: '2021-01-01' 
    },
    { 
        id: '103206', role: 'faculty', name: 'Dr. P. Nagathan', profilePicUrl: 'https://ui-avatars.com/api/?name=P+Nagathan&background=random', 
        department: 'AIML', designation: 'Professor', email: 'nagathan.p@bldeacet.ac.in', contact: '9876543206', 
        subjectsTaught: [{ code: 'BCS301', name: 'Maths for CS', semester: 3 }], 
        classCount: 35, avgRating: 4.5, joinDate: '2010-01-01' 
    },
    { 
        id: '103207', role: 'faculty', name: 'Dr. Veena Patil', profilePicUrl: 'https://ui-avatars.com/api/?name=Veena+Patil&background=random', 
        department: 'AIML', designation: 'Assoc. Professor', email: 'veena.p@bldeacet.ac.in', contact: '9876543207', 
        subjectsTaught: [{ code: 'BCS302', name: 'DDCO', semester: 3 }], 
        classCount: 36, avgRating: 4.7, joinDate: '2012-01-01' 
    },
    { 
        id: '103209', role: 'faculty', name: 'Mrs. P. Bandennavar', profilePicUrl: 'https://ui-avatars.com/api/?name=P+Bandennavar&background=random', 
        department: 'AIML', designation: 'Asst. Professor', email: 'bandennavar.p@bldeacet.ac.in', contact: '9876543209', 
        subjectsTaught: [{ code: 'BCS303', name: 'Operating Systems', semester: 3 }], 
        classCount: 39, avgRating: 4.6, joinDate: '2018-01-01' 
    },
    { 
        id: '103214', role: 'faculty', name: 'Ms. H. B. Biradar', profilePicUrl: 'https://ui-avatars.com/api/?name=H+B+Biradar&background=random', 
        department: 'AIML', designation: 'Asst. Professor', email: 'h.biradar@bldeacet.ac.in', contact: '9876543214', 
        subjectsTaught: [
            { code: 'BCS306A', name: 'OOP with Java', semester: 3 }, 
            { code: 'BAIL504', name: 'Data Visualization Lab', semester: 5 }
        ], 
        classCount: 41, avgRating: 4.8, joinDate: '2022-01-01' 
    },
    { 
        id: '103221', role: 'faculty', name: 'Mrs. Savitri N.', profilePicUrl: 'https://ui-avatars.com/api/?name=Savitri+N&background=random', 
        department: 'AIML', designation: 'Asst. Professor', email: 'savitri.n@bldeacet.ac.in', contact: '9876543221', 
        subjectsTaught: [{ code: 'BCS501', name: 'Software Engineering', semester: 5 }], 
        classCount: 37, avgRating: 4.5, joinDate: '2019-01-01' 
    },
    { 
        id: '103223', role: 'faculty', name: 'Ms. Hemavathi Biradar', profilePicUrl: 'https://ui-avatars.com/api/?name=Hemavathi+Biradar&background=random', 
        department: 'AIML', designation: 'Asst. Professor', email: 'hemavathi.b@bldeacet.ac.in', contact: '9876543223', 
        subjectsTaught: [{ code: 'BCS504', name: 'Theory of Computation', semester: 5 }], 
        classCount: 34, avgRating: 4.6, joinDate: '2021-01-01' 
    },
    { 
        id: '103228', role: 'faculty', name: 'Dr. N. S. Mathapathi', profilePicUrl: 'https://ui-avatars.com/api/?name=N+S+Mathapathi&background=random', 
        department: 'AIML', designation: 'Professor', email: 'mathapathi.ns@bldeacet.ac.in', contact: '9876543228', 
        subjectsTaught: [{ code: 'BRMK557', name: 'Research Methodology', semester: 5 }], 
        classCount: 32, avgRating: 4.7, joinDate: '2008-01-01' 
    },
];

export const MOCK_TEACHER = MOCK_FACULTY_FULL[0]; 
export const MOCK_TEACHERS_LIST = MOCK_FACULTY_FULL;

export const MOCK_TEACHERS_FOR_FEEDBACK: TeacherFeedback[] = MOCK_FACULTY_FULL.map(f => ({
    id: f.id,
    name: f.name,
    subject: f.subjectsTaught.length > 0 ? f.subjectsTaught[0].name : 'General'
}));

// --- 3. TIMETABLE DATA ---
export const MOCK_TIMETABLE_DATA: Record<number, Record<string, Record<string, TimetableEntry>>> = {
    3: {
        "Monday": {
            "09:00 - 10:00": { subject: "Mathematics for CS", subjectShort: "BCS301", teacher: "Dr. P. Nagathan", time: "9:00-9:55" },
            "10:00 - 11:00": { subject: "Operating Systems", subjectShort: "BCS303", teacher: "Mrs. P. Bandennavar", time: "9:55-10:50" },
            "11:15 - 12:15": { subject: "PHP Programming", subjectShort: "BAIL358D", teacher: "Mr. Shrinivas Amate", time: "11:20-12:15" },
            "02:00 - 03:00": { subject: "Mathematics for CS", subjectShort: "BCS301", teacher: "Dr. P. Nagathan", time: "2:15-3:10" },
            "03:00 - 04:00": { subject: "OOP with Java", subjectShort: "BCS306A", teacher: "Ms. H. B. Biradar", time: "3:10-4:05" }
        },
        "Tuesday": {
            "09:00 - 10:00": { subject: "Data Structures", subjectShort: "BCS304", teacher: "Mrs. Poornima Mamadapur", time: "9:00-9:55" },
            "10:00 - 11:00": { subject: "DDCO", subjectShort: "BCS302", teacher: "Dr. Veena Patil", time: "9:55-10:50" },
            "11:15 - 12:15": { subject: "Data Structures Lab", subjectShort: "BCSL305", teacher: "Mrs. Poornima Mamadapur", time: "11:20-12:15" },
            "12:15 - 01:15": { subject: "Data Structures Lab", subjectShort: "BCSL305", teacher: "Dr. Sumangala Biradar", time: "12:15-1:10" }
        },
        "Wednesday": {
             "09:00 - 10:00": { subject: "Operating Systems", subjectShort: "BCS303", teacher: "Mrs. P. Bandennavar", time: "9:00-9:55" },
             "10:00 - 11:00": { subject: "DDCO", subjectShort: "BCS302", teacher: "Dr. Veena Patil", time: "9:55-10:50" },
             "02:00 - 03:00": { subject: "Social Connect", subjectShort: "BCSK307", teacher: "Staff", time: "2:15-3:10" },
             "03:00 - 04:00": { subject: "Mathematics for CS", subjectShort: "BCS301", teacher: "Dr. P. Nagathan", time: "3:10-4:05" }
        },
        "Thursday": {
            "09:00 - 10:00": { subject: "OOP with Java", subjectShort: "BCS306A", teacher: "Ms. H. B. Biradar", time: "9:00-9:55" },
            "10:00 - 11:00": { subject: "Operating Systems", subjectShort: "BCS303", teacher: "Mrs. P. Bandennavar", time: "9:55-10:50" },
            "02:00 - 03:00": { subject: "PHP Programming", subjectShort: "BAIL358D", teacher: "Mr. Shrinivas Amate", time: "2:15-3:10" },
            "03:00 - 04:00": { subject: "Data Structures", subjectShort: "BCS304", teacher: "Mrs. Poornima Mamadapur", time: "3:10-4:05" }
        },
        "Friday": {
            "09:00 - 10:00": { subject: "DDCO", subjectShort: "BCS302", teacher: "Dr. Veena Patil", time: "9:00-9:55" },
            "10:00 - 11:00": { subject: "Mathematics for CS", subjectShort: "BCS301", teacher: "Dr. P. Nagathan", time: "9:55-10:50" },
            "11:15 - 12:15": { subject: "OOP with Java Lab", subjectShort: "BCS306A", teacher: "Ms. H. B. Biradar", time: "11:20-12:15" },
            "12:15 - 01:15": { subject: "OOP with Java Lab", subjectShort: "BCS306A", teacher: "Ms. H. B. Biradar", time: "12:15-1:10" }
        }
    },
    5: {
        "Monday": {
            "09:00 - 10:00": { subject: "Research Methodology", subjectShort: "BRMK557", teacher: "Dr. N. S. Mathapathi", time: "9:00-9:55" },
            "10:00 - 11:00": { subject: "Theory of Computation", subjectShort: "BCS504", teacher: "Ms. Hemavathi Biradar", time: "9:55-10:50" },
            "11:15 - 12:15": { subject: "Software Engineering", subjectShort: "BCS501", teacher: "Mrs. Savitri N.", time: "11:20-12:15" }
        },
        "Tuesday": {
            "09:00 - 10:00": { subject: "Computer Networks", subjectShort: "BCS502", teacher: "Mr. Shrinivas Amate", time: "9:00-9:55" },
            "10:00 - 11:00": { subject: "Research Methodology", subjectShort: "BRMK557", teacher: "Dr. N. S. Mathapathi", time: "9:55-10:50" },
            "02:00 - 03:00": { subject: "Image Processing", subjectShort: "BCI515D", teacher: "Mr. Somashekhar Dhanyal", time: "2:15-3:10" },
            "03:00 - 04:00": { subject: "Image Processing", subjectShort: "BCI515D", teacher: "Mr. Somashekhar Dhanyal", time: "3:10-4:05" }
        },
        "Wednesday": {
            "09:00 - 10:00": { subject: "Computer Networks", subjectShort: "BCS502", teacher: "Mr. Shrinivas Amate", time: "9:00-9:55" },
            "10:00 - 11:00": { subject: "Research Methodology", subjectShort: "BRMK557", teacher: "Dr. N. S. Mathapathi", time: "9:55-10:50" },
            "11:15 - 12:15": { subject: "Data Visualization Lab", subjectShort: "BAIL504", teacher: "Ms. H. B. Biradar", time: "11:20-12:15" }
        },
        "Thursday": {
             "09:00 - 10:00": { subject: "EVS", subjectShort: "BCS508", teacher: "Mr. Raju Lagali", time: "9:00-9:55" },
             "10:00 - 11:00": { subject: "Computer Networks Lab", subjectShort: "BCS503", teacher: "Mr. Shrinivas Amate", time: "9:55-10:50" },
             "11:15 - 12:15": { subject: "Theory of Computation", subjectShort: "BCS504", teacher: "Ms. Hemavathi Biradar", time: "11:20-12:15" }
        },
        "Friday": {
             "09:00 - 10:00": { subject: "Software Engineering", subjectShort: "BCS501", teacher: "Mrs. Savitri N.", time: "9:00-9:55" },
             "10:00 - 11:00": { subject: "Mini Project", subjectShort: "BCI586", teacher: "Mr. Somashekhar Dhanyal", time: "9:55-10:50" },
             "11:15 - 12:15": { subject: "Software Engineering", subjectShort: "BCS501", teacher: "Mrs. Savitri N.", time: "11:20-12:15" }
        }
    }
};

export const MOCK_TIME_SLOTS = ["09:00 - 10:00", "10:00 - 11:00", "11:15 - 12:15", "12:15 - 01:15", "02:00 - 03:00", "03:00 - 04:00", "04:00 - 05:00"];

// --- 4. STUDENT DATA GENERATOR ---

const getSubjectsForSem = (sem: number): EditableSubjectResult[] => {
    if (sem === 3) {
        return [
            { code: 'BCS301', name: 'Mathematics for Computer Science', cie1: 22, cie2: 20, assignment: 9, see: 85, total: 45, grade: 'A', status: 'saved' },
            { code: 'BCS302', name: 'Digital Design & Comp Org', cie1: 18, cie2: 21, assignment: 8, see: 70, total: 40, grade: 'B+', status: 'saved' },
            { code: 'BCS303', name: 'Operating Systems', cie1: 23, cie2: 24, assignment: 10, see: 90, total: 50, grade: 'S', status: 'saved' },
            { code: 'BCS304', name: 'Data Structures and Applications', cie1: 20, cie2: 22, assignment: 9, see: 75, total: 42, grade: 'A', status: 'saved' },
            { code: 'BCS306A', name: 'OOP WITH JAVA', cie1: 24, cie2: 23, assignment: 10, see: 88, total: 49, grade: 'S', status: 'saved' },
            { code: 'BAIL358D', name: 'PHP Programming', cie1: 21, cie2: 20, assignment: 9, see: 80, total: 44, grade: 'A', status: 'saved' }
        ];
    }
    if (sem === 5) {
        return [
             { code: 'BCS501', name: 'Software Engineering & PM', cie1: 22, cie2: 23, assignment: 9, see: 82, total: 47, grade: 'A', status: 'saved' },
             { code: 'BCS502', name: 'Computer Networks', cie1: 20, cie2: 21, assignment: 8, see: 76, total: 43, grade: 'B+', status: 'saved' },
             { code: 'BCS503', name: 'Computer Networks Lab', cie1: 24, cie2: 25, assignment: 10, see: 92, total: 50, grade: 'S', status: 'saved' },
             { code: 'BCS504', name: 'Theory of Computation', cie1: 19, cie2: 20, assignment: 9, see: 70, total: 40, grade: 'B+', status: 'saved' },
             { code: 'BCI515D', name: 'Image and Video Processing', cie1: 23, cie2: 22, assignment: 10, see: 88, total: 48, grade: 'S', status: 'saved' },
             { code: 'BRMK557', name: 'Research Methodology and IPR', cie1: 21, cie2: 21, assignment: 9, see: 78, total: 45, grade: 'A', status: 'saved' },
             { code: 'BCI586', name: 'Mini Project', cie1: 24, cie2: 24, assignment: 10, see: 90, total: 49, grade: 'S', status: 'saved'}
        ];
    }
    return [];
};

const getAttendanceForSem = (sem: number): AttendanceRecord[] => {
    const subjects = getSubjectsForSem(sem);
    return subjects.map(sub => ({
        subjectCode: sub.code,
        subjectName: sub.name,
        totalClasses: 45, 
        classesAttended: Math.floor(45 * (0.75 + Math.random() * 0.25)) // Random between 75-100%
    }));
};

// Helper for creating students
const createStudent = (
    id: string, 
    name: string, 
    sem: number, 
    email: string, 
    phone: string, 
    fatherPhone: string, 
    address: string, 
    classTeacher: string
): Student => ({
    id: id,
    role: 'student',
    name: name,
    profilePicUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
    department: 'AIML',
    semester: sem,
    cgpa: parseFloat((7.5 + Math.random() * 2.4).toFixed(2)),
    batchYear: sem === 3 ? '2024-28' : '2023-27',
    classTeacher: classTeacher,
    phone: phone,
    alternatePhone: '9988776655', // Default dummy
    dateOfBirth: '2003-05-15', // Default dummy
    bloodGroup: 'B+', // Default dummy
    fatherName: 'Father Name', // Default dummy
    fatherPhone: fatherPhone,
    motherName: 'Mother Name', // Default dummy
    motherPhone: '9900000000',
    emergencyContactName: 'Father Name', // Default dummy
    emergencyContactRelation: 'Father', // Default dummy
    emergencyPhone: fatherPhone,
    email: email,
    address: address,
    permanentAddress: address,
    academicHistory: [
        {
            semester: sem,
            sgpa: parseFloat((7.0 + Math.random() * 2.9).toFixed(2)),
            results: getSubjectsForSem(sem).map(s => ({ code: s.code, name: s.name, marks: s.see, grade: s.grade })),
            editableResults: getSubjectsForSem(sem)
        }
    ],
    attendance: getAttendanceForSem(sem)
});

// MOCK_STUDENTS_LIST with Real Data from User
export const MOCK_STUDENTS_LIST: Student[] = [
    // --- 5th SEMESTER ---
    createStudent("2BL23CI001", "ABHILASH HOLIKATTI", 5, "abhilashholikatti@gmail.com", "91-7411145975", "9901536552", "JADARA GALLI STATION ROAD VIJAYAPUR PIN CODE 586104", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI002", "AFIYA BABARCHI", 5, "aafiyababarchi@gmail.com", "91-9353415600", "8951788809", "D/O ATHIK J M ROAD NEAR JUMA MASJID VTC BIJAPUR PIN CODE 586104", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI003", "ANKITA PUJARI", 5, "ankitapujari003@gmail.com", "91-7483126877", "9880157242", "D/O: ANAND, WARD NO.14 , C/O M K MASKI , SHAPETI, BIJAPUR , KARNATAKA", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI004", "APARNA L MANDALAPURE", 5, "aparnamandlapure42@gmail.com", "91-9113637517", "9019753979", "H NO 82 KABADE LAYOUT NEAR HANUMAN MANDIR ALAMEEN MEDICAL COLLEGE ATHANI ROAD VIJAYAPUR 586103", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI005", "APOORVA GOUNDI", 5, "apoorvagoundi13@gmail.com", "91-9632760563", "9380741233", "SHIKHARKHANE, STATION BACK ROAD, VIJAYAPUR - 586101", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI006", "ASHWINI JANGAMSHETTI", 5, "max.jagadish@gmail.com", "91-9113244824", "6362482507", "C/O PRAKASH JANGAMSHETTI WARD NO 24KAMANAKHAN BAZAR BIJAPUR", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI007", "BABALESHWAR RITIKA MOHAN", 5, "ritikababaleshwar2005@gmail.com", "91-6362356553", "7977848691", "C/O MOHAN BABALSHWAR ,WARD NO 18 NEAR GOLGUMBAZ,MAHADWAR ROAD,BIJAPUR,VIJAYAPUR", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI008", "CHAITRA MURGOD", 5, "chaitramurgod@gmail.com", "91-9742162007", "9742162007", "NEAR ISHWAR TEMPLE NEELA NAGAR ASHRAM ROAD BIJAPUR", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI009", "DARSHAN WALI", 5, "darshanwali3023@gmail.com", "91-8088356994", "9538038049", "S/O RAJASHEKHAR NH 13 BY PASS ROAD, INDI CROSS ROAD, GIRIMALLESHWAR SOCIETY, VIJAYAPUR - 586104", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI010", "DATTA KAMBAGI", 5, "dattakambagi021@gmail.com", "91-7019179574", "9731485237", "DATTA KAMBAGI, S/O. BHIMANNA KAMBAGI, STATION ROAD, NEAR GOLGUMBAZ, BENDIGERI GALLI, VIJAYAPUR - 586104.", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI011", "DEEKSHA NAYAKODI", 5, "deekshanayakodi@gmail.com", "91-7892456083", "9448782232", "D/O MALLIKARJUN WARD NO 21 B BAGEWADI ROAD IBRAHIMPUR VIJAYAPUR", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI012", "GANESH GOULI", 5, "ganeshgouli204@gamil.com", "91-7259710424", "9945502072", "S/O GOPAL SATHE H NO 68-57/2 CHAMUNDESHWARI NAGAR JALGHAR ONI SHAHAPUR CITY YADGIR 585223", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI013", "GOURAMMA HALANGALI", 5, "sidarayappahalangali@gmail.com", "91-7619495015", "9900180059", "AT/POST:CHIMMAD TQ:JAMKHANDI DIS:BAGALKOT 587312", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI014", "HUSNA BAGALKOT", 5, "bagalkothusna@gmail.com", "91-8088039612", "9448209948", "MATIN MANZIL, MUSTAFA COLONY NEAR DHANWANTRY HOSPITAL, VIJAYAPUR", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI015", "ISHWAR SHATAGAR", 5, "shatagar07ishwar@gmail.com", "91-7483035478", "9343707502", "HAKEEM CHOWK NEAR SHANTI NAGAR HOUSE NO 160 VIJAYAPUR PIN CODE 586104", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI016", "JANHAVI VIJAYKUMAR GUNAKI", 5, "janhavigunaki@gmail.com", "91-9008238699", "9008238699", "NEHURU NAGAR, BESIDE GANESHA TEMPLE,GYANG BOUDI,BIJAYPUR", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI017", "LAXMI HALLI", 5, "laxmihalli2005@gmail.com", "91-8310332918", "8892729184", "D/O NANDABASAPPA HALLI WARD NO 21 HOUSE NO 123 BASAVAN BAGEWADI ROAD IBRAHIMPUR VIJAYAPUR 586109", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI018", "LAXMI M BIRADAR", 5, "laxmimb1907@gmail.com", "91-9538049128", "9611902377", "D/O MALLIKARJUN C BIRADAR, C/O B A PATIL, RAJ LAXMI NIWAS, PLOT NO 59, PAREKH NAGAR, NEAR ASHRAM, VIJAYAPURA - 586103", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI019", "LAXMI NANDABASU TELASANG", 5, "nanadutelasang@gmail.com", "91-7892530473", "7892530473", "D/O NANDABASU TELASANG B BAGEWADI ROAD IBRAHIMPUR VIJAYAPUR", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI020", "MADHUVAN SANGAPPA METRI", 5, "s4metri@gmail.com", "91-9480567219", "9448245680", "C/O SANGAPPA H.NO 13 BANKARS COLONY SOLAPUR ROAD VIJAYAPURA PIN 586103", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI021", "MADIVAL MALLAPPA SAJJAN", 5, "madivalappasajjan23@gmail.com", "91-7975234823", "8495845044", "S/O MALLAPPA TQ BABALESHAWAR BOLA CHIKKLAKI VIJAYAPUR 586125", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI022", "MAHEROZ KAZI", 5, "maherozkazi07@gmail.com", "91-9353444361", "9035068842", "J.M ROAD BAGAYAT GALLI BIJAPUR BIJAPUR RAILWAY STATION ,BJAPUR,VIJAYPURA,KARNATAKA-586104", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI023", "MALLANAGOUD GOUDAPPAGOUD PATIL", 5, "mallupatil1817@gmail.com", "91-8147745783", "9448250433", "S/O:GOUDAPPAGOUD PATIL SOLAPUR ROAD BEHIND B L D E A LADIES HOSTEL (MEDICAL) BIJAPUR", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI024", "MANASA SHIVASHANKAR HALAGALI", 5, "manasahalagali3@gmail.com", "91-7795343404", "9482630990", "KALIKA NAGAR, ASHRAM ROAD, VIJAYAPUR - 586103", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI025", "MANOJ R AKKI", 5, "manojakki95@gmail.com", "91-6360908030", "6363864279", "WARD NO. 04 ASHRAM ROAD , AKKI COLONY , VIJAYAPUR", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI026", "NANDINI PATIL", 5, "patilnandiniv85@gmail.com", "91-8867247993", "9113516148", "AKKI COLONY,ASHRAM ROAD,VIJAYAPURA,586103", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI027", "NIRMAL HOTAKAR", 5, "nirmalhotakar@gmail.com", "91-8660106461", "9900693863", "PLOT NO 201, OPP AMC, NEAR NEELANKESHWAR SAMUDAY BHAVAN, AMBEDKAR COLONY, ATHANI ROAD, VIJAYAPURA -586108", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI028", "OM VEERKAR", 5, "veerkarom3@gmail.com", "91-6362448695", "9845635415", "OM VEERKAR, S/O SHREEMANTH VEERKAR, INDI ROAD, RAJAPUT GALLI, VIJAYAPUR", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI030", "PRAJWAL PATIL", 5, "prajwaldante9888@gmail.com", "91-9845959614", "8139914888", "POLICE HEADQUARTERS WATER TANK NEAR SHIVAJI CIRCLE , VIJAYAPURA 586102", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI029", "PRAJWAL IRAPPA WADED", 5, "prajwalwaded7@gmail.com", "91-9482248341", "9482248341", "S/O IRANNA WADED MAHAL BAGAYAT DARGA VIJAYAPUR", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI031", "PRAJWAL S BASHETTI", 5, "prajwalbashetti81@gmail.com", "91-7892529897", "9663617140", "AT VIJAYAPURA. GANESH NAGAR NEAR TO THE CANARA BANK .", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI032", "PREMKUMAR HALLI", 5, "premkumarhalli@gmail.com", "91-9110613635", "7760955707", "TEACHER'S COLONY , MUDHOL-587313", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI033", "PRIYA ANIL KALBURGI", 5, "priyakalburgi14@gmail.com", "91-7624994091", "9964460719", "NEAR RAM MANDIR TEMPLE, BIJAPUR", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI034", "RADHIKA APPASAB PATIL", 5, "radhikapatil37011@gmail.com", "91-7795110229", "8970316886", "FARIDKHANAWADI DIST- BELAGAVI, KARNATAKA", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI035", "RAHUL CHANNAPPA DALAWAI", 5, "rahuldalawai515@gmail.com", "91-6363849005", "7829753998", "AT POST; SIDDAPUR(A) ,VIJAYAPURA ,KARNATAKA 586104", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI036", "RAHUL HANAMANT NAGANASOOR", 5, "rahulnaganasur@gmail.com", "91-9482470406", "9880056368", "AT POST CHANDAKAVATHE TQ SINDAGI DIST VIJAYAPUR", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI037", "ROHAN SURESH RATHOD", 5, "rohansureshrathod@gmail.com", "91-7795127404", "9900286955", "chalukya nagar siddhivinay colony plot number 18 vijaypur", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI038", "RUTU BASAVARAJ KAMADAL", 5, "rutukamadal@gmail.com", "91-6363142705", "9448418481", "D/O BASAVARAJ KAMADAL HOUSE NO 761 VIVEK NAGAR WEST JALNAGAR VIJAYAPURA", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI039", "SAFANA LASHKARI", 5, "safanalashkari447@gmail.com", "91-9880971950", "9880971950", "42 NAVARASPUR EXTENSION , NEAR IBRAHIMPUR RAILWAY STATION , VIJAYAPUR", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI040", "SAGAR NIKKAM", 5, "sagarnikkam2005@gmail.com", "91-7349075412", "9482400939", "S/O LAXMAN NIKKAM, AT/PO; DEGINAL, TQ: INDI, DT: VIJAYAPURA - 586117.", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI041", "SAMARTH SHIVASHANKAR DUTTARGAVI", 5, "samarthduttargavi@gmail.com", "91-8105858648", "9448232013", "S S DUTTARGAVI, HOUSE NO 16, GADAGI LAYOUT, NEAR GANESH NAGAR, VIJAYAPUR, PINCODE: 586101", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI042", "SANDESH BASAVARAJ PRADHANI", 5, "sandeshpradhani2004@gmail.com", "91-8867392986", "8073356677", "C/O: BASAVARAJ PRADHANI, VIJAYAPUR ROAD, SANTESH NAGAR, NEAR BASAVA TEMPLE , INDI, VIJAYAPUR, KARNATAKA-586209", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI043", "SANIYA MURASHA MULLA", 5, "aman7483444@gmail.com", "91-9881539625", "7349400402", "House no 74 Ibrahimpur petha bijapur 586101 karnataka", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI044", "SAVITRI KULLOLLI", 5, "savitrikullolli@gmail.com", "91-8217606980", "9611272520", "AT, POST: BIJJARAGI, TAL: TIKOTA, DIST: VIJAYAPUR", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI045", "SHAMBHAVI S BIRADAR", 5, "biradarshambhavi196@gmail.com", "91-9353994277", "9449500154", "PLOT NO 79,80, ASHRAM ROAD, BAGALAKOTKAR LAY OUT, AISHWARYA NAGAR, VIJAYAPURA", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI046", "SHRADDA LONI", 5, "shraddhaloni93@gmail.com", "91-8217280949", "9741206509", "D/O SIDDANNA LONI, AT/PO: BIJJARAGI, TQ:TIKOTA, DT:VIJAYAPURA - 586114.", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI047", "SHREYAS MUTTAPPA SANTI", 5, "santishreyas@gmail.com", "91-9606376500", "9916689206", "SHREYAS SANTI S/O MUTTAPPA SANTI, BEHIND BARAMAPPA TEMPLE KURUBAR GALLI. HALEPETH, TERDAL PO TERDAL-587315 TQ-RABAKAVI-BANAHATTI DIST-BAGALKOT", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI048", "SOUMYA CHANNABASAPPA SOLAPUR", 5, "soumyasolapur111@gmail.com", "91-8088780667", "9980127499", "NEW BLDE M B PATIL NAGAR,SOLAPUR ROAD, VIJAYAPUR-586101", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI049", "SUHAS KANNUR", 5, "kannursuhas@gmail.com", "91-9071900326", "8431117475", "#20, SHREYASSU NILAYA, NEAR ASHRAM, VIJAYAPURA", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI050", "SUSHMITA BIJAPUR", 5, "sushmitabijapur97@gmail.com", "91-7338646682", "9035281472", "D/O S R BIJAPUR H.NO. 215, SANGAMANATH NILAYA VIVEK NAGAR WEST, NEAR BDA GARDEN VIJAYAPUR 586 101", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI051", "TOUQEER MOHAMMAD JUNEDI", 5, "touqeerjunedi@gmail.com", "91-9611646066", "9606870818", "JUNED SANI DARGA, GYANG BOWADI,VIJAYPURA,KARNATAKA,586101", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI052", "VAIBHAV SHANKARAPPA BHAJANTRI", 5, "vaibhavbajantri944@gmail.com", "91-8762579444", "8867106635", "J M Road KHB Colony EWS House No 114 Vijayapura - 586104", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI053", "VAIBHAVI V P", 5, "vaibhavivpmath@gmail.com", "91-8088563551", "9483317551", "H NO 2-274/2 NEAR HANUMAN TEMPLE JAGAT GULBARGA 585101", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI054", "VIDYALAXMI HITNALLI", 5, "skhitnalli1976@gmail.com", "91-9730815766", "9730815766", "A/P JADAR BOBALAD TAL JATH DIST SANGLI PIN-416413", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI055", "VIKAS M MATH", 5, "vikasmath35@gmail.com", "91-8310988995", "9164057665", "C/O MAHESH MATH GANGANAHALLI VIJAYAPUR PIN CODE 586215", "Mr. Shrinivas Amate"),
    createStudent("2BL23CI056", "VINUT SHANKAR PATROT", 5, "vinutpatrot1@gamil.com", "91-7353696591", "9880149698", "VINUT SHANKAR PATROT HOUSE NO 116 K.S.R.T.C COLONY TORAVI ROAD VIJAYAPUR", "Mr. Shrinivas Amate"),

    // --- 3rd SEMESTER ---
    createStudent("2BL23CI054", "Vidyalaxmi Hitnalli", 3, "vidyalaxmi.hitnalli@bldeacet.ac.in", "9900000001", "9900000001", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI001", "Abhishek Biradar", 3, "abhishek.biradar@bldeacet.ac.in", "9900000002", "9900000002", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI002", "Aishwarya Masali", 3, "aishwarya.masali@bldeacet.ac.in", "9900000003", "9900000003", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI004", "Akash Biradar Patil", 3, "akash.patil@bldeacet.ac.in", "9900000004", "9900000004", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI005", "Akshata Telasang", 3, "akshata.telasang@bldeacet.ac.in", "9900000005", "9900000005", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI006", "Aliya Yarnal", 3, "aliya.yarnal@bldeacet.ac.in", "9900000006", "9900000006", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI008", "Ayan Borgi", 3, "ayan.borgi@bldeacet.ac.in", "9900000007", "9900000007", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI009", "Bhagyashree.Vittal Biradar", 3, "bhagyashree.biradar@bldeacet.ac.in", "9900000008", "9900000008", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI010", "Bharat Kirasur", 3, "bharat.kirasur@bldeacet.ac.in", "9900000009", "9900000009", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI011", "Bhoomika Rohite", 3, "bhoomika.rohite@bldeacet.ac.in", "9900000010", "9900000010", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI012", "Diya Runwal", 3, "diya.runwal@bldeacet.ac.in", "9900000011", "9900000011", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI013", "Harish G Uttur", 3, "harish.uttur@bldeacet.ac.in", "9900000012", "9900000012", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI014", "Karthik S Gadyal", 3, "karthik.gadyal@bldeacet.ac.in", "9900000013", "9900000013", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI015", "Khushi Waghamore", 3, "khushi.waghamore@bldeacet.ac.in", "9900000014", "9900000014", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI017", "Laxmi", 3, "laxmi@bldeacet.ac.in", "9900000015", "9900000015", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI019", "Mallanna", 3, "mallanna@bldeacet.ac.in", "9900000016", "9900000016", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI020", "Mallika.R.Nadagouda", 3, "mallika.nadagouda@bldeacet.ac.in", "9900000017", "9900000017", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI021", "Mehak Jain", 3, "mehak.jain@bldeacet.ac.in", "9900000018", "9900000018", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI024", "Sami Mujawar", 3, "sami.mujawar@bldeacet.ac.in", "9900000019", "9900000019", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI025", "Naveen Prakash Hadakar", 3, "naveen.hadakar@bldeacet.ac.in", "9900000020", "9900000020", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI027", "Omsai Shrikant Kannur", 3, "omsai.kannur@bldeacet.ac.in", "9900000021", "9900000021", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI028", "Parshuram prajapati", 3, "parshuram.prajapati@bldeacet.ac.in", "9900000022", "9900000022", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI029", "Parshwanath onakudari", 3, "parshwanath.onakudari@bldeacet.ac.in", "9900000023", "9900000023", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI030", "Pavan Akhandappa madar", 3, "pavan.madar@bldeacet.ac.in", "9900000024", "9900000024", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI031", "Pooja maruti rathod", 3, "pooja.rathod@bldeacet.ac.in", "9900000025", "9900000025", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI032", "Pooja Nimadar", 3, "pooja.nimadar@bldeacet.ac.in", "9900000026", "9900000026", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI033", "Prachi Jamadar", 3, "prachi.jamadar@bldeacet.ac.in", "9900000027", "9900000027", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI035", "Prajwal Vithal Bagewadi", 3, "prajwal.bagewadi@bldeacet.ac.in", "9900000028", "9900000028", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI036", "Preksha Jain", 3, "preksha.jain@bldeacet.ac.in", "9900000029", "9900000029", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI037", "Priyanka somanath salotagi", 3, "priyanka.salotagi@bldeacet.ac.in", "9900000030", "9900000030", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI038", "Rakshita Ramachandra Badiger", 3, "rakshita.badiger@bldeacet.ac.in", "9900000031", "9900000031", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI039", "Rohan Ravi Kumbar", 3, "rohan.kumbar@bldeacet.ac.in", "9900000032", "9900000032", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI041", "Rutesh chavan", 3, "rutesh.chavan@bldeacet.ac.in", "9900000033", "9900000033", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI042", "Safura Sajjade", 3, "safura.sajjade@bldeacet.ac.in", "9900000034", "9900000034", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI043", "Sanjana Dashyal", 3, "sanjana.dashyal@bldeacet.ac.in", "9900000035", "9900000035", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI045", "Shravan Shamarao Naik", 3, "shravan.naik@bldeacet.ac.in", "9900000036", "9900000036", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI046", "Shreelaxmi hirandagi", 3, "shreelaxmi.hirandagi@bldeacet.ac.in", "9900000037", "9900000037", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI047", "Shreya", 3, "shreya@bldeacet.ac.in", "9900000038", "9900000038", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI050", "Shrin S Bagali", 3, "shrin.bagali@bldeacet.ac.in", "9900000039", "9900000039", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI052", "Sneha M Shapurkar", 3, "sneha.shapurkar@bldeacet.ac.in", "9900000040", "9900000040", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI053", "Sohel Maniyar", 3, "sohel.maniyar@bldeacet.ac.in", "9900000041", "9900000041", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI054", "Srushti Sonwalkar", 3, "srushti.sonwalkar@bldeacet.ac.in", "9900000042", "9900000042", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI055", "Sudarshan S Sarwad", 3, "sudarshan.sarwad@bldeacet.ac.in", "9900000043", "9900000043", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI056", "Swaleha Yadgir", 3, "swaleha.yadgir@bldeacet.ac.in", "9900000044", "9900000044", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI057", "Tanuja Sakule", 3, "tanuja.sakule@bldeacet.ac.in", "9900000045", "9900000045", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI058", "Tasmiyanaaz S Inamdar", 3, "tasmiyanaaz.inamdar@bldeacet.ac.in", "9900000046", "9900000046", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI059", "Tejaswini Ganapati Thakkannavar", 3, "tejaswini.thakkannavar@bldeacet.ac.in", "9900000047", "9900000047", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI060", "Vatsala Korabu", 3, "vatsala.korabu@bldeacet.ac.in", "9900000048", "9900000048", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI061", "Venkatesh patil", 3, "venkatesh.patil@bldeacet.ac.in", "9900000049", "9900000049", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI062", "Vikas M Ambali", 3, "vikas.ambali@bldeacet.ac.in", "9900000050", "9900000050", "Vijayapura", "Dr. P. Nagathan"),
    createStudent("2BL24CI063", "Zoya Fatima M Bagali", 3, "zoya.bagali@bldeacet.ac.in", "9900000051", "9900000051", "Vijayapura", "Dr. P. Nagathan"),
];

export const MOCK_STUDENT = MOCK_STUDENTS_LIST[0];

// --- 5. ASSIGNMENTS & OTHER DATA ---

export const MOCK_ASSIGNMENTS: Assignment[] = [
    {
        id: 'assign-301',
        title: 'PHP Lab Experiment 1',
        subjectCode: 'BAIL358D',
        subjectName: 'PHP Programming',
        description: 'Write a PHP program to check if a number is prime.',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        maxMarks: 10,
        resources: [],
        status: 'Pending',
        facultyId: '103204', // Mr. Shrinivas Amate
        targetAudience: { department: 'AIML', semester: 3, section: ['A'] },
        createdAt: new Date().toISOString()
    },
    {
        id: 'assign-501',
        title: 'CN Lab: Socket Programming',
        subjectCode: 'BCS503',
        subjectName: 'Computer Networks Lab',
        description: 'Implement TCP/IP socket communication using Python/Java.',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        maxMarks: 15,
        resources: [],
        status: 'Pending',
        facultyId: '103204', // Mr. Shrinivas Amate
        targetAudience: { department: 'AIML', semester: 5, section: ['A'] },
        createdAt: new Date().toISOString()
    },
    {
        id: 'assign-502',
        title: 'Image Processing: Histogram Equalization',
        subjectCode: 'BCI515D',
        subjectName: 'Image and Video Processing',
        description: 'Perform histogram equalization on a grayscale image using MATLAB/Python.',
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        maxMarks: 20,
        resources: [],
        status: 'Pending',
        facultyId: '103201', // Mr. Somashekhar Dhanyal
        targetAudience: { department: 'AIML', semester: 5, section: ['A'] },
        createdAt: new Date().toISOString()
    }
];

export const MOCK_FACULTY_ATTENDANCE: FacultyAttendance[] = [
    { id: '1', facultyId: '103201', facultyName: 'Mr. Somashekhar Dhanyal', deptId: 'AIML', semester: 5, classDate: '2024-02-10', subjectCode: 'BCI515D', section: 'A', totalStudents: 60, presentCount: 55 },
];

export const MOCK_LEAVE_EMAILS: LeaveRequestEmail[] = [
    {
        id: 'email-001',
        senderName: 'Mrs. Poornima Mamadapur',
        senderEmail: 'poornima.m@bldeacet.ac.in',
        facultyId: '103202',
        subject: 'Request for CL',
        body: 'Respected Sir, requesting 1 day CL.',
        receivedAt: new Date().toISOString(),
        status: 'pending',
        aiParsedData: { leaveType: 'CL', fromDate: '2024-02-15', toDate: '2024-02-15', days: 1, reason: 'Personal', confidenceScore: 95 }
    }
];

export const MOCK_FACULTY_LEAVE_PROFILES: FacultyLeaveProfile[] = MOCK_FACULTY_FULL.map(f => ({
    facultyId: f.id,
    facultyName: f.name,
    department: f.department,
    totalCL: 15,
    takenCL: Math.floor(Math.random() * 5),
    history: []
}));

export const MOCK_CLASS_AVG_SGPA = [ { semester: 3, avgSgpa: 7.5 }, { semester: 5, avgSgpa: 7.8 } ];