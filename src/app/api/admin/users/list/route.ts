import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { adminAuth } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const { isValid } = adminAuth.verifySession(req);

    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const snapshot = await adminDb.collection('users')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();
      
    const users = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error("[Admin Users List Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
