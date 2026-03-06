import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Request is from a Super Admin
    const sessionToken = req.cookies.get('admin_session')?.value;
    const isSuper = req.cookies.get('is_super_admin')?.value === 'true';

    if (!sessionToken || !isSuper) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { email, password, fullName } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Check if user already exists by email
    const userQuery = await adminDb.collection('users').where('email', '==', email).limit(1).get();
    
    if (userQuery.empty) {
      // Create new user entry if they don't exist yet (normally they should sign up first, but we can scaffold)
      const newUserRef = adminDb.collection('users').doc();
      await newUserRef.set({
        email,
        fullName: fullName || 'Admin User',
        role: 'admin',
        adminPassword: password, // Store password for admin login
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        onboardingComplete: true
      });
      return NextResponse.json({ success: true, message: "Admin created successfully" });
    } else {
      // Update existing user to admin
      const userDoc = userQuery.docs[0];
      await userDoc.ref.update({
        role: 'admin',
        adminPassword: password,
        updatedAt: new Date().toISOString()
      });
      return NextResponse.json({ success: true, message: "User elevated to Admin" });
    }

  } catch (error) {
    console.error("[Admin Create Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
