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

    const { username, usageLimit } = await req.json();
    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
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

    for (let i = 0; i < 10; i++) {
      code = generateCode();
      const snapshot = await adminDb.collection("referral_codes").doc(code).get();
      if (!snapshot.exists) {
        isUnique = true;
        break;
      }
    }

    if (!isUnique) {
      code = `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    }

    const codeData = {
      code,
      ownerUid: uid,
      ownerUsername: username,
      usageCount: 0,
      usageLimit: usageLimit ? parseInt(usageLimit) : 0, // 0 for unlimited
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await adminDb.collection("referral_codes").doc(code).set(codeData);

    return NextResponse.json({ success: true, code, data: codeData });

  } catch (error: any) {
    console.error("Referral generation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
