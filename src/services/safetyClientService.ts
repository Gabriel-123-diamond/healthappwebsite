export interface SafetyCheckResult {
  isSafe: boolean;
  hasRedFlag: boolean;
  redFlagType?: string;
  message?: string;
  action?: string;
}

/**
 * Client-side safety check that calls our internal API.
 * This avoids importing firebase-admin in the browser.
 */
export const checkSafety = async (query: string): Promise<SafetyCheckResult> => {
  if (!query.trim()) return { isSafe: true, hasRedFlag: false };

  try {
    const res = await fetch('/api/safety/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    
    if (!res.ok) throw new Error('Safety check API failed');
    
    return await res.json();
  } catch (error) {
    console.error("Client Safety Check Error (using safe fallback):", error);
    // Return a safe default if API fails
    return { isSafe: true, hasRedFlag: false };
  }
};