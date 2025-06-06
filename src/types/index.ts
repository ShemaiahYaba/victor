
export interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  credits: number; // Retained, though not explicitly in new card UI, might be useful elsewhere
  description: string;
  color?: string; // Can be repurposed for topBorderColor or iconBgColor if needed
  imageUrl?: string; // To be removed from card, replaced by icon

  // New fields for the updated CourseCard UI
  difficulty?: string; // e.g., "Beginner", "Intermediate"
  rating?: number; // e.g., 4.8
  progress?: number; // Percentage, e.g., 65
  nextClassTime?: string; // e.g., "Today, 2:00 PM"
  dueSoonTask?: string; // e.g., "Lab 3 - Due Tomorrow"
  studentCount?: number;
  discussionCount?: number;
  notification?: string; // e.g., "New lecture uploaded"
  icon?: React.ElementType; // Lucide icon component
  iconBgColor?: string; // Tailwind class for icon background, e.g., 'bg-blue-100'
  topBorderColor?: string; // Tailwind class for top border, e.g., 'border-blue-500'
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TimetableEvent {
  id: string;
  courseId: string;
  courseName?: string; 
  courseColor?: string;
  day: DayOfWeek;
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  description: string;
}

export interface Note {
  id: string;
  courseId: string;
  title: string;
  content: string;
  summary?: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

export interface Document {
  id: string;
  courseId: string;
  name: string;
  url: string; 
  fileType: string;
  uploadedAt: string; // ISO Date string
  isLectureNote?: boolean;
  content?: string; // Added for summarization
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation?: string;
}

export interface Quiz {
  id:string;
  courseId: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

export interface UserProfile {
  name: string;           // e.g., Oyedele Onaolamipo.V
  degreeMajor: string;    // e.g., B.SC Computer Science
  department: string;     // e.g., Computer Science & Mathematics
  currentYear: number;    // e.g., 3
  currentSemester: string;// e.g., Second
  coursesTaken: number;   // e.g., 6
  unitsTaken: number;     // e.g., 11
  avatarUrl: string;      // Retain for other potential uses, not displayed in this widget
  university: string;     // Retain for other potential uses, not displayed in this widget
  isAdmin?: boolean;
}

export interface AnsweredQuestion extends QuizQuestion {
  selectedOptionId?: string; // The option ID selected by the user
  isCorrect?: boolean;       // Was the selected answer correct
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  courseId: string; 
  quizTitle: string;
  attemptedAt: string; // ISO Date string
  score: number;
  totalQuestions: number;
  questions: AnsweredQuestion[]; 
}
