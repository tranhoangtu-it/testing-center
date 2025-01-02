import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TimerProps {
  timeRemaining: number;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining, className }) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 300) return 'text-red-600'; // 5 minutes
    if (timeRemaining <= 900) return 'text-orange-500'; // 15 minutes
    return 'text-gray-900';
  };

  return (
    <div className={cn("bg-white rounded-lg p-4 shadow-lg text-center", className)}>
      <Clock className="w-6 h-6 mx-auto mb-2 text-gray-500" />
      <div className={cn("text-2xl font-mono font-bold", getTimeColor())}>
        {formatTime(timeRemaining)}
      </div>
      {timeRemaining <= 300 && (
        <p className="text-red-500 text-sm mt-2 font-medium">
          Sắp hết giờ!
        </p>
      )}
    </div>
  );
};

export default Timer;