import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { rateLimiter } from "@/lib/rateLimit";

const EXPERT_ROLES = ['doctor', 'herbal_practitioner', 'hospital', 'expert'];

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

    // Rate Limiting: Prevent spamming expert submissions
    const rateCheck = rateLimiter.isAllowed(uid + "_expert_submit", 5, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait." }, { status: 429 });
    }

    const { expertProfile, bio, specialties, specialty, yearsOfExperience, licenseNumber } = await req.json();

    // Securely validate the requested role
    const requestedRole = expertProfile?.type || 'expert';
    const finalRole = EXPERT_ROLES.includes(requestedRole) ? requestedRole : 'expert';

    // Securely set status to pending and update role
    const updateData = {
      expertProfile: expertProfile || null,
      bio: bio || '',
      specialties: Array.isArray(specialties) ? specialties : [],
      specialty: specialty || '',
      yearsOfExperience: yearsOfExperience || '',
      licenseNumber: licenseNumber || '',
      
      // Strict server-controlled fields
      verificationStatus: 'pending',
      role: finalRole,
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
