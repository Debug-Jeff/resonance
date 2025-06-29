'use client'

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

interface VerificationEmailProps {
  name: string;
  verificationUrl: string;
}

export const VerificationEmailTemplate = ({ name, verificationUrl }: VerificationEmailProps) => {
  return (
    <EmailLayout previewText="Please verify your email address for Resonance">
      <Heading style={styles.heading}>Verify Your Email Address</Heading>
      
      <Text style={styles.paragraph}>
        Hi {name},
      </Text>
      
      <Text style={styles.paragraph}>
        Thank you for signing up for Resonance! To complete your registration and access all features, please verify your email address by clicking the button below:
      </Text>
      
      <Section style={styles.ctaContainer}>
        <Button style={styles.button} href={verificationUrl}>
          Verify Email Address
        </Button>
      </Section>
      
      <Text style={styles.paragraph}>
        This link will expire in 24 hours. If you didn't create an account with Resonance, you can safely ignore this email.
      </Text>
      
      <Hr style={styles.hr} />
      
      <Text style={styles.smallText}>
        If the button above doesn't work, copy and paste this URL into your browser:
      </Text>
      
      <Text style={styles.linkText}>
        {verificationUrl}
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
  signature: {
    fontSize: '16px',
    color: '#4b5563',
    margin: '30px 0 0',
  },
};