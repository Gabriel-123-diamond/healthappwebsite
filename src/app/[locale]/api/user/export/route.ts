import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const uid = decodedToken.uid;

    // Fetch all user-related data in parallel
    const [profileDoc, journalsSnap, reviewsSnap] = await Promise.all([
      adminDb.collection("users").doc(uid).get(),
      adminDb.collection("journals").where("userId", "==", uid).get(),
      adminDb.collection("reviews").where("userId", "==", uid).get(),
    ]);

    const exportData = {
      metadata: {
        exportTimestamp: new Date().toISOString(),
        version: "1.0.0",
      },
      profile: profileDoc.exists ? profileDoc.data() : null,
      journals: journalsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      searchHistory: reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    };

    return NextResponse.json(exportData, {
      headers: {
        "Content-Disposition": `attachment; filename="health_data_export_${uid}.json"`,
        "Content-Type": "application/json",
      },
    });

  } catch (error: any) {
    console.error("Export Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
