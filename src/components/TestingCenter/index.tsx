import React, { useState } from 'react';
import { Exam, ExamSetupData } from '../../types/exam';
import { examService } from '../../services/examService';
import ExamSetup from './ExamSetup';
import ExamRunner from './ExamRunner';
import FailScreen from './FailScreen';
import ResultScreen from './ResultScreen';

const TestingCenter: React.FC = () => {
  const [exam, setExam] = useState<Exam | null>(null);
  const [examSetup, setExamSetup] = useState<ExamSetupData | null>(null);
  const [hasFailed, setHasFailed] = useState(false);
  const [examResult, setExamResult] = useState<{
    score: number;
    correctAnswers: number;
  } | null>(null);

  const handleStart = async (setupData: ExamSetupData) => {
    try {
      const examData = await examService.loadExam(setupData.examId);
      setExam(examData);
      setExamSetup(setupData);
    } catch (error) {
      console.error('Error loading exam:', error);
    }
  };

  const handleComplete = (answers: Record<number, number[]>) => {
    if (!exam) return;
    
    const result = {
      score: (Object.keys(answers).length / exam.questions.length) * 100,
      correctAnswers: Object.keys(answers).length
    };
    
    setExamResult(result);
    setExam(null);
  };

  const handleFail = () => {
    setHasFailed(true);
    setExam(null);
  };

  const handleRestart = () => {
    setExam(null);
    setExamSetup(null);
    setHasFailed(false);
    setExamResult(null);
  };

  if (hasFailed) {
    return <FailScreen onRestart={handleRestart} />;
  }

  if (examResult) {
    return (
      <ResultScreen
        score={examResult.score}
        correctAnswers={examResult.correctAnswers}
        totalQuestions={exam?.questions.length || 0}
        onRestart={handleRestart}
      />
    );
  }

  if (exam && examSetup) {
    return (
      <ExamRunner
        exam={exam}
        timeLimit={examSetup.timeLimit}
        onComplete={handleComplete}
        onFail={handleFail}
      />
    );
  }

  return <ExamSetup onStart={handleStart} />;
};

export default TestingCenter;