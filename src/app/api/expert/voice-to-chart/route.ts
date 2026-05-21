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

    if (userData?.role !== 'doctor') {
      return NextResponse.json({ error: "Only doctors can access this node." }, { status: 403 });
    }

    const { transcript, patientId, context } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    const model = getGeminiModel();
    const prompt = `
      As a Clinical Scribe Node, transform the following consultation transcript into a structured medical chart (SOAP note).
      
      Patient ID: ${patientId || 'Unknown'}
      Doctor Specialty: ${userData?.specialty || 'General Practice'}
      Additional Context: ${context || 'None'}

      Transcript:
      "${transcript}"

      Instructions:
      1. Extract Subjective (Symptoms, patient history).
      2. Extract Objective (Observations, vitals if mentioned).
      3. Provide Assessment (Potential diagnosis or findings).
      4. Suggest a Plan (Treatment, follow-up, prescriptions).
      5. Highlight any "Red Flags" that require immediate attention.

      Output Format: JSON object with keys: "subjective", "objective", "assessment", "plan", "redFlags".
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = (response as any).text().replace(/```json|```/g, "").trim();
    const soapNote = JSON.parse(jsonText);

    // Save to patient history if patientId is provided
    if (patientId) {
      await adminDb.collection("users").doc(uid).collection("consultations").add({
        patientId,
        soapNote,
        timestamp: new Date().toISOString(),
        type: 'voice-to-chart'
      });
    }

    return NextResponse.json({ soapNote });

  } catch (error) {
    console.error("Voice-to-Chart Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
