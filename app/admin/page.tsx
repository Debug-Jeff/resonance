'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { 
  Users, Activity, Calendar, Brain, 
  Heart, MessageCircle, BarChart3, Download
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSessions: 0,
    totalMoodEntries: 0,
    averageMood: 0,
    maleUsers: 0,
    femaleUsers: 0,
    otherUsers: 0
  });
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [genderDistribution, setGenderDistribution] = useState<any[]>([]);
  const [ageDistribution, setAgeDistribution] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch user stats
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*');
      
      if (usersError) throw usersError;
      
      // Fetch voice sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('voice_sessions')
        .select('*');
      
      if (sessionsError) throw sessionsError;
      
      // Fetch mood entries
      const { data: moodEntries, error: moodError } = await supabase
        .from('mood_entries')
        .select('*');
      
      if (moodError) throw moodError;
      
      // Calculate stats
      const totalUsers = users?.length || 0;
      const lastMonth = subDays(new Date(), 30);
      const activeUsers = users?.filter(user => 
        new Date(user.updated_at) >= lastMonth
      ).length || 0;
      
      const totalSessions = sessions?.length || 0;
      const totalMoodEntries = moodEntries?.length || 0;
      
      const moodSum = moodEntries?.reduce((sum, entry) => sum + entry.mood, 0) || 0;
      const averageMood = totalMoodEntries > 0 ? Math.round((moodSum / totalMoodEntries) * 10) / 10 : 0;
      
      // Gender distribution
      const maleUsers = users?.filter(user => user.gender === 'male').length || 0;
      const femaleUsers = users?.filter(user => user.gender === 'female').length || 0;
      const otherUsers = users?.filter(user => user.gender === 'other' || !user.gender).length || 0;
      
      setStats({
        totalUsers,
        activeUsers,
        totalSessions,
        totalMoodEntries,
        averageMood,
        maleUsers,
        femaleUsers,
        otherUsers
      });
      
      // Generate user growth data (last 30 days)
      const growthData = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(new Date(), 29 - i);
        const formattedDate = format(date, 'MMM dd');
        const count = users?.filter(user => 
          new Date(user.joined_at).toDateString() === date.toDateString()
        ).length || 0;
        
        return { date: formattedDate, users: count };
      });
      
      // Calculate cumulative growth
      let cumulativeUsers = 0;
      const cumulativeGrowthData = growthData.map(day => {
        cumulativeUsers += day.users;
        return {
          ...day,
          totalUsers: cumulativeUsers
        };
      });
      
      setUserGrowth(cumulativeGrowthData);
      
      // Generate activity data (last 7 days)
      const activityData = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        const formattedDate = format(date, 'EEE');
        
        const moodCount = moodEntries?.filter(entry => 
          new Date(entry.created_at).toDateString() === date.toDateString()
        ).length || 0;
        
        const sessionCount = sessions?.filter(session => 
          new Date(session.created_at).toDateString() === date.toDateString()
        ).length || 0;
        
        return {
          day: formattedDate,
          'Mood Entries': moodCount,
          'Voice Sessions': sessionCount
        };
      });
      
      setActivityData(activityData);
      
      // Gender distribution for pie chart
      setGenderDistribution([
        { name: 'Male', value: maleUsers },
        { name: 'Female', value: femaleUsers },
        { name: 'Other', value: otherUsers }
      ]);
      
      // Age distribution (mock data - replace with real data when available)
      setAgeDistribution([
        { name: '18-24', value: Math.floor(totalUsers * 0.25) },
        { name: '25-34', value: Math.floor(totalUsers * 0.35) },
        { name: '35-44', value: Math.floor(totalUsers * 0.20) },
        { name: '45-54', value: Math.floor(totalUsers * 0.10) },
        { name: '55+', value: Math.floor(totalUsers * 0.10) }
      ]);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      // Fetch all data
      const [usersResult, sessionsResult, moodEntriesResult] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('voice_sessions').select('*'),
        supabase.from('mood_entries').select('*')
      ]);
      
      const exportData = {
        users: usersResult.data,
        sessions: sessionsResult.data,
        moodEntries: moodEntriesResult.data,
        exportDate: new Date().toISOString(),
        stats: stats
      };
      
      // Create downloadable file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resonance-admin-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const COLORS = ['#8B5CF6', '#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];

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
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of platform metrics and user analytics
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchDashboardData}
          >
            <Activity className="w-4 h-4 mr-2" />
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalUsers}
                </p>
                <div className="flex items-center mt-1">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active
                  </Badge>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
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
                  {stats.totalSessions}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total recorded
                </p>
              </div>
              <div className="w-12 h-12 rounded-full gradient-secondary flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-0 shadow-xl hover:scale-105 transition-transform">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mood Entries</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalMoodEntries}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Avg: {stats.averageMood}/10
                </p>
              </div>
              <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-0 shadow-xl hover:scale-105 transition-transform">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gender Ratio</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.maleUsers}:{stats.femaleUsers}:{stats.otherUsers}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  M:F:Other
                </p>
              </div>
              <div className="w-12 h-12 rounded-full gradient-warm flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              User Growth
            </CardTitle>
            <CardDescription>
              New user registrations over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={12}
                    tickFormatter={(value) => value.split(' ')[0]}
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
                  <Line 
                    type="monotone" 
                    dataKey="totalUsers" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#8B5CF6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity Chart */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-600" />
              Daily Activity
            </CardTitle>
            <CardDescription>
              User engagement over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
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
                  <Bar dataKey="Mood Entries" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Voice Sessions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              Gender Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of users by gender
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {genderDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} users`, 'Count']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Age Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of users by age range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis type="number" stroke="#6B7280" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#6B7280" 
                    fontSize={12}
                    width={50}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} users`, 'Count']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}