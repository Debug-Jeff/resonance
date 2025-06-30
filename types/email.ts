export type EmailType = 
  | 'welcome'
  | 'verification'
  | 'password-reset'
  | 'check-in-reminder'
  | 'progress-report';

export interface BaseEmailData {
  name: string;
  email: string;
}

export interface WelcomeEmailData extends BaseEmailData {}

export interface VerificationEmailData extends BaseEmailData {
  verificationUrl: string;
}

export interface PasswordResetEmailData extends BaseEmailData {
  resetUrl: string;
}

export interface CheckInReminderEmailData extends BaseEmailData {
  lastCheckIn?: string;
}

export interface ProgressReportEmailData extends BaseEmailData {
  averageMood: number;
  sessionsCount: number;
  topEmotion: string;
  startDate: string;
  endDate: string;
}

export type EmailData = 
  | WelcomeEmailData
  | VerificationEmailData
  | PasswordResetEmailData
  | CheckInReminderEmailData
  | ProgressReportEmailData;