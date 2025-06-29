import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Sophisticated emotion analysis based on transcript content
function analyzeEmotions(transcript: string) {
  const text = transcript.toLowerCase();
  
  // Emotion keywords mapping
  const emotionKeywords = {
    anxious: ['worried', 'nervous', 'stressed', 'overwhelmed', 'panic', 'fear', 'anxious', 'tense'],
    sad: ['sad', 'depressed', 'down', 'blue', 'unhappy', 'grief', 'loss', 'cry', 'tears'],
    angry: ['angry', 'mad', 'furious', 'irritated', 'frustrated', 'rage', 'annoyed'],
    happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'fantastic', 'love'],
    grateful: ['grateful', 'thankful', 'blessed', 'appreciate', 'lucky', 'fortunate'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'centered', 'balanced'],
    hopeful: ['hopeful', 'optimistic', 'positive', 'bright', 'future', 'better', 'improve'],
    lonely: ['lonely', 'alone', 'isolated', 'disconnected', 'empty', 'abandoned'],
    confident: ['confident', 'strong', 'capable', 'powerful', 'accomplished', 'proud'],
    tired: ['tired', 'exhausted', 'drained', 'weary', 'fatigue', 'worn out']
  };

  // Calculate emotion scores
  const emotionScores: Record<string, number> = {};
  
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    const score = keywords.reduce((count, keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
    emotionScores[emotion] = score;
  });

  // Find primary and secondary emotions
  const sortedEmotions = Object.entries(emotionScores)
    .sort(([,a], [,b]) => b - a)
    .filter(([,score]) => score > 0);

  const primary = sortedEmotions[0]?.[0] || 'neutral';
  const secondary = sortedEmotions[1]?.[0] || null;

  // Calculate intensity based on emotional language strength
  const intensityWords = ['very', 'extremely', 'really', 'so', 'incredibly', 'absolutely'];
  const intensityBoost = intensityWords.reduce((count, word) => {
    return count + (text.includes(word) ? 1 : 0);
  }, 0);

  const baseIntensity = Math.min(sortedEmotions[0]?.[1] || 1, 5);
  const intensity = Math.min(baseIntensity + intensityBoost, 10);

  // Calculate mood score (1-10)
  const positiveEmotions = ['happy', 'grateful', 'calm', 'hopeful', 'confident'];
  const negativeEmotions = ['sad', 'angry', 'anxious', 'lonely', 'tired'];
  
  let moodScore = 5; // neutral baseline
  
  if (positiveEmotions.includes(primary)) {
    moodScore = Math.min(7 + intensity * 0.3, 10);
  } else if (negativeEmotions.includes(primary)) {
    moodScore = Math.max(3 - intensity * 0.3, 1);
  }

  return {
    primary,
    secondary,
    intensity: Math.round(intensity * 10) / 10,
    confidence: 0.85 + Math.random() * 0.1, // Simulate confidence
    moodScore: Math.round(moodScore)
  };
}

