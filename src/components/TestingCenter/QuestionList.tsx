import React from 'react';
import { Question } from '../../types/exam';
import { cn } from '../../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

  const getQuestionStatus = (index: number) => {
    if (currentIndex === index) return 'current';
    if (answers[index]?.length > 0) return 'answered';
    return 'unanswered';
  };

  const getButtonClass = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-blue-600 text-white font-bold';
      case 'answered':
        return 'bg-green-500 text-white';
      default:
        return 'bg-white text-gray-800 hover:bg-gray-50';
    }
  };

  const rows = Array.from({ length: 20 }, (_, rowIndex) => {
    return Array.from({ length: 5 }, (_, colIndex) => {
      const questionIndex = rowIndex * 5 + colIndex;
      return questionIndex < questions.length ? questionIndex : null;
    });
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Question List</h3>
        <div className="flex space-x-2">
          <Button
            onClick={goToPreviousQuestion}
            disabled={currentIndex === 0}
            className="p-2"
            variant="outline"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            onClick={goToNextQuestion}
            disabled={currentIndex === questions.length - 1}
            className="p-2"
            variant="outline"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="grid gap-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((questionIndex, colIndex) => {
              if (questionIndex === null) return null;
              const status = getQuestionStatus(questionIndex);
              return (
                <button
                  key={colIndex}
                  onClick={() => onQuestionSelect(questionIndex)}
                  className={cn(
                    'w-10 h-10 flex items-center justify-center rounded-lg',
                    'text-sm font-medium transition-all',
                    getButtonClass(status)
                  )}
                >
                  {questionIndex + 1}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;