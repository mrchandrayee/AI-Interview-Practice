import { useEffect, useRef, useState } from 'react';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

interface AudioRecorderProps {
  onStart?: () => void;
  onStop?: (audioBlob: Blob) => void;
  onDataAvailable?: (audioData: Float32Array) => void;
  className?: string;
  isDisabled?: boolean;
}

export function AudioRecorder({
  onStart,
  onStop,
  onDataAvailable,
  className,
  isDisabled = false,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up AudioContext and Analyser
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      // Set up MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
      mediaRecorderRef.current.addEventListener('stop', handleStop);
      
      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      onStart?.();
      
      // Start analyzing audio levels
      analyzeAudio();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      onStop?.(event.data);
    }
  };

  const handleStop = () => {
    if (mediaRecorderRef.current) {
      const tracks = mediaRecorderRef.current.stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const analyzeAudio = () => {
    if (!analyserRef.current) return;

    const dataArray = new Float32Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getFloatTimeDomainData(dataArray);

    // Calculate RMS value of audio data
    let sumSquares = 0;
    for (const amplitude of dataArray) {
      sumSquares += amplitude * amplitude;
    }
    const rms = Math.sqrt(sumSquares / dataArray.length);
    
    // Normalize and smooth the audio level
    const normalizedLevel = Math.min(1, rms * 5);
    setAudioLevel(normalizedLevel);
    onDataAvailable?.(dataArray);

    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  };

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isDisabled}
        className={cn(
          'relative flex h-12 w-12 items-center justify-center rounded-full transition-colors',
          isRecording
            ? 'bg-error hover:bg-error/90'
            : 'bg-primary hover:bg-primary/90',
          isDisabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isRecording ? (
          <StopIcon className="h-6 w-6 text-white" />
        ) : (
          <MicrophoneIcon className="h-6 w-6 text-white" />
        )}
        
        {/* Audio level indicator */}
        {isRecording && (
          <div
            className="absolute inset-0 animate-pulse rounded-full border-2 border-error"
            style={{
              transform: `scale(${1 + audioLevel * 0.5})`,
              opacity: 1 - audioLevel * 0.5,
            }}
          />
        )}
      </button>

      {isRecording && (
        <div className="flex items-center gap-2">
          <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-error transition-all duration-100"
              style={{ width: `${audioLevel * 100}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">Recording...</span>
        </div>
      )}
    </div>
  );
}