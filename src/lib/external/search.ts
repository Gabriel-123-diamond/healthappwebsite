"use server";

import "server-only";

const YOUTUBE_API_KEY = process.env.GOOGLE_YOUTUBE_API_KEY;
const SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const SEARCH_CX = process.env.GOOGLE_SEARCH_CX;

export interface SourceResult {
  title: string;
  url: string;
  type: "video" | "article";
  snippet?: string;
  thumbnail?: string;
}

/**
 * Fetches relevant videos from YouTube
 */
export async function fetchYouTubeVideos(query: string, count: number = 2): Promise<SourceResult[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn("YouTube API Key is missing");
    return [];
  }

  const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${count}&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`;

  try {
    const res = await fetch(endpoint, { next: { revalidate: 3600 } }); // Cache for 1 hour
    const data = await res.json();

    if (!data.items) return [];

    return data.items.map((item: any) => ({
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      type: "video",
      snippet: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.medium?.url,
    }));
  } catch (error) {
    console.error("YouTube Fetch Error:", error);
    return [];
  }
}

/**
 * Fetches trusted articles using Google Custom Search JSON API
 */
export async function fetchGoogleArticles(query: string, count: number = 2): Promise<SourceResult[]> {
  if (!SEARCH_API_KEY || !SEARCH_CX) {
    console.warn("Google Search API Key or CX ID is missing");
    return [];
  }

  const endpoint = `https://www.googleapis.com/customsearch/v1?key=${SEARCH_API_KEY}&cx=${SEARCH_CX}&q=${encodeURIComponent(query)}&num=${count}`;

  try {
    const res = await fetch(endpoint, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (!data.items) return [];

    return data.items.map((item: any) => ({
      title: item.title,
      url: item.link,
      type: "article",
      snippet: item.snippet,
    }));
  } catch (error) {
    console.error("Google Search Error:", error);
    return [];
  }
}
