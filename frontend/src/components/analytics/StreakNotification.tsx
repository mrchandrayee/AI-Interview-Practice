import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalyticsState } from '@/types/analytics';

interface StreakNotificationProps {
  onClose: () => void;
}

const StreakNotification: React.FC<StreakNotificationProps> = ({ onClose }) => {
  const { progress } = useAppSelector((state) => state.analytics) as AnalyticsState;
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [animation, setAnimation] = useState<'enter' | 'exit'>('enter');

  useEffect(() => {
    const checkMilestones = () => {
      const milestones = [7, 14, 30, 60, 90];
      const currentStreak = progress.current_streak_days;

      const milestone = milestones.find(m => currentStreak === m);
      if (milestone) {
        setMessage(`🎉 Amazing! You've reached a ${milestone}-day streak!`);
        setAnimation('enter');
        setShow(true);
        setTimeout(() => {
          setAnimation('exit');
          setTimeout(() => {
            setShow(false);
            onClose();
          }, 300);
        }, 5000);
      }
    };

    checkMilestones();
  }, [progress.current_streak_days, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={animation === 'enter' ? 
            { opacity: 1, y: 0, scale: 1 } : 
            { opacity: 0, y: -50, scale: 0.8 }
          }
          transition={{ 
            duration: 0.3,
            ease: animation === 'enter' ? 'easeOut' : 'easeIn'
          }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-start">
              <motion.div 
                className="flex-shrink-0"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                <span className="text-2xl">🎉</span>
              </motion.div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Streak Milestone!
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setAnimation('exit');
                    setTimeout(() => {
                      setShow(false);
                      onClose();
                    }, 300);
                  }}
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StreakNotification; 