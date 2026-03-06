import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { getGeminiModel } from "@/lib/gemini";
import { rateLimiter } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    let uid: string | null = null;
    
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split("Bearer ")[1];
      try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        uid = decodedToken.uid;
      } catch (error) {
        console.warn("[API Discovery] Invalid token provided");
      }
    }

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(',')[0] : "unknown";
    const identifier = uid || `guest_${ip}`;

    // Rate Limit: 5 discovery requests per minute
    const rateCheck = rateLimiter.isAllowed(identifier, 5, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Discovery rate limit exceeded. Please wait." }, { status: 429 });
    }

    const { answers } = await req.json();

    if (!answers) {
      return NextResponse.json({ error: "Answers are required" }, { status: 400 });
    }

    const model = getGeminiModel();
    const prompt = `
      Analyze these health-related data points and provide a high-level intelligence summary.
      Focus on patterns and suggest a relevant medical specialty.
      
      Data: ${JSON.stringify(answers)}
      
      Return JSON format: { "summary": "...", "suggestedSpecialty": "..." }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const resultJson = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: text, suggestedSpecialty: "General Practitioner" };

    return NextResponse.json(resultJson);
  } catch (error) {
    console.error("Discovery API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
