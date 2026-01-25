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

  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=3`
    );

    if (!response.ok) {
      throw new Error(`Search API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return (data.items || []).map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet
    }));
  } catch (error) {
    console.error("Error fetching evidence:", error);
    return [];
  }
};
