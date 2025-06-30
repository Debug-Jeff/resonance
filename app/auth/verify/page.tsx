'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Heart, ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Check if token is present
        const token = searchParams.get('token');
        if (!token) {
          setVerifying(false);
          return;
        }

        // Verify the token
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email',
        });

        if (error) {
          throw error;
        }

        setVerified(true);
        toast.success('Email verified successfully!');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } catch (error) {
        console.error('Error verifying email:', error);
        toast.error('Failed to verify email. The link may be invalid or expired.');
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, router, supabase.auth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="w-full max-w-md animate-fade-in">
        {/* Back to home */}
        <Link 
          href="/"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        <Card className="glassmorphism border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {verifying ? 'Verifying Email' : verified ? 'Email Verified' : 'Verification Failed'}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {verifying 
                ? "Please wait while we verify your email address" 
                : verified 
                  ? "Your email has been successfully verified"
                  : "We couldn't verify your email address"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center py-6">
              {verifying ? (
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
              ) : verified ? (
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              )}
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {verifying 
                  ? "We're verifying your email address. This will only take a moment." 
                  : verified 
                    ? "Thank you for verifying your email address. You now have full access to all Resonance features."
                    : "The verification link may be invalid or has expired. Please request a new verification link."}
              </p>
              
              {!verifying && !verified && (
                <Link href="/auth/signin">
                  <Button
                    className="w-full gradient-primary hover:scale-105 transition-transform"
                    size="lg"
                  >
                    Back to Sign In
                  </Button>
                </Link>
              )}
              
              {verified && (
                <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                  Redirecting to dashboard...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}