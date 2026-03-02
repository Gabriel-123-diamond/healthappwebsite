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

    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    // Check if user already has a code
    const existingDoc = await adminDb.collection("referral_codes").doc(uid).get();
    if (existingDoc.exists) {
      return NextResponse.json({ code: existingDoc.data()?.code });
    }

    // Logic to generate a unique code
    const cleanUsername = username.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    const generateCode = () => {
      let suffix = '';
      for (let i = 0; i < 4; i++) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `${cleanUsername || 'REF'}-${suffix}`;
    };

    let code = '';
    let isUnique = false;

    for (let i = 0; i < 5; i++) {
      code = generateCode();
      const snapshot = await adminDb.collection("referral_codes").where("code", "==", code).limit(1).get();
      if (snapshot.empty) {
        isUnique = true;
        break;
      }
    }

    if (!isUnique) {
      code = `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    }

    await adminDb.collection("referral_codes").doc(uid).set({
      code,
      ownerUid: uid,
      ownerUsername: username,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, code });

  } catch (error: any) {
    console.error("Referral generation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
