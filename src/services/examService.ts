import { Exam, ExamSetupData, Question, ExamInfo } from '../types/exam';

export const examService = {
  async loadExam(examId: string): Promise<Exam> {
    try {
      const examsList = await this.loadExamsList();
      const examInfo = examsList.find(exam => exam.id === examId);
      
      if (!examInfo) {
        throw new Error(`Exam with ID ${examId} not found`);
      }

      const response = await fetch(`/exams/${examInfo.filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load exam: ${response.status}`);
      }
      
      const examData = await response.json();
      return examData;
    } catch (error) {
      console.error('Error loading exam:', error);
      throw error;
    }
  },

  async loadExamsList(): Promise<ExamInfo[]> {
    try {
      const response = await fetch('/exams/exams.json');
      if (!response.ok) {
        throw new Error('Failed to load exams list');
      }
      const data = await response.json();
      return data.exams;
    } catch (error) {
      console.error('Error loading exams list:', error);
      throw error;
    }
  },

  validateExamSetup(setup: ExamSetupData): string[] {
    const errors: string[] = [];
    
    if (!setup.examId) {
      errors.push('Vui lòng chọn môn thi');
    }
    
    if (!setup.candidateName.trim()) {
      errors.push('Vui lòng nhập tên thí sinh');
    }
    
    if (setup.questionCount < 1 || setup.questionCount > 100) {
      errors.push('Số câu hỏi phải từ 1 đến 100');
    }
    
    if (setup.timeLimit < 1 || setup.timeLimit > 5) {
      errors.push('Thời gian làm bài phải từ 1 đến 5 giờ');
    }
    
    return errors;
  },

  calculateScore(questions: Question[], answers: Record<number, number[]>): {
    score: number;
    correctAnswers: number;
  } {
    let correct = 0;
    const total = questions.length;

    questions.forEach((question, index) => {
      const userAnswers = answers[index] || [];
      if (this.validateAnswer(question, userAnswers)) {
        correct++;
      }
    });

    const score = (correct / total) * 100;
    
    return {
      score,
      correctAnswers: correct
    };
  },

  prepareQuestions(questions: Question[], count: number): Question[] {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, Math.min(count, shuffled.length));
  },

  validateAnswer(question: Question, userAnswers: number[]): boolean {
    if (!userAnswers?.length) return false;

    // Convert userAnswers to be 1-based index like in the data
    const adjustedUserAnswers = userAnswers.map(ans => ans + 1);
    
    // For single choice questions
    if (question.type === 'single') {
      return adjustedUserAnswers[0] === question.correctAnswers[0];
    }

    // For multiple choice questions
    // First check if the number of selected answers matches
    if (adjustedUserAnswers.length !== question.correctAnswers.length) {
      return false;
    }

    // Then check if all answers match (order doesn't matter)
    const sortedUserAnswers = [...adjustedUserAnswers].sort((a, b) => a - b);
    const sortedCorrectAnswers = [...question.correctAnswers].sort((a, b) => a - b);
    return JSON.stringify(sortedUserAnswers) === JSON.stringify(sortedCorrectAnswers);
  },

  getExamStats(questions: Question[], answers: Record<number, number[]>) {
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).length;
    const remainingQuestions = totalQuestions - answeredQuestions;

    const categoryStats: Record<string, { total: number; answered: number }> = {};
    questions.forEach((question, index) => {
      if (!categoryStats[question.category]) {
        categoryStats[question.category] = { total: 0, answered: 0 };
      }
      categoryStats[question.category].total++;
      if (answers[index]?.length > 0) {
        categoryStats[question.category].answered++;
      }
    });

    const difficultyStats: Record<string, { total: number; answered: number }> = {};
    questions.forEach((question, index) => {
      if (!difficultyStats[question.difficulty]) {
        difficultyStats[question.difficulty] = { total: 0, answered: 0 };
      }
      difficultyStats[question.difficulty].total++;
      if (answers[index]?.length > 0) {
        difficultyStats[question.difficulty].answered++;
      }
    });

    return {
      progress: {
        total: totalQuestions,
        answered: answeredQuestions,
        remaining: remainingQuestions,
        percentage: (answeredQuestions / totalQuestions) * 100
      },
      categoryStats,
      difficultyStats
    };
  },

  formatTimeRemaining(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [hours, minutes, secs]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  },
};