'use client';

import { Navigation } from '@/components/layout/landing-navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Scale, AlertTriangle, CheckCircle, 
  Sparkles, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Navigation />
      
      <div className="pt-24">
        {/* Hero Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="glassmorphism px-4 py-2 mb-8">
                <Scale className="w-4 h-4 mr-2" />
                Legal Agreement
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Terms of Service
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                Please read these terms carefully before using Resonance. By accessing or using our service, you agree to be bound by these terms.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <Card className="glassmorphism border-0 shadow-xl">
              <CardContent className="p-8 md:p-12 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Last Updated: December 24, 2025
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    These Terms of Service ("Terms") govern your access to and use of the Resonance website, mobile application, and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    1. Acceptance of Terms
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    By creating an account, accessing, or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    2. Account Registration
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    To use certain features of our Services, you must create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    3. Use of Services
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our Services are designed to help you track and improve your mental health. However, they are not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with any questions you may have regarding a medical condition.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree not to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
                    <li>Use the Services in any way that violates any applicable law or regulation</li>
                    <li>Attempt to interfere with or disrupt the Services or servers or networks connected to the Services</li>
                    <li>Impersonate or attempt to impersonate Resonance, a Resonance employee, or another user</li>
                    <li>Collect or store personal data about other users without their consent</li>
                    <li>Use the Services in any way that could harm, disable, overburden, or impair the Services</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-purple-600" />
                    4. Medical Disclaimer
                  </h3>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-yellow-800 dark:text-yellow-200">
                      <strong>Important:</strong> Resonance is not a medical device or healthcare provider. The Services are not intended to diagnose, treat, cure, or prevent any disease or health condition. The information provided through our Services is for informational purposes only.
                    </p>
                    <p className="text-yellow-800 dark:text-yellow-200 mt-2">
                      If you are experiencing a medical emergency, call your doctor or emergency services immediately. If you are having suicidal thoughts, please call the National Suicide Prevention Lifeline at 988 or go to the nearest emergency room.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    5. User Content
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our Services allow you to create, upload, store, and share content, including text, audio recordings, and other materials ("User Content"). You retain all rights in your User Content, but you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your User Content in connection with providing and improving our Services.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    You are solely responsible for your User Content and the consequences of posting or publishing it. By posting User Content, you represent and warrant that:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
                    <li>You own or have the necessary rights to use and authorize us to use your User Content</li>
                    <li>Your User Content does not violate the privacy rights, publicity rights, copyright, contractual rights, or any other rights of any person</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    6. Privacy
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your privacy is important to us. Our <Link href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline">Privacy Policy</Link> explains how we collect, use, and protect your personal information. By using our Services, you agree to the collection and use of information in accordance with our Privacy Policy.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    7. Subscription and Payments
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Some features of our Services may require a subscription. By subscribing to our Services, you agree to pay the applicable fees. All fees are non-refundable except as required by law or as explicitly stated in these Terms.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    We may change our fees at any time. If we change our fees, we will provide notice of the change on the website or by email, at our option, at least 14 days before the change is to take effect. Your continued use of our Services after the fee change becomes effective constitutes your agreement to pay the changed amount.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    8. Intellectual Property
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    The Services and their original content, features, and functionality are and will remain the exclusive property of Resonance and its licensors. The Services are protected by copyright, trademark, and other laws of both the United States and foreign countries.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Resonance.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    9. Termination
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We may terminate or suspend your account and access to the Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upon termination, your right to use the Services will immediately cease. If you wish to terminate your account, you may simply discontinue using the Services or delete your account through the settings page.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    10. Disclaimer of Warranties
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    The Services are provided on an "AS IS" and "AS AVAILABLE" basis. Resonance and its suppliers expressly disclaim all warranties of any kind, whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Resonance makes no warranty that the Services will meet your requirements, be available on an uninterrupted, secure, or error-free basis, or that defects will be corrected.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    11. Limitation of Liability
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    In no event shall Resonance, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
                    <li>Your access to or use of or inability to access or use the Services</li>
                    <li>Any conduct or content of any third party on the Services</li>
                    <li>Any content obtained from the Services</li>
                    <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    12. Changes to Terms
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    By continuing to access or use our Services after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Services.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    13. Governing Law
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    These Terms shall be governed and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    14. Contact Us
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    If you have any questions about these Terms, please contact us at:
                  </p>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">
                      Email: legal@resonance.ai<br />
                      Address: 123 Mental Health Avenue, Nairobi, Kenya<br />
                      Phone: +254 700 000 000
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Card className="glassmorphism border-0 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
              <CardContent className="relative px-6 py-16 sm:px-6 sm:py-24 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                  <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Ready to start your mental health journey?
                  </h2>
                  <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-400">
                    Join Resonance today and take the first step towards better mental wellbeing.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link href="/auth/signup">
                      <button className="rounded-md bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5 inline" />
                      </button>
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