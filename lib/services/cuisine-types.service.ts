/**
 * Cuisine Types Service
 * Calls backend API for cuisine type operations
 */

import { fetchAPI } from './api.client';
import type { CuisineType } from '@/types/database';

/**
 * Get all active cuisine types
 * Endpoint: GET /api/cuisine-types
 */
export async function getCuisineTypes(): Promise<CuisineType[]> {
  return await fetchAPI<CuisineType[]>('/cuisine-types');
}

/**
 * Get single cuisine type by ID
 */
export async function getCuisineTypeById(id: string): Promise<CuisineType> {
  return await fetchAPI<CuisineType>(`/cuisine-types/${id}`);
}

/**
 * Get single cuisine type by slug
 */
export async function getCuisineTypeBySlug(slug: string): Promise<CuisineType> {
  return await fetchAPI<CuisineType>(`/cuisine-types/slug/${slug}`);
}
