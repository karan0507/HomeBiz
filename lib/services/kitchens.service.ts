/**
 * Kitchens Service
 * Calls backend API for kitchen operations
 */

import { fetchAPI } from './api.client';
import type { Kitchen, KitchenWithOwner, KitchenFilters, KitchenInput } from '@/types/database';

export type { Kitchen, KitchenWithOwner, KitchenFilters, KitchenInput };

/**
 * Helper to map database kitchen to frontend kitchen type
 */
function mapKitchen(k: any): Kitchen {
  const mapJoinedItems = (items: any[]) => {
    if (!items || !Array.isArray(items)) return [];
    return items.map((item: any) => {
      if (typeof item === 'object') return item.name || 'Unknown';
      return String(item);
    });
  };

  return {
    ...k,
    is_verified: k.verification_status === 'approved',
    isVerified: k.verification_status === 'approved',
    acceptingOrders: k.accepting_orders ?? false,
    cuisineTypes: mapJoinedItems(k.cuisine_types),
    dietaryOptions: mapJoinedItems(k.dietary_options),
    // Ensure numeric fields are numbers
    rating: Number(k.rating || 0),
    reviewCount: Number(k.review_count || 0),
    minimumOrder: Number(k.minimum_order || 0),
    totalOrders: Number(k.total_orders || 0),
    prep_time_min: Number(k.prep_time_min || 30),
    prep_time_max: Number(k.prep_time_max || 45),
    preparationTime: k.prep_time_min ? `${k.prep_time_min}-${k.prep_time_max} mins` : k.preparation_time,
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

  const kitchens = await fetchAPI<any[]>(`/kitchens?${params.toString()}`, { signal });
  return kitchens.map(mapKitchen);
}

/**
 * Get kitchen by slug
 */
export async function getKitchenBySlug(slug: string, signal?: AbortSignal): Promise<Kitchen | null> {
  try {
    const kitchen = await fetchAPI<any>(`/kitchens/${slug}`, { signal });
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
    const kitchen = await fetchAPI<any>(`/kitchens/${id}`, { signal });
    return mapKitchen(kitchen);
  } catch {
    return null;
  }
}

/**
 * Get featured kitchens
 */
export async function getFeaturedKitchens(limit: number = 6, signal?: AbortSignal): Promise<Kitchen[]> {
  const kitchens = await fetchAPI<any[]>(`/kitchens/featured?limit=${limit}`, { signal });
  return kitchens.map(mapKitchen);
}

/**
 * Get current user's kitchen (business owner)
 */
export async function getMyKitchen(): Promise<Kitchen | null> {
  try {
    const kitchen = await fetchAPI<any>(`/business/kitchen`);
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
  const kitchen = await fetchAPI<any>('/kitchens', {
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
  const kitchen = await fetchAPI<any>(`/kitchens/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  return mapKitchen(kitchen);
}

/**
 * Update current user's kitchen (business owner)
 */
export async function updateMyKitchen(updates: KitchenInput): Promise<Kitchen> {
  const kitchen = await fetchAPI<any>(`/business/kitchen`, {
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
