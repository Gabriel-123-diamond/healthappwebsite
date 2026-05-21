import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { adminAuth } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const { isValid } = adminAuth.verifySession(req);

    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { userId, updates } = await req.json();

    if (!userId || !updates) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Restriction: Only super admins can grant admin role
    if (updates.role === 'admin') {
      const { isSuper } = adminAuth.verifySession(req);
      if (!isSuper) {
        return NextResponse.json({ error: "Only Super Admins can grant administrative access" }, { status: 403 });
      }
    }

    await adminDb.collection('users').doc(userId).update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("[Admin User Update Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
