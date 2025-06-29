import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Get user session
    const cookieStore = cookies();
    const supabase = createClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Fetch user data
    const [profileResult, moodEntriesResult, voiceSessionsResult, notesResult, settingsResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('mood_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('voice_sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('notes').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('user_settings').select('*').eq('user_id', userId).single()
    ]);
    
    // Check for errors
    if (profileResult.error || moodEntriesResult.error || voiceSessionsResult.error || notesResult.error) {
      console.error('Data fetch error:', {
        profile: profileResult.error,
        mood: moodEntriesResult.error,
        voice: voiceSessionsResult.error,
        notes: notesResult.error
      });
      
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }
    
    // Prepare export data
    const userData = {
      profile: profileResult.data,
      moodEntries: moodEntriesResult.data || [],
      voiceSessions: voiceSessionsResult.data || [],
      notes: notesResult.data || [],
      settings: settingsResult.data || {},
      exportDate: new Date().toISOString(),
      exportVersion: '1.0'
    };
    
    // Set headers for file download
    return NextResponse.json(
      userData,
      {
        headers: {
          'Content-Disposition': 'attachment; filename="resonance-data-export.json"',
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}