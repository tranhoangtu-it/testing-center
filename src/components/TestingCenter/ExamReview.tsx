import React from 'react';
import { Question } from '../../types/exam';
import { cn } from '../../lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface ExamReviewProps {
  questions: Question[];
  answers: Record<number, number[]>;
  onClose: () => void;
}

const ExamReview: React.FC<ExamReviewProps> = ({
  questions,
  answers,
  onClose,
}) => {
  const isAnswerCorrect = (question: Question, userAnswers: number[]) => {
    if (!userAnswers) return false;
    return question.correctAnswers.length === userAnswers.length &&
      question.correctAnswers.every(answer => userAnswers.includes(answer)) &&
      userAnswers.every(answer => question.correctAnswers.includes(answer));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Exam Review</h2>
          <Button onClick={onClose} variant="outline">
            Close Review
          </Button>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => {
            const userAnswers = answers[index] || [];
            const isCorrect = isAnswerCorrect(question, userAnswers);

            return (
              <div 
                key={index}
                className={cn(
                  "bg-white rounded-lg p-6 shadow",
                  isCorrect ? "border-l-4 border-green-500" : "border-l-4 border-red-500"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-lg font-bold">Question {index + 1}</span>
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    
                    <p className="text-gray-900 mb-4">{question.content}</p>

                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = userAnswers.includes(optionIndex);
                        const isCorrectOption = question.correctAnswers.includes(optionIndex);

                        return (
                          <div
                            key={optionIndex}
                            className={cn(
                              "p-3 rounded-lg",
                              isSelected && isCorrectOption && "bg-green-100",
                              isSelected && !isCorrectOption && "bg-red-100",
                              !isSelected && isCorrectOption && "bg-green-50 border-2 border-green-500",
                              !isSelected && !isCorrectOption && "bg-gray-50"
                            )}
                          >
                            <span className={cn(
                              isSelected && isCorrectOption && "text-green-700",
                              isSelected && !isCorrectOption && "text-red-700"
                            )}>
                              {option}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExamReview;