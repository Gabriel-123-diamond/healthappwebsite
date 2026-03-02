import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

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

    // SIMULATION: Verify mock session
    if (!sessionId.startsWith("mock_stripe_")) {
      return NextResponse.json({ error: "Invalid session protocol" }, { status: 400 });
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
