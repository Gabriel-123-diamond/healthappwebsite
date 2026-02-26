import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

const rateLimitMap = new Map<string, { count: number, lastReset: number }>();
const DELETE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(uid: string): boolean {
  const now = Date.now();
  const userData = rateLimitMap.get(uid) || { count: 0, lastReset: now };
  if (now - userData.lastReset > DELETE_LIMIT_WINDOW) {
    userData.count = 1;
    userData.lastReset = now;
    rateLimitMap.set(uid, userData);
    return false;
  }
  userData.count++;
  rateLimitMap.set(uid, userData);
  return userData.count > 2; // Max 2 attempts per hour (sanity check)
}

export async function DELETE(req: NextRequest) {
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
      return NextResponse.json({ error: "Too many delete requests. Please wait." }, { status: 429 });
    }

    // 1. Delete Firestore Data
    const collections = ["users", "journals", "reviews", "saved", "api_keys", "verification_requests", "global_history", "experts", "institutions"];
    const subcollections = ["bookmarks", "history", "searchHistory", "saved_searches"];
    const batch = adminDb.batch();

    // Standard userId or uid fields in top-level collections
    for (const colName of collections) {
      // Check both userId and uid fields as different collections use different conventions
      const [userSnap, uidSnap] = await Promise.all([
        adminDb.collection(colName).where("userId", "==", uid).get(),
        adminDb.collection(colName).where("uid", "==", uid).get()
      ]);
      
      userSnap.docs.forEach(doc => batch.delete(doc.ref));
      uidSnap.docs.forEach(doc => batch.delete(doc.ref));
    }

    // Expert and other fields
    const expertReqSnap = await adminDb.collection("verification_requests").where("expertId", "==", uid).get();
    expertReqSnap.docs.forEach(doc => batch.delete(doc.ref));

    const globalHistSnap = await adminDb.collection("global_history").where("uid", "==", uid).get();
    globalHistSnap.docs.forEach(doc => batch.delete(doc.ref));

    // Cleanup subcollections of the user document
    const userRef = adminDb.collection("users").doc(uid);
    for (const subColName of subcollections) {
      const subColSnap = await userRef.collection(subColName).get();
      subColSnap.docs.forEach(doc => batch.delete(doc.ref));
    }

    // Referral codes (keyed by UID)
    batch.delete(adminDb.collection("referral_codes").doc(uid));

    // Referrals (where user is either referrer or invitee)
    const refAsReferrer = await adminDb.collection("referrals").where("referrerUid", "==", uid).get();
    refAsReferrer.docs.forEach(doc => batch.delete(doc.ref));

    const refAsInvitee = await adminDb.collection("referrals").where("inviteeUid", "==", uid).get();
    refAsInvitee.docs.forEach(doc => batch.delete(doc.ref));
    
    // The main user profile
    batch.delete(adminDb.collection("users").doc(uid));

    await batch.commit();

    // 2. Delete Auth Account
    await adminAuth.deleteUser(uid);

    return NextResponse.json({ message: "Account successfully deleted" });

  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete account. Please contact support if the issue persists." }, { status: 500 });
  }
}
