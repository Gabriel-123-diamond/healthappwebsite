import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function DELETE(req: NextRequest) {
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

    // 1. Delete Firestore Data
    const collections = ["users", "journals", "reviews", "saved"];
    const batch = adminDb.batch();

    for (const colName of collections) {
      const snap = await adminDb.collection(colName).where("userId", "==", uid).get();
      snap.docs.forEach(doc => batch.delete(doc.ref));
    }
    
    // Also delete the specific user profile doc if it doesn't use "userId" field but is keyed by uid
    batch.delete(adminDb.collection("users").doc(uid));

    await batch.commit();

    // 2. Delete Auth Account
    await adminAuth.deleteUser(uid);

    return NextResponse.json({ message: "Account successfully deleted" });

  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
