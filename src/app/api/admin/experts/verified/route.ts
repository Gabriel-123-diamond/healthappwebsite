import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { adminAuth } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    // 1. Verify Admin Session
    const { isValid } = adminAuth.verifySession(req);

    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch verified experts
    const expertsQuery = await adminDb.collection('users')
      .where('verificationStatus', '==', 'verified')
      .orderBy('updatedAt', 'desc')
      .get();
    
    const experts = expertsQuery.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(experts);

  } catch (error) {
    console.error("[Verified Experts Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
