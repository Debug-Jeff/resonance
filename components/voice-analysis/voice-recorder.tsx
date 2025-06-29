'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Square, Play, Pause, Save, Trash2, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void;
  onCancel?: () => void;
}

export function VoiceRecorder({ onRecordingComplete, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Create audio element for playback
    audioElementRef.current = new Audio();
    
    return () => {
      // Clean up
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Set up audio analysis
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      // Start audio level visualization
      visualizeAudio();
      
      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        if (audioElementRef.current) {
          audioElementRef.current.src = url;
        }
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to access microphone. Please check permissions.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      toast.info('Recording paused');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast.info('Recording resumed');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      toast.success('Recording completed');
    }
  };

  const playAudio = () => {
    if (audioElementRef.current && audioUrl) {
      audioElementRef.current.play();
      setIsPlaying(true);
      
      audioElementRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const pauseAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    
    if (audioElementRef.current) {
      audioElementRef.current.src = '';
    }
    
    toast.info('Recording reset');
  };

  const saveRecording = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob, recordingTime);
    }
  };

  const cancelRecording = () => {
    resetRecording();
    if (onCancel) onCancel();
  };

  const visualizeAudio = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateAudioLevel = () => {
      if (!analyserRef.current || !isRecording) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average level
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      setAudioLevel(average);
      
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };
    
    updateAudioLevel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="glassmorphism border-0 shadow-xl">
      <CardContent className="p-6 space-y-6">
        {/* Visualization */}
        <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
          {isRecording && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-16 flex items-center justify-center">
                {Array.from({ length: 30 }).map((_, i) => {
                  const height = isRecording && !isPaused
                    ? Math.min(5 + (Math.random() * audioLevel / 5), 64)
                    : 5;
                  
                  return (
                    <div
                      key={i}
                      className="w-1 mx-0.5 bg-purple-500 rounded-full transition-all duration-75"
                      style={{ 
                        height: `${height}px`,
                        opacity: isPaused ? 0.5 : 1
                      }}
                    ></div>
                  );
                })}
              </div>
            </div>
          )}
          
          {!isRecording && !audioUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Tap the microphone button to start recording
              </p>
            </div>
          )}
          
          {!isRecording && audioUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-16 flex items-center justify-center">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 mx-0.5 bg-blue-500 rounded-full"
                    style={{ 
                      height: `${5 + Math.random() * 20}px`,
                      opacity: isPlaying ? 1 : 0.5
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Timer */}
        <div className="flex items-center justify-center">
          <div className="text-2xl font-mono font-semibold">
            {formatTime(recordingTime)}
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isRecording && !audioUrl && (
            <Button
              size="lg"
              className="w-16 h-16 rounded-full gradient-primary hover:scale-110 transition-transform"
              onClick={startRecording}
            >
              <Mic className="w-8 h-8 text-white" />
            </Button>
          )}
          
          {isRecording && (
            <>
              {isPaused ? (
                <Button
                  size="lg"
                  className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600"
                  onClick={resumeRecording}
                >
                  <Play className="w-6 h-6 text-white" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-12 h-12 rounded-full bg-yellow-500 hover:bg-yellow-600"
                  onClick={pauseRecording}
                >
                  <Pause className="w-6 h-6 text-white" />
                </Button>
              )}
              
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600"
                onClick={stopRecording}
              >
                <Square className="w-8 h-8 text-white" />
              </Button>
            </>
          )}
          
          {!isRecording && audioUrl && (
            <>
              {isPlaying ? (
                <Button
                  size="lg"
                  className="w-12 h-12 rounded-full bg-yellow-500 hover:bg-yellow-600"
                  onClick={pauseAudio}
                >
                  <Pause className="w-6 h-6 text-white" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600"
                  onClick={playAudio}
                >
                  <Play className="w-6 h-6 text-white" />
                </Button>
              )}
              
              <Button
                size="lg"
                className="w-12 h-12 rounded-full gradient-primary"
                onClick={saveRecording}
              >
                <Save className="w-6 h-6 text-white" />
              </Button>
              
              <Button
                size="lg"
                className="w-12 h-12 rounded-full bg-gray-500 hover:bg-gray-600"
                onClick={resetRecording}
              >
                <Trash2 className="w-6 h-6 text-white" />
              </Button>
            </>
          )}
        </div>
        
        {/* Status */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          {isRecording && !isPaused && (
            <div className="flex items-center justify-center">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
              Recording in progress...
            </div>
          )}
          
          {isRecording && isPaused && (
            <div className="flex items-center justify-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Recording paused
            </div>
          )}
          
          {!isRecording && audioUrl && (
            <div className="flex items-center justify-center">
              <Volume2 className="w-4 h-4 mr-2 text-green-500" />
              Recording ready
            </div>
          )}
        </div>
        
        {/* Cancel Button */}
        {onCancel && (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={cancelRecording}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}