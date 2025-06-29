import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { ContactFormEmailTemplate } from '@/components/emails/contact-form-email';
import { ContactConfirmationEmailTemplate } from '@/components/emails/contact-confirmation-email';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY || 're_LJkvCUbj_HwN4bvNkagtLhwrYjAAc5Dsa');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, type } = body;
    
    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createClient();
    
    // Store contact submission in database
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        subject,
        message,
        type: type || 'general'
      });
      
    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save contact submission' },
        { status: 500 }
      );
    }

    // Send email notification to admin
    const { data: adminEmailData, error: adminEmailError } = await resend.emails.send({
      from: 'Resonance <contact@resonance.ai>',
      to: ['support@resonance.ai'],
      subject: `New Contact Form: ${subject}`,
      react: ContactFormEmailTemplate({
        name,
        email,
        type: type || 'General',
        subject,
        message
      }),
    });
    
    if (adminEmailError) {
      console.error('Admin email error:', adminEmailError);
      // Continue anyway since we saved to database
    }

    // Send confirmation email to user
    const { error: confirmationError } = await resend.emails.send({
      from: 'Resonance <contact@resonance.ai>',
      to: [email],
      subject: 'We received your message - Resonance',
      react: ContactConfirmationEmailTemplate({
        name,
        subject,
        message
      }),
    });
    
    if (confirmationError) {
      console.error('Confirmation email error:', confirmationError);
      // Continue anyway
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}