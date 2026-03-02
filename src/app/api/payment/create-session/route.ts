import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

/**
 * STRIPE INTEGRATION HUB (Simulation Mode)
 * To enable real payments:
 * 1. npm install stripe
 * 2. Add STRIPE_SECRET_KEY to .env
 * 3. Swap simulation logic with stripe.checkout.sessions.create
 */

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

    const { tier } = await req.json();
    if (!tier) {
      return NextResponse.json({ error: "Tier selection required" }, { status: 400 });
    }

    const userRecord = await adminAuth.getUser(uid);
    const email = userRecord.email;

    console.log(`Initializing payment session for ${email} (${uid}) - Tier: ${tier}`);

    // SIMULATION: In a real app, this would be a Stripe Session URL
    // We'll return a simulated success path
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    // We add a mock session ID to simulate verification
    const mockSessionId = `mock_stripe_${Math.random().toString(36).substring(2, 15)}`;

    return NextResponse.json({ 
      id: mockSessionId,
      url: `${appUrl}/onboarding/payment-success?session_id=${mockSessionId}&tier=${tier}`,
      isSimulation: true
    });

  } catch (error: any) {
    console.error("Payment session creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
