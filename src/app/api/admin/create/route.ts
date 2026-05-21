import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { adminAuth } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Request is from a Super Admin
    const { isValid, isSuper } = adminAuth.verifySession(req);

    if (!isValid || !isSuper) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { email, password, fullName, countryIso, stateIso } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Hash the secondary admin password
    const hashedPassword = adminAuth.hashPassword(password);

    // 2. Check if user already exists by email
    const userQuery = await adminDb.collection('users').where('email', '==', email).limit(1).get();
    
    const adminData: any = {
      email,
      fullName: fullName || 'Admin User',
      role: 'admin',
      adminPassword: hashedPassword,
      countryIso: countryIso || '',
      stateIso: stateIso || '',
      updatedAt: new Date().toISOString(),
      onboardingComplete: true
    };

    if (userQuery.empty) {
      const newUserRef = adminDb.collection('users').doc();
      adminData.createdAt = new Date().toISOString();
      await newUserRef.set(adminData);
      return NextResponse.json({ success: true, message: "Admin created successfully" });
    } else {
      const userDoc = userQuery.docs[0];
      await userDoc.ref.update(adminData);
      return NextResponse.json({ success: true, message: "User updated/elevated to Admin" });
    }

  } catch (error) {
    console.error("[Admin Create Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
