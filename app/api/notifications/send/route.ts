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
    const { userId, title, message, url } = body;
    
    if (!userId || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get user's push subscriptions
    const supabase = createClient();
    const { data: subscriptions, error: fetchError } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', userId);
      
    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      );
    }
    
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No subscriptions found for user' },
        { status: 404 }
      );
    }
    
    // Send notifications to all user's devices
    const results = [];
    
    // Uncomment to use web-push
    // for (const sub of subscriptions) {
    //   try {
    //     await webpush.sendNotification(
    //       sub.subscription,
    //       JSON.stringify({
    //         title,
    //         body: message,
    //         icon: '/logo.png',
    //         url: url || '/'
    //       })
    //     );
    //     results.push({ success: true, endpoint: sub.subscription.endpoint });
    //   } catch (error) {
    //     console.error('Push error:', error);
    //     results.push({ 
    //       success: false, 
    //       endpoint: sub.subscription.endpoint,
    //       error: error.message 
    //     });
    //     
    //     // Remove invalid subscriptions
    //     if (error.statusCode === 410) {
    //       await supabase
    //         .from('push_subscriptions')
    //         .delete()
    //         .eq('user_id', userId)
    //         .eq('subscription->endpoint', sub.subscription.endpoint);
    //     }
    //   }
    // }
    
    return NextResponse.json({ 
      success: true,
      results,
      sent: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    });
  } catch (error) {
    console.error('Send notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}