import React, { useState, useEffect } from 'react';
import { ExamSetupData } from '../../types/exam';
import { ExamInfo } from '../../services/examService';
import { examService } from '../../services/examService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { BookOpen, Clock, User, Hash } from 'lucide-react';

interface ExamSetupProps {
  onStart: (setupData: ExamSetupData) => void;
}

const ExamSetup: React.FC<ExamSetupProps> = ({ onStart }) => {
  const [formData, setFormData] = useState<ExamSetupData>({
    examId: '',
    candidateName: '',
    questionCount: 100,
    timeLimit: 3,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<ExamInfo[]>([]);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      const examsList = await examService.loadExamsList();
      setExams(examsList);
    } catch (error) {
      setErrors(['Failed to load exams list']);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const validationErrors = examService.validateExamSetup(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onStart(formData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-900"></div>
      <div className="relative z-10 w-[500px] bg-white rounded-xl shadow-2xl p-8 mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Testing Center</h1>
          <p className="text-gray-700 text-lg">Điền thông tin để bắt đầu bài thi</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Môn thi */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center mb-1 w-full justify-center">
              <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
              <label className="block text-base font-semibold text-gray-900">
                Môn thi
              </label>
            </div>
            <Select
              value={formData.examId}
              onChange={(e) => setFormData(prev => ({ ...prev, examId: e.target.value }))}
              options={[
                { value: '', label: 'Chọn môn thi' },
                ...exams.map(exam => ({
                  value: exam.id,
                  label: exam.name
                }))
              ]}
              className="w-3/4 text-center text-gray-900"
            />
            {formData.examId && (
              <p className="text-sm text-gray-600">
                {exams.find(exam => exam.id === formData.examId)?.description}
              </p>
            )}
          </div>

          {/* Tên thí sinh */}
          <div className="space-y-2">
            <div className="flex items-center mb-1">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <label className="block text-base font-semibold text-gray-900">
                Tên thí sinh
              </label>
            </div>
            <Input
              type="text"
              value={formData.candidateName}
              onChange={(e) => setFormData(prev => ({ ...prev, candidateName: e.target.value }))}
              placeholder="Nhập tên của bạn"
              className="w-full text-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Số câu hỏi */}
            <div className="space-y-2">
              <div className="flex items-center mb-1">
                <Hash className="w-5 h-5 text-blue-600 mr-2" />
                <label className="block text-base font-semibold text-gray-900">
                  Số câu hỏi
                </label>
              </div>
              <Input
                type="number"
                min={1}
                max={100}
                value={formData.questionCount}
                onChange={(e) => setFormData(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                className="w-full text-gray-900"
              />
            </div>

            {/* Thời gian */}
            <div className="space-y-2">
              <div className="flex items-center mb-1">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                <label className="block text-base font-semibold text-gray-900">
                  Thời gian (giờ)
                </label>
              </div>
              <Input
                type="number"
                min={1}
                max={5}
                value={formData.timeLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                className="w-full text-gray-900"
              />
            </div>
          </div>

          {/* Error messages */}
          {errors.length > 0 && (
            <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
              {errors.map((error, index) => (
                <p key={index} className="text-red-600 text-base font-medium">
                  • {error}
                </p>
              ))}
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            className={`
              w-full bg-blue-600 hover:bg-blue-700 text-white text-lg
              py-3 rounded-lg font-semibold
              transition-all transform hover:scale-[1.02] active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            disabled={!formData.examId || !formData.candidateName}
          >
            Bắt đầu thi
          </Button>
        </form>

        {/* Helper text */}
        <div className="mt-6 text-center">
          <p className="text-base text-gray-600">
            Hãy đảm bảo bạn đã sẵn sàng trước khi bắt đầu bài thi
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExamSetup;