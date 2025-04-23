import { useState, useEffect, useRef, useCallback } from 'react';
import { InterviewWebSocket } from '@/lib/websocket';
import { useDispatch } from 'react-redux';
import { addTranscriptEntry, setError } from '@/store/slices/interviewSlice';

interface UseInterviewSessionProps {
  interviewId: string;
  onError?: (error: string) => void;
}

export function useInterviewSession({ interviewId, onError }: UseInterviewSessionProps) {
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isInterrupted, setIsInterrupted] = useState(false);
  const wsRef = useRef<InterviewWebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isProcessingRef = useRef(false);

  const handleAiResponse = useCallback((data: any) => {
    if (data.type === 'ai_response') {
      dispatch(addTranscriptEntry({
        role: 'interviewer',
        content: data.content
      }));
      setIsAiSpeaking(true);
    } else if (data.type === 'ai_done') {
      setIsAiSpeaking(false);
    } else if (data.type === 'error') {
      dispatch(setError(data.message));
      onError?.(data.message);
    }
  }, [dispatch, onError]);

  const handleAudioData = useCallback(async (data: ArrayBuffer) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    audioQueueRef.current.push(data);
    if (!isProcessingRef.current) {
      isProcessingRef.current = true;
      await processAudioQueue();
    }
  }, []);

  const processAudioQueue = async () => {
    while (audioQueueRef.current.length > 0) {
      const audioData = audioQueueRef.current.shift();
      if (audioData && audioContextRef.current) {
        const audioBuffer = await audioContextRef.current.decodeAudioData(audioData);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start();
        
        // Wait for the audio to finish playing
        await new Promise(resolve => {
          source.onended = resolve;
        });
      }
    }
    isProcessingRef.current = false;
  };

  const interruptAi = useCallback(() => {
    if (wsRef.current?.isConnected() && isAiSpeaking) {
      wsRef.current.send({ type: 'interrupt' });
      setIsInterrupted(true);
      setIsAiSpeaking(false);
    }
  }, [isAiSpeaking]);

  const resumeInterview = useCallback(() => {
    if (wsRef.current?.isConnected()) {
      wsRef.current.send({ type: 'resume' });
      setIsInterrupted(false);
    }
  }, []);

  useEffect(() => {
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/ws/interview/${interviewId}`;
    wsRef.current = new InterviewWebSocket(wsUrl);

    wsRef.current.on('connected', () => {
      setIsConnected(true);
    });

    wsRef.current.on('disconnected', () => {
      setIsConnected(false);
    });

    wsRef.current.on('message', (data: any) => {
      if (data.audio) {
        handleAudioData(data.audio);
      } else {
        handleAiResponse(data);
      }
    });

    wsRef.current.on('error', (error: Error) => {
      dispatch(setError(error.message));
      onError?.(error.message);
    });

    wsRef.current.connect();

    return () => {
      wsRef.current?.disconnect();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [interviewId, dispatch, handleAiResponse, handleAudioData, onError]);

  return {
    isConnected,
    isAiSpeaking,
    isInterrupted,
    interruptAi,
    resumeInterview,
    sendMessage: (content: string) => {
      if (wsRef.current?.isConnected()) {
        wsRef.current.send({ type: 'user_message', content });
        dispatch(addTranscriptEntry({
          role: 'candidate',
          content
        }));
      }
    }
  };
} 