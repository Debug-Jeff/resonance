import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY || 're_LJkvCUbj_HwN4bvNkagtLhwrYjAAc5Dsa');

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
          html: generateWelcomeEmail(data.name),
        });
        break;
        
      case 'verification':
        emailData = await resend.emails.send({
          from: 'Resonance <noreply@resonance.ai>',
          to: [data.email],
          subject: 'Verify Your Email Address - Resonance',
          html: generateVerificationEmail(data.name, data.verificationUrl),
        });
        break;
        
      case 'password-reset':
        emailData = await resend.emails.send({
          from: 'Resonance <noreply@resonance.ai>',
          to: [data.email],
          subject: 'Reset Your Password - Resonance',
          html: generatePasswordResetEmail(data.name, data.resetUrl),
        });
        break;
        
      case 'check-in-reminder':
        emailData = await resend.emails.send({
          from: 'Resonance <noreply@resonance.ai>',
          to: [data.email],
          subject: 'Your Daily Mental Health Check-in - Resonance',
          html: generateCheckInReminderEmail(data.name, data.lastCheckIn),
        });
        break;
        
      case 'progress-report':
        emailData = await resend.emails.send({
          from: 'Resonance <noreply@resonance.ai>',
          to: [data.email],
          subject: 'Your Weekly Mental Health Progress - Resonance',
          html: generateProgressReportEmail(
            data.name,
            data.averageMood,
            data.sessionsCount,
            data.topEmotion,
            data.startDate,
            data.endDate
          ),
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

// Email template generators
function generateWelcomeEmail(name: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px 0;">
        <img src="https://i.imgur.com/QkBGPJp.png" width="120" height="40" alt="Resonance Logo" style="margin: 0 auto;">
      </div>
      
      <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); padding: 40px; margin: 20px 0;">
        <h1 style="font-size: 24px; font-weight: bold; color: #4f46e5; margin: 0 0 20px; text-align: center;">Welcome to Resonance, ${name}!</h1>
        
        <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0 0 20px;">
          We're thrilled to have you join our community of individuals committed to improving their mental wellbeing through AI-powered insights and support.
        </p>
        
        <div style="margin: 30px 0; text-align: center;">
          <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=300&fit=crop" width="500" height="250" alt="Peaceful landscape" style="border-radius: 8px; max-width: 100%;">
        </div>
        
        <h2 style="font-size: 18px; font-weight: bold; color: #374151; margin: 30px 0 15px;">
          Here's what you can do with Resonance:
        </h2>
        
        <div style="display: flex; flex-direction: column; gap: 20px; margin: 20px 0;">
          <div style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
            <img src="https://i.imgur.com/nV3dQJb.png" width="32" height="32" alt="Voice icon">
            <p style="font-size: 16px; font-weight: bold; color: #374151; margin: 10px 0 5px;">AI Voice Analysis</p>
            <p style="font-size: 14px; color: #6b7280; margin: 0;">
              Record your thoughts and receive emotional insights
            </p>
          </div>
          
          <div style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
            <img src="https://i.imgur.com/8XpzRmJ.png" width="32" height="32" alt="Heart icon">
            <p style="font-size: 16px; font-weight: bold; color: #374151; margin: 10px 0 5px;">Mood Tracking</p>
            <p style="font-size: 14px; color: #6b7280; margin: 0;">
              Monitor your emotional patterns over time
            </p>
          </div>
          
          <div style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
            <img src="https://i.imgur.com/KZL3Uax.png" width="32" height="32" alt="Chart icon">
            <p style="font-size: 16px; font-weight: bold; color: #374151; margin: 10px 0 5px;">Personal Analytics</p>
            <p style="font-size: 14px; color: #6b7280; margin: 0;">
              Visualize your mental health journey
            </p>
          </div>
        </div>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="https://resonance.ai/dashboard" style="background-color: #8b5cf6; color: #ffffff; border-radius: 6px; font-size: 16px; font-weight: bold; padding: 12px 24px; text-decoration: none; display: inline-block;">
            Start Your Journey
          </a>
        </div>
        
        <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0 0 20px;">
          If you have any questions or need assistance, our support team is here to help. Just reply to this email or visit our <a href="https://resonance.ai/help" style="color: #8b5cf6; text-decoration: none;">Help Center</a>.
        </p>
        
        <p style="font-size: 16px; color: #4b5563; margin: 30px 0 0;">
          Warmly,<br>
          The Resonance Team
        </p>
      </div>
      
      <div style="padding: 20px 0; color: #6b7280; font-size: 14px; text-align: center;">
        <hr style="border-color: #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
          © 2025 Resonance AI, Inc. All rights reserved.
        </p>
        <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
          <a href="https://resonance.ai/privacy" style="color: #8b5cf6; text-decoration: none; margin: 0 5px;">Privacy Policy</a> • 
          <a href="https://resonance.ai/terms" style="color: #8b5cf6; text-decoration: none; margin: 0 5px;">Terms of Service</a> • 
          <a href="https://resonance.ai/contact" style="color: #8b5cf6; text-decoration: none; margin: 0 5px;">Contact Us</a>
        </p>
        <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
          You're receiving this email because you signed up for Resonance.
          If you'd like to stop receiving emails, you can 
          <a href="https://resonance.ai/unsubscribe" style="color: #8b5cf6; text-decoration: none;">unsubscribe here</a>.
        </p>
      </div>
    </div>
  `;
}

function generateVerificationEmail(name: string, verificationUrl: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px 0;">
        <img src="https://i.imgur.com/QkBGPJp.png" width="120" height="40" alt="Resonance Logo" style="margin: 0 auto;">
      </div>
      
      <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); padding: 40px; margin: 20px 0;">
        <h1 style="font-size: 24px; font-weight: bold; color: #4f46e5; margin: 0 0 20px; text-align: center;">Verify Your Email Address</h1>
        
        <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0 0 20px;">
          Hi ${name},
        </p>
        
        <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0 0 20px;">
          Thank you for signing up for Resonance! To complete your registration and access all features, please verify your email address by clicking the button below:
        </p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${verificationUrl}" style="background-color: #8b5cf6; color: #ffffff; border-radius: 6px; font-size: 16px; font-weight: bold; padding: 12px 24px; text-decoration: none; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0 0 20px;">
          This link will expire in 24 hours. If you didn't create an account with Resonance, you can safely ignore this email.
        </p>
        
        <hr style="border-color: #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px;">
          If the button above doesn't work, copy and paste this URL into your browser:
        </p>
        
        <p style="font-size: 14px; color: #8b5cf6; margin: 0 0 30px; word-break: break-all;">
          ${verificationUrl}
        </p>
        
        <p style="font-size: 16px; color: #4b5563; margin: 30px 0 0;">
          Best regards,<br>
          The Resonance Team
        </p>
      </div>
      
      <div style="padding: 20px 0; color: #6b7280; font-size: 14px; text-align: center;">
        <hr style="border-color: #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
          © 2025 Resonance AI, Inc. All rights reserved.
        </p>
        <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
          <a href="https://resonance.ai/privacy" style="color: #8b5cf6; text-decoration: none; margin: 0 5px;">Privacy Policy</a> • 
          <a href="https://resonance.ai/terms" style="color: #8b5cf6; text-decoration: none; margin: 0 5px;">Terms of Service</a> • 
          <a href="https://resonance.ai/contact" style="color: #8b5cf6; text-decoration: none; margin: 0 5px;">Contact Us</a>
        </p>
      </div>
    </div>
  `;
}

function generatePasswordResetEmail(name: string, resetUrl: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px 0;">
        <img src="https://i.imgur.com/QkBGPJp.png" width="120" height="40" alt="Resonance Logo" style="margin: 0 auto;">
      </div>
      
      <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); padding: 40px; margin: 20px 0;">
        <h1 style="font-size: 24px; font-weight: bold; color: #4f46e5; margin: 0 0 20px; text-align: center;">Reset Your Password</h1>
        
        <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0 0 20px;">
          Hi ${name},
        </p>
        
        <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0 0 20px;">
          We received a request to reset your password for your Resonance account. If you didn't make this request, you can safely ignore this email.
        </p>
        
        <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0 0 20px;">
          To reset your password, click the button below:
        </p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetUrl}" style="background-color: #8b5cf6; color: #ffffff; border-radius: 6px; font-size: 16px; font-weight: bold; padding: 12px 24px; text-decoration: none; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0 0 20px;">
          This link will expire in 1 hour for security reasons.
        </p>
        
        <hr style="border-color: #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px;">
          If the button above doesn't work, copy and paste this URL into your browser:
        </p>
        
        <p style="font-size: 14px; color: #8b5cf6; margin: 0 0 30px; word-break: break-all;">
          ${resetUrl}
        </p>
        
        <p style="font-size: 14px; color: #6b7280; margin: 20px 0; padding: 15px; background-color: #f9fafb; border-radius: 6px; border-left: 4px solid #8b5cf6;">
          For security, this password reset link was sent to the email address associated with your Resonance account. If you continue to have problems, please contact our support team at support@resonance.ai.
        </p>
        
        <p style="font-size: 16px; color: #4b5563; margin: 30px 0 0;">
          Best regards,<br>
          The Resonance Team
        </p>
      </div>
      
      <div style="padding: 20px 0; color: #6b7280; font-size: 14px; text-align: center;">
        <hr style="border-color: #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
          © 2025 Resonance AI, Inc. All rights reserved.
        </p>
        <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
          <a href="https://resonance.ai/privacy" style="color: #8b5cf6; text-decoration: none; margin: 0 5px;">Privacy Policy</a> • 
          <a href="https://resonance.ai/terms" style="color: #8b5cf6; text-decoration: none; margin: 0 5px;">Terms of Service</a> • 
          <a href="https://resonance.ai/contact" style="color: #8b5cf6; text-decoration: none; margin: 0 5px;">Contact Us</a>
        </p>
      </div>
    </div>
  `;
}

function generateCheckInReminderEmail(name: string, lastCheckIn?: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px 0;">
        <img src="https://i.imgur.com/QkBGPJp.png" width="120" height="40" alt="Resonance Logo" style="margin: 0 auto;">
      </div>
      
      <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); padding: 40px; margin: 20px 0;">
        <h1 style="font-size: 24px; font-weight: bold; color: #4f46e5; margin: 0 0 20px; text-align: center;">Your Daily Check-in</h1>
        
        <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0 0 20px;">
          Hi ${name},
        </p>
        
        <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0 0 20px;">
          ${lastCheckIn 
            ? `It's been ${lastCheckIn} since your last check-in.` 
            : "It looks like you haven't checked in recently."}
          Taking a few moments to reflect on your mental wellbeing can make a big difference in your day.
        </p>
        
        <div style="margin: 30px 0; text-align: center;">
          <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=300&fit=crop" width="500" height="250" alt="Peaceful meditation scene" style="border-radius: 8px; max-width: 100%;">
        </div>
        
        <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0 0 20px;">
          Today's quick tip: <strong>Take three deep breaths</strong> before starting your check-in. This simple practice can help center your mind and bring awareness to how you're feeling right now.
        </p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="https://resonance.ai/mood" style="background-color: #8b5cf6; color: #ffffff; border-radius: 6px; font-size: 16px; font-weight: bold; padding: 12px 24px; text-decoration: none; display: inline-block; margin: 0 10px 10px 0;">
            Track Your Mood
          </a>
          <a href="https://resonance.ai/voice" style="background-color: #ffffff; color: #8b5cf6; border-radius: 6px; font-size: 16px; font-weight: bold; padding: 12px 24px; text-decoration: none; display: inline-block; margin: 0 0 10px 10px; border: 1px solid #8b5cf6;">
            Record Voice Session
          </a>
        </div>
        
        <p style="font-size: 18px; font-style: italic; color: #6b7280; margin: 30px 0; padding: 15px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; text-align: center;">
          "Self-awareness is the first step toward positive change."
        </p>
        
        <p style="font-size: 16px; color: #4b5563; margin: 30px 0 0;">
          Wishing you well,<br>
          The Resonance Team
        </p>
      </div>
      
      <div style="padding: 20px 0; color: #6b7280; font-size: 14px; text-align: center;">
        <hr style="border-color: #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
          © 2025 Resonance AI, Inc. All rights reserved.
        </p>
        <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
          <a href="https://resonance.ai/privacy" style="color: #8b5cf6; text-decoration: none; margin: 0 5px;">Privacy Policy</a> • 
          <a href="https://resonance.ai/terms" style="color: #8b5cf6; text-decoration: none; margin: 0 5px;">Terms of Service</a> • 
          <a href="https://resonance.ai/contact" style="color: #8b5cf6; text-decoration: none; margin: 0 5px;">Contact Us</a>
        </p>
        <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
          You're receiving this email because you signed up for Resonance.
          If you'd like to stop receiving emails, you can 
          <a href="https://resonance.ai/unsubscribe" style="color: #8b5cf6; text-decoration: none;">unsubscribe here</a>.
        </p>
      </div>
    </div>
  `;
}

function generateProgressReportEmail(
  name: string, 
  averageMood: number, 
  sessionsCount: number, 
  topEmotion: string,
  startDate: string,
  endDate: string
): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px 0;">
        <img src="https://i.imgur.com/QkBGPJp.png" width="120" height="40" alt="Resonance Logo" style="margin: 0 auto;">
      </div>
      
      <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); padding: 40px; margin: 20px 0;">
        <h1 style="font-size: 24px; font-weight: bold; color: #4f46e5; margin: 0 0 10px; text-align: center;">Your Weekly Progress Report</h1>
        
        <p style="font-size: 16px; color: #6b7280; margin: 0 0 20px; text-align: center;">
          ${startDate} - ${endDate}
        </p>
        
        <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0 0 20px;">
          Hi ${name},
        </p>
        
        <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0 0 20px;">
          Here's a summary of your mental health journey this week. Taking time to reflect on your progress can help you identify patterns and celebrate your growth.
        </p>
        
        <div style="display: flex; justify-content: space-between; margin: 30px 0;">
          <div style="width: 30%; padding: 15px; background-color: #f9fafb; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb;">
            <p style="font-size: 24px; font-weight: bold; color: #8b5cf6; margin: 0 0 5px;">${averageMood}/10</p>
            <p style="font-size: 14px; color: #6b7280; margin: 0;">Average Mood</p>
          </div>
          
          <div style="width: 30%; padding: 15px; background-color: #f9fafb; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb;">
            <p style="font-size: 24px; font-weight: bold; color: #8b5cf6; margin: 0 0 5px;">${sessionsCount}</p>
            <p style="font-size: 14px; color: #6b7280; margin: 0;">Voice Sessions</p>
          </div>
          
          <div style="width: 30%; padding: 15px; background-color: #f9fafb; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb;">
            <p style="font-size: 24px; font-weight: bold; color: #8b5cf6; margin: 0 0 5px;">${topEmotion}</p>
            <p style="font-size: 14px; color: #6b7280; margin: 0;">Top Emotion</p>
          </div>
        </div>
        
        <hr style="border-color: #e5e7eb; margin: 30px 0;">
        
        <h2 style="font-size: 18px; font-weight: bold; color: #374151; margin: 30px 0 15px;">
          Insights & Recommendations
        </h2>
        
        <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0 0 20px;">
          Based on your activity this week, here are some personalized insights:
        </p>
        
        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 10px 0; display: flex; align-items: flex-start;">
            <img src="https://i.imgur.com/KZL3Uax.png" width="16" height="16" alt="Insight icon" style="margin-right: 10px; margin-top: 4px;">
            Your mood has been ${averageMood >= 7 ? 'consistently positive' : averageMood >= 5 ? 'relatively stable' : 'fluctuating'} this week.
          </p>
          
          <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 10px 0; display: flex; align-items: flex-start;">
            <img src="https://i.imgur.com/KZL3Uax.png" width="16" height="16" alt="Insight icon" style="margin-right: 10px; margin-top: 4px;">
            You've completed ${sessionsCount} voice sessions, which ${sessionsCount >= 3 ? 'shows great commitment' : 'is a good start'} to your mental health journey.
          </p>
          
          <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 10px 0; display: flex; align-items: flex-start;">
            <img src="https://i.imgur.com/KZL3Uax.png" width="16" height="16" alt="Insight icon" style="margin-right: 10px; margin-top: 4px;">
            Your most frequent emotion was "${topEmotion}", which may indicate patterns worth exploring.
          </p>
        </div>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="https://resonance.ai/analytics" style="background-color: #8b5cf6; color: #ffffff; border-radius: 6px; font-size: 16px; font-weight: bold; padding: 12px 24px; text-decoration: none; display: inline-block;">
            View Full Report
          </a>
        </div>
        
        <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0 0 20px;">
          Remember, mental health is a journey, not a destination. Every step you take matters, and we're here to support you along the way.
        </p>
        
        <p style="font-size: 16px; color: #4b5563; margin: 30px 0 0;">
          Here's to your wellbeing,<br>
          The Resonance Team
        </p>
      </div>
      
      <div style="padding: 20px 0; color: #6b7280; font-size: 14px; text-align: center;">
        <hr style="border-color: #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
          © 2025 Resonance AI, Inc. All rights reserved.
        </p>
        <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
          <a href="https://resonance.ai/privacy" style="color: #8b5cf6; text-decoration: none; margin: 0 5px;">Privacy Policy</a> • 
          <a href="https://resonance.ai/terms" style="color: #8b5cf6; text-decoration: none; margin: 0 5px;">Terms of Service</a> • 
          <a href="https://resonance.ai/contact" style="color: #8b5cf6; text-decoration: none; margin: 0 5px;">Contact Us</a>
        </p>
        <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
          You're receiving this email because you signed up for Resonance.
          If you'd like to stop receiving emails, you can 
          <a href="https://resonance.ai/unsubscribe" style="color: #8b5cf6; text-decoration: none;">unsubscribe here</a>.
        </p>
      </div>
    </div>
  `;
}