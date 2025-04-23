'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import TrainingSession from '@/components/training/TrainingSession';
import { RootState } from '@/store';
import { setCurrentSession, clearTranscript } from '@/store/slices/trainingSlice';
import { fetchLesson, Lesson } from '@/services/api/training';

export default function TrainingSessionPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentSession, error } = useSelector((state: RootState) => state.training);
  const [loading, setLoading] = React.useState(true);
  const [lesson, setLesson] = React.useState<Lesson | null>(null);

  useEffect(() => {
    const sessionId = params.id as string;
    if (sessionId) {
      dispatch(setCurrentSession(sessionId));
      dispatch(clearTranscript());

      const loadLesson = async () => {
        try {
          setLoading(true);
          const lessonData = await fetchLesson(sessionId);
          setLesson(lessonData);
        } catch (err) {
          console.error('Error loading lesson:', err);
          router.push('/training');
        } finally {
          setLoading(false);
        }
      };

      loadLesson();
    }

    return () => {
      dispatch(setCurrentSession(''));
    };
  }, [params.id, dispatch, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading training session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button
            onClick={() => router.push('/training')}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Return to Training
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Lesson not found</p>
          <button
            onClick={() => router.push('/training')}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Return to Training
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Training Session</h1>
          <p className="mt-2 text-sm text-gray-600">
            Session ID: {currentSession}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <TrainingSession
            sessionId={currentSession}
            lessonId={lesson.id}
          />
        </div>

        <div className="mt-8">
          <button
            onClick={() => router.push('/training')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Exit Session
          </button>
        </div>
      </div>
    </div>
  );
} 