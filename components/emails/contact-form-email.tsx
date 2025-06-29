'use client'

import React from 'react';
import { 
  Section, 
  Heading, 
  Text, 
  Hr 
} from '@react-email/components';
import { EmailLayout } from './email-layout';

interface ContactFormEmailProps {
  name: string;
  email: string;
  type: string;
  subject: string;
  message: string;
}

export const ContactFormEmailTemplate = ({ 
  name, 
  email, 
  type, 
  subject, 
  message 
}: ContactFormEmailProps) => {
  return (
    <EmailLayout previewText={`New contact form submission: ${subject}`}>
      <Heading style={styles.heading}>New Contact Form Submission</Heading>
      
      <Section style={styles.infoContainer}>
        <Text style={styles.infoItem}>
          <strong>Name:</strong> {name}
        </Text>
        <Text style={styles.infoItem}>
          <strong>Email:</strong> {email}
        </Text>
        <Text style={styles.infoItem}>
          <strong>Type:</strong> {type}
        </Text>
        <Text style={styles.infoItem}>
          <strong>Subject:</strong> {subject}
        </Text>
      </Section>
      
      <Hr style={styles.hr} />
      
      <Heading as="h2" style={styles.subheading}>
        Message:
      </Heading>
      
      <Section style={styles.messageContainer}>
        <Text style={styles.message}>
          {message.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </Text>
      </Section>
      
      <Hr style={styles.hr} />
      
      <Text style={styles.note}>
        This message was sent from the contact form on resonance.ai. Please respond to the user directly by replying to their email address.
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
  subheading: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#374151',
    margin: '20px 0 15px',
  },
  infoContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '20px',
    margin: '20px 0',
  },
  infoItem: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#4b5563',
    margin: '10px 0',
  },
  hr: {
    borderColor: '#e5e7eb',
    margin: '20px 0',
  },
  messageContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '20px',
    margin: '20px 0',
  },
  message: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#4b5563',
    margin: '0',
    whiteSpace: 'pre-wrap' as const,
  },
  note: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '20px 0 0',
    fontStyle: 'italic',
  },
};