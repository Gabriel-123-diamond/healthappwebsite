import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { checkSafetyServer } from "@/lib/safetyServer";
import { rateLimiter } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    let uid: string | null = null;
    
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split("Bearer ")[1];
      try {
        const decoded = await adminAuth.verifyIdToken(token);
        uid = decoded.uid;
      } catch (e) {
        console.warn("[API Safety] Invalid token provided");
      }
    }

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(',')[0] : "unknown";
    const identifier = uid || `guest_safety_${ip}`;

    // Rate Limit: 30 requests per minute
    const rateCheck = rateLimiter.isAllowed(identifier, 30, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const query = body.query;
    const result = await checkSafetyServer(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Safety Check Error:", error);
    return NextResponse.json({ 
      isSafe: false, 
      hasRedFlag: false,
      error: "Safety verification service unavailable" 
    }, { status: 500 });
  }
}
