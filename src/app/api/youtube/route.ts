import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  try {
    // 1. Auth Check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    try {
      await adminAuth.verifyIdToken(token);
    } catch (e) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // 2. Proxy request to YouTube
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const maxResults = searchParams.get("maxResults") || "5";
    
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "YouTube API not configured" }, { status: 500 });
    }

    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`;
    
    const response = await fetch(youtubeUrl);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: "YouTube API Error", details: data }, { status: response.status });
    }

    // Map to our internal format to keep data clean
    const videos = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      channelName: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

    return NextResponse.json({ videos });

  } catch (error: any) {
    console.error("YouTube Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
