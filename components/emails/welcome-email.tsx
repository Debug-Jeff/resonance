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

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmailTemplate = ({ name }: WelcomeEmailProps) => {
  return (
    <EmailLayout previewText="Welcome to Resonance - Your mental health journey begins now">
      <Heading style={styles.heading}>Welcome to Resonance, {name}!</Heading>
      
      <Text style={styles.paragraph}>
        We're thrilled to have you join our community of individuals committed to improving their mental wellbeing through AI-powered insights and support.
      </Text>
      
      <Section style={styles.imageContainer}>
        <Img
          src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=300&fit=crop"
          width="500"
          height="250"
          alt="Peaceful landscape"
          style={styles.image}
        />
      </Section>
      
      <Heading as="h2" style={styles.subheading}>
        Here's what you can do with Resonance:
      </Heading>
      
      <Section style={styles.features}>
        <Section style={styles.feature}>
          <Img
            src="https://i.imgur.com/nV3dQJb.png"
            width="32"
            height="32"
            alt="Voice icon"
          />
          <Text style={styles.featureTitle}>AI Voice Analysis</Text>
          <Text style={styles.featureText}>
            Record your thoughts and receive emotional insights
          </Text>
        </Section>
        
        <Section style={styles.feature}>
          <Img
            src="https://i.imgur.com/8XpzRmJ.png"
            width="32"
            height="32"
            alt="Heart icon"
          />
          <Text style={styles.featureTitle}>Mood Tracking</Text>
          <Text style={styles.featureText}>
            Monitor your emotional patterns over time
          </Text>
        </Section>
        
        <Section style={styles.feature}>
          <Img
            src="https://i.imgur.com/KZL3Uax.png"
            width="32"
            height="32"
            alt="Chart icon"
          />
          <Text style={styles.featureTitle}>Personal Analytics</Text>
          <Text style={styles.featureText}>
            Visualize your mental health journey
          </Text>
        </Section>
      </Section>
      
      <Section style={styles.ctaContainer}>
        <Button style={styles.button} href="https://resonance.ai/dashboard">
          Start Your Journey
        </Button>
      </Section>
      
      <Text style={styles.paragraph}>
        If you have any questions or need assistance, our support team is here to help. Just reply to this email or visit our <Link href="https://resonance.ai/help" style={styles.link}>Help Center</Link>.
      </Text>
      
      <Text style={styles.signature}>
        Warmly,<br />
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
  subheading: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#374151',
    margin: '30px 0 15px',
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
  features: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    margin: '20px 0',
  },
  feature: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    padding: '15px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  featureTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#374151',
    margin: '10px 0 5px',
  },
  featureText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0',
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
  link: {
    color: '#8b5cf6',
    textDecoration: 'none',
  },
  signature: {
    fontSize: '16px',
    color: '#4b5563',
    margin: '30px 0 0',
  },
};