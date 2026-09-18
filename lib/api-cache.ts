// lib/api-cache.ts
// High-performance in-memory client-side cache and prefetching engine

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const activeFetches = new Map<string, Promise<any>>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds fresh TTL

/**
 * Fetch data with memory caching & background revalidation
 * Returns instant 0ms cached data if available.
 */
export async function fetchWithCache<T = any>(
  url: string,
  options: RequestInit = {},
  ttlMs = CACHE_TTL_MS
): Promise<T> {
  const cacheKey = `${options.method || 'GET'}:${url}`;

  // Return cached entry if fresh
  const cached = memoryCache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < ttlMs) {
    return cached.data as T;
  }

  // Deduplicate inflight requests to same URL
  if (activeFetches.has(cacheKey)) {
    return activeFetches.get(cacheKey)! as Promise<T>;
  }

  const fetchPromise = (async () => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch ${url}`);
      const data = await res.json();
      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } finally {
      activeFetches.delete(cacheKey);
    }
  })();

  activeFetches.set(cacheKey, fetchPromise);
  return fetchPromise as Promise<T>;
}

/**
 * Preload API endpoint into cache on link hover
 */
export function preloadApi(url: string): void {
  if (typeof window === 'undefined') return;
  const cacheKey = `GET:${url}`;
  if (memoryCache.has(cacheKey) || activeFetches.has(cacheKey)) return;

  fetchWithCache(url, { method: 'GET' }).catch(() => {
    // Silently ignore background preload failures
  });
}

/**
 * Invalidate cache on mutations (creates, updates, deletes)
 */
export function invalidateApiCache(urlPrefix?: string): void {
  if (!urlPrefix) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.includes(urlPrefix)) {
      memoryCache.delete(key);
    }
  }
}
