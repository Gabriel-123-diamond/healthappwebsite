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

    if (userData?.role !== 'wellness_practitioner') {
      return NextResponse.json({ error: "Only wellness practitioners can access this node." }, { status: 403 });
    }

    const { type, topic, keywords, tone } = await req.json();

    const model = getGeminiModel();
    const prompt = `
      As a Holistic Health Intelligence Node, generate a ${type} for a wellness practitioner.
      
      Topic: ${topic}
      Keywords: ${keywords?.join(', ') || 'holistic health, traditional wisdom'}
      Preferred Tone: ${tone || 'professional and empathetic'}
      Practitioner Modality: ${userData?.specialty || 'Integrative Wellness'}

      Instructions:
      1. Provide a title.
      2. Structure the content with clear sections.
      3. Integrate the provided keywords naturally.
      4. Ensure a balance between traditional herbal wisdom and modern wellness practices.
      5. Include a standard medical disclaimer at the end.

      Output Format: Markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = (response as any).text();

    return NextResponse.json({ content });

  } catch (error) {
    console.error("Content Scribe Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
