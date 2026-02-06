import { useState, useCallback } from 'react';
import { searchHealthTopic, AIResponse } from '@/services/aiService';

export function useAIIntelligence() {
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (query: string, mode: 'medical' | 'herbal' | 'both') => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setResponse(null);

    try {
      const data = await searchHealthTopic(query, mode);
      setResponse(data);
    } catch (err: any) {
      console.error("Search hook error:", err);
      setError(err.message || "An unexpected error occurred during search.");
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  return {
    response,
    isSearching,
    error,
    performSearch,
    clearResults
  };
}
