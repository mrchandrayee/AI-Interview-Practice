import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Lesson {
  id: string;
  topic: string;
  content: string;
  questions: any[];
  duration: number;
  objectives: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const fetchLesson = async (sessionId: string): Promise<Lesson> => {
  const response = await axios.get(`${API_URL}/training/sessions/${sessionId}/lesson/`);
  return response.data;
};

export const startSession = async (lessonId: string): Promise<{ session_id: string }> => {
  const response = await axios.post(`${API_URL}/training/sessions/`, {
    lesson_id: lessonId
  });
  return response.data;
};

export const endSession = async (sessionId: string): Promise<void> => {
  await axios.post(`${API_URL}/training/sessions/${sessionId}/complete/`);
}; 