import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendPasswordResetEmail } from '@/lib/email/send-email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;
    
    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Create Supabase client
    const supabase = createClient();
    
    // Get user profile to get name
    const { data: profiles } = await supabase
      .from('profiles')
      .select('name')
      .eq('email', email)
      .single();
      
    const name = profiles?.name || 'User';
    
    // Send password reset email
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Send custom email
    try {
      const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${data?.user?.recovery_token}`;
      await sendPasswordResetEmail(name, email, resetUrl);
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      // Continue anyway
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}