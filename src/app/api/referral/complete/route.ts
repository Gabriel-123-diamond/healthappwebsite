import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import * as admin from 'firebase-admin';

export async function POST(req: NextRequest) {
  try {
    // 1. Basic Auth Check
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

    // 2. Find pending referral
    const referralsRef = adminDb.collection("referrals");
    const snapshot = await referralsRef
      .where("inviteeUid", "==", inviteeUid)
      .where("status", "==", "pending")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ message: "No pending referral found" }, { status: 200 });
    }

    const referralDoc = snapshot.docs[0];
    const referrerUid = referralDoc.data().referrerUid;
    const rewardPoints = parseInt(process.env.REWARD_POINTS || '50', 10);

    // 3. Update records in a transaction
    await adminDb.runTransaction(async (transaction) => {
      const referrerRef = adminDb.collection("users").doc(referrerUid);
      const inviteeRef = adminDb.collection("users").doc(inviteeUid);
      
      const referrerDoc = await transaction.get(referrerRef);
      const inviteeDoc = await transaction.get(inviteeRef);

      // Update Referral Status
      transaction.update(referralDoc.ref, {
        status: 'completed',
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Award Points
      transaction.set(referrerRef, { 
        points: admin.firestore.FieldValue.increment(rewardPoints),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      transaction.set(inviteeRef, { 
        points: admin.firestore.FieldValue.increment(rewardPoints),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    });

    return NextResponse.json({ success: true, pointsAwarded: rewardPoints });

  } catch (error: any) {
    console.error("Referral completion error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
