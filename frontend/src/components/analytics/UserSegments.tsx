import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import { motion } from 'framer-motion';
import { UserCircleIcon, ChartBarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface UserSegment {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

interface LifecycleStage {
  stage: string;
  enteredAt: string;
  reason?: string;
}

const UserSegments: React.FC = () => {
  const [segments, setSegments] = useState<UserSegment[]>([]);
  const [lifecycleStage, setLifecycleStage] = useState<LifecycleStage | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user segments
        const segmentsResponse = await fetch('/api/analytics/segments');
        const segmentsData = await segmentsResponse.json();
        setSegments(segmentsData);

        // Fetch lifecycle stage
        const stageResponse = await fetch('/api/analytics/lifecycle');
        const stageData = await stageResponse.json();
        setLifecycleStage(stageData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lifecycle Stage */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">User Lifecycle</h2>
        {lifecycleStage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-4"
          >
            <div className="p-3 bg-blue-100 rounded-full">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Current Stage</p>
              <p className="text-2xl font-bold text-blue-600 capitalize">
                {lifecycleStage.stage}
              </p>
              {lifecycleStage.reason && (
                <p className="text-sm text-gray-500 mt-1">{lifecycleStage.reason}</p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* User Segments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">User Segments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {segments.map((segment) => (
            <motion.div
              key={segment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-full">
                  <UserCircleIcon className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{segment.name}</h3>
                  <p className="text-sm text-gray-500">{segment.description}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <ChartBarIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {segment.memberCount} members
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSegments; 