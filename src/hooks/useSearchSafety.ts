import { useState, useEffect } from 'react';
import { checkSafety, SafetyCheckResult } from '@/services/safetyClientService';

export function useSearchSafety(query: string) {
  const [safetyResult, setSafetyResult] = useState<SafetyCheckResult | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim()) {
        const result = await checkSafety(query);
        setSafetyResult(result);
      } else {
        setSafetyResult(null);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return safetyResult;
}
