import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

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

    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: "Phone number required" }, { status: 400 });
    }

    // In a real production scenario, we would use Firebase Auth's phone verification
    // and then sync here. For this prototype, we'll simulate the secure update
    // of the phoneVerified flag via this protected API.

    await adminDb.collection("users").doc(uid).set({
      phone: phone,
      phoneVerified: true,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ success: true, phoneVerified: true });

  } catch (error: any) {
    console.error("Phone verification error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
