'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-provider';
import { createClient } from '@/lib/supabase/client';
import { Navigation } from '@/components/layout/landing-navigation';
import { Footer } from '@/components/layout/footer';
import { 
  Heart, Mic, BarChart3, BookOpen, ArrowRight, 
  Sparkles, Shield, Clock, Users, Star, ChevronRight,
  Play, CheckCircle, Zap, Brain, Target, TrendingUp,
  MessageCircle, Activity, PenTool, Headphones
} from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'AI Voice Sessions',
    description: 'Record and analyze your thoughts with advanced emotional AI that understands context and provides personalized insights for deeper self-awareness.',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
    iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
    delay: '0s',
    highlights: ['Real-time analysis', 'Emotional patterns', 'Voice recognition'],
    accent: 'purple'
  },
  {
    icon: Heart,
    title: 'Smart Mood Tracking',
    description: 'Monitor emotional patterns with intelligent tracking that learns your unique patterns, triggers, and provides predictive insights.',
    gradient: 'from-rose-500 to-red-500',
    bgGradient: 'from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20',
    iconBg: 'bg-gradient-to-br from-rose-500 to-red-500',
    delay: '0.1s',
    highlights: ['Pattern recognition', 'Trigger alerts', 'Mood forecasting'],
    accent: 'rose'
  },
  {
    icon: BarChart3,
    title: 'Personal Analytics',
    description: 'Visualize your mental health journey with beautiful, actionable insights and comprehensive progress tracking over time.',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    delay: '0.2s',
    highlights: ['Visual dashboards', 'Progress metrics', 'Trend analysis'],
    accent: 'blue'
  },
  {
    icon: BookOpen,
    title: 'Intelligent Journaling',
    description: 'Write, reflect, and organize thoughts with AI-powered prompts, emotional analysis, and personalized writing guidance.',
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    delay: '0.3s',
    highlights: ['Smart prompts', 'Sentiment analysis', 'Goal tracking'],
    accent: 'emerald'
  }
];

const benefits = [
  { icon: Brain, text: 'AI-powered emotional intelligence', color: 'text-purple-600' },
  { icon: Shield, text: 'Privacy-first and secure by design', color: 'text-blue-600' },
  { icon: Clock, text: 'Available 24/7 when you need support', color: 'text-green-600' },
  { icon: Users, text: 'Trusted by mental health professionals', color: 'text-pink-600' }
];

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Marketing Professional',
    content: 'Resonance helped me understand my anxiety patterns. The voice sessions feel like talking to a caring friend who truly understands.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10'
  },
  {
    name: 'Dr. James Wilson',
    role: 'Clinical Psychologist',
    content: 'I recommend Resonance to my patients. The mood tracking features provide valuable insights between our sessions.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10'
  },
  {
    name: 'Maria R.',
    role: 'College Student',
    content: 'The analytics helped me identify triggers I never noticed. It\'s like having a therapist in my pocket.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10'
  }
];

