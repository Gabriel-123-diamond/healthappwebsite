import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import * as admin from 'firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    let inviteeUid: string;
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      inviteeUid = decoded.uid;
    } catch (e) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { code, referrerUid } = await req.json();
    if (!code || !referrerUid) {
      return NextResponse.json({ error: "Code and Referrer UID required" }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    // Verify code exists and check usage limit
    const codeRef = adminDb.collection("referral_codes").doc(normalizedCode);
    const codeDoc = await codeRef.get();

    if (!codeDoc.exists) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    const codeData = codeDoc.data();
    if (codeData?.ownerUid !== referrerUid) {
      return NextResponse.json({ error: "Code and owner mismatch" }, { status: 400 });
    }

    if (codeData?.usageLimit > 0 && codeData?.usageCount >= codeData?.usageLimit) {
      return NextResponse.json({ error: "Usage limit reached" }, { status: 400 });
    }

    // Check if invitee already applied a code
    const existingRef = await adminDb.collection("referrals")
      .where("inviteeUid", "==", inviteeUid)
      .limit(1)
      .get();

    if (!existingRef.empty) {
      return NextResponse.json({ message: "Referral already applied" }, { status: 200 });
    }

    const inviteeRecord = await adminAuth.getUser(inviteeUid);

    // Update usage count and create referral record in a transaction or batch
    const batch = adminDb.batch();
    
    batch.update(codeRef, {
      usageCount: admin.firestore.FieldValue.increment(1)
    });

    const newReferralRef = adminDb.collection("referrals").doc();
    batch.set(newReferralRef, {
      referrerUid,
      inviteeUid,
      inviteeEmail: inviteeRecord.email || null,
      code: normalizedCode,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await batch.commit();

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Referral apply error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
