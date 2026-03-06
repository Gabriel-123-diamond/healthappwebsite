import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { adminAuth } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Admin Session
    const { isValid } = adminAuth.verifySession(req);

    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { expertId, status, notes } = await req.json();

    if (!expertId || !['verified', 'rejected'].includes(status)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // 2. Update via Admin SDK
    const userRef = adminDb.collection("users").doc(expertId);
    const updateData: any = {
      verificationStatus: status,
      verificationNotes: notes || "",
      updatedAt: new Date().toISOString(),
    };

    if (status === 'verified') {
      updateData.tier = 'basic';
      updateData.profileComplete = true;
    }

    await userRef.update(updateData);

    console.log(`[Admin Action] Expert ${expertId} set to ${status}`);

    return NextResponse.json({ success: true, message: `Expert status updated to ${status}` });

  } catch (error: any) {
    console.error("Verification API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
