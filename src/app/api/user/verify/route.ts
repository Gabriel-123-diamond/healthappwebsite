import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

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
    } catch (e: any) {
      console.error("[VerifyAPI] Token verification failed:", e.message);
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // 1. Get status from Firebase Auth
    let userRecord: any = null;
    try {
      userRecord = await adminAuth.getUser(uid);
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      throw e;
    }
    
    // 2. Get status from Firestore
    const userDoc = await adminDb.collection("users").doc(uid).get();
    const userData = userDoc.data() || {};

    console.log(`[VerifyAPI] Checking status for ${uid}: Auth=${userRecord?.emailVerified}, DB=${userData.emailVerified}`);

    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    // Email is verified ONLY if our database says so.
    // We ignore userRecord.emailVerified to force Google users to verify manually too.
    if (userData.emailVerified === true) {
      updates.emailVerified = true;
    }

    // Phone is verified if either Auth or Firestore says so (standard for phones)
    if (userRecord?.phoneNumber || userData.phoneVerified === true) {
      updates.phoneVerified = true;
    }

    if (Object.keys(updates).length > 1) {
      await adminDb.collection("users").doc(uid).set(updates, { merge: true });
    }

    return NextResponse.json({ 
      success: true, 
      emailVerified: !!updates.emailVerified,
      phoneVerified: !!updates.phoneVerified
    });

  } catch (error: any) {
    console.error("Verification sync error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
