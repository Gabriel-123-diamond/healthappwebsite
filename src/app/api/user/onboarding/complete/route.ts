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

    const formData = await req.json();
    const fullName = `${formData.firstName} ${formData.lastName}`.toLowerCase();

    const updateData = {
      ...formData,
      fullName: fullName,
      username: formData.username.toLowerCase(),
      phone: `${formData.countryCode}${formData.phone.replace(/\s/g, '')}`,
      onboardingComplete: true,
      profileComplete: true,
      tier: 'basic',
      role: 'user',
      updatedAt: new Date().toISOString()
    };

    // Remove fields that shouldn't be in Firestore or are handled elsewhere
    delete updateData.referralCode; 

    await adminDb.collection("users").doc(uid).set(updateData, { merge: true });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Onboarding completion error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
