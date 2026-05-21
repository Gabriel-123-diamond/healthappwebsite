import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { adminAuth } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    // 1. Verify Request is from a Super Admin
    const { isValid, isSuper } = adminAuth.verifySession(req);

    if (!isValid || !isSuper) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    // 2. Fetch all admins
    const adminsQuery = await adminDb.collection('users')
      .where('role', '==', 'admin')
      .get();
    
    const admins = adminsQuery.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(admins);

  } catch (error) {
    console.error("[Admin List Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
