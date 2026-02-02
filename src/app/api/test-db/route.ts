import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    const expertsRef = adminDb.collection('experts');
    const snapshot = await expertsRef.limit(5).get();
    
    const experts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({
      success: true,
      count: snapshot.size,
      experts: experts,
      env: {
        hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
