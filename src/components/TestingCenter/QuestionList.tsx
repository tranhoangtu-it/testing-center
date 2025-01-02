import React from 'react';
import { Question } from '../../types/exam';
import { cn } from '../../lib/utils';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface QuestionListProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, number[]>;
  onQuestionSelect: (index: number) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  currentIndex,
  answers,
  onQuestionSelect,
}) => {
  const getQuestionStatus = (index: number) => {
    if (currentIndex === index) return 'current';
    if (answers[index]?.length > 0) return 'answered';
    return 'unanswered';
  };

  const getButtonClass = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2 shadow-lg shadow-blue-100';
      case 'answered':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300 shadow-sm';
      default:
        return 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm';
    }
  };

  const goToNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      onQuestionSelect(currentIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentIndex > 0) {
      onQuestionSelect(currentIndex - 1);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  return (
    <div className="h-full flex flex-col bg-white p-6">
      {/* Header with Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900">Câu hỏi</h3>
          <span className="text-lg font-semibold text-blue-600">
            {answeredCount}/{questions.length}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mb-6">
        <Button
          onClick={goToPreviousQuestion}
          disabled={currentIndex === 0}
          variant="outline"
          className="flex items-center px-4 py-2 text-base"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          <span>Trước</span>
        </Button>

        <Button
          onClick={goToNextQuestion}
          disabled={currentIndex === questions.length - 1}
          variant="outline"
          className="flex items-center px-4 py-2 text-base"
        >
          <span>Tiếp</span>
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>

      {/* Questions Grid */}
      <div className="flex-grow overflow-auto px-1">
        <div className="grid grid-cols-5 gap-5">
          {questions.map((_, idx) => {
            const status = getQuestionStatus(idx);
            return (
              <button
                key={idx}
                onClick={() => onQuestionSelect(idx)}
                className={cn(
                  'relative w-22 h-10 flex items-center justify-center margin-top-10',
                  'rounded-xl border-2 font-semibold transition-all duration-200',
                  'text-base hover:transform hover:scale-105',
                  'focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2',
                  getButtonClass(status)
                )}
              >
                <span>{idx + 1}</span>
                {status === 'answered' && (
                  <CheckCircle className="absolute -top-1.5 -right-1.5 h-5 w-5 text-emerald-500 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center text-gray-600">
            <div className="w-4 h-4 rounded-lg bg-white border-2 border-gray-200 mr-2"></div>
            <span className="text-sm font-medium">Chưa làm</span>
          </div>
          <div className="flex items-center text-gray-600">
            <div className="w-4 h-4 rounded-lg bg-emerald-100 border-2 border-emerald-300 mr-2"></div>
            <span className="text-sm font-medium">Đã làm</span>
          </div>
          <div className="flex items-center text-gray-600">
            <div className="w-4 h-4 rounded-lg bg-blue-600 mr-2"></div>
            <span className="text-sm font-medium">Hiện tại</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionList;