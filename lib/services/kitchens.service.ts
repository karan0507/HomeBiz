/**
 * Kitchens Service
 * Calls backend API for kitchen operations
 */

import { fetchAPI } from './api.client';

export interface Kitchen {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string | null;
  phone: string;
  email: string | null;
  neighborhood: string;
  city: string;
  province: string;
  postal_code: string | null;
  address: string | null;
  cover_image: string | null;
  logo: string | null;
  cuisine_types: string[];
  dietary_options: string[];
  specialties: string[];
  accepting_orders: boolean;
  preparation_time: string;
  minimum_order: number;
  rating: number;
  review_count: number;
  total_orders: number;
  verification_status: 'pending' | 'approved' | 'rejected' | 'suspended';
  is_verified: boolean;
  food_handler_certificate: boolean;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface KitchenFilters {
  cuisines?: string[];
  dietary?: string[];
  neighborhood?: string;
  min_rating?: number;
  accepting_orders?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Get all approved kitchens with filters
 */
export async function getKitchens(filters: KitchenFilters = {}): Promise<Kitchen[]> {
  const params = new URLSearchParams();

  if (filters.cuisines?.length) params.append('cuisines', filters.cuisines.join(','));
  if (filters.dietary?.length) params.append('dietary', filters.dietary.join(','));
  if (filters.neighborhood) params.append('neighborhood', filters.neighborhood);
  if (filters.min_rating) params.append('min_rating', filters.min_rating.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  return fetchAPI<Kitchen[]>(`/kitchens?${params.toString()}`);
}

/**
 * Get kitchen by slug
 */
export async function getKitchenBySlug(slug: string): Promise<Kitchen | null> {
  try {
    return await fetchAPI<Kitchen>(`/kitchens/${slug}`);
  } catch {
    return null;
  }
}

/**
 * Get kitchen by ID
 */
export async function getKitchenById(id: string): Promise<Kitchen | null> {
  try {
    return await fetchAPI<Kitchen>(`/kitchens/${id}`);
  } catch {
    return null;
  }
}

/**
 * Get featured kitchens
 */
export async function getFeaturedKitchens(limit: number = 6): Promise<Kitchen[]> {
  return fetchAPI<Kitchen[]>(`/kitchens?featured=true&limit=${limit}`);
}

/**
 * Get kitchens by owner
 */
export async function getMyKitchens(ownerId: string): Promise<Kitchen[]> {
  return fetchAPI<Kitchen[]>(`/business/kitchens`);
}

/**
 * Create kitchen
 */
export async function createKitchen(kitchen: Partial<Kitchen>): Promise<Kitchen> {
  return fetchAPI<Kitchen>('/kitchens', {
    method: 'POST',
    body: JSON.stringify(kitchen),
  });
}

/**
 * Update kitchen
 */
export async function updateKitchen(id: string, updates: Partial<Kitchen>): Promise<Kitchen> {
  return fetchAPI<Kitchen>(`/kitchens/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
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
export async function searchKitchens(searchQuery: string, filters: KitchenFilters = {}): Promise<Kitchen[]> {
  const params = new URLSearchParams({ search: searchQuery });
  if (filters.neighborhood) params.append('neighborhood', filters.neighborhood);
  if (filters.min_rating) params.append('min_rating', filters.min_rating.toString());

  return fetchAPI<Kitchen[]>(`/kitchens?${params.toString()}`);
}
