import React from 'react';
import { 
  Section, 
  Heading, 
  Text, 
  Button, 
  Link, 
  Img,
  Hr
} from '@react-email/components';
import { EmailLayout } from './email-layout';

interface ProgressReportEmailProps {
  name: string;
  averageMood: number;
  sessionsCount: number;
  topEmotion: string;
  startDate: string;
  endDate: string;
}

export const ProgressReportEmailTemplate = ({ 
  name, 
  averageMood, 
  sessionsCount, 
  topEmotion,
  startDate,
  endDate
}: ProgressReportEmailProps) => {
  return (
    <EmailLayout previewText="Your weekly mental health progress report">
      <Heading style={styles.heading}>Your Weekly Progress Report</Heading>
      
      <Text style={styles.dateRange}>
        {startDate} - {endDate}
      </Text>
      
      <Text style={styles.paragraph}>
        Hi {name},
      </Text>
      
      <Text style={styles.paragraph}>
        Here's a summary of your mental health journey this week. Taking time to reflect on your progress can help you identify patterns and celebrate your growth.
      </Text>
      
      <Section style={styles.statsContainer}>
        <Section style={styles.statBox}>
          <Text style={styles.statValue}>{averageMood}/10</Text>
          <Text style={styles.statLabel}>Average Mood</Text>
        </Section>
        
        <Section style={styles.statBox}>
          <Text style={styles.statValue}>{sessionsCount}</Text>
          <Text style={styles.statLabel}>Voice Sessions</Text>
        </Section>
        
        <Section style={styles.statBox}>
          <Text style={styles.statValue}>{topEmotion}</Text>
          <Text style={styles.statLabel}>Top Emotion</Text>
        </Section>
      </Section>
      
      <Hr style={styles.hr} />
      
      <Heading as="h2" style={styles.subheading}>
        Insights & Recommendations
      </Heading>
      
      <Text style={styles.paragraph}>
        Based on your activity this week, here are some personalized insights:
      </Text>
      
      <Section style={styles.insightContainer}>
        <Text style={styles.insight}>
          <Img
            src="https://i.imgur.com/KZL3Uax.png"
            width="16"
            height="16"
            alt="Insight icon"
            style={styles.insightIcon}
          />
          Your mood has been {averageMood >= 7 ? 'consistently positive' : averageMood >= 5 ? 'relatively stable' : 'fluctuating'} this week.
        </Text>
        
        <Text style={styles.insight}>
          <Img
            src="https://i.imgur.com/KZL3Uax.png"
            width="16"
            height="16"
            alt="Insight icon"
            style={styles.insightIcon}
          />
          You've completed {sessionsCount} voice sessions, which {sessionsCount >= 3 ? 'shows great commitment' : 'is a good start'} to your mental health journey.
        </Text>
        
        <Text style={styles.insight}>
          <Img
            src="https://i.imgur.com/KZL3Uax.png"
            width="16"
            height="16"
            alt="Insight icon"
            style={styles.insightIcon}
          />
          Your most frequent emotion was "{topEmotion}", which may indicate patterns worth exploring.
        </Text>
      </Section>
      
      <Section style={styles.ctaContainer}>
        <Button style={styles.button} href="https://resonance.ai/analytics">
          View Full Report
        </Button>
      </Section>
      
      <Text style={styles.paragraph}>
        Remember, mental health is a journey, not a destination. Every step you take matters, and we're here to support you along the way.
      </Text>
      
      <Text style={styles.signature}>
        Here's to your wellbeing,<br />
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
    margin: '0 0 10px',
    textAlign: 'center' as const,
  },
  dateRange: {
    fontSize: '16px',
    color: '#6b7280',
    margin: '0 0 20px',
    textAlign: 'center' as const,
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#4b5563',
    margin: '0 0 20px',
  },
  subheading: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#374151',
    margin: '30px 0 15px',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '30px 0',
  },
  statBox: {
    width: '30%',
    padding: '15px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    textAlign: 'center' as const,
    border: '1px solid #e5e7eb',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#8b5cf6',
    margin: '0 0 5px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0',
  },
  hr: {
    borderColor: '#e5e7eb',
    margin: '30px 0',
  },
  insightContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    padding: '20px',
    margin: '20px 0',
  },
  insight: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#4b5563',
    margin: '10px 0',
    display: 'flex',
    alignItems: 'flex-start',
  },
  insightIcon: {
    marginRight: '10px',
    marginTop: '4px',
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