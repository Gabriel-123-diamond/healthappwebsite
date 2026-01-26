export interface EvidenceItem {
  title: string;
  link: string;
  snippet: string;
}

export const fetchEvidence = async (query: string): Promise<EvidenceItem[]> => {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_CX;

  if (!apiKey || !cx) {
    console.warn("Google Search API keys missing, skipping evidence fetch");
    return [];
  }

  const fetchSearch = async (searchQuery: string, num: number) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout per request

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

    return [...generalItems, ...videoItems];
  } catch (error) {
    console.error("Critical error in fetchEvidence:", error);
    return [];
  }
};
