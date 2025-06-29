import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
// Uncomment to use web-push
// import webpush from 'web-push';

// Uncomment to configure web-push
// webpush.setVapidDetails(
//   'mailto:support@resonance.ai',
//   process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
//   process.env.VAPID_PRIVATE_KEY || ''
// );

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subscription } = body;
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription object is required' },
        { status: 400 }
      );
    }
    
    // Get user session
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Store subscription in database
    const { error: dbError } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        subscription: subscription,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,subscription->endpoint'
      });
      
    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save subscription' },
        { status: 500 }
      );
    }
    
    // Send welcome notification
    // Uncomment to use web-push
    // try {
    //   await webpush.sendNotification(
    //     subscription,
    //     JSON.stringify({
    //       title: 'Notifications Enabled',
    //       body: 'You will now receive notifications from Resonance',
    //       icon: '/logo.png'
    //     })
    //   );
    // } catch (pushError) {
    //   console.error('Push notification error:', pushError);
    //   // Continue anyway
    // }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}