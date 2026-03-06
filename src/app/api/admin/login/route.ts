import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { adminAuth } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting based on IP
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(',')[0] : "unknown";
    
    const rateCheck = adminAuth.checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json({ 
        error: "Too many login attempts. Access locked for 15 minutes." 
      }, { status: 429 });
    }

    const { password } = await req.json();

    let isAuthenticated = false;
    let isAdminSuper = false;

    // 2. Check if it's the Super Admin
    if (adminAuth.isSuperAdminPassword(password)) {
      isAuthenticated = true;
      isAdminSuper = true;
    } else {
      // 3. Check if it's a secondary admin created via dashboard
      const adminQuery = await adminDb.collection('users')
        .where('role', '==', 'admin')
        .get();
      
      for (const doc of adminQuery.docs) {
        const storedHash = doc.data().adminPassword;
        if (storedHash && adminAuth.comparePassword(password, storedHash)) {
          isAuthenticated = true;
          break;
        }
      }
    }

    if (isAuthenticated) {
      const token = adminAuth.signSession(isAdminSuper);
      
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

      // Non-sensitive flag for UI routing logic
      if (isAdminSuper) {
        response.cookies.set('is_super_admin', 'true', { maxAge: 60 * 60 * 24, path: '/' });
      } else {
        response.cookies.set('is_super_admin', 'false', { maxAge: 60 * 60 * 24, path: '/' });
      }

      return response;
    }

    return NextResponse.json({ 
      error: `Invalid security key. ${rateCheck.remaining} attempts remaining.` 
    }, { status: 401 });

  } catch (error) {
    console.error("[Admin Login Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
