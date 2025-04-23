import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { motion } from 'framer-motion';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-hot-toast';

interface ReferralReward {
  id: string;
  reward_type: string;
  amount: number;
  description: string;
  is_claimed: boolean;
  created_at: string;
}

const ReferralSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [referralCredits, setReferralCredits] = useState(0);
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [inputCode, setInputCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchReferralData();
    fetchRewards();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/users/referral-code');
      const data = await response.json();
      setReferralCode(data.referral_code);
      setReferralLink(data.referral_link);
      setTotalReferrals(data.total_referrals);
      setReferralCredits(data.referral_credits);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    }
  };

  const fetchRewards = async () => {
    try {
      const response = await fetch('/api/users/rewards');
      const data = await response.json();
      setRewards(data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const handleApplyCode = async () => {
    if (!inputCode) {
      toast.error('Please enter a referral code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/users/apply-referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: inputCode }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Referral code applied successfully!');
        setRewards(data.rewards);
        fetchReferralData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to apply referral code');
      }
    } catch (error) {
      toast.error('An error occurred while applying the referral code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimReward = async (rewardId: string) => {
    try {
      const response = await fetch(`/api/users/claim-reward/${rewardId}`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Reward claimed successfully!');
        setRewards(data.remaining_rewards);
        fetchReferralData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to claim reward');
      }
    } catch (error) {
      toast.error('An error occurred while claiming the reward');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Referral Program</h2>

      <div className="space-y-6">
        {/* Referral Code Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Your Referral Code</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={referralCode}
              readOnly
              className="flex-1 p-2 border rounded-md bg-white"
            />
            <CopyToClipboard text={referralLink} onCopy={() => toast.success('Link copied!')}>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Copy Link
              </button>
            </CopyToClipboard>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Share your referral link and earn rewards when friends sign up!
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{totalReferrals}</p>
            <p className="text-sm text-gray-600">Total Referrals</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{referralCredits}</p>
            <p className="text-sm text-gray-600">Referral Credits</p>
          </div>
        </div>

        {/* Apply Referral Code */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Apply Referral Code</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Enter referral code"
              className="flex-1 p-2 border rounded-md"
            />
            <button
              onClick={handleApplyCode}
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Applying...' : 'Apply'}
            </button>
          </div>
        </div>

        {/* Rewards Section */}
        {rewards.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Your Rewards</h3>
            <div className="space-y-2">
              {rewards.map((reward) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-50 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{reward.description}</p>
                    <p className="text-sm text-gray-600">
                      {reward.amount} {reward.reward_type}
                    </p>
                  </div>
                  {!reward.is_claimed && (
                    <button
                      onClick={() => handleClaimReward(reward.id)}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
                    >
                      Claim
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralSection; 