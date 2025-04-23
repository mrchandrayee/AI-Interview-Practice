'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useInterviewSession } from '@/hooks/useInterviewSession';
import { AudioRecorder } from '@/components/ui/audio-recorder';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';

export default function ActiveInterviewPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [userInput, setUserInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const {
    isConnected,
    isAiSpeaking,
    isInterrupted,
    interruptAi,
    resumeInterview,
    sendMessage
  } = useInterviewSession({
    interviewId: 'current', // This should be replaced with the actual interview ID
    onError: (error) => setError(error)
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isAiSpeaking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      sendMessage(userInput);
      setUserInput('');
    }
  };

  const handleRecordingStart = () => {
    setIsRecording(true);
  };

  const handleRecordingStop = async (audioBlob: Blob) => {
    setIsRecording(false);
    try {
      // TODO: Send audio to backend for processing
      // This will be implemented when we add the audio processing backend
    } catch (err) {
      setError('Failed to process audio');
      console.error('Audio processing error:', err);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Active Interview</h1>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-500">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Transcript Display */}
            <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
              <div className="space-y-4">
                {/* Transcript entries will be rendered here */}
                <div ref={transcriptEndRef} />
              </div>
            </div>

            {/* Input Controls */}
            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  disabled={isAiSpeaking}
                />
                <button
                  type="submit"
                  disabled={isAiSpeaking || !userInput.trim()}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>

              <div className="flex items-center justify-between">
                <AudioRecorder
                  onStart={handleRecordingStart}
                  onStop={handleRecordingStop}
                  isDisabled={isAiSpeaking}
                />

                {isAiSpeaking && (
                  <button
                    onClick={interruptAi}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Interrupt
                  </button>
                )}

                {isInterrupted && (
                  <button
                    onClick={resumeInterview}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Resume
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 