const stats = [
  { number: '10', label: 'Active Users', icon: Users, color: 'from-purple-500 to-pink-500' },
  { number: '100+', label: 'Voice Sessions', icon: Mic, color: 'from-blue-500 to-cyan-500' },
  { number: '95%', label: 'User Satisfaction', icon: Heart, color: 'from-rose-500 to-red-500' },
  { number: '24/7', label: 'Support Available', icon: Clock, color: 'from-emerald-500 to-teal-500' }
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState(4);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
          <Heart className="absolute inset-0 m-auto w-8 h-8 text-purple-600 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Navigation />
      
      <div className="overflow-hidden">
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-emerald-300/10 to-teal-300/10 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 rounded-full bg-gradient-to-br from-rose-300/10 to-red-300/10 animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>

        {/* Hero Section */}
        <section className="relative px-6 pt-24 pb-16 sm:px-6 sm:pt-32 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-12 lg:px-8">
            <div className="px-6 pb-24 pt-10 sm:pb-32 lg:col-span-7 lg:px-0 lg:pb-32 lg:pt-32 xl:col-span-6">
              <div className={`mx-auto max-w-2xl lg:mx-0 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="mb-8">
                  <Badge variant="secondary" className="glassmorphism px-4 py-2 animate-pulse-soft border-0 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                    <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">
                      AI-Powered Mental Health Revolution
                    </span>
                  </Badge>
                </div>
                
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl leading-tight">
                  Your Personal{' '}
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                    Mental Health
                  </span>{' '}
                  Companion
                </h1>
                
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-xl">
                  Resonance combines cutting-edge AI technology with compassionate support to help you understand, 
                  track, and transform your mental wellbeing. Start your journey to better mental health today.
                </p>
                
                <div className="mt-10 flex items-center gap-x-6">
                  <Link href="/auth/signup">
                    <Button size="lg" className="gradient-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-3">
                      Start Your Journey
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  
                  <Link href="/auth/signin">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="hover:scale-105 transition-all duration-300 border-2 hover:border-purple-300 px-8 py-3 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className={`flex items-center text-sm transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ transitionDelay: `${0.5 + index * 0.1}s` }}>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${benefit.color.includes('purple') ? 'from-purple-500 to-purple-600' : benefit.color.includes('blue') ? 'from-blue-500 to-blue-600' : benefit.color.includes('green') ? 'from-green-500 to-green-600' : 'from-pink-500 to-pink-600'} flex items-center justify-center mr-3`}>
                        <benefit.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative lg:col-span-5 lg:-mr-8 xl:col-span-6">
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-10 rotate-3'}`} style={{ transitionDelay: '0.3s' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 transform rotate-2 rounded-3xl opacity-10 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 transform -rotate-1 rounded-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="relative backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/30 dark:border-gray-700/30">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse-soft shadow-lg">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Daily Wellness Check</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">How are you feeling today?</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-3">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div
                          key={num}
                          className={`h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-300 hover:scale-110 cursor-pointer shadow-lg ${
                            num === 4 
                              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-purple-500/25' 
                              : 'bg-white/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600 backdrop-blur-sm'
                          }`}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { color: 'from-green-400 to-emerald-500', text: 'Feeling optimistic about the future', icon: TrendingUp },
                        { color: 'from-blue-400 to-cyan-500', text: 'Productive day at work', icon: Target },
                        { color: 'from-purple-400 to-pink-500', text: 'Quality time with family', icon: Heart }
                      ].map((item, index) => (
                        <div key={index} className={`flex items-center space-x-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-500 hover:translate-x-2 hover:shadow-lg border border-white/30 dark:border-gray-700/30`} style={{ transitionDelay: `${0.8 + index * 0.1}s` }}>
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                            <item.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-purple-900/80 backdrop-blur-sm"></div>
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className={`text-center transition-all duration-700 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${1 + index * 0.1}s` }}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
                Everything you need for{' '}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  better mental health
                </span>
              </h2>
              <p className="text-lg leading-8 text-gray-600 dark:text-gray-400">
                Comprehensive tools designed by mental health professionals and powered by advanced AI technology.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {features.map((feature, index) => (
                <div key={index} className={`transition-all duration-700 hover:scale-[1.02] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${1.5 + index * 0.2}s` }}>
                  <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${feature.bgGradient} border border-white/30 dark:border-gray-700/30 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden`}>
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                    
                    <div className="relative z-10">
                      <div className={`w-16 h-16 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 leading-7 mb-6">
                        {feature.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {feature.highlights.map((highlight, idx) => (
                          <span key={idx} className={`px-3 py-1 rounded-full text-xs font-medium bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 backdrop-blur-sm border border-white/30 dark:border-gray-700/30`}>
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials Section */}
        {/*Uncomment aftre getting actual testimaonials.*/}
        {/* <section className="py-24 sm:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-purple-900/50 backdrop-blur-sm"></div>
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
                Trusted by{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  thousands worldwide
                </span>
              </h2>
              <p className="text-lg leading-8 text-gray-600 dark:text-gray-400">
                See how Resonance is helping people transform their mental health and emotional wellbeing.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className={`transition-all duration-500 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${2 + index * 0.2}s` }}>
                  <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${testimonial.bgGradient} border border-white/30 dark:border-gray-700/30 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 group h-full`}>
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-white/20 to-transparent rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-7 font-medium">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center">
                      <div className="relative">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-2xl mr-4 object-cover shadow-lg"
                        />
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${testimonial.gradient} opacity-20`}></div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-2xl">
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"></div>
              <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full -translate-x-36 -translate-y-36 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full translate-x-36 translate-y-36 animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              <div className="relative px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-6">
                    Ready to transform your{' '}
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      mental health journey?
                    </span>
                  </h2>
                  <p className="mx-auto max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-400 mb-10">
                    Join thousands of people who are taking control of their mental wellbeing with Resonance&apos;s AI-powered platform.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                    <Link href="/auth/signup">
                      <Button size="lg" className="gradient-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-3 w-full sm:w-auto">
                        Start Free Today
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/auth/signin">
                      <Button variant="outline" size="lg" className="hover:scale-105 transition-all duration-300 border-2 hover:border-purple-300 px-8 py-3 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 w-full sm:w-auto">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Free to start
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      No credit card required
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Cancel anytime
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}