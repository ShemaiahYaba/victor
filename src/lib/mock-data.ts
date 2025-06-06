
import type { Course, TimetableEvent, Note, Document, Quiz, UserProfile, QuizAttempt, AnsweredQuestion } from '@/types';
import { Globe, MousePointerSquareDashed, Projector, Image, Settings2 } from 'lucide-react'; // Updated icons

export const MOCK_USER_PROFILE: UserProfile = {
  name: 'Oyedele Onaolamipo.V',
  degreeMajor: 'B.SC Computer Science',
  department: 'Computer Science & Mathematics',
  currentYear: 3,
  currentSemester: 'Second',
  coursesTaken: 5, // Updated to 5 courses
  unitsTaken: 15, // Assuming 3 units per course
  avatarUrl: 'https://placehold.co/100x100.png', 
  university: 'State University', 
  isAdmin: true, 
};

export const MOCK_COURSES: Course[] = [
  {
    id: 'csc402', // Changed from cs101
    name: 'Net-Centric & Internet Programming',
    code: 'CSC 402',
    instructor: 'Dr. Tim Berners-Lee',
    credits: 3,
    description: 'Fundamentals of network programming, client-server architectures, and web technologies including HTML, CSS, JavaScript, and server-side scripting.',
    topBorderColor: 'border-primary',
    icon: Globe,
    iconBgColor: 'bg-cyan-100 dark:bg-cyan-900',
    difficulty: 'Intermediate',
    rating: 4.7,
    progress: 55,
    nextClassTime: 'Today, 1:00 PM',
    dueSoonTask: 'Project Phase 1 - Due Next Week',
    studentCount: 90,
    discussionCount: 10,
    notification: 'New assignment posted',
  },
  {
    id: 'csc404', // Changed from math202
    name: 'Human Computer Interface',
    code: 'CSC 404',
    instructor: 'Dr. Alan Kay',
    credits: 3,
    description: 'Principles of designing, implementing, and evaluating user interfaces. Usability heuristics, user-centered design, and HCI theories.',
    topBorderColor: 'border-primary', 
    icon: MousePointerSquareDashed, // Changed icon
    iconBgColor: 'bg-orange-100 dark:bg-orange-900',
    difficulty: 'Intermediate',
    rating: 4.6,
    progress: 40,
    nextClassTime: 'Tomorrow, 11:00 AM',
    dueSoonTask: 'Usability Report - Due Friday',
    studentCount: 75,
    discussionCount: 8,
    // notification: 'Feedback on wireframes available', // Removed
  },
  {
    id: 'csc406', // Changed from phy301
    name: 'Computer Modeling and Simulation',
    code: 'CSC 406',
    instructor: 'Dr. John von Neumann',
    credits: 3,
    description: 'Techniques for modeling complex systems and simulating their behavior. Discrete-event simulation, continuous simulation, and statistical analysis of results.',
    topBorderColor: 'border-primary', 
    icon: Projector,
    iconBgColor: 'bg-lime-100 dark:bg-lime-900',
    difficulty: 'Advanced',
    rating: 4.8,
    progress: 60,
    nextClassTime: 'Wednesday, 10:00 AM',
    dueSoonTask: 'Simulation Model Design',
    studentCount: 65,
    discussionCount: 12,
  },
  {
    id: 'csc412', // Changed from eng110
    name: 'Computer Graphics and Visualization',
    code: 'CSC 412',
    instructor: 'Dr. Ed Catmull',
    credits: 3,
    description: 'Algorithms and techniques for 2D/3D computer graphics, rendering pipelines, geometric transformations, and data visualization.',
    topBorderColor: 'border-primary', 
    icon: Image,
    iconBgColor: 'bg-pink-100 dark:bg-pink-900',
    difficulty: 'Advanced',
    rating: 4.9,
    progress: 35,
    nextClassTime: 'Friday, 2:00 PM',
    dueSoonTask: 'OpenGL Lab 2',
    studentCount: 70,
    discussionCount: 9,
  },
  {
    id: 'csc408', // New course
    name: 'Special Topics in Software Engineering',
    code: 'CSC 408',
    instructor: 'Dr. Grady Booch',
    credits: 3,
    description: 'Exploring advanced and emerging topics in software engineering, including Agile methodologies, DevOps, microservices, and software architecture patterns.',
    topBorderColor: 'border-primary',
    icon: Settings2,
    iconBgColor: 'bg-indigo-100 dark:bg-indigo-900',
    difficulty: 'Advanced',
    rating: 4.7,
    progress: 25,
    nextClassTime: 'Thursday, 3:00 PM',
    dueSoonTask: 'Research Paper Proposal',
    studentCount: 55,
    discussionCount: 6,
    // notification: 'Guest lecture next week', // Removed
  }
];

