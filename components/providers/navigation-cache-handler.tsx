'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { clearApiCache } from '@/lib/services/api.client';
import { clearDataCache } from '@/lib/services/data.service';

/**
 * Global component to handle API cache lifecycle
 * Clears the deduplication cache when navigating between pages
 */
export function NavigationCacheHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Clear concurrent request cache and static data cache whenever the route changes
    // This ensures that navigating to a new page doesn't reuse stale 
    // in-flight requests or cached data from the previous page context.
    clearApiCache();
    clearDataCache();
    
    // As a senior detail: we also log the transition to audit API traffic
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache Handler] Navigation to ${pathname} - API cache cleared`);
    }
  }, [pathname]);

  return null;
}
