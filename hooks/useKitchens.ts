/**
 * Kitchens Hooks
 */

import { useState, useEffect, useRef } from 'react';
import {
  getKitchens,
  getFeaturedKitchens,
  getKitchenBySlug,
  getKitchenById,
  searchKitchens,
} from '@/lib/services/kitchens.service';
import { Kitchen, KitchenFilters } from '@/types/database';
import { showError } from '@/lib/notifications';
import { APIError } from '@/lib/services/api.client';

interface UseKitchensResult {
  kitchens: Kitchen[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Fetch kitchens with filters
 */
export function useKitchens(filters: KitchenFilters = {}): UseKitchensResult {
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchKitchens = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getKitchens(filters, signal);
      setKitchens(data);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err as Error);
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchKitchens(controller.signal);

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.cuisines?.join(','),
    filters.dietary?.join(','),
    filters.neighborhood,
    filters.min_rating,
    filters.query,
    filters.page,
    filters.per_page,
    filters.lat,
    filters.lon,
    filters.radius
  ]);

  return { kitchens, loading, error, refetch: () => fetchKitchens() };
}

/**
 * Fetch featured kitchens
 * Note: Uses useRef to prevent duplicate calls in React Strict Mode (development)
 */
export function useFeaturedKitchens(limit?: number): UseKitchensResult {
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const hasFetched = useRef(false);

  const fetchKitchens = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFeaturedKitchens(limit, signal);
      setKitchens(data);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      const error = err as Error;
      setError(error);
      if (error instanceof APIError && error.code !== 'NETWORK_ERROR' && error.code !== 'NOT_FOUND') {
        showError(error);
      }
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Prevent duplicate calls in React Strict Mode (development only)
    if (hasFetched.current) return;
    hasFetched.current = true;

    const controller = new AbortController();
    fetchKitchens(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  return { kitchens, loading, error, refetch: () => fetchKitchens() };
}

interface UseKitchenResult {
  kitchen: Kitchen | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Fetch single kitchen by slug
 */
export function useKitchen(slug: string): UseKitchenResult {
  const [kitchen, setKitchen] = useState<Kitchen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchKitchen = async (signal?: AbortSignal) => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getKitchenBySlug(slug, signal);
      setKitchen(data);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err as Error);
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchKitchen(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return { kitchen, loading, error, refetch: () => fetchKitchen() };
}

/**
 * Fetch single kitchen by ID
 */
export function useKitchenById(id: string): UseKitchenResult {
  const [kitchen, setKitchen] = useState<Kitchen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchKitchen = async (signal?: AbortSignal) => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getKitchenById(id, signal);
      setKitchen(data);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err as Error);
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchKitchen(controller.signal);
    return () => controller.abort();
  }, [id]);

  return { kitchen, loading, error, refetch: () => fetchKitchen() };
}

/**
 * Search kitchens with query
 */
export function useKitchenSearch(searchQuery: string, filters: KitchenFilters = {}): UseKitchensResult {
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchKitchens = async (signal?: AbortSignal) => {
    if (!searchQuery || searchQuery.length < 2) {
      setKitchens([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchKitchens(searchQuery, filters, signal);
      setKitchens(data);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err as Error);
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const debounce = setTimeout(() => {
      fetchKitchens(controller.signal);
    }, 300);

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filters.neighborhood, filters.min_rating]);

  return { kitchens, loading, error, refetch: () => fetchKitchens() };
}
