export interface FacultyMember {
    name: string;
    designation: string;
    qualification: string;
    specialization: string;
    imageUrl: string;
}

export interface Lab {
    name: string;
    description: string;
    equipment: string[];
    imageUrl?: string;
}

export interface Curriculum {
    [semester: string]: string[];
}

export interface Department {
    id: string;
    name: string;
    fullName: string;
    tagline: string;
    overview: string;
    vision: string;
    mission: string[];
    peos: string[];
    psos: string[];
    programOutcomes: string[];
    hod: {
        name: string;
        qualification: string;
        message: string;
        imageUrl: string;
    };
    faculty: FacultyMember[];
    labs: Lab[];
    curriculum: Curriculum;
    achievements: string[];
    kpis: {
        intake: number;
        duration: string;
        labsCount: number;
    };
}

export const DEPARTMENTS_DATA: Department[] = [
    {
        id: 'aiml',
        name: 'AI & ML',
        fullName: 'Artificial Intelligence & Machine Learning',
        tagline: 'Shaping the Future with Intelligent Systems',
        overview: 'The Department of Artificial Intelligence and Machine Learning was established in the year 2020. We offer a 4-year B.E. degree program with an annual intake of 60 students. Our department is dedicated to producing top-tier engineers equipped with the latest knowledge in AI and ML, ready to tackle the challenges of the modern world.',
        vision: 'To be a center of excellence in Artificial Intelligence and Machine Learning education and research, producing globally competent professionals who are innovative, ethical, and socially responsible.',
        mission: [
            'To provide a strong theoretical and practical foundation in AI & ML through a comprehensive curriculum and state-of-the-art facilities.',
            'To foster innovation and research by collaborating with industries and research organizations.',
            'To inculcate professional ethics, leadership qualities, and a sense of social responsibility in our students.',
        ],
        peos: [
            'Graduates will have successful careers in AI, ML, and related fields.',
            'Graduates will engage in lifelong learning and adapt to technological advancements.',
            'Graduates will demonstrate professionalism, ethical behavior, and social responsibility.',
        ],
        psos: [
            'Analyze, design, and develop intelligent systems for real-world problems.',
            'Apply modern tools and techniques in AI and ML to create innovative solutions.',
        ],
        programOutcomes: [
            "Engineering knowledge: Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.",
            "Problem analysis: Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions.",
            "Design/development of solutions: Design solutions for complex engineering problems and design system components or processes that meet the specified needs.",
            "Conduct investigations of complex problems: Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions.",
        ],
        hod: {
            name: 'Dr. Sumangala Biradar',
            qualification: 'Ph.D. in Computer Science',
            message: 'Welcome to the Department of AI & ML! Our goal is to empower students with the skills to become leaders in the field of artificial intelligence. We are committed to providing a vibrant learning environment that nurtures creativity and innovation.',
            imageUrl: `https://picsum.photos/seed/hod_aiml/200`,
        },
        faculty: [
            { name: 'Dr. Sumangala Biradar', designation: 'Professor & HOD', qualification: 'Ph.D.', specialization: 'Machine Learning', imageUrl: `https://picsum.photos/seed/hod_aiml/200` },
            { name: 'Mr. Somashekhar Dhanyal', designation: 'Asst. Professor', qualification: 'M.Tech', specialization: 'Deep Learning', imageUrl: `https://picsum.photos/seed/faculty_sd/200` },
            { name: 'Mrs. Poornima Mamadapur', designation: 'Asst. Professor', qualification: 'M.Tech', specialization: 'Natural Language Processing', imageUrl: `https://picsum.photos/seed/faculty_pm/200` },
        ],
        labs: [
            { name: 'AI & ML Laboratory', description: 'Equipped with high-performance computing systems and the latest software for developing and testing AI models.', equipment: ['NVIDIA DGX Station', 'TensorFlow & PyTorch Servers', 'High-RAM Workstations'] },
            { name: 'Data Science Lab', description: 'Focused on data analysis, visualization, and big data technologies.', equipment: ['Hadoop Cluster', 'Tableau licenses', 'JupyterHub Server'] },
            { name: 'Robotics & Automation Lab', description: 'A hands-on lab for students to work on robotics projects and intelligent automation.', equipment: ['UR5 Robotic Arms', 'ROS-enabled robots', '3D Printers'] },
        ],
        curriculum: {
            "Semester 3": ["Data Structures", "Operating Systems", "Mathematics for CS", "OOP with Java"],
            "Semester 5": ["Machine Learning", "Data Visualization", "Theory of Computation", "Image Processing"],
            "Semester 7": ["Deep Learning", "Big Data Analytics", "Cryptography & Network Security"],
        },
        achievements: [
            "Won first place at the National Level 'InnovateAI' Hackathon 2023.",
            "Published 15+ research papers in reputed international journals in the last academic year.",
            "Signed an MoU with a leading AI company for student internships and collaborative projects.",
        ],
        kpis: { intake: 60, duration: '4 Years', labsCount: 3 },
    },
    {
        id: 'cse',
        name: 'Computer Science',
        fullName: 'Computer Science & Engineering',
        tagline: 'Engineering the Digital World',
        overview: 'Established in 1983, the Department of Computer Science & Engineering is one of the premier departments at our institution. With an intake of 180 students, we offer a robust curriculum that covers all aspects of computer science, from algorithms to software engineering.',
        vision: 'To be a distinguished center for Computer Science and Engineering education and research, creating globally competent professionals.',
        mission: [
            'To impart quality education with a strong foundation in theory and practice.',
            'To promote research and development activities in collaboration with industry.',
            'To instill ethical values and leadership skills in students.',
        ],
        peos: [
            'Excel in professional careers or pursue higher education in CSE and related fields.',
            'Exhibit technical competency and problem-solving skills.',
            'Engage in continuous learning and professional development.',
        ],
        psos: [
            'Ability to design and develop computer-based systems of varying complexity.',
            'Proficiency in using modern software tools and programming languages.',
        ],
         programOutcomes: [
            "Engineering knowledge: Apply fundamental knowledge to solve complex problems.",
            "Problem analysis: Analyze complex problems and reach substantiated conclusions.",
            "Modern tool usage: Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools.",
        ],
        hod: {
            name: 'Dr. S. F. Rodd',
            qualification: 'Ph.D., M.E.',
            message: 'Greetings from the CSE Department! We are dedicated to providing our students with a comprehensive education that prepares them for the ever-evolving tech industry. Our experienced faculty and excellent infrastructure are our greatest strengths.',
            imageUrl: `https://picsum.photos/seed/hod_cse/200`,
        },
        faculty: [
             { name: 'Dr. S. F. Rodd', designation: 'Professor & HOD', qualification: 'Ph.D.', specialization: 'Cloud Computing', imageUrl: `https://picsum.photos/seed/hod_cse/200` },
             { name: 'Dr. S. V. Gornale', designation: 'Professor', qualification: 'Ph.D.', specialization: 'Image Processing', imageUrl: `https://picsum.photos/seed/faculty_svg/200` },
             { name: 'Dr. P. V. Malge', designation: 'Professor', qualification: 'Ph.D.', specialization: 'Wireless Networks', imageUrl: `https://picsum.photos/seed/faculty_pvm/200` },
        ],
        labs: [
            { name: 'Advanced Programming Lab', description: 'Features the latest IDEs and tools for software development.', equipment: ['IntelliJ IDEA, VS Code', 'GitLab Server'] },
            { name: 'Database & Big Data Lab', description: 'Equipped for working with large datasets and database management systems.', equipment: ['Oracle DBMS', 'MongoDB Servers'] },
            { name: 'Networking Lab', description: 'Provides hands-on experience with network configuration and security.', equipment: ['Cisco Routers & Switches', 'Wireshark'] },
        ],
        curriculum: {
            "Semester 4": ["Design and Analysis of Algorithms", "Microcontroller and Embedded Systems", "Object Oriented Concepts"],
            "Semester 6": ["Computer Graphics and Visualization", "System Software and Compiler Design", "Web Technology and its applications"],
        },
        achievements: ["Runner-up in Smart India Hackathon 2023.", "Received a grant for a research project on blockchain technology."],
        kpis: { intake: 180, duration: '4 Years', labsCount: 5 },
    },
    {
        id: 'civil',
        name: 'Civil Engineering',
        fullName: 'Civil Engineering',
        tagline: 'Building the World of Tomorrow',
        overview: 'The Civil Engineering department has been a cornerstone of our institution since its inception. We focus on providing a comprehensive education in structural, environmental, and transportation engineering, with an intake of 60 students.',
        vision: 'To produce competent Civil Engineers with high technical skills, professional ethics and human values to serve the society and nation.',
        mission: [
            'To provide quality education in Civil Engineering to create skilled professionals.',
            'To promote innovative and sustainable solutions for societal problems.',
            'To foster a culture of lifelong learning and professional ethics.',
        ],
        peos: [
            'Graduates will have successful careers in the construction industry, government sectors, or as entrepreneurs.',
            'Graduates will pursue advanced degrees and engage in research and development.',
            'Graduates will be able to design and execute civil engineering projects in a sustainable manner.',
        ],
        psos: [
            'Plan, analyze, design, and execute civil engineering projects.',
            'Utilize modern engineering tools for complex problem-solving.',
        ],
        programOutcomes: ["Ethics: Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice."],
        hod: {
            name: 'Dr. A. I. Dhatrak',
            qualification: 'Ph.D., M.Tech',
            message: 'Welcome to Civil Engineering. We are committed to nurturing the next generation of engineers who will build a sustainable and resilient future. Our curriculum blends rigorous academics with practical, hands-on experience.',
            imageUrl: `https://picsum.photos/seed/hod_civil/200`,
        },
        faculty: [
            { name: 'Dr. A. I. Dhatrak', designation: 'Professor & HOD', qualification: 'Ph.D.', specialization: 'Structural Engg.', imageUrl: `https://picsum.photos/seed/hod_civil/200` },
            { name: 'Dr. S. S. Huddar', designation: 'Professor', qualification: 'Ph.D.', specialization: 'Geotechnical Engg.', imageUrl: `https://picsum.photos/seed/faculty_ssh/200` },
        ],
        labs: [
            { name: 'Structural Engineering Lab', description: 'For testing the strength and behavior of building materials.', equipment: ['Universal Testing Machine', 'Compression Testing Machine'] },
            { name: 'Geotechnical Engineering Lab', description: 'Focuses on soil mechanics and foundation engineering.', equipment: ['Triaxial Shear Test Apparatus', 'Direct Shear Test Apparatus'] },
            { name: 'Environmental Engineering Lab', description: 'Equipped for water and wastewater quality analysis.', equipment: ['BOD Incubator', 'Spectrophotometer'] },
        ],
        curriculum: {},
        achievements: [],
        kpis: { intake: 60, duration: '4 Years', labsCount: 8 },
    },
    { id: 'arch', name: 'Architecture', fullName: 'School of Architecture', tagline: 'Designing Spaces, Inspiring Lives', overview: 'Our School of Architecture offers a creative and rigorous program for aspiring architects.', vision: 'To be a leading center for architectural education.', mission: [], peos: [], psos: [], programOutcomes: [], hod: {name: 'Ar. Shreyas Shirol', qualification: 'M.Arch', message: 'Welcome!', imageUrl: `https://picsum.photos/seed/hod_arch/200`}, faculty: [], labs: [], curriculum: {}, achievements: [], kpis: { intake: 40, duration: '5 Years', labsCount: 4 } },
    { id: 'datasci', name: 'Data Science', fullName: 'Computer Science (Data Science)', tagline: 'Unlocking Insights from Data', overview: 'A specialized program focusing on the intersection of computer science and data analytics.', vision: 'To produce data scientists capable of solving complex problems.', mission: [], peos: [], psos: [], programOutcomes: [], hod: {name: 'Dr. S. F. Rodd', qualification: 'Ph.D., M.E.', message: 'Welcome!', imageUrl: `https://picsum.photos/seed/hod_cse/200`}, faculty: [], labs: [], curriculum: {}, achievements: [], kpis: { intake: 60, duration: '4 Years', labsCount: 3 } },
    { id: 'ece', name: 'Electronics & Comm.', fullName: 'Electronics & Communication Engg.', tagline: 'Connecting the World', overview: 'The ECE department focuses on the design and development of modern communication systems.', vision: 'To excel in education and research in Electronics and Communication.', mission: [], peos: [], psos: [], programOutcomes: [], hod: {name: 'Dr. B. M. Patil', qualification: 'Ph.D.', message: 'Welcome!', imageUrl: `https://picsum.photos/seed/hod_ece/200`}, faculty: [], labs: [], curriculum: {}, achievements: [], kpis: { intake: 60, duration: '4 Years', labsCount: 6 } },
    { id: 'eee', name: 'Electrical & Elec.', fullName: 'Electrical & Electronics Engg.', tagline: 'Powering Progress', overview: 'Our EEE department provides in-depth knowledge in electrical machinery, power systems, and electronics.', vision: 'To be a center of excellence in Electrical and Electronics Engineering.', mission: [], peos: [], psos: [], programOutcomes: [], hod: {name: 'Dr. C. B. Hanchinal', qualification: 'Ph.D.', message: 'Welcome!', imageUrl: `https://picsum.photos/seed/hod_eee/200`}, faculty: [], labs: [], curriculum: {}, achievements: [], kpis: { intake: 60, duration: '4 Years', labsCount: 7 } },
    { id: 'ise', name: 'Information Science', fullName: 'Information Science & Engineering', tagline: 'Innovating with Information', overview: 'The ISE program focuses on software development, data management, and information security.', vision: 'To produce globally competent Information Science engineers.', mission: [], peos: [], psos: [], programOutcomes: [], hod: {name: 'Dr. Aruna A. Chandargi', qualification: 'Ph.D.', message: 'Welcome!', imageUrl: `https://picsum.photos/seed/hod_ise/200`}, faculty: [], labs: [], curriculum: {}, achievements: [], kpis: { intake: 60, duration: '4 Years', labsCount: 4 } },
    { id: 'mech', name: 'Mechanical Engg.', fullName: 'Mechanical Engineering', tagline: 'The Foundation of Engineering', overview: 'The Mechanical Engineering department offers a broad curriculum covering design, manufacturing, and thermal sciences.', vision: 'To create skilled Mechanical Engineers to meet global challenges.', mission: [], peos: [], psos: [], programOutcomes: [], hod: {name: 'Dr. V. G. Kulkarni', qualification: 'Ph.D.', message: 'Welcome!', imageUrl: `https://picsum.photos/seed/hod_mech/200`}, faculty: [], labs: [], curriculum: {}, achievements: [], kpis: { intake: 60, duration: '4 Years', labsCount: 9 } },
];