import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { verifyAuth, getBaseUrl } from "@/lib/serverUtils";

/**
 * STRIPE INTEGRATION HUB (Simulation Mode)
 */

export async function POST(req: NextRequest) {
  try {
    const { decodedToken, error } = await verifyAuth(req);
    if (error) return error;
    const uid = decodedToken.uid;

    const { tier } = await req.json();
    if (!tier) {
      return NextResponse.json({ error: "Tier selection required" }, { status: 400 });
    }

    const userRecord = await adminAuth.getUser(uid);
    const email = userRecord.email;

    console.log(`Initializing payment session for ${email} (${uid}) - Tier: ${tier}`);

    // Automatically detect the correct URL based on environment
    const appUrl = getBaseUrl();
    
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