export const MOCK_TIMETABLE_EVENTS: TimetableEvent[] = [
  { id: 't1', courseId: 'csc402', courseName: 'Net-Centric & Internet Programming', courseColor: 'bg-primary', day: 'Monday', startTime: '09:00', endTime: '10:30', description: 'Lecture in Tech Hall 101, covering Chapter 3.' },
  { id: 't2', courseId: 'csc404', courseName: 'Human Computer Interface', courseColor: 'bg-accent', day: 'Monday', startTime: '11:00', endTime: '12:30', description: 'Interactive session in Design Studio B. Bring wireframes.' },
  { id: 't3', courseId: 'csc406', courseName: 'Computer Modeling and Simulation', courseColor: 'bg-secondary', day: 'Tuesday', startTime: '14:00', endTime: '15:30', description: 'Lab session in Science Hub A. Focus on DES software.' },
  { id: 't4', courseId: 'csc412', courseName: 'Computer Graphics and Visualization', courseColor: 'bg-primary/70', day: 'Wednesday', startTime: '10:00', endTime: '11:30', description: 'Lecture on 3D transformations, Graphics Lab 3.' },
  { id: 't5', courseId: 'csc402', courseName: 'Net-Centric Programming Lab', courseColor: 'bg-primary', day: 'Wednesday', startTime: '13:00', endTime: '14:30', description: 'Practical lab work in Tech Hall Lab 2.' },
  { id: 't6', courseId: 'csc408', courseName: 'Special Topics in SE Seminar', courseColor: 'bg-accent', day: 'Thursday', startTime: '15:00', endTime: '16:30', description: 'Guest speaker on DevOps, Eng. Auditorium.' },
];

