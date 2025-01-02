import React from 'react';
import { Question } from '../../types/exam';
import { cn } from '../../lib/utils';

interface QuestionDisplayProps {
  question: Question;
  selectedAnswers: number[];
  onAnswerSelect: (answerId: number) => void;
  questionNumber: number;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedAnswers,
  onAnswerSelect,
  questionNumber,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 min-h-[calc(100vh-3rem)]">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-blue-600">
              Question {questionNumber}
            </span>
            <div className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-600">
              {question.category}
            </div>
            <div className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-600">
              {question.difficulty}
            </div>
          </div>
        </div>
        
        <div className="text-xl text-gray-900 leading-relaxed mb-8">
          {question.content}
        </div>

        <div className="space-y-4">
          {question.options.map((option, idx) => (
            <label
              key={idx}
              className={cn(
                "flex items-start p-4 rounded-lg cursor-pointer transition-all",
                "border-2 hover:border-blue-200",
                selectedAnswers.includes(idx) 
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              )}
            >
              <input
                type={question.type === 'single' ? 'radio' : 'checkbox'}
                name={`question-${question.id}`}
                checked={selectedAnswers.includes(idx)}
                onChange={() => onAnswerSelect(idx)}
                className={cn(
                  "mt-1 mr-4",
                  question.type === 'single' ? "form-radio" : "form-checkbox",
                  "text-blue-600 focus:ring-blue-500 h-5 w-5"
                )}
              />
              <span className="flex-grow text-lg text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;