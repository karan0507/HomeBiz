/**
 * Kitchens Hooks
 */

import { useState, useEffect } from 'react';
import {
  getKitchens,
  getFeaturedKitchens,
  getKitchenBySlug,
  getKitchenById,
  searchKitchens,
  Kitchen,
  KitchenFilters
} from '@/lib/services/kitchens.service';

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

  const fetchKitchens = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getKitchens(filters);
      setKitchens(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.cuisines?.join(','), filters.dietary?.join(','), filters.neighborhood, filters.min_rating, filters.search, filters.page, filters.limit]);

  return { kitchens, loading, error, refetch: fetchKitchens };
}

/**
 * Fetch featured kitchens
 */
export function useFeaturedKitchens(limit?: number): UseKitchensResult {
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchKitchens = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFeaturedKitchens(limit);
      setKitchens(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchens();
  }, [limit]);

  return { kitchens, loading, error, refetch: fetchKitchens };
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

  const fetchKitchen = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getKitchenBySlug(slug);
      setKitchen(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return { kitchen, loading, error, refetch: fetchKitchen };
}

/**
 * Fetch single kitchen by ID
 */
export function useKitchenById(id: string): UseKitchenResult {
  const [kitchen, setKitchen] = useState<Kitchen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchKitchen = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getKitchenById(id);
      setKitchen(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchen();
  }, [id]);

  return { kitchen, loading, error, refetch: fetchKitchen };
}

/**
 * Search kitchens with query
 */
export function useKitchenSearch(searchQuery: string, filters: KitchenFilters = {}): UseKitchensResult {
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchKitchens = async () => {
    if (!searchQuery || searchQuery.length < 2) {
      setKitchens([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchKitchens(searchQuery, filters);
      setKitchens(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchKitchens();
    }, 300);

    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filters.neighborhood, filters.min_rating]);

  return { kitchens, loading, error, refetch: fetchKitchens };
}
