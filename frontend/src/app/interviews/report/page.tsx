'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface Assessment {
  domainExpertise: number;
  communication: number;
  cultureFit: number;
  problemSolving: number;
  selfAwareness: number;
  overallScore: number;
  feedback: string;
  strengths: string[];
  improvementAreas: string[];
  recommendations: string[];
}

export default function InterviewReportPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchAssessment = async () => {
      try {
        const response = await axios.post(`/api/interviews/${params.id}/assessment`);
        setAssessment(response.data);
      } catch (err) {
        setError('Failed to fetch assessment data');
        console.error('Error fetching assessment:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessment();
  }, [isAuthenticated, router, params.id]);

  const handleDownloadPdf = async () => {
    try {
      const response = await axios.get(`/api/interviews/${params.id}/assessment/pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `interview_assessment_${params.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download PDF');
      console.error('Error downloading PDF:', err);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center text-red-600">{error || 'No assessment data available'}</div>
          </div>
        </div>
      </div>
    );
  }

  const doughnutData = {
    labels: ['Domain Expertise', 'Communication', 'Culture Fit', 'Problem Solving', 'Self-awareness'],
    datasets: [
      {
        data: [
          assessment.domainExpertise,
          assessment.communication,
          assessment.cultureFit,
          assessment.problemSolving,
          assessment.selfAwareness
        ],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(236, 72, 153, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Domain Expertise', 'Communication', 'Culture Fit', 'Problem Solving', 'Self-awareness'],
    datasets: [
      {
        label: 'Score',
        data: [
          assessment.domainExpertise,
          assessment.communication,
          assessment.cultureFit,
          assessment.problemSolving,
          assessment.selfAwareness
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Interview Assessment Report</h1>
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Download PDF
            </button>
          </div>

          <div className="space-y-8">
            {/* Overall Score */}
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">Overall Score</h2>
              <div className="mt-2 text-5xl font-bold text-indigo-600">{assessment.overallScore}%</div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Score Distribution</h3>
                <div className="h-64">
                  <Doughnut data={doughnutData} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Category Scores</h3>
                <div className="h-64">
                  <Bar data={barData} />
                </div>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Feedback</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">{assessment.feedback}</p>
              </div>
            </div>

            {/* Strengths */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Key Strengths</h3>
              <div className="space-y-2">
                {assessment.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-gray-600">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Areas */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Areas for Improvement</h3>
              <div className="space-y-2">
                {assessment.improvementAreas.map((area, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-gray-600">{area}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
              <div className="space-y-2">
                {assessment.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <p className="text-gray-600">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 