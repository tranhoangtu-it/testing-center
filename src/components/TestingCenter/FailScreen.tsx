import React from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface FailScreenProps {
  onRestart: () => void;
}

const FailScreen: React.FC<FailScreenProps> = ({ onRestart }) => {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-red-700 mb-4">
          Bài kiểm tra thất bại
        </h1>
        <p className="text-gray-600 mb-8">
          Bạn đã vi phạm quy định bài kiểm tra bằng cách thoát khỏi chế độ toàn màn hình
          hoặc chuyển sang cửa sổ khác.
        </p>
        <Button
          onClick={onRestart}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          Thử lại
        </Button>
      </div>
    </div>
  );
};

export default FailScreen;