'use client';

import { Navigation } from '@/components/layout/landing-navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, Users, Award, Target, Brain, Shield, 
  Lightbulb, Sparkles, CheckCircle, Star
} from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Compassion First',
    description: 'Every feature is designed with empathy and understanding at its core.',
    gradient: 'gradient-primary'
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description: 'Your mental health data is protected with enterprise-grade security.',
    gradient: 'gradient-secondary'
  },
  {
    icon: Brain,
    title: 'Evidence-Based',
    description: 'Built on proven psychological principles and validated research.',
    gradient: 'gradient-accent'
  },
  {
    icon: Users,
    title: 'Inclusive Design',
    description: 'Accessible mental health support for everyone, regardless of background.',
    gradient: 'gradient-warm'
  }
];

const team = [
  {
    name: 'Jeff Mutugi',
    role: 'Co-Founder & Frontend Engineer',
    bio: 'Frontend engineer and product strategist with a passion for building compassionate, voice-driven mental health tools.',
    image: 'https://avatar.iran.liara.run/public/36?w=300',
    credentials: 'BSc. Computer Science, Africa Nazarene University'
  },
  {
    name: 'Stanley Mwendwa',
    role: 'Co-Founder & Backend Engineer',
    bio: 'Backend engineer focused on scalable AI systems, with a strong drive to make mental health support universally accessible.',
    image: 'https://avatar.iran.liara.run/public/13?w=300',
    credentials: 'BSc. Computer Science, Africa Nazarene University'
  },
  {
    name: 'Rachel Mugisha',
    role: 'UI/UX Designer',
    bio: 'UX designer blending psychology and design to craft intuitive, emotionally intelligent user experiences.',
    image: 'https://avatar.iran.liara.run/public/65?w=300',
    credentials: 'BSc. BBIT, Africa Nazarene University'
  },
  {
    name: 'Jesse Jacob',
    role: 'Head of AI Research',
    bio: 'AI researcher exploring affective computing and emotion-aware interfaces for real-world mental health applications.',
    image: 'https://avatar.iran.liara.run/public/2?w=300',
    credentials: 'BSc. Computer Science, Africa Nazarene University'
  }
];

const milestones = [
  {
    year: '2022',
    title: 'Company Founded',
    description: 'Started with a mission to make mental health support accessible to everyone.'
  },
  {
    year: '2023',
    title: 'AI Breakthrough',
    description: 'Developed proprietary emotional AI technology with 95% accuracy in emotion detection.'
  },
  {
    year: '2024',
    title: '50K+ Users',
    description: 'Reached 50,000 active users and processed over 1 million voice sessions.'
  },
  {
    year: '2024',
    title: 'Clinical Validation',
    description: 'Published peer-reviewed research showing 40% improvement in user wellbeing.'
  }
];

export default function AboutPage() {
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
                Our Story
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Transforming Mental Health{' '}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Through Technology
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                We believe everyone deserves access to compassionate, intelligent mental health support. 
                Our mission is to bridge the gap between traditional therapy and everyday emotional wellness 
                through cutting-edge AI technology.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <Card className="glassmorphism border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Our Mission
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-7">
                    To democratize mental health support by providing intelligent, accessible, 
                    and personalized tools that help people understand and improve their emotional wellbeing. 
                    We&apos;re building a world where mental health support is available to everyone, 
                    anytime, anywhere.
                  </p>
                </CardContent>
              </Card>

              <Card className="glassmorphism border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl gradient-secondary flex items-center justify-center mb-6">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Our Vision
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-7">
                    A future where mental health stigma is eliminated, where seeking emotional support 
                    is as natural as taking care of physical health, and where AI-powered tools 
                    complement human connection to create a comprehensive support ecosystem.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Our Core Values
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="glassmorphism border-0 shadow-xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-2xl ${value.gradient} flex items-center justify-center mx-auto mb-4`}>
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Meet Our Team
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                Passionate experts dedicated to revolutionizing mental health care
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="glassmorphism border-0 shadow-xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-3">
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {member.bio}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {member.credentials}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline = Uncomment in the future*/}
        {/* <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Our Journey
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                Key milestones in our mission to transform mental health
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-purple-600 to-blue-600"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <Card className="glassmorphism border-0 shadow-xl">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-3">
                            <Badge variant="secondary" className="gradient-primary text-white">
                              {milestone.year}
                            </Badge>
                            {index % 2 === 0 && <CheckCircle className="w-5 h-5 text-green-500 ml-2" />}
                            {index % 2 !== 0 && <CheckCircle className="w-5 h-5 text-green-500 mr-2" />}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {milestone.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {milestone.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="relative flex items-center justify-center w-8 h-8">
                      <div className="w-4 h-4 rounded-full gradient-primary border-4 border-white dark:border-gray-900"></div>
                    </div>
                    
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section> */}

        {/* Recognition = Uncomment in the future*/}
        {/* <section className="py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Recognition & Awards
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="glassmorphism border-0 shadow-xl text-center">
                <CardContent className="p-8">
                  <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Best Mental Health App 2024
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Digital Health Awards
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glassmorphism border-0 shadow-xl text-center">
                <CardContent className="p-8">
                  <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Top 10 AI Healthcare Startups
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    TechCrunch Disrupt 2024
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glassmorphism border-0 shadow-xl text-center">
                <CardContent className="p-8">
                  <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Innovation in Mental Health
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    American Psychological Association
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section> */}
      </div>

      <Footer />
    </div>
  );
}