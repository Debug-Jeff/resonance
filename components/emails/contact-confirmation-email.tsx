'use client';

import React from 'react';
import { 
  Section, 
  Heading, 
  Text, 
  Button, 
  Hr 
} from '@react-email/components';
import { EmailLayout } from './email-layout';

interface ContactConfirmationEmailProps {
  name: string;
  subject: string;
  message: string;
}

export const ContactConfirmationEmailTemplate = ({ 
  name, 
  subject, 
  message 
}: ContactConfirmationEmailProps) => {
  return (
    <EmailLayout previewText="We've received your message - Resonance">
      <Heading style={styles.heading}>Thank You for Contacting Us</Heading>
      
      <Text style={styles.paragraph}>
        Hi {name},
      </Text>
      
      <Text style={styles.paragraph}>
        We've received your message and wanted to let you know that our team is reviewing it. We typically respond within 24-48 hours during business days.
      </Text>
      
      <Section style={styles.messageContainer}>
        <Heading as="h3" style={styles.messageHeading}>
          Your Message:
        </Heading>
        
        <Text style={styles.messageSubject}>
          <strong>Subject:</strong> {subject}
        </Text>
        
        <Hr style={styles.messageDivider} />
        
        <Text style={styles.messageContent}>
          {message.length > 300 
            ? message.substring(0, 300) + '...' 
            : message}
        </Text>
      </Section>
      
      <Text style={styles.paragraph}>
        While you wait for our response, you might find answers to common questions in our Help Center.
      </Text>
      
      <Section style={styles.ctaContainer}>
        <Button style={styles.button} href="https://resonance.ai/faq">
          Visit Help Center
        </Button>
      </Section>
      
      <Text style={styles.paragraph}>
        If your inquiry is urgent, please feel free to call our support team at 1-800-RESONANCE.
      </Text>
      
      <Text style={styles.signature}>
        Best regards,<br />
        The Resonance Support Team
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
  messageContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '20px',
    margin: '30px 0',
    border: '1px solid #e5e7eb',
  },
  messageHeading: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#374151',
    margin: '0 0 15px',
  },
  messageSubject: {
    fontSize: '16px',
    color: '#4b5563',
    margin: '0 0 10px',
  },
  messageDivider: {
    borderColor: '#e5e7eb',
    margin: '10px 0',
  },
  messageContent: {
    fontSize: '14px',
    lineHeight: '22px',
    color: '#6b7280',
    margin: '10px 0 0',
    fontStyle: 'italic',
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
  signature: {
    fontSize: '16px',
    color: '#4b5563',
    margin: '30px 0 0',
  },
};