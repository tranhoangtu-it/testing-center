import React, { useState } from 'react';
import { Exam, ExamSetupData, ExamResult } from '../../types/exam';
import { examService } from '../../services/examService';
import ExamSetup from './ExamSetup';
import ExamRunner from './ExamRunner';
import FailScreen from './FailScreen';
import ResultScreen from './ResultScreen';

const TestingCenter: React.FC = () => {
  const [exam, setExam] = useState<Exam | null>(null);
  const [examSetup, setExamSetup] = useState<ExamSetupData | null>(null);
  const [hasFailed, setHasFailed] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  const handleStart = async (setupData: ExamSetupData) => {
    try {
      const examData = await examService.loadExam(setupData.examId);
      setExam(examData);
      setExamSetup(setupData);
    } catch (error) {
      console.error('Error loading exam:', error);
    }
  };

  const handleComplete = (result: ExamResult) => {
    setExamResult(result);
    setExam(null);
    setExamSetup(null);
  };

  const handleFail = () => {
    setHasFailed(true);
    setExam(null);
    setExamSetup(null);
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
    return <ResultScreen result={examResult} onRestart={handleRestart} />;
  }

  if (exam && examSetup) {
    return (
      <ExamRunner
        exam={exam}
        timeLimit={examSetup.timeLimit}
        questionCount={examSetup.questionCount}
        onComplete={handleComplete}
        onFail={handleFail}
      />
    );
  }

  return <ExamSetup onStart={handleStart} />;
};

export default TestingCenter;