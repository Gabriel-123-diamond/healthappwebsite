import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { checkSafetyServer } from "@/lib/safetyServer";
import { getGeminiModel } from "@/lib/gemini";
import { fetchEvidence } from "@/services/evidenceService";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number, lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; 
const MAX_REQUESTS = 10;

type SearchMode = 'medical' | 'herbal' | 'both';

function isRateLimited(uid: string): boolean {
  const now = Date.now();
  const userData = rateLimitMap.get(uid) || { count: 0, lastReset: now };

  if (now - userData.lastReset > RATE_LIMIT_WINDOW) {
    userData.count = 1;
    userData.lastReset = now;
    rateLimitMap.set(uid, userData);
    return false;
  }

  userData.count++;
  rateLimitMap.set(uid, userData);
  return userData.count > MAX_REQUESTS;
}

function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 500); 
}

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
        console.warn("[API Search] Invalid token provided");
      }
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const identifier = uid || `guest_${ip}`;

    if (isRateLimited(identifier)) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const body = await req.json();
    const query = sanitizeInput(body.query);
    const rawMode = sanitizeInput(body.mode || "both");
    const country = sanitizeInput(body.country || "");
    const providerOverride = body.provider; // Optional override from request

    const allowedModes: SearchMode[] = ['medical', 'herbal', 'both'];
    const mode: SearchMode = allowedModes.includes(rawMode as SearchMode) 
      ? (rawMode as SearchMode) 
      : 'both';

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const safety = await checkSafetyServer(query);
    if (safety.hasRedFlag) {
      return NextResponse.json({
        answer: safety.message,
        action: safety.action,
        error: "Emergency detected",
        isSafe: false
      }, { status: 400 });
    }

    const evidence = await fetchEvidence(query, mode);

    // Respect provider switch
    const model = getGeminiModel(); 

    const prompt = `
      You are Ikiké, a specialized health assistant bridging modern medicine and traditional herbal knowledge.
      Provide culturally relevant, evidence-based health insights.

      User Query: "${query}"
      Search Mode: "${mode}"
      User Location: "${country || 'Global'}"

      Instructions:
      1. Analyze the query carefully. 
      2. If location is "${country}", prioritize regional herbs/practices.
      3. Structure: ## 🏥 Medical Perspective, ## 🌿 Herbal Perspective, ## ⚠️ Safety & Interactions.
      4. End with "REGIONAL_INSIGHT: [one sentence for ${country || 'the user'}]".
      5. Tone: Professional, empathetic. Use Markdown. No citations.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let aiText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    let regionalInsight = "";
    const insightMatch = aiText.match(/REGIONAL_INSIGHT:\s*(.*)/);
    if (insightMatch) {
      regionalInsight = insightMatch[1];
      aiText = aiText.replace(/REGIONAL_INSIGHT:\s*(.*)/, "").trim();
    }

    aiText = aiText.replace(/\[\d+(?:,\s*\d+)*\]/g, "").replace(/\[\d+-\d+\]/g, "");
    
    let reviewId = "";
    if (uid) {
      const reviewRef = await adminDb.collection("global_history").add({
        query,
        mode,
        answer: aiText,
        uid,
        timestamp: new Date().toISOString(),
        status: 'pending'
      });
      reviewId = reviewRef.id;
    }

    return NextResponse.json({
      answer: aiText,
      evidence: evidence,
      reviewId,
      regionalContext: country ? { region: country, insight: regionalInsight } : undefined,
      disclaimer: "This information is for educational purposes only and does not constitute medical advice."
    });

  } catch (error) {
    console.error("API Search Error:", error);
    return NextResponse.json({ error: "Failed to process health intelligence request" }, { status: 500 });
  }
}
