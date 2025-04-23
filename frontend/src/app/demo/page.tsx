'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('interview');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Image src="/logo.svg" alt="AI Interview Practice" width={48} height={48} className="drop-shadow-lg" />
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            AI Interview Practice
          </span>
        </div>
        <Link 
          href="/signup" 
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Get Started
        </Link>
      </nav>

      {/* Demo Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Experience AI-Powered Interview Practice
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Discover how our platform can transform your interview preparation with cutting-edge AI technology
          </p>
          
          {/* Tabs */}
          <div className="flex justify-center space-x-4 mb-12">
            {['interview', 'feedback', 'training'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-lg font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
              {activeTab === 'interview' && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-semibold text-gray-900">AI-Powered Mock Interview</h2>
                  <div className="aspect-video bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl flex items-center justify-center border-2 border-dashed border-indigo-200">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg mb-4">Sample Interview Preview</p>
                      <div className="animate-pulse space-y-4">
                        <div className="flex space-x-4">
                          <div className="h-12 w-12 rounded-full bg-indigo-200"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                            <div className="h-4 bg-indigo-200 rounded w-1/2"></div>
                          </div>
                        </div>
                        <div className="flex space-x-4">
                          <div className="h-12 w-12 rounded-full bg-blue-200"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-blue-200 rounded w-2/3"></div>
                            <div className="h-4 bg-blue-200 rounded w-1/3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Experience realistic interview scenarios with our advanced AI interviewer. Practice answering common questions and receive instant, detailed feedback on your responses.
                  </p>
                </div>
              )}

              {activeTab === 'feedback' && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-semibold text-gray-900">Real-Time Feedback</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                      <h3 className="text-xl font-medium text-indigo-800 mb-4">Communication Score</h3>
                      <div className="space-y-2">
                        <div className="h-3 bg-indigo-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "85%" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full"
                          />
                        </div>
                        <p className="text-sm text-indigo-600">85% - Clear and concise responses</p>
                      </div>
                      <ul className="mt-4 space-y-2 text-indigo-700">
                        <li className="flex items-center">
                          <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Strong verbal communication
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Good pacing and clarity
                        </li>
                      </ul>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <h3 className="text-xl font-medium text-green-800 mb-4">Technical Knowledge</h3>
                      <div className="space-y-2">
                        <div className="h-3 bg-green-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "67%" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
                          />
                        </div>
                        <p className="text-sm text-green-600">67% - Room for improvement</p>
                      </div>
                      <ul className="mt-4 space-y-2 text-green-700">
                        <li className="flex items-center">
                          <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Basic concepts understood
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Advanced topics need work
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'training' && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-semibold text-gray-900">Personalized Training Modules</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: "Communication Skills", progress: 50, color: "indigo" },
                      { title: "Technical Knowledge", progress: 75, color: "blue" },
                      { title: "Problem Solving", progress: 65, color: "purple" }
                    ].map((module, index) => (
                      <div key={index} className={`p-6 bg-gradient-to-br from-${module.color}-50 to-${module.color}-100 rounded-xl border border-${module.color}-100`}>
                        <h3 className="text-xl font-medium text-gray-900 mb-4">{module.title}</h3>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${module.progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full bg-gradient-to-r from-${module.color}-600 to-${module.color}-700 rounded-full`}
                            />
                          </div>
                          <p className="text-sm text-gray-600">{module.progress}% Complete</p>
                        </div>
                        <ul className="mt-4 space-y-2 text-gray-700">
                          <li className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Module {index + 1} completed
                          </li>
                          <li className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Module {index + 2} in progress
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <Link
              href="/signup"
              className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-lg font-medium hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Your Journey
            </Link>
            <p className="mt-6 text-gray-600 text-lg">
              Join thousands of professionals who have improved their interview skills with our platform.
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
} 