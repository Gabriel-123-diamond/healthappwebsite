export interface EvidenceItem {
  title: string;
  link: string;
  snippet: string;
}

export const fetchEvidence = async (query: string): Promise<EvidenceItem[]> => {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_CX;

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

  if (!apiKey || !cx) {
    console.warn("Google Search API keys missing, using fallback links");
    return getFallbackItems(query);
  }

  const fetchSearch = async (searchQuery: string, num: number) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased timeout

      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(searchQuery)}&num=${num}`;
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Google Search API Error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      return (data.items || []).map((item: any) => ({
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
      fetchSearch(query, 3),
      fetchSearch(query + ' site:youtube.com', 2)
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
