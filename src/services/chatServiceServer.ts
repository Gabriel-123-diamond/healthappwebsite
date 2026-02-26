import { adminDb } from '@/lib/firebaseAdmin';
import { fetchEvidence } from '@/services/evidenceService';

export interface ChatContext {
  experts: any[];
  evidence: any[];
  contextString: string;
}

/**
 * simple regex-based intent detection
 */
export function detectIntent(query: string) {
  const isExpertQuery = /doctor|specialist|herbalist|clinic|hospital|find|search|contact|expert/i.test(query);
  const isResearchQuery = query.length > 10 && !isExpertQuery; // Heuristic: Long queries usually need info
  return { isExpertQuery, isResearchQuery };
}

/**
 * Fetches relevant context (Experts + Web Evidence) for the chat RAG.
 */
export async function getChatContext(query: string, lastMessageContent: string): Promise<ChatContext> {
  const { isExpertQuery, isResearchQuery } = detectIntent(query);
  
  const promises = [];
  
  // 1. Fetch Experts via Admin SDK
  if (isExpertQuery) {
    promises.push(fetchExpertsAdmin(query));
  } else {
    promises.push(Promise.resolve([]));
  }

  // 2. Fetch Evidence via Serper
  if (isResearchQuery) {
    promises.push(fetchEvidence(lastMessageContent));
  } else {
    promises.push(Promise.resolve([]));
  }

  const [experts, evidence] = await Promise.all(promises);

  // 3. Build Context String for AI
  let contextString = "";
  if (experts && experts.length > 0) {
    contextString += `
FOUND EXPERTS:
${JSON.stringify(experts.map((e: any) => ({ name: e.name, specialty: e.specialty, location: e.location })))}`;
  }
  if (evidence && evidence.length > 0) {
    contextString += `
FOUND RESEARCH:
${evidence.slice(0, 3).map((e: any) => `- ${e.title} (${e.link})`).join('\n')}`;
  }

  return { experts: experts || [], evidence: evidence || [], contextString };
}

/**
 * Helper to fetch experts via Admin SDK
 */
async function fetchExpertsAdmin(query: string) {
  try {
    const expertsRef = adminDb.collection('experts');
    const snapshot = await expertsRef.limit(20).get();
    
    // Naive client-side filtering (Firestore full-text search limitation)
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as any))
      .filter(expert => {
         const text = JSON.stringify(expert).toLowerCase();
         const terms = query.split(/\s+/).filter(t => t.length > 3);
         return terms.some(term => text.includes(term));
      })
      .slice(0, 3);
  } catch (e) {
    console.error("Expert fetch failed:", e);
    return [];
  }
}
