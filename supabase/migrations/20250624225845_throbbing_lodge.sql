/*
  # Create Test User and Seed Data

  This migration creates the test user through Supabase Auth and then adds the seed data.
  
  IMPORTANT: This migration should be run AFTER the main schema migration.
  
  Steps:
  1. Creates test user via auth.users (if not exists)
  2. Ensures profile is created via trigger
  3. Adds all the seed data for the test user
*/

-- First, let's create the test user in auth.users if it doesn't exist
-- Note: In production Supabase, you typically can't insert directly into auth.users
-- This is a workaround for development/demo purposes

DO $$
DECLARE
    test_user_id UUID := '550e8400-e29b-41d4-a716-446655440000';
    user_exists BOOLEAN;
BEGIN
    -- Check if user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = test_user_id) INTO user_exists;
    
    -- Only insert if user doesn't exist
    IF NOT user_exists THEN
        -- Insert test user into auth.users
        INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            test_user_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'testuser@resonance.ai',
            '$2a$10$YourHashedPasswordHere', -- This should be a properly hashed password
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"name": "Alex Chen"}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );
        
        -- Insert into auth.identities
        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            test_user_id,
            format('{"sub": "%s", "email": "%s"}', test_user_id, 'testuser@resonance.ai')::jsonb,
            'email',
            NOW(),
            NOW(),
            NOW()
        );
    END IF;
END $$;

-- Now insert the profile data (this will work because the user exists)
INSERT INTO public.profiles (id, email, name, avatar_url, theme, joined_at, updated_at) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'testuser@resonance.ai',
  'Alex Chen',
  'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
  'light',
  NOW() - INTERVAL '3 months',
  NOW() - INTERVAL '1 day'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = EXCLUDED.updated_at;