export const MOCK_NOTES: Note[] = [
  {
    id: 'n1',
    courseId: 'csc402',
    title: 'Lecture 1: HTTP Basics',
    content: 'Request methods (GET, POST, PUT, DELETE), status codes, headers. Client-server model.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), 
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'n2',
    courseId: 'csc402',
    title: 'Lecture 2: HTML & CSS',
    content: 'Basic HTML structure, common tags. CSS selectors, box model, flexbox basics.',
    summary: 'This lecture covered fundamental HTML elements and CSS styling concepts, including selectors and layout with flexbox.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'n3',
    courseId: 'csc404',
    title: 'Usability Heuristics',
    content: "Nielsen's 10 usability heuristics. Examples and applications in UI design evaluation.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'n4',
    courseId: 'csc406',
    title: 'Discrete Event Simulation',
    content: 'Components of DES: entities, attributes, activities, events, state variables. Event scheduling.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'd1',
    courseId: 'csc402',
    name: 'Syllabus_CSC402.pdf',
    url: '#', 
    fileType: 'PDF',
    uploadedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    isLectureNote: true,
    content: `Course Syllabus: CSC 402 - Net-Centric & Internet Programming

Instructor: Dr. Tim Berners-Lee
Office Hours: Mondays 1-3 PM, Tech Hall 303

Course Description:
This course covers the fundamentals of network programming and web technologies. Topics include client-server architecture, HTTP protocol, HTML, CSS, JavaScript, and server-side scripting.

Learning Objectives:
- Understand internet protocols and client-server communication.
- Develop static and dynamic web pages.
- Implement basic server-side logic.

Required Text: "Web Programming Step by Step" (Recommended)

Grading:
- Assignments: 50%
- Midterm Project: 20%
- Final Project: 30%

Schedule (Tentative):
Week 1-2: Introduction to Internet, HTTP
Week 3-5: HTML, CSS
...and so on.
`
  },
  {
    id: 'd2',
    courseId: 'csc402',
    name: 'Assignment1_WebBasics.docx',
    url: '#', 
    fileType: 'DOCX',
    uploadedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    isLectureNote: false,
  },
  {
    id: 'd3',
    courseId: 'csc404',
    name: 'HCI_Design_Principles.pdf',
    url: '#', 
    fileType: 'PDF',
    uploadedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    isLectureNote: true,
    content: `CSC 404 - Human Computer Interface: Design Principles

Key Principles:
1. Visibility of System Status: Users should always be informed about what is going on.
2. Match between System and Real World: Speak the users' language.
3. User Control and Freedom: Users need an "emergency exit".
4. Consistency and Standards: Users should not have to wonder whether different words, situations, or actions mean the same thing.
5. Error Prevention: Design to prevent problems from occurring.
6. Recognition rather than Recall: Make objects, actions, and options visible.
7. Flexibility and Efficiency of Use: Allow users to tailor frequent actions.
8. Aesthetic and Minimalist Design: Dialogues should not contain irrelevant information.
9. Help Users Recognize, Diagnose, and Recover from Errors: Error messages should be expressed in plain language.
10. Help and Documentation: Provide help and documentation.

This lecture covers key design principles crucial for creating effective and user-friendly interfaces.`
  },
   {
    id: 'd4',
    courseId: 'csc406',
    name: 'Lecture1_IntroToModeling.pdf',
    url: '#', 
    fileType: 'PDF',
    uploadedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    isLectureNote: true,
    content: `CSC 406 - Computer Modeling and Simulation: Lecture 1 - Introduction

What is Modeling?
- Creating a simplified representation of a real-world system or process.
- Captures essential characteristics and behaviors.

What is Simulation?
- Imitating the operation of a real-world process or system over time.
- Involves generating an artificial history of a system and observing that history to draw inferences.

Types of Models:
- Physical Models
- Mathematical Models (Deterministic, Stochastic)
- Process Models

Types of Simulation:
- Discrete-Event Simulation
- Continuous Simulation
- Agent-Based Modeling

Applications: Manufacturing, healthcare, finance, logistics, military.
`
  },
  {
    id: 'd5',
    courseId: 'csc412',
    name: 'Lecture_Notes_Rendering_Pipeline.pdf',
    url: '#',
    fileType: 'PDF',
    uploadedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    isLectureNote: true,
    content: `CSC 412 - Computer Graphics: The Rendering Pipeline

The rendering pipeline is a conceptual model that describes the steps a graphics system goes through to render a 3D scene to a 2D screen.

Key Stages:
1.  Application Stage: Handled by software on the CPU (game logic, physics).
2.  Geometry Processing:
    - Model and View Transformation: Converts vertices from model space to world space, then to view space.
    - Projection: Transforms view space to clip space (e.g., perspective or orthographic).
    - Clipping: Removes parts of the scene outside the view frustum.
    - Screen Mapping: Transforms to screen coordinates.
3.  Rasterization: Converts geometric primitives (triangles) into a set of pixels (fragments).
4.  Fragment Processing (Pixel Shading): Calculates the color of each fragment (lighting, texturing).
5.  Per-Sample Operations: Depth testing, blending, stencil testing.
6.  Framebuffer Operations: Writing final pixel colors to the framebuffer.

Modern pipelines are highly programmable (shaders).`
  }
];

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'q_csc402_1',
    courseId: 'csc402',
    title: 'HTTP & Web Basics Quiz',
    description: 'Test your knowledge on fundamental HTTP and web concepts.',
    questions: [
      { id: 'q1q1', text: 'Which HTTP method is typically used for retrieving data?', options: [{id: 'o1', text:'POST'}, {id: 'o2', text:'GET'}, {id: 'o3', text:'PUT'}, {id: 'o4', text:'DELETE'}], correctOptionId: 'o2', explanation: "GET is used to request data from a specified resource." },
      { id: 'q1q2', text: 'What does HTML stand for?', options: [{id: 'o1', text:'HyperText Markup Language'}, {id: 'o2', text:'HighTech Modern Language'}, {id: 'o3', text:'Hyperlink and Text Markup Language'}, {id: 'o4', text:'Home Tool Markup Language'}], correctOptionId: 'o1', explanation: "HTML stands for HyperText Markup Language." },
    ],
  },
  {
    id: 'q_csc404_1',
    courseId: 'csc404',
    title: 'Usability Principles Quiz',
    description: 'A quick quiz on common HCI usability principles.',
    questions: [
      { id: 'q2q1', text: 'Which principle suggests that users should always be aware of what is happening in the system?', options: [{id: 'o1', text:'Consistency and Standards'}, {id: 'o2', text:'Visibility of System Status'}, {id: 'o3', text:'User Control and Freedom'}, {id: 'o4', text:'Error Prevention'}], correctOptionId: 'o2', explanation: "Visibility of System Status ensures users are informed through appropriate feedback." },
    ],
  },
];

