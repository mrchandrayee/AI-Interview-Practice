import React from 'react';
import { useAppSelector } from '@/store';
import { motion } from 'framer-motion';

interface StreakMilestone {
  days: number;
  title: string;
  description: string;
  icon: string;
}

const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 7, title: 'Week Warrior', description: 'Maintained a 7-day streak', icon: '🏆' },
  { days: 14, title: 'Fortnight Fighter', description: 'Maintained a 14-day streak', icon: '⚔️' },
  { days: 30, title: 'Monthly Master', description: 'Maintained a 30-day streak', icon: '👑' },
  { days: 60, title: 'Two-Month Titan', description: 'Maintained a 60-day streak', icon: '💪' },
  { days: 90, title: 'Quarterly Champion', description: 'Maintained a 90-day streak', icon: '🏅' },
];

const StreakAchievements: React.FC = () => {
  const { progress } = useAppSelector((state) => state.analytics);
  const { current_streak_days, longest_streak_days } = progress;

  const getNextMilestone = () => {
    return STREAK_MILESTONES.find(milestone => milestone.days > current_streak_days) || STREAK_MILESTONES[STREAK_MILESTONES.length - 1];
  };

  const getAchievedMilestones = () => {
    return STREAK_MILESTONES.filter(milestone => longest_streak_days >= milestone.days);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Streak Achievements</h2>
      
      <div className="space-y-4">
        {/* Next Milestone */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-700 mb-2">Next Milestone</h3>
          <div className="flex items-center space-x-4">
            <span className="text-3xl">{getNextMilestone().icon}</span>
            <div>
              <p className="font-medium">{getNextMilestone().title}</p>
              <p className="text-sm text-gray-600">{getNextMilestone().description}</p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(current_streak_days / getNextMilestone().days) * 100}%`,
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {current_streak_days} / {getNextMilestone().days} days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Achieved Milestones */}
        <div>
          <h3 className="text-lg font-medium mb-2">Your Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getAchievedMilestones().map((milestone) => (
              <motion.div
                key={milestone.days}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-green-50 rounded-lg p-4 flex items-center space-x-4"
              >
                <span className="text-3xl">{milestone.icon}</span>
                <div>
                  <p className="font-medium text-green-700">{milestone.title}</p>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Achieved on {new Date().toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakAchievements; 