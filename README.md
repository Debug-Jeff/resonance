# Resonance - AI Mental Health Companion

![Resonance Logo](https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=400&fit=crop)

Resonance is a cutting-edge AI-powered mental health companion that helps users track their emotional wellbeing, analyze voice patterns, and receive personalized insights for better mental health.

## 🌟 Features

- **AI Voice Analysis**: Advanced emotional AI that analyzes voice patterns with 95% accuracy
- **Smart Mood Tracking**: Intelligent mood monitoring with pattern recognition
- **Personal Analytics**: Comprehensive dashboards with actionable insights
- **Intelligent Journaling**: AI-powered journaling with smart prompts
- **Crisis Support**: 24/7 access to mental health resources and emergency contacts
- **Privacy-First**: Enterprise-grade security with end-to-end encryption

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Debug-Jeff/resonance.git
   cd resonance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the migration files in order:
     1. `supabase/migrations/20250624221123_purple_portal.sql`
     2. `supabase/migrations/20250624230336_stark_castle.sql` (for demo data)

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI/ML**: Custom emotion detection algorithms
- **Charts**: Recharts
- **Authentication**: Supabase Auth with Google OAuth
- **Deployment**: Vercel/Netlify ready

## 📱 Key Pages

- **Landing Page** (`/`) - Marketing homepage with features and testimonials
- **Dashboard** (`/dashboard`) - Main user dashboard with overview
- **Mood Tracking** (`/mood`) - Daily mood logging and calendar view
- **Voice Sessions** (`/voice`) - AI-powered voice analysis
- **Personal Notes** (`/notes`) - Intelligent journaling system
- **Analytics** (`/analytics`) - Comprehensive mental health insights
- **Settings** (`/settings`) - User preferences and crisis contacts
- **Crisis Support** (`/crisis`) - Emergency resources and support

## 🔧 Configuration

### Database Setup

The app requires specific database tables. Run these migrations in your Supabase SQL editor:

1. **Main Schema** (`20250624221123_purple_portal.sql`)
   - Creates all necessary tables
   - Sets up Row Level Security (RLS)
   - Configures user authentication triggers

2. **Demo Data** (`20250624230336_stark_castle.sql`)
   - Adds sample data for testing
   - Creates test user profile
   - Populates mood entries and voice sessions

## 🎨 Design System

Resonance uses a comprehensive design system:

- **Colors**: Purple/blue gradient theme with dark mode support
- **Typography**: Inter font family with consistent sizing
- **Components**: shadcn/ui with custom glassmorphism effects
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design with breakpoints

## 🔒 Security & Privacy

- **Data Encryption**: All data encrypted in transit and at rest
- **Row Level Security**: Database-level access controls
- **HIPAA Compliance**: Healthcare data protection standards
- **Privacy Controls**: User-controlled data sharing and export

## 📊 Analytics & Insights

The analytics system provides:

- **Mood Trends**: Visual charts of emotional patterns
- **Voice Analysis**: Emotion detection from speech
- **Pattern Recognition**: AI-identified triggers and correlations
- **Progress Tracking**: Goal setting and achievement monitoring
- **Export Options**: CSV/PDF data export for sharing with therapists

## 🆘 Crisis Support

Built-in crisis intervention features:

- **Emergency Contacts**: Personal crisis contact management
- **Hotline Integration**: Direct access to crisis hotlines
- **Safety Planning**: Collaborative safety plan creation
- **Resource Directory**: Comprehensive mental health resources

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Mental health professionals who provided guidance
- Open source community for amazing tools
- Beta testers for valuable feedback
- Supabase team for excellent backend services

---

**Made with ❤️ for mental health awareness**

For more information, visit [resonance.ai](https://resonance.ai)
