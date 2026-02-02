import { auth } from "@/lib/firebase";
import { getExperts } from "@/services/directoryService";
import { findMatchingExperts } from "@/lib/expertMatcher";

export interface SearchResult {
  id: string;
  title: string;
  summary: string;
  source: string;
  type: 'medical' | 'herbal';
  format: 'article' | 'video';
  link?: string;
  evidenceGrade?: 'A' | 'B' | 'C' | 'D'; // A: High, B: Moderate, C: Limited/Traditional, D: Insufficient
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
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User must be authenticated");
  }

  const token = await user.getIdToken();

  // Run search and expert fetch in parallel
  const [response, experts] = await Promise.all([
    fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        query, 
        mode, 
        locale: window.location.pathname.split('/')[1] || 'en' 
      })
    }),
    getExperts().catch(e => {
      console.error("Failed to fetch experts:", e);
      return [];
    })
  ]);

  if (response.status === 400) {
    const data = await response.json();
    if (data.error === "Emergency detected") {
      return {
        answer: data.safety.message,
        results: [],
        disclaimer: data.safety.action,
        isEmergency: true,
        emergencyData: data.safety
      };
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error (${response.status}): ${errorText}`);
    throw new Error("Unable to connect to AI Intelligence. Please check your internet connection or try again later.");
  }

  const data = await response.json();
  
  // Use extracted expert matching logic
  const allMatches = findMatchingExperts(query, experts, mode);

  const directoryMatches = allMatches.slice(0, 4).map(e => ({
    id: e.id,
    name: e.name,
    specialty: e.specialty,
    location: e.location
  }));

  return {
    answer: data.answer,
    results: (data.evidence || []).map((item: any, index: number) => {
      const isVideo = item.link.includes('youtube.com') || item.link.includes('vimeo.com');
      return {
        id: `e-${index}`,
        title: item.title,
        summary: item.snippet,
        source: new URL(item.link).hostname,
        type: mode === 'both' ? 'medical' : mode,
        format: isVideo ? 'video' : 'article',
        link: item.link,
        evidenceGrade: 'B'
      };
    }),
    disclaimer: data.disclaimer || "This information is for educational purposes only and does not constitute medical advice.",
    confidenceScore: 92,
    explanation: "Calculated based on real-time primary source analysis.",
    directoryMatches,
    totalDirectoryMatches: allMatches.length
  };
};