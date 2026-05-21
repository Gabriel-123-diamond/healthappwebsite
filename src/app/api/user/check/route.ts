import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { rateLimiter } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    // 1. Basic Auth Check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    let uid: string;
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
    } catch (e) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // 2. Rate Limiting: 20 checks per minute per user
    const rateCheck = rateLimiter.isAllowed(uid, 20, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait." }, { status: 429 });
    }

    const { field, value } = await req.json();

    if (!field || !value) {
      return NextResponse.json({ error: "Missing field or value" }, { status: 400 });
    }

    const allowedFields = ['username', 'phone', 'fullName', 'licenseNumber', 'email', 'idNumber'];
    if (!allowedFields.includes(field)) {
      return NextResponse.json({ error: "Invalid field" }, { status: 400 });
    }

    let isTaken = false;
    const normalizedValue = value.toString().toLowerCase().trim();

    const usersRef = adminDb.collection("users");
    const snapshot = await usersRef.where(field, "==", normalizedValue).limit(1).get();

    if (!snapshot.empty) {
      // If the doc found belongs to the user checking, it's not "taken" by someone else
      if (snapshot.docs[0].id !== uid) {
        isTaken = true;
      }
    }

    return NextResponse.json({ taken: isTaken });

  } catch (error: any) {
    console.error("User check error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
