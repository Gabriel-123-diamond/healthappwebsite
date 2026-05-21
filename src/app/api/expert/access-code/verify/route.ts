import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { rateLimiter } from "@/lib/rateLimit";
import * as admin from 'firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    let uid: string;
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
    } catch (e) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { code } = await req.json();
    if (!code || code.length !== 6) {
      return NextResponse.json({ error: "Invalid code format" }, { status: 400 });
    }

    // Rate Limiting: 5 attempts per minute to prevent brute-forcing 6-digit codes
    const rateCheck = rateLimiter.isAllowed(uid + "_access_code_verify", 5, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Too many attempts. Please wait." }, { status: 429 });
    }

    // Query for the access code
    const snapshot = await adminDb.collection("access_codes")
      .where('code', '==', code)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "invalid" }, { status: 404 });
    }

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();

    // Check expiry
    const expiresAt = data.expiresAt instanceof admin.firestore.Timestamp 
      ? data.expiresAt.toDate() 
      : new Date(data.expiresAt);
      
    if (expiresAt < new Date()) {
      return NextResponse.json({ error: "expired" }, { status: 410 });
    }

    // Check usage limit
    if (data.usageLimit > 0 && data.usageCount >= data.usageLimit) {
      return NextResponse.json({ error: "limit-reached" }, { status: 403 });
    }

    // Increment usage count
    await docSnap.ref.update({
      usageCount: admin.firestore.FieldValue.increment(1)
    });

    // Return the minimal required data
    return NextResponse.json({
      success: true,
      expertId: data.expertId,
      expertName: data.expertName,
      id: docSnap.id
    });

  } catch (error: any) {
    console.error("Access Code Verification Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
