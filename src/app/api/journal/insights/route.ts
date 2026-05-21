import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import { adminAuth } from "@/lib/firebaseAdmin";
import { rateLimiter } from "@/lib/rateLimit";

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
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate Limit Check
    const rateCheck = rateLimiter.isAllowed(uid, 5, 60 * 1000); // 5 insights per minute
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait." }, { status: 429 });
    }

    const { entries } = await req.json();

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ error: "Valid journal entries are required" }, { status: 400 });
    }

    const prompt = `
You are an advanced AI Health Analyst. 
Analyze the following sequential health journal entries provided by a patient. Look for behavioral correlations, symptom triggers, and overall health trends over time.

Journal Entries:
${entries.map((e: any, i: number) => `
Entry ${i + 1} (${new Date(e.loggedAt?.seconds ? e.loggedAt.seconds * 1000 : e.loggedAt).toLocaleDateString()}):
- Symptoms: ${e.symptoms?.join(', ') || 'None reported'}
- Severity: ${e.severity}/10
- Notes: ${e.notes || 'None'}
`).join('\n')}

Based on this data, provide a concise, compassionate 2-3 sentence insight summarizing any patterns you observe. Address the patient directly (e.g., "We noticed..."). Do not provide medical diagnoses.
`;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = (response as any).text();

    return NextResponse.json({ insight: text });
  } catch (error) {
    console.error("AI Insight Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
