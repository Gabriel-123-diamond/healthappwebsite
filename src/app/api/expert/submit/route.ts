import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { rateLimiter } from "@/lib/rateLimit";

const EXPERT_ROLES = ['doctor', 'wellness_practitioner', 'hospital'];

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    let uid: string;
    let email: string;
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
      email = decoded.email || '';
    } catch (e) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Rate Limiting: Prevent spamming expert submissions
    const rateCheck = rateLimiter.isAllowed(uid + "_expert_submit", 5, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait." }, { status: 429 });
    }

    let { expertProfile, bio, specialties, specialty, yearsOfExperience, licenseNumber, tier } = await req.json();

    // Phase 19: Excessive Data Exposure Prevention (Extract KYC)
    let safeExpertProfile = expertProfile ? { ...expertProfile } : null;
    let privateKycData = null;
    let privateLicenseData = null;

    if (safeExpertProfile) {
       privateKycData = safeExpertProfile.kyc || null;
       privateLicenseData = safeExpertProfile.license || null;
       delete safeExpertProfile.kyc;
       delete safeExpertProfile.license;
    }

    // Securely validate the requested role
    const requestedRole = expertProfile?.type || 'expert';
    const finalRole = EXPERT_ROLES.includes(requestedRole) ? requestedRole : 'expert';

    // Securely validate requested tier (if provided for upgrade)
    const validTiers = ['basic', 'professional', 'standard', 'premium'];
    const requestedTier = validTiers.includes(tier) ? tier : null;

    // Securely set status to pending and update role
    const updateData: any = {
      email: email,
      expertProfile: safeExpertProfile,
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

    if (requestedTier) {
      updateData.requestedTier = requestedTier;
    }

    await adminDb.collection("users").doc(uid).set(updateData, { merge: true });

    // Phase 19: Write classified data to isolated Sub-Collection
    if (privateKycData || privateLicenseData) {
      await adminDb.collection("users").doc(uid).collection("private_kyc").doc("document").set({
        kyc: privateKycData,
        license: privateLicenseData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Expert submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
