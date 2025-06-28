'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth-provider';
import { createClient } from '@/lib/supabase/client';
import { 
  Heart, Mic, TrendingUp, Calendar, Smile, 
  MessageCircle, BarChart3, Lightbulb, Plus 
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

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [voiceSessions, setVoiceSessions] = useState<VoiceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [todaysTip] = useState(wellnessTips[Math.floor(Math.random() * wellnessTips.length)]);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

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
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {profile?.name || 'there'}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isTestUser 
            ? "Here's your mental health overview with rich demo data." 
            : hasData 
              ? "Here's your mental health journey so far."
              : "Ready to start your mental health journey? Let's begin with tracking your mood!"
          }
        </p>
      </div>

      {!hasData && !isTestUser ? (
        // Empty State for New Users
        <div className="text-center py-12">
          <Card className="glassmorphism border-0 shadow-xl mx-auto max-w-2xl">
            <CardContent className="p-12">
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to Resonance!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Start your mental health journey by tracking your first mood entry. 
                This will help us provide personalized insights and support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/mood">
                  <Button size="lg" className="gradient-primary hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4 mr-2" />
                    Track Your Mood
                  </Button>
                </Link>
                <Link href="/voice">
                  <Button variant="outline" size="lg" className="hover:scale-105 transition-transform">
                    <Mic className="w-4 h-4 mr-2" />
                    Try Voice Session
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glassmorphism border-0 shadow-xl hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Mood</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {averageMood}/10
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <Smile className="w-6 h-6 text-white" />
                  </div>
                </div>
                <Progress value={averageMood * 10} className="mt-4" />
              </CardContent>
            </Card>

            <Card className="glassmorphism border-0 shadow-xl hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Voice Sessions</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {voiceSessions.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full gradient-secondary flex items-center justify-center">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Total sessions recorded
                </p>
              </CardContent>
            </Card>

            <Card className="glassmorphism border-0 shadow-xl hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mood Entries</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {moodEntries.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Days tracked this week
                </p>
              </CardContent>
            </Card>

            <Card className="glassmorphism border-0 shadow-xl hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Streak</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {isTestUser ? '7' : Math.min(moodEntries.length, 7)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full gradient-warm flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Consecutive days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mood Trend Chart */}
          {chartData.length > 0 && (
            <Card className="glassmorphism border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                  Mood Trend (Last 7 Days)
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Voice Sessions */}
            <Card className="glassmorphism border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mic className="w-5 h-5 mr-2 text-purple-600" />
                    Recent Voice Sessions
                  </div>
                  <Link href="/voice">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {voiceSessions.length > 0 ? (
                  voiceSessions.map((session) => (
                    <div key={session.id} className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {session.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(session.duration / 60)}m {session.duration % 60}s
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {session.transcript.substring(0, 120)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {session.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(session.created_at), 'MMM dd')}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No voice sessions yet</p>
                    <Link href="/voice">
                      <Button variant="outline" className="mt-2">
                        Record Your First Session
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Today's Wellness Tip */}
            <Card className="glassmorphism border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                  Today's Wellness Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-lg gradient-cool">
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {todaysTip}
                  </p>
                </div>
                
                {/* Recent Emotions */}
                {moodEntries.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recent Emotions</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(
                        moodEntries
                          .slice(0, 3)
                          .flatMap(entry => entry.emotions)
                      )).slice(0, 6).map((emotion) => (
                        <Badge key={emotion} className={getEmotionColor(emotion)}>
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="glassmorphism border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump into your mental health activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/mood">
                  <Button className="w-full justify-start gradient-primary hover:scale-105 transition-transform">
                    <Heart className="w-4 h-4 mr-2" />
                    Track Mood
                  </Button>
                </Link>
                <Link href="/voice">
                  <Button className="w-full justify-start gradient-secondary hover:scale-105 transition-transform">
                    <Mic className="w-4 h-4 mr-2" />
                    Voice Session
                  </Button>
                </Link>
                <Link href="/notes">
                  <Button className="w-full justify-start gradient-accent hover:scale-105 transition-transform">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Write Note
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button className="w-full justify-start gradient-warm hover:scale-105 transition-transform">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}