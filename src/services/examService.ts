import { Exam, ExamSetupData, Question } from '../types/exam';

export const examService = {
  /**
   * Loads exam data from a JSON file
   */
  async loadExam(examId: string): Promise<Exam> {
    try {
      console.log('Loading exam:', examId);
      const response = await fetch(`/exams/${examId}.json`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to load exam: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Exam data loaded:', data);
      return data;
    } catch (error) {
      console.error('Error loading exam:', error);
      throw error;
    }
  },

  /**
   * Validates exam setup data
   */
  validateExamSetup(setup: ExamSetupData): string[] {
    console.log('Validating exam setup:', setup);
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
    
    console.log('Validation errors:', errors);
    return errors;
  },

  /**
   * Calculates exam score
   */
  calculateScore(questions: Question[], answers: Record<number, number[]>): {
    score: number;
    correctAnswers: number;
  } {
    let correct = 0;
    const total = questions.length;

    questions.forEach((question, index) => {
      const userAnswers = answers[index] || [];
      const correctAnswers = question.correctAnswers;

      // Check if arrays have same length and same elements (order doesn't matter)
      if (
        userAnswers.length === correctAnswers.length &&
        userAnswers.every(answer => correctAnswers.includes(answer)) &&
        correctAnswers.every(answer => userAnswers.includes(answer))
      ) {
        correct++;
      }
    });

    const score = (correct / total) * 100;
    
    return {
      score,
      correctAnswers: correct
    };
  },

  /**
   * Shuffles questions and limits them to the requested count
   */
  prepareQuestions(questions: Question[], count: number): Question[] {
    // Shuffle questions using Fisher-Yates algorithm
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Limit to requested count
    return shuffled.slice(0, count);
  },

  /**
   * Gets exam statistics
   */
  getExamStats(questions: Question[], answers: Record<number, number[]>) {
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).length;
    const remainingQuestions = totalQuestions - answeredQuestions;

    // Calculate category stats
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

    // Calculate difficulty stats
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

  /**
   * Validates an answer for a question
   */
  validateAnswer(question: Question, selectedAnswers: number[]): boolean {
    if (question.type === 'single' && selectedAnswers.length !== 1) {
      return false;
    }

    // For both single and multiple choice, check if selected answers match correct answers
    return (
      selectedAnswers.length === question.correctAnswers.length &&
      selectedAnswers.every(answer => question.correctAnswers.includes(answer)) &&
      question.correctAnswers.every(answer => selectedAnswers.includes(answer))
    );
  },

  /**
   * Formats time remaining into a string
   */
  formatTimeRemaining(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [hours, minutes, secs]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  },

  /**
   * Checks if the exam should auto-submit based on current state
   */
  shouldAutoSubmit(timeRemaining: number, answers: Record<number, number[]>, totalQuestions: number): boolean {
    // Auto-submit conditions:
    // 1. Time has run out
    if (timeRemaining <= 0) return true;

    // 2. All questions have been answered
    if (Object.keys(answers).length === totalQuestions) return true;

    return false;
  }
};