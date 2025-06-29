'use client'

import React from 'react';
import { 
  Html, 
  Body, 
  Container, 
  Section, 
  Heading, 
  Text, 
  Link, 
  Hr, 
  Img 
} from '@react-email/components';

interface EmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

export const EmailLayout = ({ previewText, children }: EmailLayoutProps) => {
  return (
    <Html>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Img
              src="https://i.imgur.com/QkBGPJp.png"
              width="120"
              height="40"
              alt="Resonance Logo"
              style={styles.logo}
            />
          </Section>
          
          {/* Content */}
          <Section style={styles.content}>
            {children}
          </Section>
          
          {/* Footer */}
          <Section style={styles.footer}>
            <Hr style={styles.hr} />
            <Text style={styles.footerText}>
              © 2025 Resonance AI, Inc. All rights reserved.
            </Text>
            <Text style={styles.footerLinks}>
              <Link href="https://resonance.ai/privacy" style={styles.link}>Privacy Policy</Link> • 
              <Link href="https://resonance.ai/terms" style={styles.link}>Terms of Service</Link> • 
              <Link href="https://resonance.ai/contact" style={styles.link}>Contact Us</Link>
            </Text>
            <Text style={styles.footerText}>
              You&apos;re receiving this email because you signed up for Resonance.
              If you&apos;d like to stop receiving emails, you can 
              <Link href="https://resonance.ai/unsubscribe" style={styles.link}>unsubscribe here</Link>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const styles = {
  body: {
    backgroundColor: '#f9fafb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    margin: '0',
    padding: '0',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    padding: '20px 0',
    textAlign: 'center' as const,
  },
  logo: {
    margin: '0 auto',
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    padding: '40px',
    margin: '20px 0',
  },
  footer: {
    padding: '20px 0',
    color: '#6b7280',
    fontSize: '14px',
    textAlign: 'center' as const,
  },
  footerText: {
    color: '#6b7280',
    fontSize: '14px',
    margin: '10px 0',
  },
  footerLinks: {
    color: '#6b7280',
    fontSize: '14px',
    margin: '10px 0',
  },
  link: {
    color: '#8b5cf6',
    textDecoration: 'none',
    margin: '0 5px',
  },
  hr: {
    borderColor: '#e5e7eb',
    margin: '20px 0',
  },
};