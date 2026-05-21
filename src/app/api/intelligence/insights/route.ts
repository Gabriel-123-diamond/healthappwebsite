import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { getGeminiModel } from "@/lib/gemini";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 1. Fetch User Profile & Tier
    const userDoc = await adminDb.collection("users").doc(uid).get();
    const userData = userDoc.data();
    const tier = userData?.tier || 'basic';

    if (tier === 'basic') {
      return NextResponse.json({ error: "Premium feature restricted" }, { status: 403 });
    }

    // 2. Fetch Vault Metadata (Categories & Names)
    const vaultSnap = await adminDb.collection("users").doc(uid).collection("vault").limit(10).get();
    const vaultRecords = vaultSnap.docs.map(doc => ({
      name: doc.data().name,
      category: doc.data().category,
      uploadedAt: doc.data().uploadedAt
    }));

    // 3. Fetch Search History
    const historySnap = await adminDb.collection("users").doc(uid).collection("searchHistory").limit(10).orderBy("timestamp", "desc").get();
    const recentSearches = historySnap.docs.map(doc => doc.data().query);

    // 4. Generate Insights with Gemini
    const model = getGeminiModel();
    const prompt = `
      As an AI clinical intelligence node, generate 3 proactive health insights for a user based on their profile and activity.
      
      User Tier: ${tier}
      Recent Clinical Searches: ${recentSearches.join(", ") || "None"}
      Medical Vault Records: ${vaultRecords.map(r => r.name).join(", ") || "None"}
      
      Output format: JSON array of objects with keys: "title", "description", "priority" (low|medium|high), "category" (prevention|analysis|recommendation).
      Keep descriptions technical, evidence-based, and concise. Avoid direct medical advice; use clinical observation language.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Clean JSON if needed (Gemini sometimes adds markdown blocks)
    const jsonMatch = responseText.match(/\[.*\]/s);
    const insights = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return NextResponse.json({ success: true, insights });

  } catch (error: any) {
    console.error("Insights API Error:", error);
    return NextResponse.json({ error: "Failed to generate intelligence insights" }, { status: 500 });
  }
}
