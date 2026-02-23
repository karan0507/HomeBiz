/**
 * Dietary Options Service
 * Calls backend API for dietary options
 */

import { fetchAPI } from './api.client';
import type { DietaryOption } from '@/types/database';

/**
 * Get all active dietary options
 */
export async function getDietaryOptions(): Promise<DietaryOption[]> {
  return await fetchAPI<DietaryOption[]>('/dietary-options');
}
