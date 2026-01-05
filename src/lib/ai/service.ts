import { model } from "../firebase";
import { checkSafety, SafetyCheckResult } from "./safety";
import { fetchYouTubeVideos, fetchGoogleArticles, SourceResult } from "../external/search";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export type SearchMode = "medical" | "herbal" | "both";

export interface SearchResponse {
  summary: string;
  sources: SourceResult[];
  safetyCheck: SafetyCheckResult;
  mode: SearchMode;
}

/**
 * The Main Orchestrator
 * 1. Checks Safety
 * 2. Calls Gemini (Vertex AI)
 * 3. Calls YouTube & Google Search (Server Actions)
 */
export async function searchHealthInfo(
  query: string,
  mode: SearchMode = "medical"
): Promise<SearchResponse> {
  // 1. Safety Check (Client-side fast fail)
  const safetyResult = checkSafety(query);
  if (!safetyResult.isSafe) {
    // LOG SAFETY INCIDENT
    try {
        addDoc(collection(db, "content_logs"), {
            query,
            warningType: safetyResult.warningType,
            message: safetyResult.message,
            timestamp: serverTimestamp(),
            platform: "web"
        });
    } catch (e) {
        console.error("Failed to log safety incident", e);
    }

    return {
      summary: "Emergency content detected.",
      sources: [],
      safetyCheck: safetyResult,
      mode,
    };
  }

  try {
    // 2. Prepare the Prompt
    const prompt = buildPrompt(query, mode);

    // 3. Execute Parallel Requests
    // Note: Vertex AI runs on client (via Firebase SDK), but External APIs run on Server.
    
    if (!model) {
        throw new Error("AI Service (Gemini) is not initialized. Please check if Vertex AI is enabled in your Firebase project.");
    }

    const [aiResponse, videos, articles] = await Promise.all([
      model.generateContent(prompt),
      fetchYouTubeVideos(`${query} ${mode === "herbal" ? "herbal remedy" : "medical explanation"}`),
      fetchGoogleArticles(`${query} ${mode === "herbal" ? "herbal medicine" : "treatment"}`),
    ]);

    const summaryText = aiResponse.response.text();

    return {
      summary: summaryText,
      sources: [...articles, ...videos],
      safetyCheck: safetyResult,
      mode,
    };
  } catch (error) {
    console.error("Search Pipeline Failed:", error);
    return {
      summary: "Sorry, we encountered an error while processing your request. Please try again.",
      sources: [],
      safetyCheck: safetyResult,
      mode,
    };
  }
}

function buildPrompt(query: string, mode: SearchMode): string {
  const base = `You are a helpful, empathetic health assistant. The user is searching for: "${query}".`;
  
  if (mode === "medical") {
    return `${base} Provide a clear, concise summary based ONLY on verified orthodox medical knowledge. Explain symptoms, standard treatments, and when to see a doctor. Do not mention herbal remedies. Format with clear paragraphs.`;
  } else if (mode === "herbal") {
    return `${base} Provide a summary based on traditional and herbal knowledge. Mention commonly used herbs or natural remedies for this condition. clearly state that scientific evidence may vary and this is for educational purposes.`;
  } else {
    return `${base} Provide a comprehensive answer. First, explain the orthodox medical perspective (treatments, facts). Then, mention traditional or herbal remedies that are commonly discussed. Compare them if necessary.`;
  }
}
