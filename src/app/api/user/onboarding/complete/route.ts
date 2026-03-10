import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { rateLimiter } from "@/lib/rateLimit";

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

    // Rate Limiting: 5 attempts per minute to prevent API abuse during onboarding
    const rateCheck = rateLimiter.isAllowed(uid + "_onboarding", 5, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait." }, { status: 429 });
    }

    const formData = await req.json();
    
    // STRICT SCHEMA VALIDATION & SANITIZATION
    // Prevent Prototype Pollution and Mass Assignment vulnerabilities
    const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.toLowerCase().trim();
    const phone = formData.phone ? `${formData.countryCode || ''}${formData.phone.replace(/\s/g, '')}` : '';
    
    const ALLOWED_ROLES = ['user', 'doctor', 'herbal_practitioner', 'hospital', 'expert'];
    const requestedRole = (formData.role || 'user').toLowerCase();
    const finalRole = ALLOWED_ROLES.includes(requestedRole) ? requestedRole : 'user';

    // Explicitly select only allowed fields. NEVER spread (...formData) directly into the database.
    const updateData: any = {
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      fullName: fullName,
      username: (formData.username || '').toLowerCase(),
      phone: phone,
      countryCode: formData.countryCode || '',
      city: formData.city || '',
      state: formData.state || '',
      country: formData.country || '',
      countryIso: formData.countryIso || '',
      stateIso: formData.stateIso || '',
      ageRange: formData.ageRange || '',
      dateOfBirth: formData.dateOfBirth || '',
      interests: Array.isArray(formData.interests) ? formData.interests : [],
      
      onboardingComplete: true,
      profileComplete: true,
      
      // Hardcode secure fields to prevent privilege escalation
      tier: 'basic',
      role: finalRole,
      updatedAt: new Date().toISOString()
    };

    // Include KYC if it's an expert role
    if (finalRole !== 'user' && formData.kyc) {
      updateData.verificationStatus = 'pending';
      updateData.kycStatus = 'pending';
      updateData.kycDocument = formData.kyc.documentUrl || '';
      updateData.kycDocType = formData.kyc.documentType || '';
    }

    await adminDb.collection("users").doc(uid).set(updateData, { merge: true });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Onboarding completion error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
