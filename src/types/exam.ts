export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'single' | 'multiple';

export interface Question {
  id: number;
  category: string;
  difficulty: Difficulty;
  content: string;
  options: string[];
  correctAnswers: number[];
  type: QuestionType;
}

export interface Exam {
  id: string;
  name: string;
  questions: Question[];
}

export interface ExamSetupData {
  examId: string;
  candidateName: string;
  questionCount: number;
  timeLimit: number;
}

export interface ExamResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface ExamState {
  currentQuestionIndex: number;
  answers: Record<number, number[]>;
  timeRemaining: number;
  isComplete: boolean;
  hasFailed: boolean;
}

export interface ExamInfo {
  id: string;
  name: string;
  description: string;
  filename: string;
}