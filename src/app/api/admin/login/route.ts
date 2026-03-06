import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { password, uid } = await req.json();
    const superAdminPassword = process.env.ADMIN_PASSWORD;

    if (!superAdminPassword) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    let isAuthenticated = false;
    let isAdminSuper = false;

    // 1. Check if it's the Super Admin
    if (password === superAdminPassword) {
      isAuthenticated = true;
      isAdminSuper = true;
    } else {
      // 2. Check if it's a secondary admin created via dashboard
      const adminQuery = await adminDb.collection('users')
        .where('role', '==', 'admin')
        .where('adminPassword', '==', password)
        .limit(1)
        .get();
      
      if (!adminQuery.empty) {
        isAuthenticated = true;
      }
    }

    if (isAuthenticated) {
      // Generate a secure session token using HMAC-SHA256
      const today = new Date().toISOString().split('T')[0];
      const hmac = crypto.createHmac('sha256', superAdminPassword);
      hmac.update(today);
      const signature = hmac.digest('hex');
      
      const token = btoa(`ikike_admin_v3:${today}:${signature}:${isAdminSuper ? 'super' : 'regular'}`);
      
      const response = NextResponse.json({ 
        success: true, 
        message: "Authenticated",
        isSuper: isAdminSuper
      });

      // Set a secure, HTTP-only cookie
      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      // Non-sensitive flag for UI
      if (isAdminSuper) {
        response.cookies.set('is_super_admin', 'true', { maxAge: 60 * 60 * 24 });
      }

      return response;
    }

    return NextResponse.json({ error: "Invalid security key" }, { status: 401 });
  } catch (error) {
    console.error("[Admin Login Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
