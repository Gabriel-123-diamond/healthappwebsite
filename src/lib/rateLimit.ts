import { NextRequest } from 'next/server';

/**
 * Simple in-memory rate limiter for serverless functions.
 * Note: Resets on cold starts.
 */
const counters = new Map<string, { count: number; firstAttempt: number }>();

export const rateLimiter = {
  /**
   * Basic Rate Limiting check
   * @param key Unique key (e.g., UID or IP)
   * @param limit Max attempts allowed in window
   * @param windowMs Window size in milliseconds
   */
  isAllowed: (key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number } => {
    const now = Date.now();
    const record = counters.get(key);

    if (!record) {
      counters.set(key, { count: 1, firstAttempt: now });
      return { allowed: true, remaining: limit - 1 };
    }

    if (now - record.firstAttempt > windowMs) {
      // Reset window
      counters.set(key, { count: 1, firstAttempt: now });
      return { allowed: true, remaining: limit - 1 };
    }

    if (record.count >= limit) {
      return { allowed: false, remaining: 0 };
    }

    record.count += 1;
    return { allowed: true, remaining: limit - record.count };
  }
};
