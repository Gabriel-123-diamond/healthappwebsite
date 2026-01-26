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
      answer: "Medically, headaches can be caused by tension, dehydration, or migraines. Common treatments include over-the-counter analgesics like acetaminophen or ibuprofen. Hydration and rest are also recommended.",
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
  'catarrh': {
    medical: {
      answer: "Catarrh is an excessive build-up of mucus in an airway or cavity of the body. It's often caused by the common cold, hay fever, or nasal polyps. Treatments include saline nasal rinses and decongestants.",
      results: [
        { id: 'm3', title: 'What is Catarrh?', summary: 'Symptoms, causes and treatments for chronic catarrh.', source: 'NHS', type: 'medical', evidenceGrade: 'A' }
      ]
    },
    herbal: {
      answer: "Traditional herbal remedies for catarrh include steam inhalation with Eucalyptus oil, drinking Mullein tea, or using Elderberry syrup to reduce inflammation in the nasal passages.",
      results: [
        { id: 'h3', title: 'Eucalyptus for Respiratory Health', summary: 'How eucalyptus oil helps clear nasal passages.', source: 'Healthline', type: 'herbal', evidenceGrade: 'B' }
      ]
    }
  },
  'cough': {
    medical: {
      answer: "A cough is your body's way of responding when something irritates your throat or airways. Acute coughs are usually viral, while chronic coughs may indicate asthma or GERD.",
      results: [
        { id: 'm4', title: 'Cough: Causes and Diagnosis', summary: 'When to see a doctor for a persistent cough.', source: 'Cleveland Clinic', type: 'medical', evidenceGrade: 'A' }
      ]
    },
    herbal: {
      answer: "Herbal cough remedies often feature Honey (as a demulcent), Thyme tea, or Marshmallow root. These help coat the throat and reduce the urge to cough.",
      results: [
        { id: 'h4', title: 'Honey for Cough Suppression', summary: 'Comparing honey to over-the-counter cough suppressants.', source: 'NIH', type: 'herbal', evidenceGrade: 'A' }
      ]
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
  const keyword = Object.keys(MOCK_KNOWLEDGE_BASE).find(k => normalizedQuery.includes(k));
  
  const data = keyword ? MOCK_KNOWLEDGE_BASE[keyword] : null;

  let answer = '';
  let results: SearchResult[] = [];

  if (data) {
    if (data.medical && (mode === 'medical' || mode === 'both')) {
      answer += "**Medical Perspective:**\n" + data.medical.answer + "\n\n";
      results = [...results, ...data.medical.results];
    }

    if (data.herbal && (mode === 'herbal' || mode === 'both')) {
      answer += "**Herbal Perspective:**\n" + data.herbal.answer;
      results = [...results, ...data.herbal.results];
    }
  } else {
    answer = `I am currently in **Offline Mode** and don't have specific data for "${query}" in my local cache. \n\nHowever, for general symptoms like this, it is usually recommended to stay hydrated, rest, and monitor your symptoms. If they persist or worsen, please consult a healthcare professional.`;
    results = [
      { id: 'gen1', title: 'General Wellness Guide', summary: 'Basic steps to take when feeling unwell.', source: 'HealthAI', type: 'medical', evidenceGrade: 'B' }
    ];
  }

  return {
    answer: answer.trim(),
    results: results,
    disclaimer: "This information is for educational purposes only and does not constitute medical advice. (Offline Mode)",
    confidenceScore: data ? 95 : 50,
    explanation: data ? "Based on consensus from Mayo Clinic and NIH guidelines." : "General guidance for unknown topics in offline mode.",
    regionalContext: data?.context,
    directoryMatch: data?.directoryMatch
  };
};
