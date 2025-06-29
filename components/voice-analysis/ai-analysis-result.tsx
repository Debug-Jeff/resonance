'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, Heart, MessageCircle, Lightbulb, 
  ChevronDown, ChevronUp, Save, Sparkles
} from 'lucide-react';

interface AIAnalysisResultProps {
  result: {
    emotions: {
      primary: string;
      secondary?: string;
      intensity: number;
      confidence: number;
    };
    moodScore: number;
    aiResponse: string;
    insights: string[];
    recommendations: string[];
    tags: string[];
  };
  onSave: () => void;
  saving?: boolean;
}

export function AIAnalysisResult({ result, onSave, saving = false }: AIAnalysisResultProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      anxious: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      sad: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      angry: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      happy: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      grateful: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      calm: 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300',
      hopeful: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
      lonely: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      confident: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      tired: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    };
    
    return colors[emotion.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };
  
  const getMoodScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    if (score >= 4) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* AI Response */}
      <Card className="glassmorphism border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-purple-800 dark:text-purple-200 leading-relaxed">
                  {result.aiResponse}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1 text-purple-600" />
              <span className="text-sm font-medium">Mood Score:</span>
              <span className={`text-sm font-bold ml-1 ${getMoodScoreColor(result.moodScore)}`}>
                {result.moodScore}/10
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1 ml-auto">
              <Badge className={getEmotionColor(result.emotions.primary)}>
                {result.emotions.primary}
              </Badge>
              {result.emotions.secondary && (
                <Badge variant="outline">
                  {result.emotions.secondary}
                </Badge>
              )}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full"
          >
            {showDetails ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Show Details
              </>
            )}
          </Button>
          
          {showDetails && (
            <div className="space-y-4 pt-2">
              {/* Insights */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center">
                  <Lightbulb className="w-4 h-4 mr-1 text-yellow-500" />
                  Insights
                </h4>
                <ul className="space-y-1">
                  {result.insights.map((insight, index) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300 pl-5 relative">
                      <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1 text-blue-500" />
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {result.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300 pl-5 relative">
                      <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Technical Details */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center">
                  <Brain className="w-4 h-4 mr-1 text-purple-500" />
                  Analysis Details
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-gray-500 dark:text-gray-400">Primary Emotion:</span>
                    <span className="ml-1 font-medium">{result.emotions.primary}</span>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-gray-500 dark:text-gray-400">Secondary:</span>
                    <span className="ml-1 font-medium">{result.emotions.secondary || 'None'}</span>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-gray-500 dark:text-gray-400">Intensity:</span>
                    <span className="ml-1 font-medium">{result.emotions.intensity}/10</span>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-gray-500 dark:text-gray-400">Confidence:</span>
                    <span className="ml-1 font-medium">{Math.round(result.emotions.confidence * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Button
            onClick={onSave}
            disabled={saving}
            className="w-full gradient-primary hover:scale-105 transition-transform"
          >
            {saving ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}