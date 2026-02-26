import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

const rateLimitMap = new Map<string, { count: number, lastReset: number }>();
const EXPORT_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const MAX_EXPORTS = 3;

function isRateLimited(uid: string): boolean {
  const now = Date.now();
  const userData = rateLimitMap.get(uid) || { count: 0, lastReset: now };

  if (now - userData.lastReset > EXPORT_LIMIT_WINDOW) {
    userData.count = 1;
    userData.lastReset = now;
    rateLimitMap.set(uid, userData);
    return false;
  }

  userData.count++;
  rateLimitMap.set(uid, userData);
  return userData.count > MAX_EXPORTS;
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const uid = decodedToken.uid;

    if (isRateLimited(uid)) {
      return NextResponse.json({ error: "Export limit reached. Try again in 24 hours." }, { status: 429 });
    }

    // Fetch all user-related data in parallel
    const [
      profileDoc, 
      journalsSnap, 
      reviewsSnap, 
      refCodesSnap, 
      referralsAsReferrer, 
      referralsAsInvitee,
      apiKeysSnap,
      verifRequestsSnap
    ] = await Promise.all([
      adminDb.collection("users").doc(uid).get(),
      adminDb.collection("journals").where("userId", "==", uid).get(),
      adminDb.collection("reviews").where("userId", "==", uid).get(),
      adminDb.collection("referral_codes").doc(uid).get(),
      adminDb.collection("referrals").where("referrerUid", "==", uid).get(),
      adminDb.collection("referrals").where("inviteeUid", "==", uid).get(),
      adminDb.collection("api_keys").where("ownerId", "==", uid).get(),
      adminDb.collection("verification_requests").where("expertId", "==", uid).get(),
    ]);

    const exportData = {
      metadata: {
        exportTimestamp: new Date().toISOString(),
        version: "1.1.0",
        platform: "Ikiké Health AI"
      },
      profile: profileDoc.exists ? profileDoc.data() : null,
      journals: journalsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      expertReviews: reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      referralCode: refCodesSnap.exists ? refCodesSnap.data() : null,
      referrals: [
        ...referralsAsReferrer.docs.map(d => ({ ...d.data(), type: 'sent' })),
        ...referralsAsInvitee.docs.map(d => ({ ...d.data(), type: 'received' }))
      ],
      apiKeys: apiKeysSnap.docs.map(d => ({ name: d.data().name, createdAt: d.data().createdAt })), // Don't export the actual keys for security
      verificationRequests: verifRequestsSnap.docs.map(d => d.data()),
    };

    return NextResponse.json(exportData, {
      headers: {
        "Content-Disposition": `attachment; filename="health_data_export_${uid}.json"`,
        "Content-Type": "application/json",
      },
    });

  } catch (error: any) {
    console.error("Export Error:", error);
    return NextResponse.json({ error: "Failed to export data. Please try again later." }, { status: 500 });
  }
}