-- Insert mood entries for the last 7 days
INSERT INTO public.mood_entries (user_id, mood, emotions, note, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 6, ARRAY['anxious', 'hopeful'], 'Work stress but feeling optimistic about the future', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440000', 8, ARRAY['grateful', 'content'], 'Great family time today, feeling blessed', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440000', 4, ARRAY['sad', 'lonely'], 'Difficult day processing some emotions', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440000', 7, ARRAY['energetic', 'focused'], 'Productive morning workout, feeling strong', NOW() - INTERVAL '4 days'),
('550e8400-e29b-41d4-a716-446655440000', 5, ARRAY['neutral', 'tired'], 'Average day, low energy but stable', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440000', 9, ARRAY['joyful', 'excited'], 'Got great news from a friend, celebrating!', NOW() - INTERVAL '6 days'),
('550e8400-e29b-41d4-a716-446655440000', 6, ARRAY['contemplative', 'peaceful'], 'Good meditation session this morning', NOW() - INTERVAL '7 days')
ON CONFLICT DO NOTHING;

-- Insert voice sessions with realistic content
INSERT INTO public.voice_sessions (user_id, title, transcript, duration, emotions, ai_response, mood_score, tags, created_at) VALUES
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Work Stress Check-in',
  'I am feeling really overwhelmed with work today. The deadline is approaching and I am not sure if I can make it. Everything feels so chaotic right now. I keep thinking about all the things I need to do and it just feels like too much.',
  180,
  '{"primary": "anxious", "secondary": "overwhelmed", "intensity": 7.2, "confidence": 0.88}'::jsonb,
  'I can hear the stress in your voice, Alex. It sounds like you are carrying a heavy load right now. Remember that feeling overwhelmed is temporary, and you have successfully navigated challenging deadlines before. Would you like to try breaking down your tasks into smaller, manageable pieces? Sometimes when everything feels chaotic, creating a simple list can help bring clarity and control back to the situation.',
  4,
  ARRAY['work-stress', 'deadlines', 'anxiety'],
  NOW() - INTERVAL '1 day'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Family Gratitude Session',
  'Had such a wonderful conversation with my sister today. She really helped me see things from a different perspective. I feel so grateful to have her support. We talked for hours and I just felt so understood and loved.',
  240,
  '{"primary": "grateful", "secondary": "content", "intensity": 8.5, "confidence": 0.92}'::jsonb,
  'What a beautiful shift in your voice, Alex. I can hear the warmth and gratitude flowing through your words. Family support can be incredibly powerful, especially when we feel truly heard and understood. It sounds like you are feeling much more balanced and grounded after connecting with your sister. These moments of deep connection are so valuable for our emotional wellbeing.',
  8,
  ARRAY['family-support', 'gratitude', 'positive'],
  NOW() - INTERVAL '2 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Processing Difficult Emotions',
  'I keep thinking about what happened last month. It is hard to move forward when everything reminds me of the situation. I feel stuck in this cycle of replaying events over and over. I know I need to let go but I do not know how.',
  420,
  '{"primary": "sad", "secondary": "stuck", "intensity": 6.8, "confidence": 0.85}'::jsonb,
  'I can feel the weight of what you are carrying, Alex. The way you describe feeling stuck in this cycle shows such self-awareness, even in the midst of pain. Healing is not linear, and it is completely okay to have difficult days where the past feels very present. You are not alone in this journey, and the fact that you are here, talking about it, shows incredible strength and courage.',
  3,
  ARRAY['grief', 'healing', 'processing'],
  NOW() - INTERVAL '3 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Morning Energy Boost',
  'Just finished my morning workout and I feel amazing! There is something about starting the day with movement that just sets the right tone. I feel strong and capable and ready to take on whatever comes my way.',
  150,
  '{"primary": "energetic", "secondary": "accomplished", "intensity": 8.8, "confidence": 0.95}'::jsonb,
  'Your energy is absolutely infectious, Alex! I can hear the vitality and strength in your voice. Exercise can be such a powerful mood booster and confidence builder. It sounds like you have found a wonderful way to start your days that sets you up for success. That sense of feeling strong and capable is something to celebrate and remember during more challenging moments.',
  9,
  ARRAY['exercise', 'energy', 'routine'],
  NOW() - INTERVAL '4 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Quiet Reflection Time',
  'Spent some time in meditation this morning. Just sitting with my thoughts and breathing. It feels good to have these quiet moments where I can just be present with myself without any distractions or pressure.',
  200,
  '{"primary": "peaceful", "secondary": "contemplative", "intensity": 7.0, "confidence": 0.90}'::jsonb,
  'There is such calmness in your voice, Alex. I can sense the peace that meditation has brought you. These quiet moments of presence are so valuable in our busy world. It sounds like you are really learning to appreciate the power of stillness and self-connection. How wonderful that you are making space for these peaceful moments in your routine.',
  7,
  ARRAY['meditation', 'mindfulness', 'peace'],
  NOW() - INTERVAL '6 days'
)
ON CONFLICT DO NOTHING;

-- Insert personal notes with realistic journaling content
INSERT INTO public.notes (user_id, title, content, tags, created_at, updated_at) VALUES
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Daily Gratitude Practice',
  'Starting a daily gratitude practice to help shift my mindset. Today I am grateful for:

1. My sister calling me when I needed it most
2. The morning sunshine streaming through my window
3. Having a job, even when it feels stressful
4. My health and ability to exercise
5. This app helping me process my emotions
6. The delicious coffee I had this morning
7. My cozy apartment that feels like home

It is amazing how focusing on the good things can shift my entire perspective. Even on difficult days, there is always something to appreciate. I want to make this a daily habit because I notice I feel more positive and resilient when I practice gratitude regularly.',
  ARRAY['gratitude', 'daily-practice', 'positivity'],
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Coping Strategies That Actually Work',
  'Building a list of strategies that actually help when I am feeling overwhelmed or anxious:

• Deep breathing (4-7-8 technique works best for me)
• Going for a walk outside, especially in nature
• Calling my sister or a close friend
• Writing in this journal or app
• Taking a hot shower or bath
• Listening to calming music or nature sounds
• Breaking big tasks into tiny, manageable steps
• Doing gentle stretches or yoga
• Making a cup of tea and sitting quietly
• Watching funny videos to shift my mood

I need to remember these when I am in crisis mode and cannot think clearly. Maybe I should print this list and put it somewhere visible. It is so easy to forget what helps when you are in the middle of feeling overwhelmed.',
  ARRAY['coping-strategies', 'mental-health', 'toolkit'],
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Therapy Session Insights',
  'Key takeaways from today therapy session with Dr. Martinez:

- I tend to catastrophize when stressed (notice the spiral thoughts)
- My inner critic is much harsher than I would ever be to a friend
- Setting boundaries at work is not selfish, it is necessary for my wellbeing
- Progress is not always linear - setbacks are part of the healing process
- I have more strength and resilience than I give myself credit for
- Perfectionism is often a form of self-protection but it can be limiting

Dr. Martinez suggested I practice self-compassion this week. Going to try talking to myself like I would talk to my best friend when I make mistakes or face challenges. She also recommended the loving-kindness meditation practice.

Action items:
- Practice self-compassion daily
- Notice when I am catastrophizing and challenge those thoughts
- Set one small boundary at work this week
- Continue with morning meditation routine',
  ARRAY['therapy', 'insights', 'self-compassion'],
  NOW() - INTERVAL '1 week',
  NOW() - INTERVAL '1 week'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Relationship Reflections',
  'Thinking about the important relationships in my life and how they affect my mental health:

Family:
- Sister: My biggest supporter, always knows what to say
- Parents: Love them but sometimes feel pressure to be "perfect"
- Need to work on being more authentic with them

Friends:
- Jamie: Great for fun activities but not always emotionally available
- Sam: Deep conversations, very supportive during tough times
- Alex: New friendship but feels very genuine and supportive

Work relationships:
- Generally positive but I tend to overcommit and say yes too much
- Need to practice saying no and setting boundaries
- My manager is understanding but I do not always communicate my needs

I am realizing that quality matters more than quantity when it comes to relationships. The people who really see and accept me are the ones who help me feel most like myself. I want to invest more energy in those deeper connections.',
  ARRAY['relationships', 'reflection', 'boundaries'],
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '10 days'
)
ON CONFLICT DO NOTHING;

