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
      console.error("Auth Verification Failed:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { query, mode = "both" } = await req.json();
    console.log(`Processing search query: "${query}" in mode: ${mode}`);

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 2. Safety Check
    const safetyResult = checkSafety(query);
    if (!safetyResult.isSafe) {
      console.log("Safety red flag detected");
      return NextResponse.json({ 
        error: "Emergency detected", 
        safety: safetyResult 
      }, { status: 400 });
    }

    // 3. Call Gemini AI
    console.log("Calling Gemini AI...");
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

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log("AI Response received successfully");

      // 4. Fetch Evidence (Real links)
      console.log("Fetching evidence...");
      const evidence = await fetchEvidence(query);
      console.log(`Found ${evidence.length} evidence items`);

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
    } catch (aiError) {
      console.error("Gemini AI or DB Operation Failed:", aiError);
      throw aiError;
    }

  } catch (error: any) {
    console.error("API Search Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
