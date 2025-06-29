// Client-side email sending with Resend
import { EmailType, EmailData } from '@/types/email';

const RESEND_API_KEY = 're_LJkvCUbj_HwN4bvNkagtLhwrYjAAc5Dsa';

export async function sendEmail(type: EmailType, data: EmailData) {
  try {
    // In a static export, we'll use Resend's API directly
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Resonance <support@resonance.ai>',
        to: data.email,
        subject: getEmailSubject(type),
        html: getEmailContent(type, data),
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Resend API error: ${error.message}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

function getEmailSubject(type: EmailType): string {
  switch (type) {
    case 'welcome':
      return 'Welcome to Resonance!';
    case 'verification':
      return 'Verify your email address';
    case 'password-reset':
      return 'Reset your password';
    case 'check-in-reminder':
      return 'Time for your daily check-in';
    case 'progress-report':
      return 'Your weekly mental health progress report';
    default:
      return 'Message from Resonance';
  }
}

function getEmailContent(type: EmailType, data: EmailData): string {
  switch (type) {
    case 'welcome':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #8B5CF6;">Welcome to Resonance, ${data.name}!</h1>
          <p>We're thrilled to have you join our community of individuals committed to improving their mental wellbeing.</p>
          <p>With Resonance, you can:</p>
          <ul>
            <li>Track your mood and emotions</li>
            <li>Record voice sessions for AI analysis</li>
            <li>Journal your thoughts and feelings</li>
            <li>Get personalized insights about your mental health</li>
          </ul>
          <p>If you have any questions, our support team is here to help.</p>
          <div style="margin-top: 30px; text-align: center;">
            <a href="https://resonance.ai/dashboard" style="background-color: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Start Your Journey</a>
          </div>
        </div>
      `;
    
    case 'verification':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #8B5CF6;">Verify Your Email Address</h1>
          <p>Hi ${data.name},</p>
          <p>Thank you for signing up for Resonance! To complete your registration and access all features, please verify your email address by clicking the button below:</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${(data as any).verificationUrl}" style="background-color: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email Address</a>
          </div>
          <p>If the button above doesn't work, copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #8B5CF6;">${(data as any).verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `;
    
    case 'password-reset':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #8B5CF6;">Reset Your Password</h1>
          <p>Hi ${data.name},</p>
          <p>We received a request to reset your password for your Resonance account. If you didn't make this request, you can safely ignore this email.</p>
          <p>To reset your password, click the button below:</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${(data as any).resetUrl}" style="background-color: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If the button above doesn't work, copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #8B5CF6;">${(data as any).resetUrl}</p>
          <p>This link will expire in 1 hour for security reasons.</p>
        </div>
      `;
    
    default:
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #8B5CF6;">Message from Resonance</h1>
          <p>Hi ${data.name},</p>
          <p>Thank you for using Resonance. We're here to support your mental health journey.</p>
        </div>
      `;
  }
}

export async function sendWelcomeEmail(name: string, email: string) {
  return sendEmail('welcome', { name, email });
}

export async function sendVerificationEmail(name: string, email: string, verificationUrl: string) {
  return sendEmail('verification', { name, email, verificationUrl });
}

export async function sendPasswordResetEmail(name: string, email: string, resetUrl: string) {
  return sendEmail('password-reset', { name, email, resetUrl });
}

export async function sendCheckInReminderEmail(name: string, email: string, lastCheckIn?: string) {
  return sendEmail('check-in-reminder', { name, email, lastCheckIn });
}

export async function sendProgressReportEmail(
  name: string, 
  email: string, 
  averageMood: number, 
  sessionsCount: number, 
  topEmotion: string,
  startDate: string,
  endDate: string
) {
  return sendEmail('progress-report', { 
    name, 
    email, 
    averageMood, 
    sessionsCount, 
    topEmotion,
    startDate,
    endDate
  });
}