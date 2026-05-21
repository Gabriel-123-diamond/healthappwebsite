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
    let uid: string;
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
    } catch (e) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { licenseNumber, documentUrl, documentType } = await req.json();

    if (!licenseNumber || !documentUrl || !documentType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Create the verification request record
    const verifRef = await adminDb.collection("verification_requests").add({
      expertId: uid,
      licenseNumber,
      documentType,
      documentUrl,
      status: 'pending',
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 2. Update the user's verification status securely
    await adminDb.collection("users").doc(uid).set({
      verificationStatus: 'pending',
      lastVerificationRequestId: verifRef.id,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ success: true, requestId: verifRef.id });

  } catch (error: any) {
    console.error("Verification Submission Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
