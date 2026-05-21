import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { verifyAuth, getBaseUrl } from "@/lib/serverUtils";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
if (!PAYSTACK_SECRET_KEY) {
  throw new Error("CRITICAL: Missing PAYSTACK_SECRET_KEY environment variable");
}
const PAYSTACK_API_BASE = 'https://api.paystack.co';

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
    
    // Set amount array in Kobo (NGN) or Cents
    const tierPrices: Record<string, number> = {
      'vip1': 5000000, 
      'vip2': 10000000, 
      'premium': 2000000,
      'expert_pro': 15000000
    };

    const amount = tierPrices[tier] || 100000;

    // Create a real Paystack Checkout Session
    const response = await fetch(`${PAYSTACK_API_BASE}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        amount: amount,
        currency: 'NGN', // Adjust based on locale/merchant config
        callback_url: `${appUrl}/onboarding/payment-success?tier=${tier}`,
        metadata: {
          uid: uid,
          tier: tier,
          custom_fields: [
            {
              display_name: "HealthApp Tier Upgrade",
              variable_name: "upgrade_type",
              value: tier.toUpperCase()
            }
          ]
        }
      })
    });

    const data = await response.json();

    if (!data.status) {
       return NextResponse.json({ error: data.message || "Paystack initialization failed" }, { status: 400 });
    }

    return NextResponse.json({ 
      id: data.data.reference,
      url: data.data.authorization_url,
      isSimulation: false
    });

  } catch (error: any) {
    console.error("Payment session creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
