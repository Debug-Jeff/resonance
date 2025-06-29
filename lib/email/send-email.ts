// This is a client-side mock for email sending
// In a real app, this would call a serverless function

import { EmailType, EmailData } from '@/types/email';

export async function sendEmail(type: EmailType, data: EmailData) {
  try {
    // In a static export, we can't use server routes
    // This is a mock implementation
    console.log(`Sending ${type} email to ${data.email}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
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