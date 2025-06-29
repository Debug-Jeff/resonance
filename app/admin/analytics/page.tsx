'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, eachMonthOfInterval, subMonths } from 'date-fns';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [refreshing, setRefreshing] = useState(false);
  
  // Analytics data states
  const [moodTrend, setMoodTrend] = useState<any[]>([]);
  const [emotionDistribution, setEmotionDistribution] = useState<any[]>([]);
  const [sessionsByDay, setSessionsByDay] = useState<any[]>([]);
  const [userRetention, setUserRetention] = useState<any[]>([]);
  const [topTags, setTopTags] = useState<any[]>([]);
  const [moodDistribution, setMoodDistribution] = useState<any[]>([]);
  
  const supabase = createClient();

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setRefreshing(true);
    try {
      // Get date range based on selection
      const { startDate, endDate } = getDateRange();
      
      // Fetch all required data
      const [moodEntriesResult, voiceSessionsResult, usersResult] = await Promise.all([
        supabase
          .from('mood_entries')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        supabase
          .from('voice_sessions')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        supabase
          .from('profiles')
          .select('*')
      ]);
      
      const moodEntries = moodEntriesResult.data || [];
      const voiceSessions = voiceSessionsResult.data || [];
      const users = usersResult.data || [];
      
      // Process mood trend data
      processMoodTrendData(moodEntries, startDate, endDate);
      
      // Process emotion distribution
      processEmotionDistribution(moodEntries);
      
      // Process sessions by day
      processSessionsByDay(voiceSessions, startDate, endDate);
      
      // Process user retention (mock data for now)
      processUserRetention(users, startDate, endDate);
      
      // Process top tags
      processTopTags(voiceSessions);
      
      // Process mood distribution
      processMoodDistribution(moodEntries);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    let startDate, endDate;
    
    switch (timeRange) {
      case 'week':
        startDate = subDays(now, 7);
        endDate = now;
        break;
      case 'month':
        startDate = subDays(now, 30);
        endDate = now;
        break;
      case 'quarter':
        startDate = subDays(now, 90);
        endDate = now;
        break;
      case 'year':
        startDate = subDays(now, 365);
        endDate = now;
        break;
      default:
        startDate = subDays(now, 30);
        endDate = now;
    }
    
    return { startDate, endDate };
  };

  const processMoodTrendData = (moodEntries: any[], startDate: Date, endDate: Date) => {
    // Generate date intervals based on time range
    let dateInterval;
    let dateFormat;
    
    if (timeRange === 'week') {
      dateInterval = eachDayOfInterval({ start: startDate, end: endDate });
      dateFormat = 'MMM dd';
    } else if (timeRange === 'month') {
      dateInterval = eachDayOfInterval({ start: startDate, end: endDate });
      dateFormat = 'MMM dd';
    } else if (timeRange === 'quarter') {
      // For quarter, group by week
      dateInterval = [];
      let current = new Date(startDate);
      while (current <= endDate) {
        dateInterval.push(new Date(current));
        current.setDate(current.getDate() + 7);
      }
      dateFormat = 'MMM dd';
    } else {
      // For year, group by month
      dateInterval = eachMonthOfInterval({ start: startDate, end: endDate });
      dateFormat = 'MMM yyyy';
    }
    
    // Create data points for each interval
    const trendData = dateInterval.map(date => {
      let entriesInPeriod;
      
      if (timeRange === 'week' || timeRange === 'month') {
        // Daily data points
        entriesInPeriod = moodEntries.filter(entry => 
          new Date(entry.created_at).toDateString() === date.toDateString()
        );
      } else if (timeRange === 'quarter') {
        // Weekly data points
        const weekStart = new Date(date);
        const weekEnd = new Date(date);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        entriesInPeriod = moodEntries.filter(entry => {
          const entryDate = new Date(entry.created_at);
          return entryDate >= weekStart && entryDate <= weekEnd;
        });
      } else {
        // Monthly data points
        entriesInPeriod = moodEntries.filter(entry => {
          const entryDate = new Date(entry.created_at);
          return entryDate.getMonth() === date.getMonth() && 
                 entryDate.getFullYear() === date.getFullYear();
        });
      }
      
      const avgMood = entriesInPeriod.length > 0 
        ? entriesInPeriod.reduce((sum, entry) => sum + entry.mood, 0) / entriesInPeriod.length 
        : null;
      
      return {
        date: format(date, dateFormat),
        mood: avgMood ? Math.round(avgMood * 10) / 10 : null,
        entries: entriesInPeriod.length
      };
    });
    
    setMoodTrend(trendData.filter(item => item.mood !== null));
  };

  const processEmotionDistribution = (moodEntries: any[]) => {
    // Count occurrences of each emotion
    const emotionCounts: Record<string, number> = {};
    
    moodEntries.forEach(entry => {
      if (entry.emotions && Array.isArray(entry.emotions)) {
        entry.emotions.forEach((emotion: string) => {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
      }
    });
    
    // Convert to array and sort by count
    const emotionData = Object.entries(emotionCounts)
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 emotions
    
    setEmotionDistribution(emotionData);
  };

  const processSessionsByDay = (voiceSessions: any[], startDate: Date, endDate: Date) => {
    // Group sessions by day of week
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const sessionsByDay = dayNames.map(day => ({ day, count: 0 }));
    
    voiceSessions.forEach(session => {
      const sessionDate = new Date(session.created_at);
      const dayOfWeek = sessionDate.getDay();
      sessionsByDay[dayOfWeek].count += 1;
    });
    
    setSessionsByDay(sessionsByDay);
  };

  const processUserRetention = (users: any[], startDate: Date, endDate: Date) => {
    // This would normally be calculated from actual user activity data
    // For now, we'll create mock retention data
    
    // Get months in range
    const months = eachMonthOfInterval({ start: subMonths(endDate, 6), end: endDate });
    
    // Create retention data (mock)
    const retentionData = months.map((month, index) => {
      const monthName = format(month, 'MMM yyyy');
      // Simulate decreasing retention rates
      const retentionRate = Math.max(30, 100 - (index * 10) - Math.floor(Math.random() * 10));
      
      return {
        month: monthName,
        retention: retentionRate
      };
    });
    
    setUserRetention(retentionData);
  };

  const processTopTags = (voiceSessions: any[]) => {
    // Count occurrences of each tag
    const tagCounts: Record<string, number> = {};
    
    voiceSessions.forEach(session => {
      if (session.tags && Array.isArray(session.tags)) {
        session.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    // Convert to array and sort by count
    const tagData = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 tags
    
    setTopTags(tagData);
  };

  const processMoodDistribution = (moodEntries: any[]) => {
    // Count occurrences of each mood score (1-10)
    const moodCounts = Array.from({ length: 10 }, (_, i) => ({
      mood: i + 1,
      count: 0
    }));
    
    moodEntries.forEach(entry => {
      if (entry.mood >= 1 && entry.mood <= 10) {
        moodCounts[entry.mood - 1].count += 1;
      }
    });
    
    setMoodDistribution(moodCounts.filter(item => item.count > 0));
  };

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1'];

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 skeleton"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 skeleton"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton"></div>
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
            Platform Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Detailed insights into user behavior and platform usage
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
            {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={`rounded-none first:rounded-l-lg last:rounded-r-lg ${
                  timeRange === range ? 'gradient-primary text-white' : ''
                }`}
              >
                {range === 'week' ? '7 Days' : 
                 range === 'month' ? '30 Days' : 
                 range === 'quarter' ? '90 Days' : '1 Year'}
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
        </div>
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
              Average mood scores across all users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={moodTrend}>
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
              Most frequently reported emotions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionDistribution} layout="horizontal">
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

        {/* Sessions by Day of Week */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Sessions by Day of Week
            </CardTitle>
            <CardDescription>
              When users are most active
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionsByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="day" 
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

        {/* User Retention */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              User Retention
            </CardTitle>
            <CardDescription>
              Monthly user retention rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userRetention}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Retention']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="retention" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: '#10B981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Tags */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              Top Tags
            </CardTitle>
            <CardDescription>
              Most common tags in voice sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topTags} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis type="number" stroke="#6B7280" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="tag" 
                    stroke="#6B7280" 
                    fontSize={12}
                    width={100}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="count" fill="#EC4899" radius={[0, 4, 4, 0]} />
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
                    fill="#F59E0B" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}