export const MOCK_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'attempt1',
    quizId: 'q_csc402_1', 
    courseId: 'csc402',
    quizTitle: 'HTTP & Web Basics Quiz - Attempt 1',
    attemptedAt: new Date(Date.now() - 86400000 * 3).toISOString(), 
    score: 1,
    totalQuestions: 2,
    questions: [
      {
        id: 'q1q1', text: 'Which HTTP method is typically used for retrieving data?',
        options: [{id: 'o1', text:'POST'}, {id: 'o2', text:'GET'}, {id: 'o3', text:'PUT'}, {id: 'o4', text:'DELETE'}],
        correctOptionId: 'o2',
        explanation: "GET is used to request data from a specified resource.",
        selectedOptionId: 'o1', 
        isCorrect: false,
      },
      {
        id: 'q1q2', text: 'What does HTML stand for?',
        options: [{id: 'o1', text:'HyperText Markup Language'}, {id: 'o2', text:'HighTech Modern Language'}, {id: 'o3', text:'Hyperlink and Text Markup Language'}, {id: 'o4', text:'Home Tool Markup Language'}],
        correctOptionId: 'o1',
        explanation: "HTML stands for HyperText Markup Language.",
        selectedOptionId: 'o1', 
        isCorrect: true,
      }
    ],
  },
  {
    id: 'attempt2',
    quizId: 'q_csc404_1', 
    courseId: 'csc404',
    quizTitle: 'Usability Principles Quiz - Retake',
    attemptedAt: new Date(Date.now() - 86400000 * 1).toISOString(), 
    score: 1,
    totalQuestions: 1,
    questions: [
      {
        id: 'q2q1', text: 'Which principle suggests that users should always be aware of what is happening in the system?',
        options: [{id: 'o1', text:'Consistency and Standards'}, {id: 'o2', text:'Visibility of System Status'}, {id: 'o3', text:'User Control and Freedom'}, {id: 'o4', text:'Error Prevention'}],
        correctOptionId: 'o2',
        explanation: "Visibility of System Status ensures users are informed through appropriate feedback.",
        selectedOptionId: 'o2', 
        isCorrect: true,
      }
    ],
  },
];

