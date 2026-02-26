import { auth, db } from "@/lib/firebase";
import { getExperts } from "@/services/directoryService";
import { getCachedSearch, saveSearch } from "./historyService";
import { aiResponseMapper } from "@/lib/mappers/aiResponseMapper";
import { reviewService } from "./reviewService";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { AIResponse, SearchResult } from "@/types";

export type { AIResponse, SearchResult };

export const searchHealthTopic = async (query: string, mode: 'medical' | 'herbal' | 'both'): Promise<AIResponse> => {
  const cached = await getCachedSearch(query, mode);
  if (cached) return cached;

  const user = auth.currentUser;
  if (!user) throw new Error("User must be authenticated");

  const token = await user.getIdToken();
  const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'en' : 'en';

  // Fetch User Country for Cultural Context
  let country = "";
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      country = userDoc.data().country || "";
    }
  } catch (e) {
    console.warn("Could not fetch user country for cultural context:", e);
  }

  const [response, experts, reviews] = await Promise.all([
    _fetchAIResponse(query, mode, locale, token, country),
    getExperts().catch(() => []),
    reviewService.getReviewsForQuery(query, mode)
  ]);

  if (response.status === 400) {
    const data = await response.json();
    if (data.error === "Emergency detected") return aiResponseMapper.mapEmergency(data);
  }

  if (!response.ok) throw new Error("Unable to connect to AI Intelligence. Please try again later.");

  const data = await response.json();
  const aiResponse = aiResponseMapper.map(data, query, experts, mode);
  aiResponse.reviews = reviews;

  saveSearch(query, mode, aiResponse);

  return aiResponse;
};

async function _fetchAIResponse(query: string, mode: string, locale: string, token: string, country?: string) {
  return fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query, mode, locale, country })
  });
}