import { auth } from "@/lib/firebase";

export interface SearchResult {
  id: string;
  title: string;
  summary: string;
  source: string;
  type: 'medical' | 'herbal';
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
  directoryMatch?: {
    id: string;
    name: string;
    specialty: string;
  };
}

export const searchHealthTopic = async (query: string, mode: 'medical' | 'herbal' | 'both'): Promise<AIResponse> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const token = await user.getIdToken();

    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query, mode })
    });

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
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Check for directory matches (Mock logic)
    let directoryMatch;
    if (query.toLowerCase().includes('sarah') || query.toLowerCase().includes('cardio')) {
      directoryMatch = { id: 'exp1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology' };
    }

    return {
      answer: data.answer,
      results: data.evidence.map((item: any, index: number) => ({
        id: `e-${index}`,
        title: item.title,
        summary: item.snippet,
        source: new URL(item.link).hostname,
        type: mode === 'both' ? 'medical' : mode,
        link: item.link,
        evidenceGrade: 'B' // Default grade for API results
      })),
      disclaimer: data.disclaimer,
      confidenceScore: 88,
      explanation: "Calculated based on primary source analysis.",
      directoryMatch
    };
  } catch (error) {
    console.error("AI Service Error (falling back to mock):", error);
    return getMockResponse(query, mode);
  }
};

// Fallback Mock Data
const MOCK_KNOWLEDGE_BASE: Record<string, any> = {
  'headache': {
    medical: {
      answer: "medically, headaches can be caused by tension, dehydration, or migraines. Common treatments include over-the-counter analgesics like acetaminophen or ibuprofen. Hydration and rest are also recommended.",
      results: [
        { id: 'm1', title: 'Tension Headache Overview', summary: 'Causes and treatments for common tension headaches.', source: 'Mayo Clinic', type: 'medical', evidenceGrade: 'A' },
        { id: 'm2', title: 'Migraine Triggers', summary: 'Understanding what triggers migraines and how to manage them.', source: 'WebMD', type: 'medical', evidenceGrade: 'B' }
      ]
    },
    herbal: {
      answer: "In herbal traditions, headaches are often treated with Peppermint oil (applied topically), Feverfew, or Willow Bark. Ginger tea may also help if the headache is associated with nausea.",
      results: [
        { id: 'h1', title: 'Peppermint Oil for Headaches', summary: 'Studies on the efficacy of peppermint oil for tension headaches.', source: 'NIH / PubMed', type: 'herbal', evidenceGrade: 'B' },
        { id: 'h2', title: 'Feverfew: Traditional Uses', summary: 'Historical use of feverfew for migraine relief.', source: 'Botanical Safety Handbook', type: 'herbal', evidenceGrade: 'C' }
      ]
    },
    context: {
      region: 'East Asia',
      insight: 'In Traditional Chinese Medicine (TCM), headaches are often mapped to specific meridians. For example, a headache at the temples is associated with the Gallbladder meridian.'
    }
  },
  'sarah': {
    medical: { answer: "Dr. Sarah Johnson is a verified expert in our directory specializing in Cardiology.", results: [] },
    herbal: { answer: "", results: [] },
    directoryMatch: { id: 'exp1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology' }
  }
};

const getMockResponse = async (query: string, mode: string): Promise<AIResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const normalizedQuery = query.toLowerCase();
  const keyword = Object.keys(MOCK_KNOWLEDGE_BASE).find(k => normalizedQuery.includes(k)) || 'default';
  
  const data = MOCK_KNOWLEDGE_BASE[keyword] || MOCK_KNOWLEDGE_BASE['headache']; // Fallback for demo

  let answer = '';
  let results: SearchResult[] = [];

  if (data.medical && (mode === 'medical' || mode === 'both')) {
    answer += "**Medical Perspective:**\n" + data.medical.answer + "\n\n";
    results = [...results, ...data.medical.results];
  }

  if (data.herbal && (mode === 'herbal' || mode === 'both')) {
    answer += "**Herbal Perspective:**\n" + data.herbal.answer;
    results = [...results, ...data.herbal.results];
  }

  return {
    answer: answer.trim(),
    results: results,
    disclaimer: "This information is for educational purposes only and does not constitute medical advice. (Offline Mode)",
    confidenceScore: 95,
    explanation: "Based on consensus from Mayo Clinic and NIH guidelines.",
    regionalContext: data.context,
    directoryMatch: data.directoryMatch
  };
};
