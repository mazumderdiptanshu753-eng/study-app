export type Subject = 
  | "Mathematics";

export type GradeLevel = 
  | "Middle School"
  | "High School"
  | "Undergraduate";

export interface Challenge {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface SolvedDoubt {
  id: string;
  question: string;
  subject: Subject;
  grade: GradeLevel;
  explanation: string;
  steps: string[];
  coreConcept: string;
  analogy: string;
  challenge: Challenge;
  timestamp: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  subject: Subject;
  summaryPoints?: string[];
  tags?: string[];
  flashcards?: Flashcard[];
  timestamp: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: "pdf" | "image" | "none";
}

export interface StudySession {
  id: string;
  minutes: number;
  subject: Subject;
  timestamp: string;
}

export interface StudentProfile {
  fullName: string;
  email: string;
  age: string;
  institution: string;
  grade: GradeLevel;
  preferredSubject: Subject;
  registeredAt: string;
  avatarUrl?: string;
  role: "Admin" | "Student";
  isSuspended?: boolean;
}

export interface UserStats {
  doubtsSolved: number;
  notesCreated: number;
  studyMinutes: number;
  videosUploaded: number;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderRole: "Admin" | "Student";
  message: string;
  timestamp: string;
  studentEmail: string;
  studentName: string;
}

export interface VideoComment {
  id: string;
  senderName: string;
  senderEmail: string;
  senderRole: "Admin" | "Student";
  avatarUrl?: string;
  comment: string;
  timestamp: string;
}

export interface VideoLecture {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  uploadedBy: string;
  timestamp: string;
  subject: string;
  comments: VideoComment[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "note" | "video";
  timestamp: string;
  isRead: boolean;
  userEmail?: string;
}


