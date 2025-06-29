'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface ExportButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ExportButton({ 
  variant = 'outline', 
  size = 'default',
  className = ''
}: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const supabase = createClient();

  const handleExport = async () => {
    setExporting(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Fetch user data
      const [profileResult, moodEntriesResult, voiceSessionsResult, notesResult, settingsResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('mood_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('voice_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('user_settings').select('*').eq('user_id', user.id).single()
      ]);
      
      // Check for errors
      const errors = [];
      if (profileResult.error) errors.push(`Profile error: ${profileResult.error.message}`);
      if (moodEntriesResult.error) errors.push(`Mood entries error: ${moodEntriesResult.error.message}`);
      if (voiceSessionsResult.error) errors.push(`Voice sessions error: ${voiceSessionsResult.error.message}`);
      if (notesResult.error) errors.push(`Notes error: ${notesResult.error.message}`);
      
      if (errors.length > 0) {
        console.error('Errors occurred during data export:', errors);
        throw new Error('Failed to fetch user data');
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
      
      // Create a downloadable file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `resonance-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Your data has been exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={exporting}
      className={className}
    >
      {exporting ? (
        <>
          <span className="animate-spin mr-2">⏳</span>
          Exporting...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </>
      )}
    </Button>
  );
}