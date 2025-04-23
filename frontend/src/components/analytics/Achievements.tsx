import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { shareBadge } from '@/store/slices/analyticsSlice';
import { Badge, Title } from '@/store/slices/analyticsSlice';

const Achievements: React.FC = () => {
  const dispatch = useAppDispatch();
  const { progress } = useAppSelector((state) => state.analytics);

  const handleShareBadge = (badgeId: string) => {
    dispatch(shareBadge(badgeId));
  };

  return (
    <div className="space-y-8">
      {/* Current Title */}
      {progress.current_title && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current Title</h2>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-500">
                {progress.current_title.level}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-medium">{progress.current_title.name}</h3>
              <p className="text-gray-600">{progress.current_title.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {progress.badges.map((badge: Badge) => (
            <div
              key={badge.id}
              className="border rounded-lg p-4 flex items-center space-x-4"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xl">{badge.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{badge.name}</h3>
                <p className="text-sm text-gray-600">{badge.description}</p>
                {badge.awarded_at && (
                  <p className="text-xs text-gray-500">
                    Earned on {new Date(badge.awarded_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              {!badge.shared_on_facebook && (
                <button
                  onClick={() => handleShareBadge(badge.id)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Share
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Progress</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{progress.total_interviews}</p>
            <p className="text-gray-600">Interviews</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{progress.total_training_hours}h</p>
            <p className="text-gray-600">Training</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{progress.current_streak_days}</p>
            <p className="text-gray-600">Day Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {Math.round(progress.average_interview_score)}%
            </p>
            <p className="text-gray-600">Avg. Score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements; 