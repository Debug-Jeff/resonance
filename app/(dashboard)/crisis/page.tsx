'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-provider';
import { createClient } from '@/lib/supabase/client';
import { 
  Phone, Heart, Clock, MapPin, ExternalLink, 
  Headphones, MessageCircle, Video, AlertTriangle,
  Waves, Wind, Sun, Moon
} from 'lucide-react';

interface CrisisContact {
  name: string;
  phone: string;
  relation: string;
}

const emergencyHotlines = [
  {
    name: 'National Suicide Prevention Lifeline',
    phone: '988',
    description: '24/7 crisis support for suicidal thoughts',
    available: '24/7',
    type: 'emergency'
  },
  {
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: 'Free, 24/7 crisis support via text',
    available: '24/7',
    type: 'text'
  },
  {
    name: 'SAMHSA National Helpline',
    phone: '1-800-662-4357',
    description: 'Treatment referral and information service',
    available: '24/7',
    type: 'support'
  },
  {
    name: 'National Domestic Violence Hotline',
    phone: '1-800-799-7233',
    description: 'Support for domestic violence situations',
    available: '24/7',
    type: 'emergency'
  }
];

const breathingExercises = [
  {
    name: '4-7-8 Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8',
    duration: '4 cycles',
    icon: Wind
  },
  {
    name: 'Box Breathing',
    description: 'Inhale 4, hold 4, exhale 4, hold 4',
    duration: '5 minutes',
    icon: Waves
  },
  {
    name: 'Deep Belly Breathing',
    description: 'Slow, deep breaths into your belly',
    duration: '3 minutes',
    icon: Sun
  }
];

const groundingTechniques = [
  {
    name: '5-4-3-2-1 Technique',
    description: '5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste',
    category: 'Sensory'
  },
  {
    name: 'Progressive Muscle Relaxation',
    description: 'Tense and release each muscle group from toes to head',
    category: 'Physical'
  },
  {
    name: 'Mindful Observation',
    description: 'Focus intently on one object for 2-3 minutes',
    category: 'Mental'
  },
  {
    name: 'Cold Water Technique',
    description: 'Splash cold water on face or hold ice cubes',
    category: 'Physical'
  }
];

const professionalResources = [
  {
    name: 'Psychology Today',
    description: 'Find therapists and mental health professionals',
    url: 'https://psychologytoday.com',
    type: 'directory'
  },
  {
    name: 'BetterHelp',
    description: 'Online therapy and counseling services',
    url: 'https://betterhelp.com',
    type: 'online'
  },
  {
    name: 'NAMI',
    description: 'National Alliance on Mental Illness resources',
    url: 'https://nami.org',
    type: 'support'
  },
  {
    name: 'Mental Health America',
    description: 'Mental health screening and resources',
    url: 'https://mhanational.org',
    type: 'screening'
  }
];

export default function CrisisSupportPage() {
  const { user } = useAuth();
  const [crisisContacts, setCrisisContacts] = useState<CrisisContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBreathing, setActiveBreathing] = useState<string | null>(null);
  const [breathingCount, setBreathingCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      fetchCrisisContacts();
    }
  }, [user]);

  const fetchCrisisContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('crisis_contacts')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setCrisisContacts(data?.crisis_contacts || []);
    } catch (error) {
      console.error('Error fetching crisis contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const startBreathingExercise = (exerciseName: string) => {
    setActiveBreathing(exerciseName);
    setBreathingCount(0);
    
    // Simple breathing timer (this could be enhanced with actual guided breathing)
    const interval = setInterval(() => {
      setBreathingCount(prev => {
        if (prev >= 20) { // Stop after 20 counts
          clearInterval(interval);
          setActiveBreathing(null);
          return 0;
        }
        return prev + 1;
      });
    }, 3000); // 3 second intervals
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'text':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'support':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

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
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Crisis Support
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Immediate help and resources for mental health emergencies
        </p>
      </div>

      {/* Emergency Alert */}
      <Card className="glassmorphism border-0 shadow-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-200 dark:border-red-800">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                If you're in immediate danger
              </h3>
              <p className="text-red-700 dark:text-red-300 mb-4">
                If you're having thoughts of suicide or self-harm, please reach out for help immediately. 
                You are not alone, and there are people who want to help.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => window.open('tel:988')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call 988 Now
                </Button>
                <Button 
                  variant="outline" 
                  className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300"
                  onClick={() => window.open('sms:741741?body=HOME')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Text HOME to 741741
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Crisis Contacts */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-purple-600" />
              Your Crisis Contacts
            </CardTitle>
            <CardDescription>
              Personal emergency contacts you've added
            </CardDescription>
          </CardHeader>
          <CardContent>
            {crisisContacts.length > 0 ? (
              <div className="space-y-3">
                {crisisContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {contact.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {contact.relation}
                      </p>
                    </div>
                    <Button
                      onClick={() => window.open(`tel:${contact.phone}`)}
                      className="gradient-primary hover:scale-105 transition-transform"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No crisis contacts added yet
                </p>
                <Button variant="outline" onClick={() => window.location.href = '/settings'}>
                  Add Crisis Contacts
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Hotlines */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Headphones className="w-5 h-5 mr-2 text-purple-600" />
              Emergency Hotlines
            </CardTitle>
            <CardDescription>
              24/7 professional crisis support services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emergencyHotlines.map((hotline, index) => (
                <div key={index} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {hotline.name}
                    </h4>
                    <Badge className={getTypeColor(hotline.type)}>
                      {hotline.available}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {hotline.description}
                  </p>
                  <Button
                    onClick={() => window.open(`tel:${hotline.phone.replace(/[^0-9]/g, '')}`)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {hotline.phone}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Breathing Exercises */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wind className="w-5 h-5 mr-2 text-purple-600" />
              Breathing Exercises
            </CardTitle>
            <CardDescription>
              Quick techniques to help calm anxiety and panic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {breathingExercises.map((exercise, index) => (
                <div key={index} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <exercise.icon className="w-5 h-5 text-purple-600 mr-3" />
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {exercise.name}
                      </h4>
                    </div>
                    <Badge variant="outline">{exercise.duration}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {exercise.description}
                  </p>
                  <Button
                    onClick={() => startBreathingExercise(exercise.name)}
                    disabled={activeBreathing === exercise.name}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    {activeBreathing === exercise.name ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-pulse bg-purple-600 rounded-full"></div>
                        Breathing... {breathingCount}/20
                      </>
                    ) : (
                      <>
                        <Wind className="w-4 h-4 mr-2" />
                        Start Exercise
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grounding Techniques */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-purple-600" />
              Grounding Techniques
            </CardTitle>
            <CardDescription>
              Methods to help you feel more present and centered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groundingTechniques.map((technique, index) => (
                <div key={index} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {technique.name}
                    </h4>
                    <Badge variant="secondary">{technique.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {technique.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professional Resources */}
      <Card className="glassmorphism border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ExternalLink className="w-5 h-5 mr-2 text-purple-600" />
            Professional Resources
          </CardTitle>
          <CardDescription>
            Find long-term mental health support and treatment options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professionalResources.map((resource, index) => (
              <div key={index} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {resource.name}
                  </h4>
                  <Badge variant="outline">{resource.type}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {resource.description}
                </p>
                <Button
                  onClick={() => window.open(resource.url, '_blank')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Website
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety Plan Reminder */}
      <Card className="glassmorphism border-0 shadow-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Create a Safety Plan
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Having a written safety plan can be crucial during a crisis. Consider working with a mental health professional to create a personalized plan that includes warning signs, coping strategies, and support contacts.
              </p>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Learn About Safety Plans
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}