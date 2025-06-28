'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/landing-navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ChevronDown, ChevronUp, Search, HelpCircle, 
  Shield, Brain, Heart, Sparkles, MessageCircle
} from 'lucide-react';
import Link from 'next/link';

const faqCategories = [
  {
    name: 'General',
    icon: HelpCircle,
    color: 'text-purple-600'
  },
  {
    name: 'Privacy & Security',
    icon: Shield,
    color: 'text-blue-600'
  },
  {
    name: 'AI & Technology',
    icon: Brain,
    color: 'text-green-600'
  },
  {
    name: 'Mental Health',
    icon: Heart,
    color: 'text-pink-600'
  }
];

const faqs = [
  {
    category: 'General',
    question: 'What is Resonance and how does it work?',
    answer: 'Resonance is an AI-powered mental health companion that helps you track your mood, analyze your emotions through voice recordings, and provides personalized insights. Our platform uses advanced machine learning to understand your emotional patterns and offer evidence-based support and recommendations.'
  },
  {
    category: 'General',
    question: 'Is Resonance a replacement for therapy or professional mental health care?',
    answer: 'No, Resonance is designed to complement, not replace, professional mental health care. While our AI provides valuable insights and support, we always recommend consulting with licensed mental health professionals for serious mental health concerns. Resonance can be a helpful tool between therapy sessions or for general emotional wellness.'
  },
  {
    category: 'General',
    question: 'How much does Resonance cost?',
    answer: 'Resonance offers a free tier with basic features including mood tracking and limited voice sessions. Our Pro plan is $19/month with unlimited features, and Premium is $39/month with advanced collaboration tools. You can start with our free plan and upgrade anytime.'
  },
  {
    category: 'General',
    question: 'Can I use Resonance on multiple devices?',
    answer: 'Yes! Your Resonance account syncs across all your devices. You can access your data and continue your mental health journey whether you\'re on your phone, tablet, or computer.'
  },
  {
    category: 'Privacy & Security',
    question: 'How is my personal data protected?',
    answer: 'We take your privacy extremely seriously. All your data is encrypted both in transit and at rest using industry-standard AES-256 encryption. We never sell your personal information, and you have complete control over your data. You can export or delete your data at any time.'
  },
  {
    category: 'Privacy & Security',
    question: 'Who can access my voice recordings and mood data?',
    answer: 'Only you have access to your personal data. Our AI processes your information to provide insights, but no human staff members can access your recordings or personal information without your explicit consent. We follow strict HIPAA-compliant practices for data handling.'
  },
  {
    category: 'Privacy & Security',
    question: 'Can I share my data with my therapist?',
    answer: 'Yes! With our Pro and Premium plans, you can generate reports and export your data to share with your mental health professionals. This can provide valuable insights for your therapy sessions and help track progress over time.'
  },
  {
    category: 'AI & Technology',
    question: 'How accurate is the AI emotion detection?',
    answer: 'Our AI emotion detection system has been trained on millions of voice samples and achieves 95% accuracy in clinical testing. However, AI is not perfect, and we always encourage users to trust their own feelings and seek professional help when needed.'
  },
  {
    category: 'AI & Technology',
    question: 'What languages does Resonance support?',
    answer: 'Currently, Resonance supports English, Spanish, French, German, and Mandarin Chinese. We\'re continuously working to add more languages to make mental health support accessible to more people worldwide.'
  },
  {
    category: 'AI & Technology',
    question: 'How does the AI provide personalized recommendations?',
    answer: 'Our AI analyzes your mood patterns, voice data, and journal entries to identify trends and triggers. Based on evidence-based psychological principles and your personal patterns, it provides tailored recommendations for coping strategies, mindfulness exercises, and lifestyle adjustments.'
  },
  {
    category: 'Mental Health',
    question: 'What should I do if I\'m having thoughts of self-harm?',
    answer: 'If you\'re having thoughts of self-harm or suicide, please reach out for immediate help. Contact the National Suicide Prevention Lifeline at 988, text HOME to 741741, or go to your nearest emergency room. Resonance also provides quick access to crisis resources in our Crisis Support section.'
  },
  {
    category: 'Mental Health',
    question: 'Can Resonance help with specific mental health conditions?',
    answer: 'Resonance can be helpful for managing symptoms of anxiety, depression, stress, and general emotional wellness. However, we cannot diagnose mental health conditions. Our tools are designed to support overall mental wellness and should be used alongside professional care for specific conditions.'
  },
  {
    category: 'Mental Health',
    question: 'How often should I use Resonance?',
    answer: 'We recommend daily use for the best results, even if it\'s just a quick mood check-in. Consistency helps our AI better understand your patterns and provide more accurate insights. However, use Resonance at whatever frequency feels comfortable and sustainable for you.'
  },
  {
    category: 'Mental Health',
    question: 'Is Resonance suitable for teenagers?',
    answer: 'Resonance is designed for users 18 and older. For users under 18, we recommend parental supervision and consultation with a mental health professional. We\'re working on a teen-specific version with appropriate safeguards and parental controls.'
  }
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                Frequently Asked Questions
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Get{' '}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Answers
                </span>{' '}
                to Your Questions
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                Find answers to common questions about Resonance, our AI technology, 
                privacy practices, and mental health support.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search frequently asked questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glassmorphism border-0 shadow-lg"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={selectedCategory === 'All' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('All')}
                  className={selectedCategory === 'All' ? 'gradient-primary' : ''}
                >
                  All Questions
                </Button>
                {faqCategories.map((category) => (
                  <Button
                    key={category.name}
                    variant={selectedCategory === category.name ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.name)}
                    className={selectedCategory === category.name ? 'gradient-primary' : ''}
                  >
                    <category.icon className={`w-4 h-4 mr-2 ${category.color}`} />
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => {
                const isExpanded = expandedItems.includes(index);
                const categoryInfo = faqCategories.find(cat => cat.name === faq.category);
                
                return (
                  <Card key={index} className="glassmorphism border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleExpanded(index)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors rounded-lg"
                      >
                        <div className="flex items-start space-x-4">
                          {categoryInfo && (
                            <categoryInfo.icon className={`w-5 h-5 mt-1 ${categoryInfo.color} flex-shrink-0`} />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {faq.question}
                            </h3>
                            <Badge variant="secondary" className="mt-2">
                              {faq.category}
                            </Badge>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="px-6 pb-6">
                          <div className="pl-9">
                            <p className="text-gray-600 dark:text-gray-400 leading-7">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <Card className="glassmorphism border-0 shadow-xl mx-auto max-w-md">
                  <CardContent className="p-12">
                    <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      No questions found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Try adjusting your search terms or browse all categories.
                    </p>
                    <Button 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('All');
                      }}
                      variant="outline"
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Card className="glassmorphism border-0 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
              <CardContent className="relative px-6 py-16 sm:px-6 sm:py-24 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                  <MessageCircle className="w-16 h-16 text-purple-600 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Still have questions?
                  </h2>
                  <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-400">
                    Can't find the answer you're looking for? Our support team is here to help you 
                    with any questions about Resonance.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link href="/contact">
                      <Button size="lg" className="gradient-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                        Contact Support
                        <MessageCircle className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button variant="outline" size="lg" className="hover:scale-105 transition-all duration-300 border-2 hover:border-purple-300">
                        Try Resonance Free
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