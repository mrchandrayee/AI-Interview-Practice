import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTrainingSession } from '@/hooks/useTrainingSession';
import { setRecording, addTranscriptEntry } from '@/store/slices/trainingSlice';
import { RootState } from '@/store';
import { TrainingState, TranscriptEntry, AnalysisContent } from '@/store/slices/trainingSlice';
import { Lesson } from '@/services/api/training';

interface TrainingSessionProps {
  sessionId: string;
  lessonId: string;
}

const TrainingSession: React.FC<TrainingSessionProps> = ({ sessionId, lessonId }) => {
  const dispatch = useDispatch();
  const { transcript, isRecording } = useSelector((state: RootState) => state.training as TrainingState);
  const [userResponse, setUserResponse] = useState('');
  const [question, setQuestion] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const {
    isConnected,
    isInterrupted,
    currentLesson,
    error,
    startLesson,
    submitResponse,
    askQuestion,
    interrupt,
    resume
  } = useTrainingSession(sessionId);

  useEffect(() => {
    startLesson(lessonId);
  }, [lessonId, startLesson]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      dispatch(setRecording(true));
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      dispatch(setRecording(false));

      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      submitResponse(userResponse, audioBlob);
      audioChunksRef.current = [];
    }
  };

  const handleSubmitResponse = () => {
    if (userResponse.trim()) {
      submitResponse(userResponse);
      setUserResponse('');
    }
  };

  const handleAskQuestion = () => {
    if (question.trim()) {
      askQuestion(question);
      setQuestion('');
    }
  };

  const renderTranscriptEntry = (entry: TranscriptEntry) => {
    switch (entry.type) {
      case 'analysis':
        const analysisContent = entry.content as AnalysisContent;
        return (
          <div className="bg-blue-50 p-3 rounded">
            <h4 className="font-semibold">Analysis</h4>
            <p>Score: {analysisContent.correctness}%</p>
            <p>Suggestions: {analysisContent.suggestions.join(', ')}</p>
          </div>
        );
      case 'content':
        return (
          <div className="bg-green-50 p-3 rounded">
            <p>{entry.content as string}</p>
          </div>
        );
      case 'answer':
        return (
          <div className="bg-purple-50 p-3 rounded">
            <p>{entry.content as string}</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg">
        <p>Connecting to training session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{currentLesson?.topic}</h2>
        <p className="text-gray-600">{currentLesson?.content}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Transcript</h3>
        <div className="bg-gray-50 p-4 rounded-lg h-64 overflow-y-auto">
          {transcript.map((entry: TranscriptEntry, index: number) => (
            <div key={index} className="mb-4">
              <div className="text-sm text-gray-500">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </div>
              <div className="mt-1">
                {renderTranscriptEntry(entry)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <textarea
          value={userResponse}
          onChange={(e) => setUserResponse(e.target.value)}
          placeholder="Type your response here..."
          className="w-full p-3 border rounded-lg mb-4"
          rows={4}
        />
        <div className="flex gap-4">
          <button
            onClick={handleSubmitResponse}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Response
          </button>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="w-full p-3 border rounded-lg mb-4"
        />
        <button
          onClick={handleAskQuestion}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Ask Question
        </button>
      </div>

      <div className="flex gap-4">
        <button
          onClick={isInterrupted ? resume : interrupt}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          {isInterrupted ? 'Resume' : 'Interrupt'}
        </button>
      </div>
    </div>
  );
};

export default TrainingSession; 