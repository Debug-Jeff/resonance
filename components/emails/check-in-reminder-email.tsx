'use client';

import React from 'react';
import { 
  Section, 
  Heading, 
  Text, 
  Button, 
  Link, 
  Img 
} from '@react-email/components';
import { EmailLayout } from './email-layout';

interface CheckInReminderEmailProps {
  name: string;
  lastCheckIn?: string;
}

export const CheckInReminderEmailTemplate = ({ name, lastCheckIn }: CheckInReminderEmailProps) => {
  return (
    <EmailLayout previewText="Time for your daily mental health check-in">
      <Heading style={styles.heading}>Your Daily Check-in</Heading>
      
      <Text style={styles.paragraph}>
        Hi {name},
      </Text>
      
      <Text style={styles.paragraph}>
        {lastCheckIn 
          ? `It's been ${lastCheckIn} since your last check-in.` 
          : "It looks like you haven't checked in recently."}
        Taking a few moments to reflect on your mental wellbeing can make a big difference in your day.
      </Text>
      
      <Section style={styles.imageContainer}>
        <Img
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=300&fit=crop"
          width="500"
          height="250"
          alt="Peaceful meditation scene"
          style={styles.image}
        />
      </Section>
      
      <Text style={styles.paragraph}>
        Today's quick tip: <strong>Take three deep breaths</strong> before starting your check-in. This simple practice can help center your mind and bring awareness to how you're feeling right now.
      </Text>
      
      <Section style={styles.ctaContainer}>
        <Button style={styles.button} href="https://resonance.ai/mood">
          Track Your Mood
        </Button>
        <Button style={styles.secondaryButton} href="https://resonance.ai/voice">
          Record Voice Session
        </Button>
      </Section>
      
      <Text style={styles.quote}>
        "Self-awareness is the first step toward positive change."
      </Text>
      
      <Text style={styles.signature}>
        Wishing you well,<br />
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
  imageContainer: {
    margin: '30px 0',
    textAlign: 'center' as const,
  },
  image: {
    borderRadius: '8px',
    maxWidth: '100%',
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
    margin: '0 10px 10px 0',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    color: '#8b5cf6',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '12px 24px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    margin: '0 0 10px 10px',
    border: '1px solid #8b5cf6',
  },
  quote: {
    fontSize: '18px',
    fontStyle: 'italic',
    color: '#6b7280',
    margin: '30px 0',
    padding: '15px 0',
    borderTop: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb',
    textAlign: 'center' as const,
  },
  signature: {
    fontSize: '16px',
    color: '#4b5563',
    margin: '30px 0 0',
  },
};