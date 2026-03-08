import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function DELETE(req: NextRequest) {
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

    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Referral code required" }, { status: 400 });
    }

    const docRef = adminDb.collection("referral_codes").doc(code);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Code not found" }, { status: 404 });
    }

    if (docSnap.data()?.ownerUid !== uid) {
      return NextResponse.json({ error: "Unauthorized to delete this code" }, { status: 403 });
    }

    await docRef.delete();

    return NextResponse.json({ success: true, message: "Referral code deleted successfully" });

  } catch (error: any) {
    console.error("Referral deletion error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
