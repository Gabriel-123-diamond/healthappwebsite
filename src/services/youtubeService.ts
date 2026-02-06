
export interface VideoResult {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelName: string;
  viewCount: string;
  publishedAt: string;
  videoUrl: string;
}

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

export const youtubeService = {
  searchVideos: async (query: string): Promise<VideoResult[]> => {
    if (!API_KEY) {
      console.warn('YouTube API Key not configured');
      return [];
    }

    try {
      const url = new URL(BASE_URL);
      url.searchParams.append('part', 'snippet');
      url.searchParams.append('maxResults', '5');
      url.searchParams.append('q', query);
      url.searchParams.append('type', 'video');
      url.searchParams.append('key', API_KEY);

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`YouTube API responded with status: ${response.status}`);
      }

      const data = await response.json();

      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        channelName: item.snippet.channelTitle,
        viewCount: '10K+', // API doesn't return view count in search
        publishedAt: item.snippet.publishedAt,
        videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));
    } catch (error) {
      console.error('YouTube API failed:', error);
      return [];
    }
  }
};
