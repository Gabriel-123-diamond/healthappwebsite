import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebaseAdmin";

const secret = process.env.PAYSTACK_SECRET_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!secret || !signature) {
      return NextResponse.json({ error: "Unauthorized or missing secret" }, { status: 401 });
    }

    // Secure webhook verification to prevent replay/spoofing attacks
    const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const metadata = event.data.metadata;
      
      if (metadata && metadata.uid && metadata.tier) {
        // Securely update the user's tier in the database
        await adminDb.collection("users").doc(metadata.uid).set({
          tier: metadata.tier,
          paymentReference: reference,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log(`Successfully upgraded user ${metadata.uid} to tier ${metadata.tier} via Paystack webhook.`);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
