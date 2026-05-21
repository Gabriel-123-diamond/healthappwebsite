import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { adminAuth } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const { isValid } = adminAuth.verifySession(req);
    if (!isValid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const upgradesQuery = await adminDb.collection('users')
      .where('upgradeStatus', '==', 'pending_verification')
      .get();
    
    const upgrades = upgradesQuery.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(upgrades);
  } catch (error) {
    console.error("[Tier Upgrades Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
