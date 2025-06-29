import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
// Uncomment to use Resend for email
// import { Resend } from 'resend';

// Uncomment to use Resend for email
// const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send email notification (uncomment to use Resend)
    // const { data, error: emailError } = await resend.emails.send({
    //   from: 'Resonance <contact@resonance.ai>',
    //   to: ['support@resonance.ai'],
    //   subject: `New Contact Form: ${subject}`,
    //   html: `
    //     <h1>New Contact Form Submission</h1>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Type:</strong> ${type || 'General'}</p>
    //     <p><strong>Subject:</strong> ${subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message.replace(/\n/g, '<br>')}</p>
    //   `,
    // });
    
    // if (emailError) {
    //   console.error('Email error:', emailError);
    //   // Continue anyway since we saved to database
    // }

    // Send confirmation email to user (uncomment to use Resend)
    // const { error: confirmationError } = await resend.emails.send({
    //   from: 'Resonance <contact@resonance.ai>',
    //   to: [email],
    //   subject: 'We received your message - Resonance',
    //   html: `
    //     <h1>Thank you for contacting Resonance</h1>
    //     <p>Hello ${name},</p>
    //     <p>We've received your message and will get back to you as soon as possible.</p>
    //     <p>For your records, here's a copy of your message:</p>
    //     <p><strong>Subject:</strong> ${subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message.replace(/\n/g, '<br>')}</p>
    //     <p>Best regards,<br>The Resonance Team</p>
    //   `,
    // });
    
    // if (confirmationError) {
    //   console.error('Confirmation email error:', confirmationError);
    //   // Continue anyway
    // }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}