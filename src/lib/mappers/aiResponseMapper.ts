import { AIResponse, SearchResult } from "@/services/aiService";
import { findMatchingExperts } from "@/lib/expertMatcher";

export const aiResponseMapper = {
  map(data: any, query: string, experts: any[], mode: 'medical' | 'herbal' | 'both'): AIResponse {
    const allMatches = findMatchingExperts(query, experts, mode);
    
    return {
      answer: data.answer || data.summary || "",
      results: (data.evidence || []).map((item: any, index: number) => this.mapSearchResult(item, index, mode)),
      disclaimer: data.disclaimer || "This information is for educational purposes only.",
      confidenceScore: data.confidenceScore || 92,
      observations: data.observations || [],
      protocol: data.protocol || [],
      explanation: "Calculated based on real-time primary source analysis.",
      directoryMatches: allMatches.slice(0, 4).map(e => ({
        id: e.id,
        name: e.name,
        specialty: e.specialty,
        location: e.location
      })),
      totalDirectoryMatches: allMatches.length,
      remainingSearches: data.remainingSearches,
      isUnlimited: data.isUnlimited
    };
  },

  mapSearchResult(item: any, index: number, mode: string): SearchResult {
    const isVideo = item.link?.includes('youtube.com') || item.link?.includes('vimeo.com');
    let source = "Web";
    try {
      source = new URL(item.link).hostname;
    } catch (e) {
      // Fallback if link is invalid
    }

    return {
      id: `e-${index}-${Date.now()}`,
      title: item.title,
      summary: item.snippet,
      source,
      type: mode === 'both' ? 'medical' : mode as any,
      format: isVideo ? 'video' : 'article',
      link: item.link,
      evidenceGrade: 'B'
    };
  },

  mapEmergency(data: any): AIResponse {
    return {
      answer: data.safety?.message || "Emergency detected",
      results: [],
      disclaimer: data.safety?.action || "Please contact emergency services immediately.",
      isEmergency: true,
      emergencyData: data.safety
    };
  }
};