-- Insert user settings with crisis contacts
INSERT INTO public.user_settings (user_id, voice_reminders, notifications, privacy_level, crisis_contacts, created_at, updated_at) VALUES
(
  '550e8400-e29b-41d4-a716-446655440000',
  true,
  true,
  'medium',
  '[
    {"name": "Dr. Sarah Martinez", "phone": "+1-555-0123", "relation": "Therapist"},
    {"name": "Mom", "phone": "+1-555-0456", "relation": "Family"},
    {"name": "Jamie (Sister)", "phone": "+1-555-0789", "relation": "Family"},
    {"name": "Crisis Text Line", "phone": "741741", "relation": "Crisis Support"}
  ]'::jsonb,
  NOW() - INTERVAL '3 months',
  NOW() - INTERVAL '1 day'
) ON CONFLICT (user_id) DO UPDATE SET
  voice_reminders = EXCLUDED.voice_reminders,
  notifications = EXCLUDED.notifications,
  privacy_level = EXCLUDED.privacy_level,
  crisis_contacts = EXCLUDED.crisis_contacts,
  updated_at = EXCLUDED.updated_at;

-- Add some additional mood entries for better analytics (past month)
INSERT INTO public.mood_entries (user_id, mood, emotions, note, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 7, ARRAY['motivated', 'focused'], 'Started new morning routine', NOW() - INTERVAL '8 days'),
('550e8400-e29b-41d4-a716-446655440000', 5, ARRAY['stressed', 'overwhelmed'], 'Big presentation at work', NOW() - INTERVAL '9 days'),
('550e8400-e29b-41d4-a716-446655440000', 8, ARRAY['proud', 'accomplished'], 'Presentation went really well!', NOW() - INTERVAL '10 days'),
('550e8400-e29b-41d4-a716-446655440000', 6, ARRAY['contemplative', 'curious'], 'Reading about mindfulness', NOW() - INTERVAL '11 days'),
('550e8400-e29b-41d4-a716-446655440000', 4, ARRAY['anxious', 'worried'], 'Health scare with family member', NOW() - INTERVAL '12 days'),
('550e8400-e29b-41d4-a716-446655440000', 7, ARRAY['relieved', 'grateful'], 'False alarm, everyone is okay', NOW() - INTERVAL '13 days'),
('550e8400-e29b-41d4-a716-446655440000', 8, ARRAY['joyful', 'connected'], 'Great weekend with friends', NOW() - INTERVAL '14 days'),
('550e8400-e29b-41d4-a716-446655440000', 6, ARRAY['peaceful', 'content'], 'Quiet Sunday at home', NOW() - INTERVAL '15 days'),
('550e8400-e29b-41d4-a716-446655440000', 5, ARRAY['tired', 'neutral'], 'Long work week catching up', NOW() - INTERVAL '16 days'),
('550e8400-e29b-41d4-a716-446655440000', 9, ARRAY['excited', 'hopeful'], 'Got accepted for therapy program', NOW() - INTERVAL '17 days'),
('550e8400-e29b-41d4-a716-446655440000', 7, ARRAY['determined', 'optimistic'], 'Setting new personal goals', NOW() - INTERVAL '18 days'),
('550e8400-e29b-41d4-a716-446655440000', 6, ARRAY['reflective', 'calm'], 'Journaling about life changes', NOW() - INTERVAL '19 days'),
('550e8400-e29b-41d4-a716-446655440000', 8, ARRAY['loved', 'supported'], 'Heart-to-heart with sister', NOW() - INTERVAL '20 days')
ON CONFLICT DO NOTHING;