import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin (Singleton)
if (!admin.apps.length) {
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountStr) {
      throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON");
    }
    
    // Parse the JSON string
    const serviceAccount = JSON.parse(serviceAccountStr);

    // FIX: Ensure private_key has correct newline formatting
    if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase Admin Init Error:', error);
  }
}

const SUPER_ADMIN_EMAIL = "gabrielpeterekerete231@gmail.com";

export async function POST(req: Request) {
  try {
    // 1. Security Check: Verify Auth Token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (decodedToken.email !== SUPER_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden: Admin Access Only" }, { status: 403 });
    }

    // 2. Process Request
    const { title, body } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: "Title and body required" }, { status: 400 });
    }

    // Send to the 'health_alerts' topic (Mobile App Users)
    const message = {
      notification: {
        title,
        body,
      },
      topic: 'health_alerts',
    };

    const response = await admin.messaging().send(message);
    return NextResponse.json({ success: true, messageId: response });

  } catch (error: any) {
    console.error("Broadcast failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
