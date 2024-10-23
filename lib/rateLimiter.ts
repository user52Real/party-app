import { LRUCache } from 'lru-cache';
import { NextResponse } from 'next/server';

const rateLimit = new LRUCache({
  max: 500,
  ttl: 60_000, // 1 minute
});

export default async function rateLimiter(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';
  const tokenCount = rateLimit.get(ip) || 0;

  if (typeof tokenCount === 'number' && tokenCount > 10) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later.' },
      { status: 429 }
    );
  }

  rateLimit.set(ip, (typeof tokenCount === 'number' ? tokenCount : 0) + 1);
  return null;
}