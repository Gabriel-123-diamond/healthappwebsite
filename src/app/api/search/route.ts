import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { checkSafety } from "@/services/safetyService";
import { getGeminiModel } from "@/lib/gemini";
import { fetchEvidence } from "@/services/evidenceService";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate Request
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

    const { query, mode = "both" } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 2. Safety Check
    const safetyResult = checkSafety(query);
    if (!safetyResult.isSafe) {
      return NextResponse.json({ 
        error: "Emergency detected", 
        safety: safetyResult 
      }, { status: 400 });
    }

    // 3. Call Gemini AI
    const model = getGeminiModel();
    const prompt = `
      You are a health assistant bridging modern medicine and traditional herbal knowledge.
      Query: "${query}"
      Mode: "${mode}"

      Provide a comprehensive answer. 
      Use markdown for formatting. 
      If mode is 'both', provide separate sections for "**Medical Perspective:**" and "**Herbal Perspective:**".
      Include a confidence score (0-1) for your answer.
    `;

    const result = await model.generateContent(prompt);
    const aiText = result.response.text();

    // 4. Fetch Evidence (Real links)
    const evidence = await fetchEvidence(query);

    // 5. Save to Review Queue (for experts)
    const reviewRef = await adminDb.collection("reviews").add({
      userId: decodedToken.uid,
      query,
      answer: aiText,
      mode,
      evidence,
      status: "pending",
      timestamp: new Date(),
    });

    // 6. Return Response
    return NextResponse.json({
      answer: aiText,
      evidence: evidence,
      reviewId: reviewRef.id,
      disclaimer: "This information is for educational purposes only and does not constitute medical advice."
    });

  } catch (error: any) {
    console.error("API Search Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
