import React, { useState, useEffect } from 'react';
import { useFullscreen } from '../../hooks/useFullScreen';
import { Exam } from '../../types/exam';
import QuestionDisplay from './QuestionDisplay';
import QuestionList from './QuestionList';
import Timer from './Timer';
import ExamReview from './ExamReview';
import { examService } from '../../services/examService';
import { Button } from '../ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ExamRunnerProps {
  exam: Exam;
  timeLimit: number;
  onComplete: (answers: Record<number, number[]>) => void;
  onFail: () => void;
}

const ExamRunner: React.FC<ExamRunnerProps> = ({
  exam,
  timeLimit,
  onComplete,
  onFail,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [remainingTime, setRemainingTime] = useState(timeLimit * 3600);
  const [randomizedQuestions, setRandomizedQuestions] = useState(examService.prepareQuestions(exam.questions, 100));
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const { elementRef } = useFullscreen({
    onExit: onFail
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [answers]);

  const handleTimeUp = () => {
    setShowReview(true);
  };

  const handleAnswerSelect = (answerId: number) => {
    const question = randomizedQuestions[currentQuestionIndex];
    
    setAnswers(prev => {
      if (question.type === 'single') {
        return { ...prev, [currentQuestionIndex]: [answerId] };
      }
      
      const currentAnswers = prev[currentQuestionIndex] || [];
      if (currentAnswers.includes(answerId)) {
        return {
          ...prev,
          [currentQuestionIndex]: currentAnswers.filter(id => id !== answerId)
        };
      }
      return {
        ...prev,
        [currentQuestionIndex]: [...currentAnswers, answerId]
      };
    });
  };

  const handleSubmit = () => {
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = () => {
    setShowSubmitConfirm(false);
    setShowReview(true);
  };

  const handleFinishReview = () => {
    onComplete(answers);
  };

  if (showReview) {
    return (
      <ExamReview
        questions={randomizedQuestions}
        answers={answers}
        onClose={handleFinishReview}
      />
    );
  }

  return (
    <div ref={elementRef} className="min-h-screen flex bg-gray-100">
      {/* Question Display Area - 70% width */}
      <div className="w-[70%] p-6 overflow-auto">
        <QuestionDisplay
          question={randomizedQuestions[currentQuestionIndex]}
          selectedAnswers={answers[currentQuestionIndex] || []}
          onAnswerSelect={handleAnswerSelect}
          questionNumber={currentQuestionIndex + 1}
        />
      </div>

      {/* Question List Area - 30% width */}
      <div className="w-[30%] bg-white shadow-lg flex flex-col">
        <div className="flex-grow overflow-auto p-4">
          <QuestionList
            questions={randomizedQuestions}
            currentIndex={currentQuestionIndex}
            answers={answers}
            onQuestionSelect={setCurrentQuestionIndex}
          />
        </div>
        
        <div className="p-4 border-t space-y-4">
          <Timer
            timeRemaining={remainingTime}
            className="w-full"
          />
          
          <Button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          >
            Submit Exam
          </Button>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Confirm Submission</h3>
              <p className="mb-6 text-gray-600">
                Are you sure you want to submit your exam?<br />
                You have answered {Object.keys(answers).length} out of {randomizedQuestions.length} questions.
              </p>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => setShowSubmitConfirm(false)}
                variant="outline"
                className="w-full"
              >
                Continue Exam
              </Button>
              <Button
                onClick={confirmSubmit}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Submit Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamRunner;