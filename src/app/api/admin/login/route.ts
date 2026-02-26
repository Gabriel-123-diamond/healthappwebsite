import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    if (password === adminPassword) {
      // Generate a secure session token using HMAC-SHA256
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
