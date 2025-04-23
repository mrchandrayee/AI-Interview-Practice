import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalyticsState } from '@/types/analytics';

const StreakTracker: React.FC = () => {
  const { progress } = useAppSelector((state) => state.analytics) as AnalyticsState;
  const [previousStreak, setPreviousStreak] = useState(progress.current_streak_days);
  const [isStreakIncreased, setIsStreakIncreased] = useState(false);

  useEffect(() => {
    if (progress.current_streak_days > previousStreak) {
      setIsStreakIncreased(true);
      setPreviousStreak(progress.current_streak_days);
      setTimeout(() => setIsStreakIncreased(false), 1000);
    }
  }, [progress.current_streak_days, previousStreak]);

  const renderStreakDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const isActive = i <= progress.current_streak_days;
      const isNewStreak = isActive && i === progress.current_streak_days - 1;
      
      days.push(
        <motion.div
          key={i}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: isNewStreak ? [0, -10, 0] : 0
          }}
          transition={{ 
            duration: 0.3, 
            delay: i * 0.1,
            y: isNewStreak ? { duration: 0.5, repeat: 1, repeatType: "reverse" } : undefined
          }}
          className="flex flex-col items-center"
        >
          <motion.div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={isNewStreak ? { 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            } : {}}
            transition={isNewStreak ? { 
              duration: 0.5,
              repeat: 1,
              repeatType: "reverse"
            } : {}}
          >
            {date.toLocaleDateString('en-US', { weekday: 'short' })}
          </motion.div>
          <span className="text-xs mt-1">
            {date.toLocaleDateString('en-US', { day: 'numeric' })}
          </span>
        </motion.div>
      );
    }
    
    return days;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Streak Tracker</h2>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <AnimatePresence mode="wait">
            <motion.p
              key={progress.current_streak_days}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: isStreakIncreased ? [1, 1.2, 1] : 1,
                opacity: 1,
                color: isStreakIncreased ? ['#10B981', '#10B981', '#10B981'] : '#10B981'
              }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold text-green-500"
            >
              {progress.current_streak_days}
            </motion.p>
          </AnimatePresence>
          <p className="text-gray-600">Current Streak</p>
        </div>
        <div>
          <motion.p
            className="text-3xl font-bold text-blue-500"
            whileHover={{ scale: 1.1 }}
          >
            {progress.longest_streak_days}
          </motion.p>
          <p className="text-gray-600">Longest Streak</p>
        </div>
      </div>

      <div className="flex justify-between">
        {renderStreakDays()}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Next Milestone</span>
          <span className="text-sm font-medium">
            {Math.ceil(progress.current_streak_days / 7) * 7} days
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div
            className="bg-blue-500 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${(progress.current_streak_days % 7) * (100 / 7)}%`,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default StreakTracker; 