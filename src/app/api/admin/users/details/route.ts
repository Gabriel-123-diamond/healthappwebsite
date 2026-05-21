import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { adminAuth } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const { isValid } = adminAuth.verifySession(req);

    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('uid');

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const docSnap = await adminDb.collection('users').doc(userId).get();
    
    if (!docSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = {
      uid: docSnap.id,
      ...docSnap.data()
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("[Admin User Details Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
