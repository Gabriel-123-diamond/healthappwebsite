import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { getGeminiModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const userDoc = await adminDb.collection("users").doc(uid).get();
    const userData = userDoc.data();

    if (userData?.role !== 'hospital') {
      return NextResponse.json({ error: "Only hospitals can access this node." }, { status: 403 });
    }

    const { caseDetails, location } = await req.json();

    const model = getGeminiModel();
    const prompt = `
      As an Emergency Logistics Node, optimize routing for an incoming critical case.
      
      Hospital: ${userData?.facilityName || 'Medical Facility'}
      Emergency Entrance: ${userData?.emergencyCoordinates || 'Main Gate'}
      Current Bed Capacity: ${userData?.bedCapacity || 'Unknown'}
      
      Incoming Case: ${caseDetails}
      Patient Location: ${location}

      Instructions:
      1. Calculate estimated ETA (Simulated).
      2. Provide specific arrival instructions for the ambulance.
      3. Recommend immediate staff preparation (e.g. "Alert Trauma Team B").
      4. Select the most appropriate ward based on the case details.

      Output Format: JSON object with keys: "eta", "entranceInstructions", "staffAlert", "assignedWard".
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = (response as any).text().replace(/```json|```/g, "").trim();
    const routePlan = JSON.parse(jsonText);


    return NextResponse.json({ routePlan });

  } catch (error) {
    console.error("Emergency Routing Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
