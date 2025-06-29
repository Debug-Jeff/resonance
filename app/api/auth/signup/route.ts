import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendWelcomeEmail, sendVerificationEmail } from '@/lib/email/send-email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, metadata } = body;
    
    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create Supabase client
    const supabase = createClient();
    
    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          ...metadata
        },
      }
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Send welcome email
    try {
      await sendWelcomeEmail(name, email);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Continue anyway
    }
    
    // Send verification email if email confirmation is enabled
    if (data?.user?.identities?.[0]?.identity_data?.email_confirmed_at === null) {
      try {
        const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify?token=${data?.user?.confirmation_token}`;
        await sendVerificationEmail(name, email, verificationUrl);
      } catch (verificationError) {
        console.error('Error sending verification email:', verificationError);
        // Continue anyway
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      user: data.user,
      session: data.session
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}