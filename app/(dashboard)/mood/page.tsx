'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/contexts/auth-provider';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { 
  Heart, Calendar as CalendarIcon, TrendingUp, Smile, 
  Frown, Meh, Plus, Save, BarChart3, Target
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

interface MoodEntry {
  id: string;
  mood: number;
  emotions: string[];
  note: string | null;
  created_at: string;
}

const moodEmojis = ['😢', '😟', '😐', '🙂', '😊', '😄', '😁', '🤩', '🥳', '🌟'];
const moodLabels = ['Terrible', 'Very Bad', 'Bad', 'Poor', 'Okay', 'Good', 'Great', 'Excellent', 'Amazing', 'Perfect'];

const emotionOptions = [
  'happy', 'sad', 'anxious', 'calm', 'angry', 'excited', 
  'grateful', 'stressed', 'peaceful', 'overwhelmed', 
  'hopeful', 'lonely', 'content', 'frustrated', 'energetic',
  'tired', 'confident', 'worried', 'relaxed', 'motivated'
];

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
    peaceful: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    overwhelmed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    hopeful: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
    lonely: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    content: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    frustrated: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    energetic: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
    tired: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
    confident: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
    worried: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    relaxed: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    motivated: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
  };
  return colors[emotion.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};

export default function MoodTrackingPage() {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      fetchMoodEntries();
    }
  }, [user]);

  const fetchMoodEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMoodEntries(data || []);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
      toast.error('Failed to load mood entries');
    } finally {
      setLoading(false);
    }
  };

  const saveMoodEntry = async () => {
    if (!selectedMood) {
      toast.error('Please select a mood rating');
      return;
    }

    setSaving(true);
    try {
      // Check if entry already exists for today
      const existingEntry = moodEntries.find(entry => 
        isSameDay(new Date(entry.created_at), selectedDate)
      );

      if (existingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('mood_entries')
          .update({
            mood: selectedMood,
            emotions: selectedEmotions,
            note: note.trim() || null,
            created_at: selectedDate.toISOString()
          })
          .eq('id', existingEntry.id);

        if (error) throw error;
        toast.success('Mood entry updated successfully!');
      } else {
        // Create new entry
        const { error } = await supabase
          .from('mood_entries')
          .insert({
            user_id: user?.id,
            mood: selectedMood,
            emotions: selectedEmotions,
            note: note.trim() || null,
            created_at: selectedDate.toISOString()
          });

        if (error) throw error;
        toast.success('Mood entry saved successfully!');
      }

      setSelectedMood(null);
      setSelectedEmotions([]);
      setNote('');
      fetchMoodEntries();
    } catch (error) {
      console.error('Error saving mood entry:', error);
      toast.error('Failed to save mood entry');
    } finally {
      setSaving(false);
    }
  };

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const getTodaysEntry = () => {
    return moodEntries.find(entry => 
      isSameDay(new Date(entry.created_at), selectedDate)
    );
  };

  const getCalendarMoodData = () => {
    const monthStart = startOfMonth(calendarDate);
    const monthEnd = endOfMonth(calendarDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return days.map(day => {
      const entry = moodEntries.find(entry => 
        isSameDay(new Date(entry.created_at), day)
      );
      return {
        date: day,
        mood: entry?.mood || null,
        hasEntry: !!entry
      };
    });
  };

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0;
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood, 0);
    return Math.round(sum / moodEntries.length);
  };

  const getStreakCount = () => {
    if (moodEntries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasEntry = moodEntries.some(entry => 
        isSameDay(new Date(entry.created_at), checkDate)
      );
      
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const todaysEntry = getTodaysEntry();
  const calendarData = getCalendarMoodData();
  const averageMood = getAverageMood();
  const streakCount = getStreakCount();

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 skeleton"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 skeleton"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mood Tracking
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor your emotional patterns and discover what affects your wellbeing
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glassmorphism border-0 shadow-xl hover:scale-105 transition-transform">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Mood</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {averageMood}/10
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {moodLabels[averageMood - 1] || 'No data'}
                </p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Streak</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Entries</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {moodEntries.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  mood records
                </p>
              </div>
              <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mood Entry Form */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2 text-purple-600" />
              Track Your Mood
            </CardTitle>
            <CardDescription>
              How are you feeling today? Rate your mood and select emotions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {todaysEntry && isSameDay(selectedDate, new Date()) ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{moodEmojis[todaysEntry.mood - 1]}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Today's mood: {moodLabels[todaysEntry.mood - 1]}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You've already logged your mood for today!
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {todaysEntry.emotions.map((emotion) => (
                    <Badge key={emotion} className={getEmotionColor(emotion)}>
                      {emotion}
                    </Badge>
                  ))}
                </div>
                {todaysEntry.note && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      "{todaysEntry.note}"
                    </p>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedMood(todaysEntry.mood);
                    setSelectedEmotions([...todaysEntry.emotions]);
                    setNote(todaysEntry.note || '');
                  }}
                  className="mt-4"
                >
                  Edit Today's Entry
                </Button>
              </div>
            ) : (
              <>
                {/* Mood Scale */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Rate your mood (1-10)
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
                      <Button
                        key={mood}
                        variant={selectedMood === mood ? "default" : "outline"}
                        className={`h-16 flex flex-col items-center justify-center transition-all duration-200 ${
                          selectedMood === mood 
                            ? 'gradient-primary text-white scale-105' 
                            : 'hover:scale-105'
                        }`}
                        onClick={() => setSelectedMood(mood)}
                      >
                        <span className="text-xl mb-1">{moodEmojis[mood - 1]}</span>
                        <span className="text-xs">{mood}</span>
                      </Button>
                    ))}
                  </div>
                  {selectedMood && (
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                      {moodLabels[selectedMood - 1]}
                    </p>
                  )}
                </div>

                {/* Emotions */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    What emotions are you experiencing?
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {emotionOptions.map((emotion) => (
                      <Badge
                        key={emotion}
                        variant={selectedEmotions.includes(emotion) ? "default" : "outline"}
                        className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                          selectedEmotions.includes(emotion) 
                            ? getEmotionColor(emotion)
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => toggleEmotion(emotion)}
                      >
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Add a note (optional)
                  </h4>
                  <Textarea
                    placeholder="What's on your mind? Any specific thoughts or events affecting your mood?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Save Button */}
                <Button
                  onClick={saveMoodEntry}
                  disabled={!selectedMood || saving}
                  className="w-full gradient-primary hover:scale-105 transition-transform"
                  size="lg"
                >
                  {saving ? (
                    'Saving...'
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Mood Entry
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Calendar View */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-purple-600" />
              Mood Calendar
            </CardTitle>
            <CardDescription>
              View your mood history at a glance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                month={calendarDate}
                onMonthChange={setCalendarDate}
                className="rounded-md border"
                components={{
                  Day: ({ date, ...props }) => {
                    const dayData = calendarData.find(d => isSameDay(d.date, date));
                    return (
                      <div
                        {...props}
                        className={`relative w-full h-full flex items-center justify-center ${
                          dayData?.hasEntry ? 'font-bold' : ''
                        }`}
                      >
                        {date.getDate()}
                        {dayData?.hasEntry && (
                          <div 
                            className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${
                              dayData.mood != null
                                ? dayData.mood >= 8
                                  ? 'bg-green-500'
                                  : dayData.mood >= 6
                                    ? 'bg-yellow-500'
                                    : dayData.mood >= 4
                                      ? 'bg-orange-500'
                                      : 'bg-red-500'
                                : 'bg-gray-300'
                            }`}
                          />
                        )}
                      </div>
                    );
                  }
                }}
              />
              
              {/* Legend */}
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                  Great (8-10)
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                  Good (6-7)
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mr-1"></div>
                  Okay (4-5)
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                  Low (1-3)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      {moodEntries.length > 0 && (
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Recent Mood Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moodEntries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-start space-x-4 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{moodEmojis[entry.mood - 1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {moodLabels[entry.mood - 1]} ({entry.mood}/10)
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(entry.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    {entry.emotions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {entry.emotions.map((emotion) => (
                          <Badge key={emotion} className={getEmotionColor(emotion)} variant="secondary">
                            {emotion}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {entry.note && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        "{entry.note}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}