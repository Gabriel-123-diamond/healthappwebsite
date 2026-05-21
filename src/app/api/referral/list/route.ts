import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    let uid: string;
    try {
      const emulatorHost = process.env.FIREBASE_AUTH_EMULATOR_HOST;
      console.log(`[AUTH] Verifying token (prefix: ${token.substring(0, 10)}...). Emulator: ${emulatorHost || 'OFF'}`);
      
      const decoded = await adminAuth.verifyIdToken(token, false);
      uid = decoded.uid;
      console.log(`[AUTH] Verified UID: ${uid}`);
    } catch (e: any) {
      console.error("[AUTH] Token verification failed:", e.message, e.code);
      
      // If we are in emulator mode, let's try to just decode the token to see what's in it
      if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            console.log("[AUTH] [DEBUG] Manual payload decode for revoked token:", payload);
          }
        } catch (inner) {
          console.error("[AUTH] [DEBUG] Manual decode also failed");
        }
      }

      return NextResponse.json({ 
        error: "Invalid session", 
        details: e.message,
        code: e.code 
      }, { status: 401 });
    }

    console.log(`Fetching referral codes for UID: ${uid}`);
    const snapshot = await adminDb.collection("referral_codes")
      .where("ownerUid", "==", uid)
      .get();

    console.log(`Found ${snapshot.docs.length} codes`);

    const codes = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || (data.createdAt ? new Date(data.createdAt) : null)
      };
    });

    // Sort in memory to avoid index requirements
    codes.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return dateB - dateA; // Descending
    });

    return NextResponse.json({ codes });

  } catch (error: any) {
    console.error("Referral listing error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error.message 
    }, { status: 500 });
  }
}
