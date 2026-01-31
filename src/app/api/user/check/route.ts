import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { field, value } = await req.json();

    if (!field || !value) {
      return NextResponse.json({ error: "Missing field or value" }, { status: 400 });
    }

    // Define allowed fields for security
    const allowedFields = ['username', 'phone', 'fullName'];
    if (!allowedFields.includes(field)) {
      return NextResponse.json({ error: "Invalid field" }, { status: 400 });
    }

    let isTaken = false;
    
    // Normalize value for lookup
    const normalizedValue = value.toString().toLowerCase().trim();

    const usersRef = adminDb.collection("users");
    const snapshot = await usersRef.where(field, "==", normalizedValue).limit(1).get();

    if (!snapshot.empty) {
      isTaken = true;
    }

    return NextResponse.json({ taken: isTaken });

  } catch (error: any) {
    console.error("User check error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
