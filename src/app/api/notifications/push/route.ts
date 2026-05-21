import { NextResponse } from 'next/server';
import { adminDb, adminMessaging } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const { userIds, title, body } = await req.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'Valid userIds array is required' }, { status: 400 });
    }

    if (!title || !body) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Firestore Admin SDK not initialized' }, { status: 500 });
    }

    // 1. Fetch fcmTokens for all target users
    const tokens: string[] = [];
    
    // Batch fetch (Assuming small batches < 50 for normal operations)
    await Promise.all(userIds.map(async (uid: string) => {
      const userSnap = await adminDb.collection('users').doc(uid).get();
      if (userSnap.exists) {
        const data = userSnap.data();
        if (data?.fcmToken) {
          tokens.push(data.fcmToken);
        }
      }
    }));

    if (tokens.length === 0) {
      return NextResponse.json({ success: true, message: 'No registered FCM tokens found for targets.' }, { status: 200 });
    }

    // 2. Construct Multicast Payload
    const message = {
      notification: {
        title,
        body,
      },
      tokens: tokens,
    };

    // 3. Dispatch to Apple/Google Servers
    const response = await adminMessaging.sendEachForMulticast(message);
    
    const failedTokens: string[] = [];
    if (response.failureCount > 0) {
      response.responses.forEach((resp: any, idx: number) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });
      console.warn(`[FCM] Failed to send to ${response.failureCount} tokens.`, failedTokens);
    }

    return NextResponse.json({ 
      success: true, 
      sentCount: response.successCount,
      failureCount: response.failureCount 
    }, { status: 200 });

  } catch (error: any) {
    console.error('[FCM API Error]:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
