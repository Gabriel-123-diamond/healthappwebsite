import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { rateLimiter } from "@/lib/rateLimit";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
if (!PAYSTACK_SECRET) {
  throw new Error("CRITICAL: Missing PAYSTACK_SECRET_KEY environment variable");
}

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

    const { tier, reference } = await req.json();
    
    if (!reference) {
      return NextResponse.json({ error: "Payment reference required" }, { status: 400 });
    }

    const rateCheck = rateLimiter.isAllowed(uid + "_upgrade_verify", 10, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Too many verification attempts" }, { status: 429 });
    }

    // 1. Verify payment with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // 2. Validate metadata matches current user
    const { metadata, amount } = verifyData.data;
    if (metadata.uid !== uid) {
      return NextResponse.json({ error: "Payment mismatch" }, { status: 403 });
    }

    const VALID_TIERS = ['free', 'plus', 'elite', 'basic', 'professional', 'authority', 'standard', 'vip1', 'vip2', 'clinic', 'hospital', 'network'];
    const targetTier = metadata.tier || tier;

    if (!VALID_TIERS.includes(targetTier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    // 3. Prevent double processing (Idempotency)
    const paymentDoc = await adminDb.collection("payments").doc(reference).get();
    if (paymentDoc.exists && paymentDoc.data()?.processed) {
       // Already processed but we return success for UI consistency
       return NextResponse.json({ success: true, tier: targetTier, alreadyProcessed: true });
     }

    const upgradeData: any = {
      tier: targetTier,
      vipTier: targetTier,
      upgradeStatus: 'idle',
      requestedTier: null,
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Provision Features
    if (targetTier === 'plus') {
      upgradeData.vaultEnabled = true;
      upgradeData.aiChatUnlimited = true;
      upgradeData.familySlots = 0;
    } else if (targetTier === 'elite') {
      upgradeData.vaultEnabled = true;
      upgradeData.aiChatUnlimited = true;
      upgradeData.familySlots = 4;
      upgradeData.videoConsultationsEnabled = true;
      upgradeData.expertQAUnlimited = true;
    } else if (targetTier === 'vip1' || targetTier === 'professional' || targetTier === 'hospital' || targetTier === 'network') {
      upgradeData.vaultEnabled = true;
      upgradeData.aiChatUnlimited = true;
      upgradeData.prioritySearch = true;
    } else if (targetTier === 'vip2' || targetTier === 'authority') {
      upgradeData.vaultEnabled = true;
      upgradeData.aiChatUnlimited = true;
      upgradeData.prioritySearch = true;
      upgradeData.familySlots = 4;
      upgradeData.videoConsultationsEnabled = true;
      upgradeData.expertQAUnlimited = true;
    }

    // Set Custom Claims in Firebase Auth
    await adminAuth.setCustomUserClaims(uid, { tier: targetTier });

    // 4. Update Database
    const batch = adminDb.batch();
    batch.update(adminDb.collection("users").doc(uid), upgradeData);
    batch.set(adminDb.collection("payments").doc(reference), {
      uid,
      amount: amount / 100,
      tier: targetTier,
      type: 'upgrade',
      status: 'success',
      processed: true,
      timestamp: new Date().toISOString()
    }, { merge: true });

    await batch.commit();

    return NextResponse.json({ success: true, tier: targetTier });

  } catch (error: any) {
    console.error("Tier upgrade verification error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
