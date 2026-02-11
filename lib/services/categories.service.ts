/**
 * Categories Service
 * Calls backend API for category operations
 */

import { fetchAPI } from './api.client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image_url: string | null;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  kitchen_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Get all active categories
 */
export async function getCategories(): Promise<Category[]> {
  return fetchAPI<Category[]>('/categories');
}

/**
 * Get featured categories (for landing page - 8 items)
 */
export async function getFeaturedCategories(): Promise<Category[]> {
  return fetchAPI<Category[]>('/categories?featured=true&page=1&per_page=8');
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    return await fetchAPI<Category>(`/categories/${slug}`);
  } catch (error) {
    return null;
  }
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    return await fetchAPI<Category>(`/categories/${id}`);
  } catch (error) {
    return null;
  }
}

/**
 * Get categories with kitchen count
 */
export async function getCategoriesWithCounts(): Promise<Category[]> {
  return fetchAPI<Category[]>('/categories');
}
