import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';

/**
 * Verifies the Firebase ID token from the Authorization header.
 * Returns the decoded token or a NextResponse error if verification fails.
 */
export async function verifyAuth(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return { decodedToken };
  } catch (e) {
    console.error("Auth verification failed:", e);
    return { error: NextResponse.json({ error: "Invalid session" }, { status: 401 }) };
  }
}

/**
 * Automatically detects the environment and returns the correct base URL.
 */
export function getBaseUrl() {
  // 1. Local Development
  if (process.env.NODE_ENV === 'development') {
    return "http://localhost:3000";
  }

  // 2. Vercel Preview/Branch Deploys
  if (process.env.VERCEL_URL && process.env.VERCEL_ENV === 'preview') {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3. Production (Custom Domain)
  return "https://www.ikikehealth.com";
}

/**
 * Standardized error response for AI operations.
 */
export function handleAIError(error: any, feature: string) {
  console.error(`${feature} API Error:`, error);
  return NextResponse.json({ 
    error: `Failed to generate ${feature} response.`,
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  }, { status: 500 });
}
