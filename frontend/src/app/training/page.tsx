'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  modules: Module[];
}

interface Module {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

export default function TrainingPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // TODO: Fetch courses from backend
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Data Analytics Fundamentals',
        description: 'Learn the basics of data analysis, visualization, and interpretation.',
        duration: '20 hours',
        progress: 45,
        modules: [
          { id: '1-1', title: 'Introduction to Data Analytics', duration: '2 hours', completed: true },
          { id: '1-2', title: 'Data Visualization', duration: '3 hours', completed: true },
          { id: '1-3', title: 'Statistical Analysis', duration: '4 hours', completed: false },
          { id: '1-4', title: 'Advanced Topics', duration: '11 hours', completed: false },
        ],
      },
      {
        id: '2',
        title: 'Accounting Principles',
        description: 'Master the fundamentals of accounting and financial reporting.',
        duration: '30 hours',
        progress: 20,
        modules: [
          { id: '2-1', title: 'Basic Accounting Concepts', duration: '4 hours', completed: true },
          { id: '2-2', title: 'Financial Statements', duration: '6 hours', completed: false },
          { id: '2-3', title: 'Taxation', duration: '8 hours', completed: false },
          { id: '2-4', title: 'Advanced Topics', duration: '12 hours', completed: false },
        ],
      },
      {
        id: '3',
        title: 'Interview Polish',
        description: 'Enhance your interview skills and communication techniques.',
        duration: '15 hours',
        progress: 80,
        modules: [
          { id: '3-1', title: 'Communication Skills', duration: '3 hours', completed: true },
          { id: '3-2', title: 'Body Language', duration: '2 hours', completed: true },
          { id: '3-3', title: 'Answering Techniques', duration: '4 hours', completed: true },
          { id: '3-4', title: 'Advanced Scenarios', duration: '6 hours', completed: false },
        ],
      },
    ];

    setCourses(mockCourses);
    setIsLoading(false);
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Training Modules</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Your Progress</span>
            <div className="w-32 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{
                  width: `${Math.round(
                    courses.reduce((acc, curr) => acc + curr.progress, 0) / courses.length
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">{course.duration}</span>
                    <span className="text-sm font-medium text-indigo-600">
                      {course.progress}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <div className="space-y-2">
                    {course.modules.map((module) => (
                      <div
                        key={module.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className={`${module.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {module.title}
                        </span>
                        <span className="text-gray-500">{module.duration}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Link
                      href={`/training/${course.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 