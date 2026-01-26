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
    // 1. Fetch General Articles
    const generalResponse = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=3`
    );

    // 2. Fetch YouTube Videos specifically
    const videoResponse = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query + ' site:youtube.com')}&num=2`
    );

    const generalData = await generalResponse.json();
    const videoData = await videoResponse.json();
    
    const generalItems = (generalData.items || []).map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet
    }));

    const videoItems = (videoData.items || []).map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet
    }));

    // Merge and return
    return [...generalItems, ...videoItems];
  } catch (error) {
    console.error("Error fetching evidence:", error);
    return [];
  }
};
