/**
 * Stale-While-Revalidate Cache Utility
 *
 * Features:
 * - Returns cached data immediately (fast)
 * - Revalidates in background (fresh)
 * - 75s TTL for kitchens, 60s for menu items
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  isRevalidating: boolean;
}

class StaleWhileRevalidateCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private ttl: Map<string, number> = new Map();

  /**
   * Get cached data with stale-while-revalidate strategy
   *
   * @param key Cache key
   * @param fetcher Function to fetch fresh data
   * @param ttl Time-to-live in milliseconds
   * @returns Cached or fresh data
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number
  ): Promise<T> {
    const now = Date.now();
    const cached = this.cache.get(key);

    // Fresh data within TTL → return immediately
    if (cached && (now - cached.timestamp < ttl)) {
      return cached.data;
    }

    // Stale data exists → return stale, revalidate in background
    if (cached && !cached.isRevalidating) {
      cached.isRevalidating = true;

      // Background revalidation
      fetcher()
        .then((freshData) => {
          this.cache.set(key, {
            data: freshData,
            timestamp: Date.now(),
            isRevalidating: false,
          });
        })
        .catch((err) => {
          console.error('[Cache] Background revalidation failed:', err);
          cached.isRevalidating = false;
        });

      return cached.data; // Return stale immediately
    }

    // No cache → fetch fresh (blocking)
    const freshData = await fetcher();
    this.cache.set(key, {
      data: freshData,
      timestamp: Date.now(),
      isRevalidating: false,
    });

    return freshData;
  }

  /**
   * Invalidate cache entry
   */
  invalidate(key: string) {
    this.cache.delete(key);
  }

  /**
   * Invalidate all cache entries matching pattern
   */
  invalidatePattern(pattern: string) {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear entire cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

// Singleton instance
export const cache = new StaleWhileRevalidateCache();

/**
 * Pre-configured cache helpers
 */
export const CACHE_TTL = {
  KITCHENS: 75 * 1000,      // 75 seconds
  MENU_ITEMS: 60 * 1000,    // 60 seconds
  USER_PROFILE: 120 * 1000, // 2 minutes
  STATIC_DATA: 300 * 1000,  // 5 minutes (cuisines, dietary, provinces)
};
