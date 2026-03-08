import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
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

    const snapshot = await adminDb.collection("referral_codes")
      .where("ownerUid", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    const codes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || null
    }));

    return NextResponse.json({ codes });

  } catch (error: any) {
    console.error("Referral listing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
