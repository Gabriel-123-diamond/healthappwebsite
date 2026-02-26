import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { checkSafetyServer } from "@/lib/safetyServer";

const rateLimitMap = new Map<string, { count: number, lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 30;

function isRateLimited(uid: string): boolean {
  const now = Date.now();
  const userData = rateLimitMap.get(uid) || { count: 0, lastReset: now };
  if (now - userData.lastReset > RATE_LIMIT_WINDOW) {
    userData.count = 1;
    userData.lastReset = now;
    rateLimitMap.set(uid, userData);
    return false;
  }
  userData.count++;
  rateLimitMap.set(uid, userData);
  return userData.count > MAX_REQUESTS;
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    let uid: string;
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
    } catch (e) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if (isRateLimited(uid)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const { query } = await req.json();
    const result = await checkSafetyServer(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Safety Check Error:", error);
    // Fail-closed: If the safety check itself fails, we cannot guarantee safety.
    // We return a neutral/error state so the client doesn't proceed under false confidence.
    return NextResponse.json({ 
      isSafe: false, 
      hasRedFlag: false,
      error: "Safety verification service unavailable" 
    }, { status: 500 });
  }
}
