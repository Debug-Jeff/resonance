import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '@/lib/email/send-email';

export function useAuthEmail() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const sendSignUpVerificationEmail = async (email: string, name: string) => {
    setLoading(true);
    try {
      // Generate verification URL
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/verify`,
      });

      if (error) throw error;

      // Send custom email
      const verificationUrl = `${window.location.origin}/auth/verify?token=${data?.user?.confirmation_token}`;
      await sendVerificationEmail(name, email, verificationUrl);

      return { success: true };
    } catch (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setLoading(true);
    try {
      // Get user profile to get name
      const { data: profiles } = await supabase
        .from('profiles')
        .select('name')
        .eq('email', email)
        .single();

      const name = profiles?.name || 'User';

      // Generate reset URL
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      // Send custom email
      const resetUrl = `${window.location.origin}/auth/reset-password?token=${data?.user?.recovery_token}`;
      await sendPasswordResetEmail(name, email, resetUrl);

      return { success: true };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const sendWelcome = async (email: string, name: string) => {
    try {
      await sendWelcomeEmail(name, email);
      return { success: true };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }
  };

  return {
    loading,
    sendSignUpVerificationEmail,
    sendPasswordReset,
    sendWelcome
  };
}