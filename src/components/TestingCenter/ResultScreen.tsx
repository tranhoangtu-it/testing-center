import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface ResultScreenProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  correctAnswers,
  totalQuestions,
  onRestart,
}) => {
  const isPassing = score >= 60;

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          {isPassing ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          )}

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Kết quả bài thi
          </h1>
          
          <div className={`text-5xl font-bold mb-6 ${getScoreColor()}`}>
            {score.toFixed(1)}%
          </div>

          <div className="space-y-2 text-gray-600 mb-8">
            <p>Số câu trả lời đúng: {correctAnswers}/{totalQuestions}</p>
            <p>Trạng thái: {isPassing ? 'Đạt' : 'Không đạt'}</p>
          </div>

          <Button
            onClick={onRestart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
          >
            Làm bài thi mới
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;