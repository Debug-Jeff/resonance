'use client';

import { Navigation } from '@/components/layout/landing-navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, Mic, BarChart3, BookOpen, Brain, Shield, 
  Clock, Users, CheckCircle, Star, Zap, Target,
  Sparkles, ArrowRight, Phone
} from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: Mic,
    title: 'AI Voice Analysis',
    description: 'Advanced emotional AI that analyzes your voice patterns to detect mood, stress levels, and emotional states with 95% accuracy.',
    features: [
      'Real-time emotion detection',
      'Personalized AI responses',
      'Voice pattern analysis',
      'Mood trend tracking'
    ],
    gradient: 'gradient-primary'
  },
  {
    icon: Heart,
    title: 'Smart Mood Tracking',
    description: 'Intelligent mood monitoring that learns your patterns and provides insights to help you understand your emotional triggers.',
    features: [
      'Daily mood logging',
      'Pattern recognition',
      'Trigger identification',
      'Progress visualization'
    ],
    gradient: 'gradient-secondary'
  },
  {
    icon: BarChart3,
    title: 'Personal Analytics',
    description: 'Comprehensive dashboards that visualize your mental health journey with actionable insights and recommendations.',
    features: [
      'Interactive charts',
      'Trend analysis',
      'Goal tracking',
      'Progress reports'
    ],
    gradient: 'gradient-accent'
  },
  {
    icon: BookOpen,
    title: 'Intelligent Journaling',
    description: 'AI-powered journaling with smart prompts, emotional analysis, and personalized reflection guidance.',
    features: [
      'Smart writing prompts',
      'Emotion tagging',
      'Reflection insights',
      'Memory organization'
    ],
    gradient: 'gradient-warm'
  },
  {
    icon: Brain,
    title: 'Cognitive Behavioral Tools',
    description: 'Evidence-based CBT techniques and exercises designed to help you develop healthier thought patterns.',
    features: [
      'Thought challenging',
      'Behavioral experiments',
      'Mindfulness exercises',
      'Coping strategies'
    ],
    gradient: 'gradient-cool'
  },
  {
    icon: Phone,
    title: 'Crisis Support',
    description: '24/7 crisis intervention resources and immediate access to professional help when you need it most.',
    features: [
      'Emergency contacts',
      'Crisis hotlines',
      'Safety planning',
      'Immediate resources'
    ],
    gradient: 'gradient-primary'
  }
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with basic mental health tracking',
    features: [
      'Basic mood tracking',
      'Simple journaling',
      'Limited voice sessions (5/month)',
      'Basic analytics',
      'Community support'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'Advanced features for serious mental health improvement',
    features: [
      'Unlimited voice sessions',
      'Advanced AI analysis',
      'Comprehensive analytics',
      'CBT tools & exercises',
      'Priority support',
      'Export data',
      'Custom reminders'
    ],
    cta: 'Start Pro Trial',
    popular: true
  },
  {
    name: 'Premium',
    price: '$39',
    period: 'per month',
    description: 'Complete mental health platform with professional features',
    features: [
      'Everything in Pro',
      'Therapist collaboration tools',
      'Advanced crisis support',
      'Family sharing (up to 4)',
      'White-label options',
      'API access',
      'Dedicated support'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

// Uncomment this section when you have actual testimonials to display 
// const testimonials = [
//   {
//     content: "The voice analysis feature is incredible. It picks up on emotions I didn't even realize I was feeling.",
//     author: "Sarah M.",
//     role: "Marketing Professional",
//     rating: 5
//   },
//   {
//     content: "As a therapist, I recommend Resonance to my clients. The analytics help track progress between sessions.",
//     author: "Dr. James Wilson",
//     role: "Clinical Psychologist",
//     rating: 5
//   },
//   {
//     content: "The crisis support features gave me peace of mind during my darkest moments. Truly life-changing.",
//     author: "Maria R.",
//     role: "College Student",
//     rating: 5
//   }
// ];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Navigation />
      
      <div className="pt-24">
        {/* Hero Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="glassmorphism px-4 py-2 mb-8">
                <Sparkles className="w-4 h-4 mr-2" />
                Our Services
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Comprehensive{' '}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Mental Health
                </span>{' '}
                Solutions
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                Discover our full range of AI-powered tools and services designed to support 
                your mental health journey at every step.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="glassmorphism border-0 shadow-xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl ${service.gradient} flex items-center justify-center mb-6`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-7">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                How Resonance Works?
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                Simple steps to start your mental health journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Sign Up & Setup
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create your account and complete a brief assessment to personalize your experience.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full gradient-secondary flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Track & Record
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Use our tools to track your mood, record voice sessions, and journal your thoughts.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Get Insights
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Receive AI-powered insights, recommendations, and track your progress over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Choose Your Plan
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                Start free and upgrade as your needs grow
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card key={index} className={`glassmorphism border-0 shadow-xl hover:scale-105 transition-all duration-300 ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}>
                  <CardContent className="p-8">
                    {plan.popular && (
                      <Badge className="gradient-primary text-white mb-4">
                        Most Popular
                      </Badge>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {plan.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular ? 'gradient-primary' : 'gradient-secondary'} hover:scale-105 transition-transform`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {/* <section className="py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                What Our Users Say
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="glassmorphism border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-7">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Card className="glassmorphism border-0 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
              <CardContent className="relative px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Ready to start your{' '}
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      mental health journey?
                    </span>
                  </h2>
                  <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-400">
                    Join thousands of people who are taking control of their mental wellbeing with Resonance.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link href="/auth/signup">
                      <Button size="lg" className="gradient-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                        Start Free Today
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" size="lg" className="hover:scale-105 transition-all duration-300 border-2 hover:border-purple-300">
                        Contact Sales
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}