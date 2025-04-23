'use client';

import { useEffect, useState } from 'react';
import { supportService } from '@/services/api';
import { Button } from '@/components/ui/button';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const categories = [
  { id: 'account', label: 'Account Issues' },
  { id: 'interview', label: 'Mock Interview Setup' },
  { id: 'training', label: 'Training Module Navigation' },
  { id: 'payment', label: 'Payment Issues' },
  { id: 'other', label: 'Other' },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('account');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        setIsLoading(true);
        const response = await supportService.getFaqs(selectedCategory);
        setFaqs(response.data);
      } catch (error) {
        console.error('Failed to load FAQs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFaqs();
  }, [selectedCategory]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'primary' : 'outline'}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* FAQ list */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No FAQs found for this category.
          </div>
        ) : (
          faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-lg p-6 bg-white shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{faq.answer}</p>
            </div>
          ))
        )}
      </div>

      {/* Contact support section */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            if (window.Intercom) {
              window.Intercom('show');
            }
          }}
        >
          Contact Support
        </Button>
      </div>
    </div>
  );
}