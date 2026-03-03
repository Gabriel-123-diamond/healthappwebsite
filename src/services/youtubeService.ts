import { auth } from '@/lib/firebase';

export interface VideoResult {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelName: string;
  viewCount: string;
  publishedAt: string;
  videoUrl: string;
}

export const youtubeService = {
  searchVideos: async (query: string): Promise<VideoResult[]> => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn('User must be authenticated to search videos');
        return [];
      }
      
      const token = await user.getIdToken();
      const url = new URL('/api/youtube', window.location.origin);
      url.searchParams.append('q', query);
      url.searchParams.append('maxResults', '5');

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Backend YouTube API responded with status: ${response.status}`);
      }

      const data = await response.json();
      return data.videos;
    } catch (error) {
      console.error('Backend YouTube API failed:', error);
      return [];
    }
  }
};
