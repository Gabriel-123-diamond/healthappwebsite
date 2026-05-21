import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { adminAuth } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Admin Session and Scope
    const adminSession = adminAuth.verifySession(req);

    if (!adminSession.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { expertId, status, notes } = await req.json();

    if (!expertId || !['verified', 'rejected', 'unverified', 'approved_upgrade', 'rejected_upgrade'].includes(status)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // 2. Fetch the target expert profile to check scope
    const userRef = adminDb.collection("users").doc(expertId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "Expert not found" }, { status: 404 });
    }

    const userData = userDoc.data()!;

    // 3. Enforce Admin Scoping
    if (!adminSession.isSuper) {
      if (adminSession.countryIso && userData.countryIso !== adminSession.countryIso) {
        return NextResponse.json({ error: "Unauthorized: Expert outside your regional scope (Country)" }, { status: 403 });
      }
      if (adminSession.stateIso && userData.stateIso !== adminSession.stateIso) {
        return NextResponse.json({ error: "Unauthorized: Expert outside your regional scope (State)" }, { status: 403 });
      }
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (status === 'approved_upgrade') {
      updateData.upgradeStatus = 'pending_payment';
      updateData.upgradeNotes = notes || "Credentials approved. Please complete payment.";
    } else if (status === 'rejected_upgrade') {
      updateData.upgradeStatus = 'rejected';
      updateData.upgradeNotes = notes || "Credentials did not meet tier requirements.";
    } else {
      updateData.verificationStatus = status;
      updateData.verificationNotes = notes || "";
      
      if (status === 'verified') {
        updateData.tier = 'basic';
        updateData.profileComplete = true;
        updateData.kycStatus = 'verified';
      } else if (status === 'rejected') {
        updateData.kycStatus = 'rejected';
      }
    }

    await userRef.update(updateData);

    console.log(`[Admin Action] ${adminSession.isSuper ? 'Super Admin' : 'Regional Admin'} set Expert ${expertId} to ${status}`);

    return NextResponse.json({ success: true, message: `Expert status updated to ${status}` });

  } catch (error: any) {
    console.error("Verification API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
