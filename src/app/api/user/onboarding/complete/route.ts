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
    let email: string;
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
      email = decoded.email || '';
    } catch (e) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Rate Limiting: 5 attempts per minute to prevent API abuse during onboarding
    const rateCheck = rateLimiter.isAllowed(uid + "_onboarding", 5, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait." }, { status: 429 });
    }

    const formData = await req.json();
    
    // Check if user already exists to preserve createdAt or fetch from Auth
    const userDocRef = adminDb.collection("users").doc(uid);
    const userDoc = await userDocRef.get();
    let createdAt = userDoc.exists ? userDoc.data()?.createdAt : null;

    if (!createdAt) {
      try {
        const userRecord = await adminAuth.getUser(uid);
        createdAt = new Date(userRecord.metadata.creationTime).toISOString();
      } catch (e) {
        createdAt = new Date().toISOString();
      }
    }

    // STRICT SCHEMA VALIDATION & SANITIZATION
    const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.toLowerCase().trim();
    const phone = formData.phone ? `${formData.countryCode || ''}${formData.phone.replace(/\s/g, '')}` : '';
    
    const ALLOWED_ROLES = ['user', 'doctor', 'wellness_practitioner', 'hospital'];
    const requestedRole = (formData.role || 'user').toLowerCase();
    const finalRole = ALLOWED_ROLES.includes(requestedRole) ? requestedRole : 'user';

    // Explicitly select only allowed fields.
    const updateData: any = {
      email: email,
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
      gender: formData.gender || '',
      pronouns: formData.pronouns || '',
      timezone: formData.timezone || '',
      interests: Array.isArray(formData.interests) ? formData.interests : [],
      chronicConditions: Array.isArray(formData.chronicConditions) ? formData.chronicConditions : [],
      familyHistory: Array.isArray(formData.familyHistory) ? formData.familyHistory : [],
      lifestyleGoals: Array.isArray(formData.lifestyleGoals) ? formData.lifestyleGoals : [],
      
      // Role-specific fields
      facilityName: formData.facilityName || '',
      facilityType: formData.facilityType || '',
      registrationNumber: formData.registrationNumber || '',
      bedCapacity: formData.bedCapacity || '',
      emergencyCoordinates: formData.emergencyCoordinates || '',
      address: formData.address || '',
      postalCode: formData.postalCode || '',
      licenseNumber: formData.licenseNumber || '',
      npiNumber: formData.npiNumber || '',
      issuingBoard: formData.issuingBoard || '',
      graduationYear: formData.graduationYear || '',
      specialties: Array.isArray(formData.specialties) ? formData.specialties : [],
      modalities: Array.isArray(formData.modalities) ? formData.modalities : [],
      languages: Array.isArray(formData.languages) ? formData.languages : [],
      insurances: Array.isArray(formData.insurances) ? formData.insurances : [],
      consultationFee: formData.consultationFee || '',
      telehealthPreference: !!formData.telehealthPreference,
      practiceName: formData.practiceName || '',
      certifications: Array.isArray(formData.certifications) ? formData.certifications : [],
      yearsOfExperience: formData.yearsOfExperience || '',
      willTravel: !!formData.willTravel,
      herbalProducts: Array.isArray(formData.herbalProducts) ? formData.herbalProducts : [],
      inventory: Array.isArray(formData.inventory) ? formData.inventory : [],
      workshopCapabilities: !!formData.workshopCapabilities,
      
      onboardingComplete: true,
      profileComplete: true,
      
      tier: 'basic',
      role: finalRole,
      createdAt: createdAt,
      updatedAt: new Date().toISOString()
    };

    // Include KYC if it's an expert role
    if (finalRole !== 'user' && formData.kyc && (formData.kyc.documentUrl || formData.kyc.idCardUrl)) {
      updateData.verificationStatus = 'pending';
      updateData.kycStatus = 'pending';
      updateData.kycDocument = formData.kyc.documentUrl || formData.kyc.idCardUrl || '';
      updateData.kycDocType = formData.kyc.documentType || '';
    } else if (finalRole !== 'user') {
      updateData.verificationStatus = 'unverified';
      updateData.kycStatus = 'unverified';
    }

    await adminDb.collection("users").doc(uid).set(updateData, { merge: true });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Onboarding completion error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
