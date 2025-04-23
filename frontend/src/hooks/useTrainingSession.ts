import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addTranscriptEntry } from '@/store/slices/trainingSlice';

interface TrainingMessage {
  type: string;
  content?: any;
  analysis?: any;
  answer?: string;
  error?: string;
}

export const useTrainingSession = (sessionId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const dispatch = useDispatch();

  const connect = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/training/session/${sessionId}/`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      // Attempt to reconnect after 5 seconds
      setTimeout(connect, 5000);
    };

    ws.current.onerror = (event) => {
      setError('WebSocket connection error');
      console.error('WebSocket error:', event);
    };

    ws.current.onmessage = (event) => {
      const message: TrainingMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'lesson_content':
          setCurrentLesson(message.content);
          break;
        case 'response_analysis':
          dispatch(addTranscriptEntry({
            type: 'analysis',
            content: message.analysis
          }));
          break;
        case 'next_content':
          dispatch(addTranscriptEntry({
            type: 'content',
            content: message.content
          }));
          break;
        case 'question_answer':
          dispatch(addTranscriptEntry({
            type: 'answer',
            content: message.answer
          }));
          break;
        case 'error':
          setError(message.error || 'An error occurred');
          break;
      }
    };
  }, [sessionId, dispatch]);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((type: string, data: any = {}) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, ...data }));
    } else {
      setError('WebSocket is not connected');
    }
  }, []);

  const startLesson = useCallback((lessonId: string) => {
    sendMessage('start_lesson', { lesson_id: lessonId });
  }, [sendMessage]);

  const submitResponse = useCallback((response: string, audioData?: Blob) => {
    sendMessage('user_response', { response, audio_data: audioData });
  }, [sendMessage]);

  const askQuestion = useCallback((question: string) => {
    sendMessage('question', { question });
  }, [sendMessage]);

  const interrupt = useCallback(() => {
    setIsInterrupted(true);
    sendMessage('interrupt');
  }, [sendMessage]);

  const resume = useCallback(() => {
    setIsInterrupted(false);
    sendMessage('resume');
  }, [sendMessage]);

  return {
    isConnected,
    isInterrupted,
    currentLesson,
    error,
    startLesson,
    submitResponse,
    askQuestion,
    interrupt,
    resume
  };
}; 