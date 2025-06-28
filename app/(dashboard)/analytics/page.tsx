'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-provider';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { 
  BarChart3, TrendingUp, Calendar, Heart, Brain, 
  Target, Award, Download, Filter, RefreshCw
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

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
  mood_score: number | null;
  tags: string[];
  created_at: string;
}

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1'];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [voiceSessions, setVoiceSessions] = useState<VoiceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [refreshing, setRefreshing] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user, timeRange]);

  const fetchAnalyticsData = async () => {
    setRefreshing(true);
    try {
      const [moodData, voiceData] = await Promise.all([
        supabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('voice_sessions')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
      ]);

      setMoodEntries(moodData.data || []);
      setVoiceSessions(voiceData.data || []);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const exportData = () => {
    try {
      const data = {
        moodEntries: moodEntries.map(entry => ({
          date: format(new Date(entry.created_at), 'yyyy-MM-dd'),
          mood: entry.mood,
          emotions: entry.emotions.join(', '),
          note: entry.note || ''
        })),
        voiceSessions: voiceSessions.map(session => ({
          date: format(new Date(session.created_at), 'yyyy-MM-dd'),
          title: session.title,
          duration: session.duration,
          moodScore: session.mood_score,
          primaryEmotion: session.emotions?.primary || '',
          tags: session.tags.join(', ')
        })),
        summary: {
          totalMoodEntries: moodEntries.length,
          totalVoiceSessions: voiceSessions.length,
          averageMood: moodEntries.length > 0 
            ? (moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length).toFixed(1)
            : 0,
          exportDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        }
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resonance-analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Analytics data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  // Calculate date range based on selection
  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case 'week':
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'month':
        return { start: subDays(now, 30), end: now };
      case 'quarter':
        return { start: subDays(now, 90), end: now };
      default:
        return { start: subDays(now, 30), end: now };
    }
  };

  const { start: dateStart, end: dateEnd } = getDateRange();

  // Filter data by date range
  const filteredMoodEntries = moodEntries.filter(entry => {
    const entryDate = new Date(entry.created_at);
    return entryDate >= dateStart && entryDate <= dateEnd;
  });

  const filteredVoiceSessions = voiceSessions.filter(session => {
    const sessionDate = new Date(session.created_at);
    return sessionDate >= dateStart && sessionDate <= dateEnd;
  });

  // Mood trend data
  const moodTrendData = eachDayOfInterval({ start: dateStart, end: dateEnd })
    .map(date => {
      const dayEntries = filteredMoodEntries.filter(entry => 
        format(new Date(entry.created_at), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      const avgMood = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => sum + entry.mood, 0) / dayEntries.length 
        : null;
      
      return {
        date: format(date, 'MMM dd'),
        mood: avgMood ? Math.round(avgMood * 10) / 10 : null,
        entries: dayEntries.length
      };
    })
    .filter(item => item.mood !== null);

  // Emotion distribution
  const emotionCounts = filteredMoodEntries
    .flatMap(entry => entry.emotions)
    .reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const emotionData = Object.entries(emotionCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([emotion, count]) => ({ emotion, count }));

  // Weekly mood distribution
  const moodDistribution = Array.from({ length: 10 }, (_, i) => {
    const moodValue = i + 1;
    const count = filteredMoodEntries.filter(entry => entry.mood === moodValue).length;
    return { mood: moodValue, count };
  }).filter(item => item.count > 0);

  // Voice session insights
  const voiceInsights = {
    totalSessions: filteredVoiceSessions.length,
    totalDuration: filteredVoiceSessions.reduce((sum, session) => sum + session.duration, 0),
    avgMoodScore: filteredVoiceSessions.length > 0 
      ? filteredVoiceSessions
          .filter(session => session.mood_score)
          .reduce((sum, session) => sum + (session.mood_score || 0), 0) / 
        filteredVoiceSessions.filter(session => session.mood_score).length
      : 0
  };

  // Calculate key metrics
  const averageMood = filteredMoodEntries.length > 0 
    ? filteredMoodEntries.reduce((sum, entry) => sum + entry.mood, 0) / filteredMoodEntries.length 
    : 0;

  const validMoodData = moodTrendData.filter(
    (item): item is { date: string; mood: number; entries: number } => item.mood !== null && item.mood !== undefined
  );
  const moodTrend = validMoodData.length >= 2
    ? validMoodData[validMoodData.length - 1].mood - validMoodData[0].mood
    : 0;

  const streakCount = (() => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasEntry = moodEntries.some(entry => 
        format(new Date(entry.created_at), 'yyyy-MM-dd') === format(checkDate, 'yyyy-MM-dd')
      );
      
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  })();

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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize your mental health journey with detailed insights and trends
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
            {(['week', 'month', 'quarter'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={`rounded-none first:rounded-l-lg last:rounded-r-lg ${
                  timeRange === range ? 'gradient-primary text-white' : ''
                }`}
              >
                {range === 'week' ? '7 Days' : range === 'month' ? '30 Days' : '90 Days'}
              </Button>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchAnalyticsData}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={exportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glassmorphism border-0 shadow-xl hover:scale-105 transition-transform">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Mood</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {averageMood.toFixed(1)}/10
                </p>
                <div className="flex items-center mt-1">
                  {moodTrend > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-500 mr-1 rotate-180" />
                  )}
                  <span className={`text-sm ${moodTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Math.abs(moodTrend).toFixed(1)} from start
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-0 shadow-xl hover:scale-105 transition-transform">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tracking Streak</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {streakCount}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {streakCount === 1 ? 'day' : 'days'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full gradient-secondary flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-0 shadow-xl hover:scale-105 transition-transform">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Voice Sessions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {voiceInsights.totalSessions}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.floor(voiceInsights.totalDuration / 60)}m total
                </p>
              </div>
              <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-0 shadow-xl hover:scale-105 transition-transform">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Wellness Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {Math.round(averageMood * 10)}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Overall progress
                </p>
              </div>
              <div className="w-12 h-12 rounded-full gradient-warm flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mood Trend Chart */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Mood Trend Over Time
            </CardTitle>
            <CardDescription>
              Track your emotional patterns and identify trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={moodTrendData}>
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
                  <Area 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#8B5CF6" 
                    fill="url(#moodGradient)"
                    strokeWidth={3}
                  />
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Emotion Distribution */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-purple-600" />
              Emotion Distribution
            </CardTitle>
            <CardDescription>
              Most frequently experienced emotions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis type="number" stroke="#6B7280" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="emotion" 
                    stroke="#6B7280" 
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Mood Distribution */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
              Mood Score Distribution
            </CardTitle>
            <CardDescription>
              Frequency of different mood ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moodDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="mood" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
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
                  <Bar 
                    dataKey="count" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Insights Panel */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              AI Insights
            </CardTitle>
            <CardDescription>
              Personalized observations about your mental health journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {averageMood >= 7 && (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                        Positive Trend
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Your average mood is in the positive range. Keep up the great work!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {streakCount >= 7 && (
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200">
                        Consistency Achievement
                      </h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                        You've maintained a {streakCount}-day tracking streak. Consistency is key to understanding patterns!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {emotionData.length > 0 && (
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-3">
                    <Heart className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Emotion Pattern
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Your most common emotion is "{emotionData[0]?.emotion}". Consider what triggers this feeling.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Recommendation
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {filteredMoodEntries.length < 7 
                        ? "Try to log your mood daily for more accurate insights and patterns."
                        : "Consider adding more detailed notes to your mood entries for deeper self-reflection."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {filteredMoodEntries.length === 0 && filteredVoiceSessions.length === 0 && (
        <div className="text-center py-12">
          <Card className="glassmorphism border-0 shadow-xl mx-auto max-w-md">
            <CardContent className="p-12">
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                No data for this period
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start tracking your mood and recording voice sessions to see detailed analytics.
              </p>
              <div className="flex gap-3 justify-center">
                <Button className="gradient-primary">
                  <Heart className="w-4 h-4 mr-2" />
                  Track Mood
                </Button>
                <Button variant="outline">
                  <Brain className="w-4 h-4 mr-2" />
                  Record Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}