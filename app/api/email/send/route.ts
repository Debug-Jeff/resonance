import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WelcomeEmailTemplate } from '@/components/emails/welcome-email';
import { PasswordResetEmailTemplate } from '@/components/emails/password-reset-email';
import { VerificationEmailTemplate } from '@/components/emails/verification-email';
import { CheckInReminderEmailTemplate } from '@/components/emails/check-in-reminder-email';
import { ProgressReportEmailTemplate } from '@/components/emails/progress-report-email';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;
    
    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    let emailData;
    
    switch (type) {
      case 'welcome':
        emailData = await resend.emails.send({
          from: 'Resonance <noreply@resonance.ai>',
          to: [data.email],
          subject: 'Welcome to Resonance - Your Mental Health Journey Begins',
          react: WelcomeEmailTemplate({ name: data.name }),
        });
        break;
        
      case 'verification':
        emailData = await resend.emails.send({
          from: 'Resonance <noreply@resonance.ai>',
          to: [data.email],
          subject: 'Verify Your Email Address - Resonance',
          react: VerificationEmailTemplate({ 
            name: data.name,
            verificationUrl: data.verificationUrl 
          }),
        });
        break;
        
      case 'password-reset':
        emailData = await resend.emails.send({
          from: 'Resonance <noreply@resonance.ai>',
          to: [data.email],
          subject: 'Reset Your Password - Resonance',
          react: PasswordResetEmailTemplate({ 
            name: data.name,
            resetUrl: data.resetUrl 
          }),
        });
        break;
        
      case 'check-in-reminder':
        emailData = await resend.emails.send({
          from: 'Resonance <noreply@resonance.ai>',
          to: [data.email],
          subject: 'Your Daily Mental Health Check-in - Resonance',
          react: CheckInReminderEmailTemplate({ 
            name: data.name,
            lastCheckIn: data.lastCheckIn 
          }),
        });
        break;
        
      case 'progress-report':
        emailData = await resend.emails.send({
          from: 'Resonance <noreply@resonance.ai>',
          to: [data.email],
          subject: 'Your Weekly Mental Health Progress - Resonance',
          react: ProgressReportEmailTemplate({ 
            name: data.name,
            averageMood: data.averageMood,
            sessionsCount: data.sessionsCount,
            topEmotion: data.topEmotion,
            startDate: data.startDate,
            endDate: data.endDate
          }),
        });
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({ success: true, data: emailData });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}