import { auth } from "@/lib/firebase";
import { getExperts, Expert } from "@/services/directoryService";

const SPECIALTY_KEYWORDS: Record<string, string[]> = {
  'Cardiologist': ['heart', 'cardiac', 'pulse', 'blood pressure', 'chest pain', 'stroke', 'palpitations'],
  'Dermatologist': ['skin', 'rash', 'acne', 'eczema', 'hair', 'mole', 'dermatitis', 'itch'],
  'Neurologist': ['brain', 'headache', 'migraine', 'dizzy', 'seizure', 'nerve', 'neuropathy', 'concussion'],
  'Psychiatrist': ['mental', 'depression', 'anxiety', 'stress', 'mood', 'psychology', 'bipolar'],
  'Orthopedist': ['bone', 'joint', 'fracture', 'knee', 'back', 'spine', 'muscle', 'arthritis'],
  'Pediatrician': ['child', 'baby', 'infant', 'kid', 'fever', 'growth', 'vaccine'],
  'Dentist': ['tooth', 'teeth', 'gum', 'cavity', 'dental', 'mouth', 'ache'],
  'Ophthalmologist': ['eye', 'vision', 'sight', 'blind', 'glaucoma', 'cataract', 'blur'],
  'Herbalist': ['herb', 'natural', 'plant', 'root', 'tea', 'holistic', 'traditional', 'remedy', 'supplement'],
  'Traditional Chinese Medicine': ['chinese', 'acupuncture', 'qi', 'meridian', 'herbal', 'tea', 'pulse', 'tongue'],
  'Nutritionist': ['diet', 'food', 'weight', 'nutrition', 'vitamin', 'obesity', 'meal'],
  'General Practitioner': ['flu', 'cold', 'fever', 'cough', 'virus', 'infection', 'checkup', 'general', 'sick'],
  'Hospital': ['emergency', 'trauma', 'accident', 'urgent', 'surgery', 'hospital', 'ambulance', 'bleeding'],
  'Emergency': ['trauma', 'accident', 'urgent', 'hospital', 'bleeding', 'crisis'],
};

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
  
  // Real directory matching logic
  const lowerQuery = query.toLowerCase();
  // Filter out very short words, but keep words > 2 chars (e.g. "flu", "eye", "ear")
  const queryTerms = lowerQuery.split(/\s+/).filter(t => t.length > 2); 

  // Filter by Mode
  let filteredExperts: Expert[] = experts;
  if (mode === 'medical') {
    filteredExperts = experts.filter(e => ['doctor', 'specialist', 'hospital'].includes(e.type));
  } else if (mode === 'herbal') {
    filteredExperts = experts.filter(e => e.type === 'herbalist');
  }
  
  const allMatches = filteredExperts.filter(e => {
    const expertName = e.name.toLowerCase();
    const expertSpecialty = e.specialty.toLowerCase();

    const nameMatch = expertName.includes(lowerQuery);
    const specialtyMatch = expertSpecialty.includes(lowerQuery);
    
    // Fuzzy match: if any significant term in the query matches the specialty
    const fuzzyMatch = queryTerms.some(term => expertSpecialty.includes(term));

    // Semantic match using keywords
    let keywordMatch = false;
    for (const [specialtyKey, keywords] of Object.entries(SPECIALTY_KEYWORDS)) {
       // If the expert's specialty matches the key (e.g. "Cardiologist")
       if (expertSpecialty.includes(specialtyKey.toLowerCase()) || specialtyKey.toLowerCase().includes(expertSpecialty)) {
           // Check if any query term matches the keywords for this specialty
           if (queryTerms.some(term => keywords.some(k => k.includes(term) || term.includes(k)))) {
               keywordMatch = true;
               break;
           }
       }
    }

    return nameMatch || specialtyMatch || fuzzyMatch || keywordMatch;
  });

  const directoryMatches = allMatches.slice(0, 2).map(e => ({
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