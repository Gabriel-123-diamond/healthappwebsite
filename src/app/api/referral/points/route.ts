import { NextResponse } from 'next/server';

/**
 * Publicly exposes the reward points value from the server-side environment.
 * This avoids hardcoding in the frontend while keeping the secret safe.
 */
export async function GET() {
  const rewardPoints = parseInt(process.env.REWARD_POINTS || '150', 10);
  return NextResponse.json({ points: rewardPoints });
}
