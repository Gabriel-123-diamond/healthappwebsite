import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Admin Session from Cookie
    const adminSession = req.cookies.get("admin_session")?.value;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminSession || !adminPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const decoded = atob(adminSession);
      const [version, date, signature] = decoded.split(':');
      
      if (version !== 'ikike_admin_v2') {
        return NextResponse.json({ error: "Invalid admin session version" }, { status: 401 });
      }

      // Verify the HMAC signature
      const hmac = crypto.createHmac('sha256', adminPassword);
      hmac.update(date);
      const expectedSignature = hmac.digest('hex');

      if (signature !== expectedSignature) {
        return NextResponse.json({ error: "Invalid session signature" }, { status: 401 });
      }
      
      // Check if the token is from today
      const today = new Date().toISOString().split('T')[0];
      if (date !== today) {
        console.warn(`[Admin Auth] Old token used for date ${date}, today is ${today}`);
        // We could return 401 here to enforce daily re-login
      }
    } catch (e) {
      return NextResponse.json({ error: "Invalid session format" }, { status: 401 });
    }

    const { expertId, status, notes } = await req.json();

    if (!expertId || !['verified', 'rejected'].includes(status)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // 2. Update via Admin SDK
    const userRef = adminDb.collection("users").doc(expertId);
    await userRef.update({
      verificationStatus: status,
      verificationNotes: notes || "",
      updatedAt: new Date().toISOString(),
    });

    console.log(`[Admin Action] Expert ${expertId} set to ${status}`);

    return NextResponse.json({ success: true, message: `Expert status updated to ${status}` });

  } catch (error: any) {
    console.error("Verification API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
