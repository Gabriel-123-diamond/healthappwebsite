import { auth } from "@/lib/firebase";
import { getExperts } from "@/services/directoryService";
import { getCachedSearch, saveSearch } from "./historyService";
import { aiResponseMapper } from "@/lib/mappers/aiResponseMapper";

export interface SearchResult {
  id: string;
  title: string;
  summary: string;
  source: string;
  type: 'medical' | 'herbal';
  format: 'article' | 'video';
  link?: string;
  evidenceGrade?: 'A' | 'B' | 'C' | 'D';
}

export interface AIResponse {
  answer: string;
  results: SearchResult[];
  disclaimer: string;
  isEmergency?: boolean;
  emergencyData?: any;
  confidenceScore?: number;
  explanation?: string;
  regionalContext?: {
    region: string;
    insight: string;
  };
  directoryMatches?: {
    id: string;
    name: string;
    specialty: string;
    location: string;
  }[];
  totalDirectoryMatches?: number;
}

export const searchHealthTopic = async (query: string, mode: 'medical' | 'herbal' | 'both'): Promise<AIResponse> => {
  const cached = await getCachedSearch(query, mode);
  if (cached) return cached;

  const user = auth.currentUser;
  if (!user) throw new Error("User must be authenticated");

  const token = await user.getIdToken();
  const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'en' : 'en';

  const [response, experts] = await Promise.all([
    _fetchAIResponse(query, mode, locale, token),
    getExperts().catch(() => [])
  ]);

  if (response.status === 400) {
    const data = await response.json();
    if (data.error === "Emergency detected") return aiResponseMapper.mapEmergency(data);
  }

  if (!response.ok) throw new Error("Unable to connect to AI Intelligence. Please try again later.");

  const data = await response.json();
  const aiResponse = aiResponseMapper.map(data, query, experts, mode);

  saveSearch(query, mode, aiResponse);
  return aiResponse;
};

async function _fetchAIResponse(query: string, mode: string, locale: string, token: string) {
  return fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query, mode, locale })
  });
}
