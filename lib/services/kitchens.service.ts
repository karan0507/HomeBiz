/**
 * Kitchens Service
 * Calls backend API for kitchen operations
 */

import { fetchAPI } from './api.client';
import { cache, CACHE_TTL } from '@/lib/cache-utils';
import type { Kitchen, KitchenWithOwner, KitchenFilters, KitchenInput } from '@/types/database';

export type { Kitchen, KitchenWithOwner, KitchenFilters, KitchenInput };

interface ApiKitchen {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  phone: string;
  email: string | null;
  neighborhood: string;
  city: string;
  province: string;
  postal_code: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  rating: number;
  review_count: number;
  is_active: boolean;
  verification_status: 'pending' | 'approved' | 'rejected' | 'suspended';
  accepting_orders: boolean;
  logo_url: string | null;
  cover_image_url: string | null;
  minimum_order: number;
  prep_time_min: number;
  prep_time_max: number;
  total_orders: number;
  created_at: string;
  updated_at: string;
  cuisine_types?: any[];
  dietary_options?: any[];
}

/**
 * Helper to map database kitchen to frontend kitchen type
 */
function mapKitchen(k: ApiKitchen): Kitchen {
  const mapJoinedItems = (items: any[] | undefined) => {
    if (!items || !Array.isArray(items)) return [];
    return items.map((item: any) => {
      if (item && typeof item === 'object' && 'name' in item) return item.name;
      return String(item);
    });
  };

  return {
    id: k.id,
    owner_id: k.owner_id,
    name: k.name,
    slug: k.slug,
    description: k.description ?? undefined,
    short_description: k.short_description ?? undefined,
    phone: k.phone,
    email: k.email ?? undefined,
    neighborhood: k.neighborhood,
    city: k.city,
    province: k.province,
    postal_code: k.postal_code ?? undefined,
    postalCode: k.postal_code ?? undefined,
    address: k.address ?? undefined,
    latitude: k.latitude,
    longitude: k.longitude,
    rating: Number(k.rating || 0),
    review_count: k.review_count,
    reviewCount: k.review_count,
    is_active: k.is_active,
    isActive: k.is_active,
    verification_status: k.verification_status,
    is_verified: k.verification_status === 'approved',
    isVerified: k.verification_status === 'approved',
    accepting_orders: k.accepting_orders,
    acceptingOrders: k.accepting_orders,
    logo_url: k.logo_url ?? undefined,
    logoUrl: k.logo_url ?? undefined,
    cover_image_url: k.cover_image_url ?? undefined,
    coverImageUrl: k.cover_image_url ?? undefined,
    minimum_order: k.minimum_order,
    minimumOrder: k.minimum_order,
    prep_time_min: k.prep_time_min,
    prepTimeMin: k.prep_time_min,
    prep_time_max: k.prep_time_max,
    prepTimeMax: k.prep_time_max,
    preparationTime: k.prep_time_min ? `${k.prep_time_min}-${k.prep_time_max} mins` : undefined,
    total_orders: k.total_orders,
    totalOrders: k.total_orders,
    created_at: k.created_at,
    createdAt: k.created_at,
    updated_at: k.updated_at,
    updatedAt: k.updated_at,
    cuisineTypes: mapJoinedItems(k.cuisine_types),
    dietaryOptions: mapJoinedItems(k.dietary_options),
    is_featured: false,
    delivery_available: true,
    pickup_available: true,
    preparation_time: k.prep_time_min ? `${k.prep_time_min}-${k.prep_time_max} mins` : '',
  };
}

/**
 * Get all approved kitchens with filters
 * NOTE: cuisines/dietary filters must be UUID arrays
 */
export async function getKitchens(filters: KitchenFilters = {}, signal?: AbortSignal): Promise<Kitchen[]> {
  const params = new URLSearchParams();

  if (filters.cuisines?.length) params.append('cuisines', filters.cuisines.join(','));
  if (filters.dietary?.length) params.append('dietary', filters.dietary.join(','));
  if (filters.neighborhood) params.append('neighborhood', filters.neighborhood);
  if (filters.min_rating) params.append('min_rating', filters.min_rating.toString());
  if (filters.query) params.append('query', filters.query);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.per_page) params.append('per_page', filters.per_page.toString());
  if (filters.lat !== undefined) params.append('lat', filters.lat.toString());
  if (filters.lon !== undefined) params.append('lon', filters.lon.toString());
  if (filters.radius !== undefined) params.append('radius', filters.radius.toString());
  if (filters.sort) params.append('sort', filters.sort);

  const kitchens = await fetchAPI<ApiKitchen[]>(`/kitchens?${params.toString()}`, { signal });
  return kitchens.map(mapKitchen);
}

