'use client';

import React from 'react';
import { 
  Section, 
  Heading, 
  Text, 
  Button, 
  Link, 
  Hr 
} from '@react-email/components';
import { EmailLayout } from './email-layout';

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export const PasswordResetEmailTemplate = ({ name, resetUrl }: PasswordResetEmailProps) => {
  return (
    <EmailLayout previewText="Reset your Resonance password">
      <Heading style={styles.heading}>Reset Your Password</Heading>
      
      <Text style={styles.paragraph}>
        Hi {name},
      </Text>
      
      <Text style={styles.paragraph}>
        We received a request to reset your password for your Resonance account. If you didn't make this request, you can safely ignore this email.
      </Text>
      
      <Text style={styles.paragraph}>
        To reset your password, click the button below:
      </Text>
      
      <Section style={styles.ctaContainer}>
        <Button style={styles.button} href={resetUrl}>
          Reset Password
        </Button>
      </Section>
      
      <Text style={styles.paragraph}>
        This link will expire in 1 hour for security reasons.
      </Text>
      
      <Hr style={styles.hr} />
      
      <Text style={styles.smallText}>
        If the button above doesn't work, copy and paste this URL into your browser:
      </Text>
      
      <Text style={styles.linkText}>
        {resetUrl}
      </Text>
      
      <Text style={styles.securityNote}>
        For security, this password reset link was sent to the email address associated with your Resonance account. If you continue to have problems, please contact our support team at support@resonance.ai.
      </Text>
      
      <Text style={styles.signature}>
        Best regards,<br />
        The Resonance Team
      </Text>
    </EmailLayout>
  );
};

const styles = {
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4f46e5',
    margin: '0 0 20px',
    textAlign: 'center' as const,
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#4b5563',
    margin: '0 0 20px',
  },
  ctaContainer: {
    margin: '30px 0',
    textAlign: 'center' as const,
  },
  button: {
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '12px 24px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
  },
  hr: {
    borderColor: '#e5e7eb',
    margin: '30px 0',
  },
  smallText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 10px',
  },
  linkText: {
    fontSize: '14px',
    color: '#8b5cf6',
    margin: '0 0 30px',
    wordBreak: 'break-all' as const,
  },
  securityNote: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '20px 0',
    padding: '15px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    borderLeft: '4px solid #8b5cf6',
  },
  signature: {
    fontSize: '16px',
    color: '#4b5563',
    margin: '30px 0 0',
  },
};