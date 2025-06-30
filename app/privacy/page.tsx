'use client';

import { Navigation } from '@/components/layout/landing-navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Lock, FileText, CheckCircle, 
  Sparkles, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Navigation />
      
      <div className="pt-24">
        {/* Hero Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="glassmorphism px-4 py-2 mb-8">
                <Shield className="w-4 h-4 mr-2" />
                Privacy First
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Privacy Policy
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                At Resonance, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.
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
                    Last Updated: June 29, 2025
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    This Privacy Policy describes how Resonance ("we", "our", or "us") collects, uses, and shares your personal information when you use our website and services (collectively, the "Services").
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-purple-600" />
                    Information We Collect
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We collect several types of information from and about users of our Services, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
                    <li><strong>Personal Information:</strong> Name, email address, phone number, and other contact details you provide when creating an account.</li>
                    <li><strong>Health Information:</strong> Mood entries, voice recordings, emotional analysis data, and other mental health-related information you choose to share.</li>
                    <li><strong>Usage Data:</strong> Information about how you interact with our Services, including access times, pages viewed, and features used.</li>
                    <li><strong>Device Information:</strong> Information about your device, including IP address, browser type, and operating system.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    How We Use Your Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
                    <li>Provide, maintain, and improve our Services</li>
                    <li>Process and analyze your mental health data to provide personalized insights</li>
                    <li>Communicate with you about your account and our Services</li>
                    <li>Protect the security and integrity of our Services</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-purple-600" />
                    Data Security
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. These measures include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
                    <li>End-to-end encryption for all sensitive data</li>
                    <li>Regular security audits and vulnerability assessments</li>
                    <li>Strict access controls and authentication procedures</li>
                    <li>Employee training on data privacy and security</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
                    Your Rights and Choices
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Depending on your location, you may have certain rights regarding your personal information, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
                    <li><strong>Access:</strong> You can request a copy of the personal information we hold about you.</li>
                    <li><strong>Correction:</strong> You can request that we correct inaccurate or incomplete information.</li>
                    <li><strong>Deletion:</strong> You can request that we delete your personal information.</li>
                    <li><strong>Restriction:</strong> You can request that we restrict the processing of your personal information.</li>
                    <li><strong>Data Portability:</strong> You can request a copy of your data in a structured, commonly used, and machine-readable format.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-400">
                    To exercise these rights, please contact us at privacy@resonance.ai.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Data Sharing and Disclosure
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We do not sell your personal information. We may share your information in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
                    <li><strong>Service Providers:</strong> We may share information with third-party vendors who help us provide our Services.</li>
                    <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests.</li>
                    <li><strong>With Your Consent:</strong> We may share information with your explicit consent, such as when you choose to share your data with a healthcare provider.</li>
                    <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-purple-600" />
                    Cookies and Tracking Technologies
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We use cookies and similar tracking technologies to collect information about your browsing activities and to remember your preferences. You can control cookies through your browser settings and other tools.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Children&apos;s Privacy
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Changes to This Privacy Policy
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Contact Us
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    If you have any questions about this Privacy Policy, please contact us at:
                  </p>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">
                      Email: privacy@resonance.ai<br />
                      Address: Nairobi, Kenya<br />
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
                    Ready to take control of your mental health?
                  </h2>
                  <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-400">
                    Join Resonance today and start your journey to better mental wellbeing with privacy and security at the forefront.
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