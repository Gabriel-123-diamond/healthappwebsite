import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { password, uid } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    if (password === adminPassword) {
      // 1. If UID is provided, assign 'admin' role in Firestore
      if (uid) {
        try {
          await adminDb.collection('users').doc(uid).update({
            role: 'admin',
            updatedAt: new Date().toISOString()
          });
          console.log(`[Admin Login] User ${uid} elevated to ADMIN role.`);
        } catch (dbErr) {
          console.error(`[Admin Login] Failed to update role for ${uid}:`, dbErr);
          // We continue anyway as the password was correct
        }
      }

      // 2. Generate a secure session token using HMAC-SHA256
      // This proves the server generated it without exposing the password itself.
      const today = new Date().toISOString().split('T')[0];
      const hmac = crypto.createHmac('sha256', adminPassword);
      hmac.update(today);
      const signature = hmac.digest('hex');
      
      const token = btoa(`ikike_admin_v2:${today}:${signature}`);
      
      const response = NextResponse.json({ 
        success: true, 
        message: "Authenticated"
      });

      // Set a secure, HTTP-only cookie
      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
