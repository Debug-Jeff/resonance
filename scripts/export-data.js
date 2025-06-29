#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function exportUserData(userId) {
  try {
    console.log(`Exporting data for user ${userId}...`);
    
    // Fetch user data
    const [profileResult, moodEntriesResult, voiceSessionsResult, notesResult, settingsResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('mood_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('voice_sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('notes').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('user_settings').select('*').eq('user_id', userId).single()
    ]);
    
    // Check for errors
    const errors = [];
    if (profileResult.error) errors.push(`Profile error: ${profileResult.error.message}`);
    if (moodEntriesResult.error) errors.push(`Mood entries error: ${moodEntriesResult.error.message}`);
    if (voiceSessionsResult.error) errors.push(`Voice sessions error: ${voiceSessionsResult.error.message}`);
    if (notesResult.error) errors.push(`Notes error: ${notesResult.error.message}`);
    if (settingsResult.error && settingsResult.error.code !== 'PGRST116') {
      errors.push(`Settings error: ${settingsResult.error.message}`);
    }
    
    if (errors.length > 0) {
      console.error('Errors occurred during data export:');
      errors.forEach(err => console.error(` - ${err}`));
      return;
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
    
    // Create export directory if it doesn't exist
    const exportDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }
    
    // Write to file
    const fileName = `resonance-data-export-${userId}-${new Date().toISOString().split('T')[0]}.json`;
    const filePath = path.join(exportDir, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
    
    console.log(`Data exported successfully to ${filePath}`);
  } catch (error) {
    console.error('Export error:', error);
  }
}

// Get user ID from command line arguments
const userId = process.argv[2];

if (!userId) {
  console.error('Please provide a user ID as an argument');
  console.log('Usage: node export-data.js USER_ID');
  process.exit(1);
}

exportUserData(userId);