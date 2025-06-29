'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth-provider';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { 
  Heart, Mic, TrendingUp, Calendar, Smile, 
  MessageCircle, BarChart3, Lightbulb, Plus,
  Play, Pause, Square, Volume2, Sparkles,
  Brain, Waves, Send, ArrowRight, Phone
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import Link from 'next/link';

interface MoodEntry {
  id: string;
  mood: number;
  emotions: string[];
  note: string | null;
  created_at: string;
}

interface VoiceSession {
  id: string;
  title: string;
  transcript: string;
  duration: number;
  emotions: any;
  ai_response: string;
  mood_score: number | null;
  tags: string[];
  created_at: string;
}

const wellnessTips = [
  "Take 5 deep breaths when feeling overwhelmed. This activates your parasympathetic nervous system.",
  "Write down 3 things you're grateful for today. Gratitude rewires your brain for positivity.",
  "Step outside for 10 minutes. Natural light and fresh air boost mood and energy levels.",
  "Stretch or do gentle movement. Physical activity releases endorphins naturally.",
  "Connect with a friend or loved one. Social connections are vital for mental health."
];

const conversationStarters = [
  "How are you feeling today?",
  "What's on your mind right now?",
  "Tell me about your day so far",
  "What emotions are you experiencing?",
  "How has your week been going?",
  "What would you like to talk about?"
];

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [voiceSessions, setVoiceSessions] = useState<VoiceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [todaysTip] = useState(wellnessTips[Math.floor(Math.random() * wellnessTips.length)]);
  const [conversationStarter] = useState(conversationStarters[Math.floor(Math.random() * conversationStarters.length)]);
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [quickResponse, setQuickResponse] = useState('');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch recent mood entries
      const { data: moods } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(7);

      // Fetch recent voice sessions
      const { data: sessions } = await supabase
        .from('voice_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3);

      setMoodEntries(moods || []);
      setVoiceSessions(sessions || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      // Set up audio analysis for visual feedback
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Start audio level monitoring
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
        }
        if (isRecording) {
          animationRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };

      setMediaRecorder(recorder);
      setAudioChunks([]);
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success('Recording started - speak naturally!');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setAudioLevel(0);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Simulate quick AI analysis
      setIsAnalyzing(true);
      
      // Mock transcript for demo
      const mockTranscript = quickResponse || "I've been feeling a bit overwhelmed lately with work and personal responsibilities. Sometimes it feels like there's just too much to handle, but I'm trying to stay positive and take things one day at a time.";
      
      try {
        // Call the edge function for analysis
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/analyze-voice`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transcript: mockTranscript,
            duration: recordingTime
          })
        });

        if (!response.ok) {
          throw new Error('Analysis failed');
        }

        const analysis = await response.json();
        
        // Save the session
        const { error } = await supabase
          .from('voice_sessions')
          .insert({
            user_id: user?.id,
            title: `Quick Check-in - ${format(new Date(), 'MMM dd')}`,
            transcript: mockTranscript,
            duration: recordingTime,
            emotions: analysis.emotions,
            ai_response: analysis.aiResponse,
            mood_score: analysis.moodScore,
            tags: analysis.tags || ['quick-checkin']
          });

        if (error) throw error;

        toast.success('Session analyzed and saved!');
        setQuickResponse('');
        setRecordingTime(0);
        fetchDashboardData();
        
      } catch (error) {
        console.error('Error analyzing session:', error);
        toast.error('Analysis failed, but recording was saved');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const chartData = moodEntries
    .slice(0, 7)
    .reverse()
    .map(entry => ({
      date: format(new Date(entry.created_at), 'MMM dd'),
      mood: entry.mood
    }));

  const averageMood = moodEntries.length > 0 
    ? Math.round(moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length) 
    : 0;

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      happy: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      sad: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      anxious: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      calm: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      angry: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      excited: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      grateful: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      stressed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colors[emotion.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 skeleton"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 skeleton"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  const isTestUser = user?.id === '8966fdd8-e515-43c9-a00c-da18e00ce825';
  const hasData = moodEntries.length > 0 || voiceSessions.length > 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* AI Voice Companion Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 rounded-3xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
        
        <Card className="glassmorphism border-0 shadow-2xl relative overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Welcome & AI Companion */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">AI Companion Online</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    Hi {profile?.name || 'there'}! 👋
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    I&apos;m your AI companion, ready to listen and support you. 
                  </p>
                </div>

                {/* Conversation Starter */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/50 dark:border-purple-800/50">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-1">
                        Let&apos;s talk about it
                      </p>
                      <p className="text-purple-700 dark:text-purple-300">
                        "{conversationStarter}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Response Input */}
                {!isRecording && !isAnalyzing && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quick response (optional):
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={quickResponse}
                        onChange={(e) => setQuickResponse(e.target.value)}
                        placeholder="Type how you're feeling or what's on your mind..."
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <Button
                        onClick={startRecording}
                        className="gradient-primary hover:scale-105 transition-transform px-4"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - Voice Interface */}
              <div className="flex flex-col items-center space-y-6">
                {/* Main Recording Button */}
                <div className="relative">
                  {/* Audio Level Visualization */}
                  {isRecording && (
                    <div className="absolute inset-0 rounded-full animate-pulse">
                      <div 
                        className="w-full h-full rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30"
                        style={{
                          transform: `scale(${1 + audioLevel / 500})`,
                          transition: 'transform 0.1s ease-out'
                        }}
                      ></div>
                    </div>
                  )}
                  
                  <Button
                    size="lg"
                    className={`w-32 h-32 rounded-full transition-all duration-300 relative z-10 ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-2xl' 
                        : isAnalyzing
                          ? 'bg-blue-500 hover:bg-blue-600 animate-spin'
                          : 'gradient-primary hover:scale-110 shadow-xl hover:shadow-2xl'
                    }`}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <Brain className="w-12 h-12 text-white" />
                    ) : isRecording ? (
                      <Square className="w-12 h-12 text-white" />
                    ) : (
                      <Mic className="w-12 h-12 text-white" />
                    )}
                  </Button>
                </div>

                {/* Recording Status */}
                <div className="text-center space-y-2">
                  {isAnalyzing ? (
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                        Analyzing your voice...
                      </p>
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  ) : isRecording ? (
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-red-600 dark:text-red-400">
                        Recording... {formatTime(recordingTime)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Speak naturally, I&apos;m listening
                      </p>
                      <div className="flex items-center justify-center space-x-2">
                        <Volume2 className="w-4 h-4 text-red-500" />
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 transition-all duration-100"
                            style={{ width: `${Math.min(audioLevel / 2, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                        Tap to start talking
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your AI companion is ready to listen
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-3">
                  <Link href="/voice">
                    <Button variant="outline" className="hover:scale-105 transition-transform">
                      <Mic className="w-4 h-4 mr-2" />
                      Full Session
                    </Button>
                  </Link>
                  <Link href="/mood">
                    <Button variant="outline" className="hover:scale-105 transition-transform">
                      <Heart className="w-4 h-4 mr-2" />
                      Track Mood
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Conversations & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent AI Conversations */}
        <div className="lg:col-span-2">
          <Card className="glassmorphism border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-purple-600" />
                  Recent Conversations
                </div>
                <Link href="/voice">
                  <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {voiceSessions.length > 0 ? (
                voiceSessions.map((session) => (
                  <div key={session.id} className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {session.title}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {Math.floor(session.duration / 60)}m {session.duration % 60}s
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {session.ai_response}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {session.emotions && (
                          <Badge className={getEmotionColor(session.emotions.primary || 'neutral')}>
                            {session.emotions.primary}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(session.created_at), 'MMM dd')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No conversations yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Start your first AI conversation above!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats & Wellness Tip */}
        <div className="space-y-6">
          {/* Today's Wellness Tip */}
          <Card className="glassmorphism border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                Daily Wellness Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg gradient-cool">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-sm">
                  {todaysTip}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Mood Stats */}
          <Card className="glassmorphism border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Average Mood</span>
                  <span className="font-medium text-gray-900 dark:text-white">{averageMood}/10</span>
                </div>
                <Progress value={averageMood * 10} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">AI Sessions</span>
                  <span className="font-medium text-gray-900 dark:text-white">{voiceSessions.length}</span>
                </div>
                <Progress value={Math.min(voiceSessions.length * 20, 100)} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Check-ins</span>
                  <span className="font-medium text-gray-900 dark:text-white">{moodEntries.length}</span>
                </div>
                <Progress value={Math.min(moodEntries.length * 10, 100)} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mood Trend Chart (if data exists) */}
      {chartData.length > 0 && (
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Your Mood Journey
            </CardTitle>
            <CardDescription>Track your emotional patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    domain={[1, 10]} 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="url(#gradient)" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: '#8B5CF6' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="glassmorphism border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Explore More Tools</CardTitle>
          <CardDescription>Additional ways to support your mental health journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/mood">
              <Button className="w-full justify-start gradient-primary hover:scale-105 transition-transform">
                <Heart className="w-4 h-4 mr-2" />
                Track Mood
              </Button>
            </Link>
            <Link href="/notes">
              <Button className="w-full justify-start gradient-secondary hover:scale-105 transition-transform">
                <MessageCircle className="w-4 h-4 mr-2" />
                Write Note
              </Button>
            </Link>
            <Link href="/analytics">
              <Button className="w-full justify-start gradient-accent hover:scale-105 transition-transform">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </Link>
            <Link href="/crisis">
              <Button className="w-full justify-start gradient-warm hover:scale-105 transition-transform">
                <Phone className="w-4 h-4 mr-2" />
                Crisis Support
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}