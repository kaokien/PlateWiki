import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple in-memory sliding-window rate limiter.
 *
 * On Vercel serverless, each cold-start gets a fresh Map, so this is
 * per-instance only. It catches rapid-fire abuse from a single instance
 * but won't enforce global limits across concurrent lambdas.
 *
 * For stricter enforcement at scale, swap to Upstash Redis.
 */

interface RateWindow {
  count: number;
  resetAt: number;
}

const windows = new Map<string, RateWindow>();

// Cleanup stale entries every 60s to prevent memory leak
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, window] of windows) {
    if (window.resetAt < now) windows.delete(key);
  }
}

/**
 * Check rate limit for a given key (userId or IP).
 * @returns null if allowed, or a NextResponse 429 if rate limited.
 */
export function rateLimit(
  key: string,
  { maxRequests = 10, windowMs = 60_000 }: { maxRequests?: number; windowMs?: number } = {}
): NextResponse | null {
  cleanup();
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt < now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  existing.count++;
  if (existing.count > maxRequests) {
    const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      }
    );
  }

  return null;
}

/**
 * Extract a rate limit key from request: prefer userId, fall back to IP.
 */
export function getRateLimitKey(req: NextRequest, userId?: string | null): string {
  if (userId) return `user:${userId}`;
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  return `ip:${ip}`;
}
