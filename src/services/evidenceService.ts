export interface EvidenceItem {
  title: string;
  link: string;
  snippet: string;
}

export const fetchEvidence = async (query: string): Promise<EvidenceItem[]> => {
  const apiKey = process.env.SERPER_API_KEY;

  // Fallback items to ensure the UI is never empty
  const getFallbackItems = (q: string): EvidenceItem[] => [
    {
      title: `Search "${q}" on Google`,
      link: `https://www.google.com/search?q=${encodeURIComponent(q)}`,
      snippet: "Browse top web results for this topic directly on Google."
    },
    {
      title: `Watch videos about "${q}"`,
      link: `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
      snippet: "Find educational videos and explainers on YouTube."
    },
    {
      title: `Read "${q}" on PubMed`,
      link: `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(q)}`,
      snippet: "Access scientific studies and clinical trials."
    }
  ];

  if (!apiKey) {
    console.warn("Serper API key missing, using fallback links");
    return getFallbackItems(query);
  }

  const fetchSearch = async (searchQuery: string, num: number) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: searchQuery,
          num: num
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Serper API Error (${response.status}): ${errorBody}`);
        return [];
      }

      const data = await response.json();
      
      // Serper returns "organic" for web results.
      // If we added "site:youtube.com", they might still be in "organic" or "videos".
      // We'll map "organic" generally.
      return (data.organic || []).map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet
      }));
    } catch (error) {
      console.error(`Fetch failed for query "${searchQuery}":`, error);
      return [];
    }
  };

  try {
    const [generalItems, videoItems] = await Promise.all([
      fetchSearch(query, 6),
      fetchSearch(query + ' site:youtube.com', 3)
    ]);

    const results = [...generalItems, ...videoItems];
    
    // Use fallback if no real results found
    if (results.length === 0) {
      console.log("No search results found, using fallback links");
      return getFallbackItems(query);
    }

    return results;
  } catch (error) {
    console.error("Critical error in fetchEvidence, using fallback:", error);
    return getFallbackItems(query);
  }
};
