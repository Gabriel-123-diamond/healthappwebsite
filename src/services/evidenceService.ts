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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    // Fetch in parallel
    const [generalResponse, videoResponse] = await Promise.all([
      fetch(
        `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=3`,
        { signal: controller.signal }
      ),
      fetch(
        `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query + ' site:youtube.com')}&num=2`,
        { signal: controller.signal }
      )
    ]);

    clearTimeout(timeoutId);

    const [generalData, videoData] = await Promise.all([
      generalResponse.json(),
      videoResponse.json()
    ]);
    
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

    return [...generalItems, ...videoItems];
  } catch (error) {
    console.error("Error fetching evidence:", error);
    return [];
  }
};
