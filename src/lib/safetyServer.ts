import { adminDb } from "@/lib/firebaseAdmin";

export interface SafetyCheckResult {
  isSafe: boolean;
  hasRedFlag: boolean;
  redFlagType?: string;
  message?: string;
  action?: string;
}

const DEFAULT_RED_FLAGS = [
  {
    keywords: ['chest pain', 'heart attack', 'cardiac arrest', 'crushing chest'],
    type: 'Cardiovascular Emergency',
    message: 'Your query indicates a potential heart-related emergency.',
    action: 'Call emergency services (911) immediately.'
  },
  {
    keywords: ['suicide', 'kill myself', 'end my life', 'want to die'],
    type: 'Mental Health Crisis',
    message: 'You are not alone. Help is available.',
    action: 'Call or text 988 (Suicide & Crisis Lifeline) or go to the nearest ER.'
  }
];

/**
 * Server-side safety check using Admin SDK.
 */
export const checkSafetyServer = async (query: string): Promise<SafetyCheckResult> => {
  if (!query) return { isSafe: true, hasRedFlag: false };

  const normalizedQuery = query.toLowerCase();

  // Try to get from Firestore Admin
  try {
    const docSnap = await adminDb.collection('safety_config').doc('default').get();
    if (docSnap.exists) {
      const data = docSnap.data();
      const crisisKeywords = (data?.crisisKeywords || []) as string[];
      const emergencyKeywords = (data?.emergencyKeywords || []) as string[];

      if (crisisKeywords.some(k => normalizedQuery.includes(k.toLowerCase()))) {
        return {
          isSafe: false,
          hasRedFlag: true,
          redFlagType: 'Crisis Alert',
          message: 'If you or someone you know is in immediate danger, please call emergency services.',
          action: 'Call or text 988 or go to the nearest ER.'
        };
      }
      if (emergencyKeywords.some(k => normalizedQuery.includes(k.toLowerCase()))) {
        return {
          isSafe: false,
          hasRedFlag: true,
          redFlagType: 'Medical Emergency',
          message: 'Potential medical emergency detected.',
          action: 'Call emergency services immediately.'
        };
      }
    }
  } catch (e) {
    console.error("Server Safety Check - DB Error:", e);
  }

  // Local Fallback
  for (const flag of DEFAULT_RED_FLAGS) {
    if (flag.keywords.some(keyword => normalizedQuery.includes(keyword))) {
      return {
        isSafe: false,
        hasRedFlag: true,
        redFlagType: flag.type,
        message: flag.message,
        action: flag.action
      };
    }
  }

  return { isSafe: true, hasRedFlag: false };
};
