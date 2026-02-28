/**
 * useInfiniteScroll — IntersectionObserver-based infinite scroll hook.
 *
 * Guarantees:
 *  - No infinite loop: observer is disconnected the moment hasMore becomes false.
 *  - No concurrent requests: `isLoading` guard prevents double-firing.
 *  - Upward scroll: all rendered items stay in DOM — native browser scroll up works out of the box.
 *
 * Usage:
 *   const sentinelRef = useInfiniteScroll({ hasMore, isLoading, onLoadMore });
 *   // Attach sentinelRef to a <div> placed after your list.
 */

import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
    /** Are there more pages to load? Set to false when last batch < per_page */
    hasMore: boolean;
    /** Is a fetch currently in-flight? Prevents concurrent loads */
    isLoading: boolean;
    /** Called exactly once per intersection when hasMore && !isLoading */
    onLoadMore: () => void;
    /** How much of the sentinel must be visible before firing (default 0.1 = 10%) */
    threshold?: number;
    /** Extra root margin to pre-load before sentinel is fully visible (default '100px') */
    rootMargin?: string;
}

export function useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore,
    threshold = 0.1,
    rootMargin = '100px',
}: UseInfiniteScrollOptions) {
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    // Stable ref to the latest callback — avoids re-creating the observer on every render
    const onLoadMoreRef = useRef(onLoadMore);
    useEffect(() => { onLoadMoreRef.current = onLoadMore; }, [onLoadMore]);

    // Stable ref for latest guard values
    const guardRef = useRef({ hasMore, isLoading });
    useEffect(() => { guardRef.current = { hasMore, isLoading }; }, [hasMore, isLoading]);

    const handleIntersection = useCallback(
        (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            const entry = entries[0];
            if (!entry?.isIntersecting) return;

            const { hasMore: hm, isLoading: il } = guardRef.current;
            // Stop condition — disconnect immediately, no more callbacks ever
            if (!hm) {
                observer.disconnect();
                return;
            }
            // Loading guard — don't pile on concurrent requests
            if (il) return;

            onLoadMoreRef.current();
        },
        [] // stable — uses refs only
    );

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        // Don't observe at all when there's nothing more to load
        if (!hasMore) return;

        const observer = new IntersectionObserver(handleIntersection, {
            threshold,
            rootMargin,
        });

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
        // Re-create observer when hasMore flips (e.g. filter reset re-enables it)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMore, threshold, rootMargin, handleIntersection]);

    return sentinelRef;
}
