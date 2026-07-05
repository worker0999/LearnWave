interface RateLimitRecord {
  timestamps: number[];
}

const cache = new Map<string, RateLimitRecord>();

/**
 * Simple in-memory sliding window rate limiter.
 * NOTE: A persistent store like Upstash or Redis should replace this in production.
 */
export function isRateLimited(
  key: string,
  limit = 5,
  windowMs = 60 * 1000
): boolean {
  const now = Date.now();
  const record = cache.get(key) || { timestamps: [] };

  // Remove timestamps outside the sliding window
  record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    return true;
  }

  record.timestamps.push(now);
  cache.set(key, record);
  return false;
}
