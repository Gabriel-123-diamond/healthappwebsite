import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import { adminAuth } from "@/lib/firebaseAdmin";
import { rateLimiter } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    let uid: string | null = null;
    
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split("Bearer ")[1];
      try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        uid = decodedToken.uid;
      } catch (error) {
        console.warn("[API Chat] Invalid token provided");
      }
    }

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(',')[0] : "unknown";
    const identifier = uid || `guest_${ip}`;

    // Rate Limit: 15 messages per minute
    const rateCheck = rateLimiter.isAllowed(identifier, 15, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Messaging rate limit exceeded. Please wait." }, { status: 429 });
    }

    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const model = getGeminiModel();
    const chat = model.startChat({
      history: history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = (response as any).text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
