import React from 'react';
import { Question } from '../../types/exam';
import { cn } from '../../lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { examService } from '../../services/examService';

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
  // Điều chỉnh index của câu trả lời để phù hợp với index trong dữ liệu
  const adjustAnswerIndex = (index: number) => index - 1;

  const isAnswerCorrect = (question: Question, userAnswers: number[]) => {
    if (!userAnswers?.length) return false;
    
    // Chuyển đổi userAnswers về index bắt đầu từ 1
    const adjustedUserAnswers = userAnswers.map(ans => ans + 1);
    
    // Với câu hỏi single choice
    if (question.type === 'single') {
      return adjustedUserAnswers[0] === question.correctAnswers[0];
    }

    // Với câu hỏi multiple choice
    if (adjustedUserAnswers.length !== question.correctAnswers.length) {
      return false;
    }

    const sortedUserAnswers = [...adjustedUserAnswers].sort((a, b) => a - b);
    const sortedCorrectAnswers = [...question.correctAnswers].sort((a, b) => a - b);
    return JSON.stringify(sortedUserAnswers) === JSON.stringify(sortedCorrectAnswers);
  };

  const correctCount = questions.reduce((count, question, index) => {
    const userAnswers = answers[index] || [];
    return isAnswerCorrect(question, userAnswers) ? count + 1 : count;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kết quả chi tiết</h2>
            <p className="text-gray-600 mt-2">
              Số câu đúng: {correctCount}/{questions.length} ({((correctCount/questions.length) * 100).toFixed(1)}%)
            </p>
          </div>
          <Button 
            onClick={onClose} 
            variant="outline"
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Xem kết quả cuối cùng
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
                      <span className="text-lg font-bold">Câu {index + 1}</span>
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="text-sm text-gray-500">
                        ({question.type === 'single' ? 'Chọn một' : 'Chọn nhiều'})
                      </span>
                    </div>
                    
                    <p className="text-gray-900 mb-4">{question.content}</p>

                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = userAnswers.includes(optionIndex);
                        // Điều chỉnh index khi kiểm tra đáp án đúng
                        const isCorrectOption = question.correctAnswers.includes(optionIndex + 1);

                        return (
                          <div
                            key={optionIndex}
                            className={cn(
                              "p-3 rounded-lg flex justify-between items-center",
                              isSelected && isCorrectOption && "bg-green-100 border border-green-500",
                              isSelected && !isCorrectOption && "bg-red-100 border border-red-500",
                              !isSelected && isCorrectOption && "bg-green-50 border-2 border-green-500",
                              !isSelected && !isCorrectOption && "bg-gray-50"
                            )}
                          >
                            <span className={cn(
                              "text-base flex-1",
                              isSelected && isCorrectOption && "text-green-700 font-medium",
                              isSelected && !isCorrectOption && "text-red-700 font-medium",
                              !isSelected && isCorrectOption && "text-green-700 font-medium",
                              !isSelected && !isCorrectOption && "text-gray-700"
                            )}>
                              {option}
                            </span>
                            <div className="flex items-center ml-2">
                              {isSelected && isCorrectOption && (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                              {isSelected && !isCorrectOption && (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                              {!isSelected && isCorrectOption && (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {!isCorrect && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-700 text-sm">
                          <strong>Đáp án đúng:</strong> {
                            question.correctAnswers
                              .map(index => question.options[index - 1])
                              .join(', ')
                          }
                        </p>
                      </div>
                    )}
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