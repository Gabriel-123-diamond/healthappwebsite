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

    const { tier } = await req.json();
    if (!['basic', 'professional', 'standard', 'premium'].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    // In a real app, check for payment status or available credits before upgrading
    await adminDb.collection("users").doc(uid).update({
      tier: tier,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, tier });

  } catch (error: any) {
    console.error("Tier upgrade error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
