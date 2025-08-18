/**
 * In-Memory Sliding Window Rate Limiter for Authentication & Sensitive Endpoints
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Checks if a key (e.g. email or IP) has exceeded the max allowed attempts within a window.
 * @param key Identifier (e.g. user email)
 * @param maxAttempts Max allowed attempts (default 5)
 * @param windowMs Time window in milliseconds (default 60 seconds)
 * @returns { allowed: boolean, remaining: number, retryAfterSec: number }
 */
export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    // New or expired window
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: maxAttempts - 1, retryAfterSec: 0 };
  }

  if (record.count >= maxAttempts) {
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: maxAttempts - record.count,
    retryAfterSec: 0,
  };
}

/**
 * Resets rate limit for a key upon successful login
 */
export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key);
}
