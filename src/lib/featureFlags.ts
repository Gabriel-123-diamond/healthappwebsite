import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Checks if a specific feature flag is enabled for a user.
 * Reads from a centralized system_config collection, with default fallbacks.
 */
export async function checkFeatureFlag(flagId: string, userTier: string = 'basic', userRole: string = 'user'): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, 'system_config', 'feature_flags'));
    if (snap.exists() && snap.data()[flagId]) {
      const config = snap.data()[flagId];
      if (config.enabled === false) return false;
      if (config.allowedRoles?.includes(userRole)) return true;
      if (config.allowedTiers?.includes(userTier)) return true;
      return false;
    }
    
    // Fallback default rules if Remote config is missing
    if (flagId === 'beta_access') {
      return ['admin', 'expert', 'doctor', 'wellness_practitioner', 'hospital'].includes(userRole) || 
             ['vip1', 'vip2', 'premium', 'professional'].includes(userTier);
    }
    
    return false;
  } catch (error) {
    console.warn(`Error checking feature flag ${flagId}:`, error);
    // Hardcoded safety fallback
    if (flagId === 'beta_access') {
      return ['admin', 'expert', 'doctor', 'wellness_practitioner'].includes(userRole) || 
             ['vip1', 'vip2', 'premium', 'professional'].includes(userTier);
    }
    return false;
  }
}
