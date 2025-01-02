import React from 'react';
import { Question } from '../../types/exam';
import { cn } from '../../lib/utils';

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
        return 'bg-blue-600 text-white font-bold';
      case 'answered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-white text-gray-800 hover:bg-gray-50';
    }
  };

  // Create array of 20 rows with 5 questions each
  const rows = Array.from({ length: 20 }, (_, rowIndex) => {
    return Array.from({ length: 5 }, (_, colIndex) => {
      const questionIndex = rowIndex * 5 + colIndex;
      return questionIndex < questions.length ? questionIndex : null;
    });
  });

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-bold mb-4 text-gray-900">Question List</h3>
      
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

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-white border border-gray-300 mr-2"></div>
          <span>Not answered</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-100 mr-2"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
          <span>Current</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionList;