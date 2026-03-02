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

    const { otp, email } = await req.json();
    if (!otp || !email) {
      return NextResponse.json({ error: "OTP and Email required" }, { status: 400 });
    }

    // Sandbox OTP for prototyping
    if (otp === "123456") {
      // 1. Update Firebase Auth
      await adminAuth.updateUser(uid, {
        emailVerified: true
      });

      // 2. Update Firestore
      await adminDb.collection("users").doc(uid).set({
        emailVerified: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      return NextResponse.json({ success: true, emailVerified: true });
    } else {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Email verification error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
