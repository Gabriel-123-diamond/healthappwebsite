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

    const { expertProfile, bio, specialties, specialty, yearsOfExperience, licenseNumber } = await req.json();

    // Securely set status to pending and update role
    const updateData: any = {
      expertProfile,
      bio,
      specialties,
      specialty,
      yearsOfExperience,
      licenseNumber,
      verificationStatus: 'pending',
      role: expertProfile.type || 'expert',
      profileComplete: true,
      updatedAt: new Date().toISOString()
    };

    await adminDb.collection("users").doc(uid).set(updateData, { merge: true });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Expert submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
