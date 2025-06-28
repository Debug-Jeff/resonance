'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/landing-navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, Phone, MapPin, Clock, Send, MessageCircle,
  Sparkles, Heart, Users, Headphones, AlertTriangle,
  CheckCircle, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Get help within 24 hours',
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
    icon: Phone,
    title: 'Phone Support',
    description: 'Speak with our team',
    contact: '+254 700 000 000',
    action: 'tel:+254700000000',
    gradient: 'gradient-accent'
  }
];

const quickHelp = [
  { title: 'Getting Started Guide', description: 'Learn the basics of Resonance' },
  { title: 'Privacy & Security', description: 'How we protect your data' },
  { title: 'Billing & Pricing', description: 'Subscription and payment info' },
  { title: 'Technical Support', description: 'Troubleshooting and bugs' }
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

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      type: 'general'
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Navigation />
      
      <div className="pt-24">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/10 to-cyan-400/10 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200/50 dark:border-purple-800/50 mb-8">
                <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Get in Touch</span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-6">
                We're Here to{' '}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Help You
                </span>
              </h1>
              
              <p className="text-xl leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Have questions about Resonance? Need support? Our team is ready to assist you on your mental health journey.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {contactMethods.map((method, index) => (
                <Card key={index} className="glassmorphism border-0 shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer" onClick={() => window.open(method.action, '_blank')}>
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-2xl ${method.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {method.description}
                    </p>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {method.contact}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div className="order-2 lg:order-1">
                <Card className="glassmorphism border-0 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Send us a message
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Fill out the form below and we'll get back to you within 24 hours.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            className="mt-2 h-12 border-2 focus:border-purple-500 transition-all duration-300"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your@email.com"
                            className="mt-2 h-12 border-2 focus:border-purple-500 transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="type" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Inquiry Type
                        </Label>
                        <select
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="mt-2 w-full h-12 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-purple-500 dark:bg-gray-800 dark:text-white transition-all duration-300"
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
                        <Label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Subject
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Brief description of your inquiry"
                          className="mt-2 h-12 border-2 focus:border-purple-500 transition-all duration-300"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Message
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us more about how we can help you..."
                          rows={6}
                          className="mt-2 border-2 focus:border-purple-500 transition-all duration-300 resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 gradient-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-white font-semibold"
                        size="lg"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                            Sending...
                          </div>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="order-1 lg:order-2 space-y-8">
                {/* Quick Help */}
                <Card className="glassmorphism border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Headphones className="w-6 h-6 text-purple-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Quick Help
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {quickHelp.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors cursor-pointer group">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.description}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Support Hours */}
                <Card className="glassmorphism border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Clock className="w-6 h-6 text-purple-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Support Hours
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Monday - Friday</span>
                        <span className="font-medium text-gray-900 dark:text-white">9:00 AM - 6:00 PM PST</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Saturday</span>
                        <span className="font-medium text-gray-900 dark:text-white">10:00 AM - 4:00 PM PST</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Sunday</span>
                        <span className="font-medium text-gray-900 dark:text-white">Emergency support only</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-200/50 dark:border-red-800/50">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-1">
                            Crisis Support Available 24/7
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            For mental health emergencies, call 988 or text HOME to 741741
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Office Location */}
                <Card className="glassmorphism border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <MapPin className="w-6 h-6 text-purple-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Our Office
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-gray-600 dark:text-gray-400">
                        123 Innovation Drive, Suite 400<br />
                        Nairobi, Kenya
                      </p>
                      <p className="text-purple-600 dark:text-purple-400 font-medium">
                        +254 700 000 000
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Card className="glassmorphism border-0 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
              <CardContent className="relative px-6 py-16 sm:px-6 sm:py-24 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                  <MessageCircle className="w-16 h-16 text-purple-600 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-6">
                    Ready to start your mental health journey?
                  </h2>
                  <p className="mx-auto max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-400 mb-10">
                    Join thousands of people who are taking control of their mental wellbeing with Resonance's AI-powered platform.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                    <Button size="lg" className="gradient-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-3 w-full sm:w-auto">
                      Start Free Today
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="lg" className="hover:scale-105 transition-all duration-300 border-2 hover:border-purple-300 px-8 py-3 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 w-full sm:w-auto">
                      Learn More
                    </Button>
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
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}