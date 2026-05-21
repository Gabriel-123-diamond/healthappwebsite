import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { checkSafetyServer } from "@/lib/safetyServer";
import { getGeminiModel } from "@/lib/gemini";
import { fetchEvidence } from "@/services/evidenceService";
import { rateLimiter } from "@/lib/rateLimit";

type SearchMode = 'medical' | 'herbal' | 'both';

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

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(',')[0] : "unknown";
    const identifier = uid || `guest_${ip}`;

    // 1. Rate Limiting (Spam protection)
    const rateCheck = rateLimiter.isAllowed(identifier, 10, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
    }
// 2. Tier-based Search Limits & Intelligence Level
let isUnlimited = false;
let intelligenceLevel = 'standard'; // standard | deep

const today = new Date().toISOString().split('T')[0];
let dailySearchCount = 0;
let remainingSearches = 5;

if (uid) {
  const userDocRef = adminDb.collection("users").doc(uid);
  const userDoc = await userDocRef.get();
  const userData = userDoc.data();
  const tier = userData?.tier || 'basic';
  
  if (tier === 'vip1' || tier === 'vip2' || tier === 'premium' || tier === 'professional') {
    isUnlimited = true;
    intelligenceLevel = 'deep';
  } else {
    const lastSearchDate = userData?.lastSearchDate;
    dailySearchCount = userData?.dailySearchCount || 0;
    
    if (lastSearchDate !== today) {
      dailySearchCount = 0;
    }
    
    if (dailySearchCount >= 5) {
      return NextResponse.json({ error: "Daily limit reached. Please upgrade your node to continue searching." }, { status: 403 });
    }
    
    remainingSearches = 4 - dailySearchCount;
    // We update the limit asynchronously or wait
    await userDocRef.update({
      dailySearchCount: dailySearchCount + 1,
      lastSearchDate: today
    });
  }
} else {
  // Simple IP-based daily limit using our rateLimiter utility (if applicable) or a separate collection
  const ipCheck = rateLimiter.isAllowed(`daily_${ip}`, 5, 24 * 60 * 60 * 1000);
  if (!ipCheck.allowed) {
    return NextResponse.json({ error: "Daily guest limit reached. Please sign in or upgrade." }, { status: 403 });
  }
  remainingSearches = ipCheck.remaining;
}

const body = await req.json();
const query = sanitizeInput(body.query);
const rawMode = body.mode;
const country = body.country;

// 3. Deep Intelligence Logic with Evidence Grading
const deepModel = getGeminiModel();
const deepPrompt = intelligenceLevel === 'deep' 
  ? `As a Deep Clinical Intelligence Node, provide an exhaustive analysis for: ${query}. 
     Cross-reference latest clinical studies and herbal registries. 

     You MUST include an "evidenceGrade" (A|B|C|D) and a "confidenceScore" (0-100) for each primary observation.

     Output format: A JSON object with keys:
     "summary": "Concise overview",
     "observations": [
       {
         "point": "The clinical finding",
         "evidence": "Source/Reasoning",
         "grade": "A", 
         "confidence": 95
       }
     ],
     "protocol": ["Step 1", "Step 2"],
     "disclaimer": "Standard medical warning"`
  : `Provide a concise summary for: ${query}. Include a confidence score (0-100).`;

const deepResult = await deepModel.generateContent(deepPrompt);
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
      remainingSearches,
      isUnlimited,
      disclaimer: "This information is for educational purposes only and does not constitute medical advice."
    });

  } catch (error) {
    console.error("API Search Error:", error);
    return NextResponse.json({ error: "Failed to process health intelligence request" }, { status: 500 });
  }
}
