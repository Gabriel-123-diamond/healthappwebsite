import axios from 'axios';

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
      const response = await axios.get(BASE_URL, {
        params: {
          part: 'snippet',
          maxResults: 5,
          q: query,
          type: 'video',
          key: API_KEY,
        },
      });

      return response.data.items.map((item: any) => ({
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
