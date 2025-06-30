'use client';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

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
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B5CF6; margin-bottom: 20px;">New Contact Form Submission</h1>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Type:</strong> ${type || 'General'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <h2 style="color: #374151; margin-bottom: 10px;">Message:</h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; white-space: pre-wrap;">
            ${message}
          </div>
          
          <hr style="margin: 30px 0; border-color: #e5e7eb;" />
          
          <p style="color: #6b7280; font-style: italic;">
            This message was sent from the contact form on resonance.ai. Please respond to the user directly by replying to their email address.
          </p>
        </div>
      `,
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
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B5CF6; margin-bottom: 20px; text-align: center;">Thank You for Contacting Us</h1>
          
          <p style="margin-bottom: 20px;">Hi ${name},</p>
          
          <p style="margin-bottom: 20px;">
            We've received your message and wanted to let you know that our team is reviewing it. 
            We typically respond within 24-48 hours during business days.
          </p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin-top: 0; color: #374151;">Your Message:</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border-color: #e5e7eb; margin: 10px 0;" />
            <p style="white-space: pre-wrap; color: #6b7280; font-style: italic;">
              ${message.length > 300 ? message.substring(0, 300) + '...' : message}
            </p>
          </div>
          
          <p style="margin-bottom: 20px;">
            While you wait for our response, you might find answers to common questions in our 
            <a href="https://resonance.ai/faq" style="color: #8B5CF6; text-decoration: none;">Help Center</a>.
          </p>
          
          <p style="margin-bottom: 20px;">
            If your inquiry is urgent, please feel free to call our support team at 1-800-RESONANCE.
          </p>
          
          <p style="margin-top: 30px;">
            Best regards,<br />
            The Resonance Support Team
          </p>
          
          <hr style="margin: 30px 0; border-color: #e5e7eb;" />
          
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>© 2025 Resonance AI, Inc. All rights reserved.</p>
            <p>
              <a href="https://resonance.ai/privacy" style="color: #8B5CF6; text-decoration: none; margin: 0 5px;">Privacy Policy</a> • 
              <a href="https://resonance.ai/terms" style="color: #8B5CF6; text-decoration: none; margin: 0 5px;">Terms of Service</a> • 
              <a href="https://resonance.ai/contact" style="color: #8B5CF6; text-decoration: none; margin: 0 5px;">Contact Us</a>
            </p>
          </div>
        </div>
      `,
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