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
    } catch (error: any) {
      console.error("Auth Verification Failed:", error);
      // Fallback for development network issues
      if (process.env.NODE_ENV === 'development' && (error.code === 'auth/network-request-failed' || error.message?.includes('ENOTFOUND'))) {
        console.warn("⚠️ NETWORK ERROR DETECTED: Bypassing auth verification for development purposes.");
        decodedToken = { uid: "dev-bypass-user" };
      } else {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    }

    const { query, mode = "both" } = await req.json();
    console.log(`[API Search] Query: "${query}", Mode: "${mode}"`);

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

    // 3. Fetch Evidence (Real links) - Done BEFORE AI for RAG
    console.log("Fetching evidence...");
    let evidence: any[] = [];
    try {
      evidence = await fetchEvidence(query);
      console.log(`Found ${evidence.length} evidence items`);
    } catch (e) {
      console.error("Failed to fetch evidence, proceeding with AI only:", e);
    }

    // 4. Call Gemini AI with Context
    console.log("Calling Gemini AI...");
    const model = getGeminiModel();
    
    // Format evidence for the prompt
    const evidenceContext = evidence.map((item, index) => 
      `[${index + 1}] ${item.title}: ${item.snippet} (${item.link})`
    ).join("\n");

    const medicalSection = `
         ## 🏥 Medical Perspective
         (Explain the orthodox medical view, treatments, or scientific consensus. Use bullet points for clarity.)`;
    
    const herbalSection = `
         ## 🌿 Herbal & Traditional Perspective
         (Explain relevant herbal remedies, cultural practices, or traditional views. Be specific about plants/remedies if applicable.)`;

    let formatInstructions = "";
    if (mode === "medical") {
      formatInstructions = medicalSection;
    } else if (mode === "herbal") {
      formatInstructions = herbalSection;
    } else {
      formatInstructions = medicalSection + "\n" + herbalSection;
    }

    const prompt = `
      You are a specialized health assistant named Ikiké, bridging modern medicine and traditional herbal knowledge.
      
      User Query: "${query}"
      Search Mode: "${mode}"

      IMPORTANT: The user has selected "${mode}" mode. You MUST ONLY provide information for the ${mode === 'both' ? 'Medical and Herbal' : mode} perspective. Do NOT include other perspectives.

      Context / Trusted Sources:
      ${evidenceContext}

      Instructions:
      1. Analyze the user's query carefully.
      2. Provide a structured, well-organized response using the following format:
         ${formatInstructions}

         ## ⚠️ Safety & Interactions
         (Crucial: Mention potential side effects, drug interactions, or contraindications. If it's a medical emergency, state it clearly.)

      3. Tone: Professional, empathetic, and educational.
      4. Formatting: Use Markdown (bolding, lists) to make it easy to read.
      5. Disclaimer: Do not start with a disclaimer, one is already displayed on the UI.
      6. References: DO NOT include inline citations (e.g., [1], [1, 2]) in the text. The UI displays sources separately.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let aiText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      // Clean up any remaining citations like [1], [1, 2], [1-3]
      aiText = aiText.replace(/\[\d+(?:,\s*\d+)*\]/g, "").replace(/\[\d+-\d+\]/g, "");
      
      console.log("AI Response received successfully");

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
