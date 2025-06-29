'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/landing-navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, MessageCircle, Send, Sparkles, Heart, 
  Users, Headphones, AlertTriangle, Clock, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Get help via email within 24 hours',
    contact: 'support@resonance.ai',
    action: 'mailto:support@resonance.ai',
    gradient: 'gradient-primary'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with us in real-time',
    contact: 'Available 9 AM - 6 PM PST',
    action: '#',
    gradient: 'gradient-secondary'
  },
  {
    icon: AlertTriangle,
    title: 'Crisis Support',
    description: 'Immediate mental health resources',
    contact: 'Call 988 or text HOME to 741741',
    action: 'tel:988',
    gradient: 'gradient-warm'
  }
];

const supportHours = [
  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM PST' },
  { day: 'Saturday', hours: '10:00 AM - 4:00 PM PST' },
  { day: 'Sunday', hours: 'Emergency support only' }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send form data to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Get in Touch
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                We&apos;re Here to{' '}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Help You
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                Have questions about Resonance? Need technical support? Want to share feedback? 
                Our team is ready to assist you on your mental health journey.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <Card key={index} className="glassmorphism border-0 shadow-xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-2xl ${method.gradient} flex items-center justify-center mx-auto mb-4`}>
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {method.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {method.description}
                    </p>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-4">
                      {method.contact}
                    </p>
                    <Button
                      onClick={() => window.open(method.action, '_blank')}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Contact Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <Card className="glassmorphism border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Send us a message
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Fill out the form below and we&apos;ll get back to you as soon as possible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="type">Inquiry Type</Label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="general">General Question</option>
                        <option value="technical">Technical Support</option>
                        <option value="billing">Billing & Pricing</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                        <option value="press">Press & Media</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about how we can help you..."
                        rows={6}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full gradient-primary hover:scale-105 transition-transform"
                      size="lg"
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Support Hours */}
                <Card className="glassmorphism border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Clock className="w-6 h-6 text-purple-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Support Hours
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {supportHours.map((schedule, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            {schedule.day}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {schedule.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                            Crisis Support Available 24/7
                          </p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            For mental health emergencies, call 988 or text HOME to 741741
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card className="glassmorphism border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Headphones className="w-6 h-6 text-purple-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Quick Help
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/faq'}>
                        <Heart className="w-4 h-4 mr-2" />
                        View FAQ
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => window.open('mailto:community@resonance.ai')}>
                        <Users className="w-4 h-4 mr-2" />
                        Community Forum
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => window.open('mailto:help@resonance.ai')}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Help Center
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Company Info */}
                <Card className="glassmorphism border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Heart className="w-6 h-6 text-purple-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        About Resonance
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-7 mb-4">
                      We&apos;re a passionate team dedicated to making mental health support accessible to everyone through innovative AI technology.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4 mr-2" />
                        support@resonance.ai
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        HIPAA Compliant
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        SOC 2 Certified
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}