import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/auth-provider';
import { NotificationProvider } from '@/components/notifications/notification-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Resonance - AI Mental Health Companion',
  description: 'Your personal AI companion for mental health and emotional wellbeing. Track your mood, record voice sessions, and get personalized support.',
  keywords: 'mental health, AI companion, mood tracking, emotional wellbeing, therapy, mindfulness, voice analysis, mental wellness',
  authors: [{ name: 'Resonance Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Resonance - AI Mental Health Companion',
    description: 'Transform your mental health journey with AI-powered insights and personalized support.',
    url: 'https://resonance.ai',
    siteName: 'Resonance',
    images: [
      {
        url: 'https://resonance.ai/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Resonance AI Mental Health Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resonance - AI Mental Health Companion',
    description: 'Transform your mental health journey with AI-powered insights and personalized support.',
    images: ['https://resonance.ai/twitter-image.jpg'],
    creator: '@resonance_ai',
  },
  alternates: {
    canonical: 'https://resonance.ai',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Resonance" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <NotificationProvider>
              {children}
              <Toaster richColors position="top-right" />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}