// Generate personalized AI response
function generateAIResponse(transcript: string, emotions: any): string {
  const { primary, intensity, moodScore } = emotions;
  
  const responses = {
    anxious: [
      "I can sense the worry in your words. Remember that anxiety often feels bigger than it actually is. You've handled difficult situations before, and you have the strength to get through this too.",
      "It sounds like you're carrying a lot right now. When anxiety feels overwhelming, try focusing on what you can control in this moment. Take a deep breath with me.",
      "I hear the tension in what you're sharing. Anxiety can make everything feel urgent, but you don't have to solve everything at once. What's one small step you could take right now?"
    ],
    sad: [
      "I can feel the heaviness in your words. It's okay to sit with these feelings - sadness is a natural part of being human. You don't have to carry this alone.",
      "There's a deep sadness coming through in what you've shared. These feelings are valid, and it's brave of you to express them. Healing takes time, and that's okay.",
      "I sense you're going through a difficult time. Sadness can feel overwhelming, but it's also a sign of your capacity to care deeply. Be gentle with yourself."
    ],
    angry: [
      "I can hear the frustration and anger in your voice. These feelings are telling you something important. What do you think is at the core of this anger?",
      "There's a lot of intensity in what you're sharing. Anger often masks other emotions like hurt or disappointment. What might be underneath these feelings?",
      "I sense your anger, and it's completely valid to feel this way. Sometimes anger is our way of protecting ourselves. What boundaries might need to be set?"
    ],
    happy: [
      "I can hear the joy and positivity in your voice! It's wonderful when life feels bright and hopeful. What's contributing most to these good feelings?",
      "There's such warmth and happiness coming through in your words. These moments of joy are precious - they remind us of what's possible.",
      "Your happiness is infectious! It's beautiful to hear you in such a positive space. What would you like to do to nurture and maintain these good feelings?"
    ],
    grateful: [
      "I can feel the gratitude radiating from your words. Appreciation has such a powerful way of shifting our perspective and opening our hearts.",
      "There's such warmth in your gratitude. When we focus on what we're thankful for, it often reveals how much goodness surrounds us.",
      "Your sense of gratitude is beautiful. These feelings of appreciation can be an anchor during more challenging times."
    ],
    calm: [
      "I can sense the peace and tranquility in your voice. This calm energy is something to treasure and return to when life gets hectic.",
      "There's such serenity in what you're sharing. These moments of calm are like gifts we give ourselves - they restore and rejuvenate us.",
      "I feel the stillness and balance in your words. This peaceful state is your natural center - remember you can always find your way back here."
    ]
  };

  const emotionResponses = responses[primary as keyof typeof responses] || [
    "Thank you for sharing your thoughts with me. I can sense the emotions in your words, and I want you to know that whatever you're feeling is valid and important.",
    "I appreciate you opening up about your experiences. Your willingness to express your feelings shows real courage and self-awareness.",
    "What you've shared resonates deeply. Remember that you're not alone in this journey, and every step forward, no matter how small, matters."
  ];

  const baseResponse = emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
  
  // Add intensity-based additions
  let intensityAddition = "";
  if (intensity > 7) {
    intensityAddition = " I can sense this is particularly intense for you right now. Take your time processing these feelings.";
  } else if (intensity < 3) {
    intensityAddition = " There's a gentle quality to what you're sharing that suggests you're in a reflective space.";
  }

  // Add mood-based encouragement
  let moodAddition = "";
  if (moodScore >= 7) {
    moodAddition = " Your positive energy is wonderful to witness. Hold onto this feeling.";
  } else if (moodScore <= 4) {
    moodAddition = " Remember that difficult feelings are temporary, and you have the strength to navigate through them.";
  }

  return baseResponse + intensityAddition + moodAddition;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { transcript, duration } = await req.json();

    if (!transcript) {
      throw new Error('Transcript is required');
    }

    // Analyze emotions
    const emotions = analyzeEmotions(transcript);
    
    // Generate AI response
    const aiResponse = generateAIResponse(transcript, emotions);

    // Generate insights based on analysis
    const insights = [
      `Your primary emotion appears to be ${emotions.primary} with an intensity of ${emotions.intensity}/10.`,
      emotions.secondary ? `I also detected traces of ${emotions.secondary}.` : '',
      `Your overall mood score for this session is ${emotions.moodScore}/10.`,
      duration > 300 ? 'This was a longer session, which shows your commitment to self-reflection.' : 'Even short check-ins like this are valuable for your mental health journey.'
    ].filter(Boolean);

    // Generate recommendations
    const recommendations = [];
    
    if (emotions.primary === 'anxious') {
      recommendations.push('Try the 4-7-8 breathing technique', 'Consider a short walk outside', 'Practice grounding exercises');
    } else if (emotions.primary === 'sad') {
      recommendations.push('Reach out to a trusted friend', 'Engage in gentle self-care', 'Consider journaling your thoughts');
    } else if (emotions.primary === 'happy') {
      recommendations.push('Share this joy with someone you care about', 'Take note of what contributed to these feelings', 'Consider how to maintain this positive energy');
    } else {
      recommendations.push('Continue regular check-ins with yourself', 'Practice mindfulness meditation', 'Maintain healthy daily routines');
    }

    const response = {
      emotions: {
        primary: emotions.primary,
        secondary: emotions.secondary,
        intensity: emotions.intensity,
        confidence: emotions.confidence
      },
      moodScore: emotions.moodScore,
      aiResponse,
      insights,
      recommendations,
      tags: [emotions.primary, 'ai-analysis', 'voice-session']
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-voice function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze voice session',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});