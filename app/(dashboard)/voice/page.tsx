'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-provider';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { 
  Mic, Play, Pause, Square, Search, Filter, 
  Calendar, Clock, Tag, MessageCircle, Brain,
  Sparkles, Volume2, FileText, TrendingUp, Save, Upload
} from 'lucide-react';
import { format } from 'date-fns';

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
  audio_url?: string;
}

export default function VoiceSessionsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<VoiceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState<VoiceSession | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionTranscript, setSessionTranscript] = useState('');
  const [saving, setSaving] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('voice_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setAudioChunks([]);
      recorder.start();
      setRecording(true);
      setRecordingTime(0);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      toast.success('Recording stopped');
    }
  };

  const saveSession = async () => {
    if (!sessionTitle.trim() || !sessionTranscript.trim()) {
      toast.error('Please provide both title and transcript');
      return;
    }

    setSaving(true);
    try {
      let audioUrl = null;

      // Upload audio file if we have chunks
      if (audioChunks.length > 0) {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const fileName = `voice-session-${Date.now()}.webm`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('voice-recordings')
          .upload(`${user?.id}/${fileName}`, audioBlob);

        if (uploadError) {
          console.error('Error uploading audio:', uploadError);
        } else {
          const { data: urlData } = supabase.storage
            .from('voice-recordings')
            .getPublicUrl(uploadData.path);
          audioUrl = urlData.publicUrl;
        }
      }

      // Generate mock AI analysis
      const mockEmotions = {
        primary: ['happy', 'calm', 'anxious', 'excited', 'peaceful'][Math.floor(Math.random() * 5)],
        secondary: ['hopeful', 'content', 'reflective', 'energetic'][Math.floor(Math.random() * 4)],
        intensity: Math.round((Math.random() * 5 + 5) * 10) / 10,
        confidence: Math.round((Math.random() * 0.3 + 0.7) * 100) / 100
      };

      const mockMoodScore = Math.floor(Math.random() * 4) + 6; // 6-10 range

      const mockAIResponse = `Thank you for sharing your thoughts with me. I can sense ${mockEmotions.primary} emotions in your voice today. Your reflection shows great self-awareness, and I appreciate your openness in expressing your feelings. Remember that every emotion you experience is valid and part of your unique journey. Consider taking some time for self-care today, perhaps through deep breathing or a mindful walk. You're doing great by taking the time to check in with yourself.`;

      const { error } = await supabase
        .from('voice_sessions')
        .insert({
          user_id: user?.id,
          title: sessionTitle.trim(),
          transcript: sessionTranscript.trim(),
          duration: recordingTime,
          emotions: mockEmotions,
          ai_response: mockAIResponse,
          mood_score: mockMoodScore,
          tags: ['self-reflection', 'voice-analysis'],
          audio_url: audioUrl
        });

      if (error) throw error;

      toast.success('Voice session saved successfully!');
      setSessionTitle('');
      setSessionTranscript('');
      setAudioChunks([]);
      setRecordingTime(0);
      fetchSessions();
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Failed to save session');
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.transcript.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      anxious: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      grateful: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      sad: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      energetic: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      peaceful: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      overwhelmed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      content: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      accomplished: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      happy: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      calm: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      excited: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      hopeful: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      reflective: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colors[emotion.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getMoodScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-500';
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

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
          Voice Sessions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Record and analyze your thoughts with AI-powered emotional insights
        </p>
      </div>

      {/* Recording Interface */}
      <Card className="glassmorphism border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mic className="w-5 h-5 mr-2 text-purple-600" />
            Record New Session
          </CardTitle>
          <CardDescription>
            Share your thoughts and feelings in a safe, private space
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center">
            <Button
              size="lg"
              className={`w-24 h-24 rounded-full transition-all duration-300 ${
                recording 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'gradient-primary hover:scale-110'
              }`}
              onClick={recording ? stopRecording : startRecording}
            >
              {recording ? (
                <Square className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {recording ? 'Recording in progress...' : 'Click to start recording'}
            </p>
            {recording && (
              <div className="mt-2 flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-red-500">{formatTime(recordingTime)}</span>
              </div>
            )}
          </div>

          {/* Session Details Form */}
          {(audioChunks.length > 0 || recordingTime > 0) && (
            <div className="space-y-4 border-t pt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Session Title
                </label>
                <Input
                  placeholder="Give your session a meaningful title..."
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Transcript / Notes
                </label>
                <Textarea
                  placeholder="What did you talk about? Add your thoughts or a transcript here..."
                  value={sessionTranscript}
                  onChange={(e) => setSessionTranscript(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                onClick={saveSession}
                disabled={saving || !sessionTitle.trim() || !sessionTranscript.trim()}
                className="w-full gradient-primary hover:scale-105 transition-transform"
              >
                {saving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Session
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search sessions, transcripts, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSessions.map((session) => (
          <Card 
            key={session.id} 
            className="glassmorphism border-0 shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedSession(session)}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {session.title}
                  </h3>
                  {session.mood_score && (
                    <Badge 
                      variant="outline" 
                      className={`${getMoodScoreColor(session.mood_score)} border-current`}
                    >
                      {session.mood_score}/10
                    </Badge>
                  )}
                </div>

                {/* Transcript Preview */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {session.transcript}
                </p>

                {/* Emotions */}
                {session.emotions && (
                  <div className="flex flex-wrap gap-1">
                    <Badge className={getEmotionColor(session.emotions.primary || 'neutral')}>
                      {session.emotions.primary}
                    </Badge>
                    {session.emotions.secondary && (
                      <Badge variant="outline" className="text-xs">
                        {session.emotions.secondary}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Tags */}
                {session.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {session.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {session.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{session.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {Math.floor(session.duration / 60)}m {session.duration % 60}s
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {format(new Date(session.created_at), 'MMM dd')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSessions.length === 0 && !loading && (
        <div className="text-center py-12">
          <Card className="glassmorphism border-0 shadow-xl mx-auto max-w-md">
            <CardContent className="p-12">
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
                <Mic className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {searchTerm ? 'No sessions found' : 'No voice sessions yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters'
                  : 'Start by recording your first voice session to track your emotional journey'
                }
              </p>
              {!searchTerm && (
                <Button className="gradient-primary" onClick={startRecording}>
                  <Mic className="w-4 h-4 mr-2" />
                  Record First Session
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedSession(null)}>
          <Card className="glassmorphism border-0 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedSession.title}</CardTitle>
                  <CardDescription className="flex items-center mt-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(new Date(selectedSession.created_at), 'MMMM dd, yyyy')}
                    <Clock className="w-4 h-4 ml-4 mr-2" />
                    {Math.floor(selectedSession.duration / 60)}m {selectedSession.duration % 60}s
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedSession(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 overflow-y-auto">
              {/* Audio Player */}
              {selectedSession.audio_url && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Audio Recording
                  </h4>
                  <audio controls className="w-full">
                    <source src={selectedSession.audio_url} type="audio/webm" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Emotions & Mood */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Emotional Analysis</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSession.emotions && (
                    <>
                      <Badge className={getEmotionColor(selectedSession.emotions.primary || 'neutral')}>
                        Primary: {selectedSession.emotions.primary}
                      </Badge>
                      {selectedSession.emotions.secondary && (
                        <Badge variant="outline">
                          Secondary: {selectedSession.emotions.secondary}
                        </Badge>
                      )}
                      {selectedSession.mood_score && (
                        <Badge variant="outline" className={getMoodScoreColor(selectedSession.mood_score)}>
                          Mood: {selectedSession.mood_score}/10
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Transcript */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Transcript
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedSession.transcript}
                  </p>
                </div>
              </div>

              {/* AI Response */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Insights
                </h4>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <p className="text-purple-800 dark:text-purple-200 leading-relaxed">
                    {selectedSession.ai_response}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {selectedSession.tags.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSession.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}