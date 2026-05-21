import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    let uid: string;
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      uid = decodedToken.uid;
      
      // Phase 15: Mandatory Backend Privilege Verification
      const userSnap = await adminDb.collection('users').doc(uid).get();
      const userData = userSnap.data();
      
      if (!userData || !['doctor', 'wellness_practitioner', 'hospital'].includes(userData.role) || userData.verificationStatus !== 'verified') {
        console.warn(`[SECURITY] Unauthorized AI Scribe access attempt by UID: ${uid}`);
        return NextResponse.json({ error: "Forbidden: Verified Expert access required." }, { status: 403 });
      }
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transcript, patientName } = await req.json();

    if (!transcript || !Array.isArray(transcript)) {
      return NextResponse.json({ error: "Valid transcript array is required" }, { status: 400 });
    }

    const prompt = `
You are an expert AI Medical Scribe. 
You are given a raw transcript of a clinical encounter.
Your job is to structure this transcript into a professional, highly readable SOAP Note (Subjective, Objective, Assessment, Plan).

Patient Name: ${patientName || 'Unknown Patient'}
Date: ${new Date().toLocaleDateString()}

Transcript:
${transcript.map((line, i) => `[${i + 1}] ${line}`).join('\n')}

Format your response exactly as a Markdown SOAP Note. Use concise medical terminology where appropriate, but remain clear.
`;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = (response as any).text();

    return NextResponse.json({ notes: text });
  } catch (error) {
    console.error("AI Scribe Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
