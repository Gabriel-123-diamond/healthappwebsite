import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
if (!PAYSTACK_SECRET_KEY) {
  throw new Error("CRITICAL: Missing PAYSTACK_SECRET_KEY environment variable");
}
const PAYSTACK_API_BASE = 'https://api.paystack.co';

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    const requestedTier = searchParams.get("tier") || "basic";

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    // PAYSTACK: Verify against API directly to prevent bypass
    try {
      const response = await fetch(`${PAYSTACK_API_BASE}/transaction/verify/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      });
      
      const data = await response.json();

      if (!data.status || data.data.status !== 'success') {
        return NextResponse.json({ error: "Payment not successful" }, { status: 402 });
      }

      // Ensure the user trying to verify is the one who generated the metadata
      if (data.data.metadata?.uid !== uid) {
        return NextResponse.json({ error: "User identity mismatch in payment metadata" }, { status: 403 });
      }
      
      const allowedTiers = ['basic', 'premium', 'vip1', 'vip2', 'expert_pro'];
      if (!allowedTiers.includes(requestedTier) || data.data.metadata?.tier !== requestedTier) {
         return NextResponse.json({ error: "Invalid tier requested." }, { status: 400 });
      }

    } catch (paystackError) {
      console.error("Paystack verification failed:", paystackError);
      return NextResponse.json({ error: "Invalid transaction reference" }, { status: 400 });
    }

    // SECURE UPGRADE: Update user tier in Firestore
    await adminDb.collection("users").doc(uid).set({
      tier: requestedTier,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ 
      success: true, 
      tier: requestedTier,
      message: `User upgraded to ${requestedTier} tier.`
    });

  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
