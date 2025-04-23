'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular: boolean;
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // TODO: Fetch plans from backend
    const mockPlans: Plan[] = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        features: [
          '2 mock interviews per month',
          '1 hour of training access',
          'Basic assessment reports',
          'Email support',
        ],
        popular: false,
      },
      {
        id: 'popular',
        name: 'Popular',
        price: 29.99,
        features: [
          'Unlimited mock interviews',
          'Full training access',
          'Detailed assessment reports',
          'Priority support',
          'Progress tracking',
        ],
        popular: true,
      },
      {
        id: 'elite',
        name: 'Elite',
        price: 99.99,
        features: [
          'Everything in Popular',
          'Group sessions with human facilitator',
          'Personalized coaching',
          'Advanced analytics',
          '24/7 support',
        ],
        popular: false,
      },
    ];

    setPlans(mockPlans);
    setIsLoading(false);
  }, [isAuthenticated, router]);

  const handleSubscribe = async (planId: string) => {
    try {
      // TODO: Implement payment processing
      console.log('Subscribing to plan:', planId);
      // Redirect to payment page or process payment
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="mt-4 text-lg text-gray-600">
            Select the plan that best fits your needs
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-2 ring-indigo-600' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-indigo-600 text-white text-center py-1">
                    <span className="text-sm font-medium">Most Popular</span>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="ml-3 text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        plan.popular
                          ? 'bg-indigo-600 hover:bg-indigo-700'
                          : 'bg-gray-600 hover:bg-gray-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      {plan.price === 0 ? 'Get Started' : 'Subscribe Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Need help choosing?{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 