/**
 * Get kitchen by slug
 */
export async function getKitchenBySlug(slug: string, signal?: AbortSignal): Promise<Kitchen | null> {
  try {
    const kitchen = await fetchAPI<ApiKitchen>(`/kitchens/${slug}`, { signal });
    return mapKitchen(kitchen);
  } catch {
    return null;
  }
}

/**
 * Get kitchen by ID
 */
export async function getKitchenById(id: string, signal?: AbortSignal): Promise<Kitchen | null> {
  try {
    const kitchen = await fetchAPI<ApiKitchen>(`/kitchens/${id}`, { signal });
    return mapKitchen(kitchen);
  } catch {
    return null;
  }
}

/**
 * Get featured kitchens
 */
export async function getFeaturedKitchens(limit: number = 6, signal?: AbortSignal): Promise<Kitchen[]> {
  const kitchens = await fetchAPI<ApiKitchen[]>(`/kitchens?featured=true&per_page=${limit}`, { signal });
  return kitchens.map(mapKitchen);
}

/**
 * Get current user's kitchen (business owner)
 */
export async function getMyKitchen(): Promise<Kitchen | null> {
  try {
    const kitchen = await fetchAPI<ApiKitchen>(`/business/kitchen`);
    return mapKitchen(kitchen);
  } catch {
    return null;
  }
}

/**
 * Create kitchen (during signup)
 * NOTE: Must send cuisine_type_ids and dietary_option_ids as UUID arrays
 */
export async function createKitchen(input: KitchenInput): Promise<Kitchen> {
  const kitchen = await fetchAPI<ApiKitchen>('/kitchens', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return mapKitchen(kitchen);
}

/**
 * Update kitchen
 * NOTE: cuisine_type_ids and dietary_option_ids must be UUID arrays
 */
export async function updateKitchen(id: string, updates: KitchenInput): Promise<Kitchen> {
  const kitchen = await fetchAPI<ApiKitchen>(`/kitchens/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  return mapKitchen(kitchen);
}

/**
 * Update current user's kitchen (business owner)
 */
export async function updateMyKitchen(updates: KitchenInput): Promise<Kitchen> {
  const kitchen = await fetchAPI<ApiKitchen>(`/business/kitchen`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  return mapKitchen(kitchen);
}

/**
 * Delete kitchen
 */
export async function deleteKitchen(id: string): Promise<void> {
  await fetchAPI(`/kitchens/${id}`, { method: 'DELETE' });
}

/**
 * Get kitchen operating hours
 */
export async function getKitchenHours(kitchenId: string) {
  return fetchAPI(`/kitchens/${kitchenId}/hours`);
}

/**
 * Search kitchens
 */
export async function searchKitchens(searchQuery: string, filters: KitchenFilters = {}, signal?: AbortSignal): Promise<Kitchen[]> {
  return getKitchens({ ...filters, query: searchQuery }, signal);
}

/**
 * =========================================
 * CACHED VERSIONS (Stale-While-Revalidate)
 * =========================================
 * Use these for better performance with automatic background refresh
 */

/**
 * Get kitchens with 75s stale-while-revalidate cache
 * Returns cached data immediately, refreshes in background
 */
export async function getCachedKitchens(filters: KitchenFilters = {}): Promise<Kitchen[]> {
  const cacheKey = `kitchens:${JSON.stringify(filters)}`;
  return cache.get(cacheKey, () => getKitchens(filters), CACHE_TTL.KITCHENS);
}

/**
 * Get kitchen by slug with caching
 */
export async function getCachedKitchenBySlug(slug: string): Promise<Kitchen | null> {
  const cacheKey = `kitchen:slug:${slug}`;
  return cache.get(cacheKey, () => getKitchenBySlug(slug), CACHE_TTL.KITCHENS);
}

/**
 * Get kitchen by ID with caching
 */
export async function getCachedKitchenById(id: string): Promise<Kitchen | null> {
  const cacheKey = `kitchen:id:${id}`;
  return cache.get(cacheKey, () => getKitchenById(id), CACHE_TTL.KITCHENS);
}

/**
 * Invalidate kitchen cache (call after kitchen updates)
 */
export function invalidateKitchenCache(kitchenId?: string) {
  if (kitchenId) {
    cache.invalidate(`kitchen:id:${kitchenId}`);
    cache.invalidatePattern(`kitchen:slug:`); // Slug might have changed
  }
  cache.invalidatePattern('kitchens:'); // Clear all kitchen lists
}
