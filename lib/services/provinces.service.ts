/**
 * Provinces Service
 * Calls backend API for Canadian provinces/territories
 */

import { fetchAPI } from './api.client';
import type { Province } from '@/types/database';

/**
 * Get all Canadian provinces and territories
 * Returns array of province objects with code, name, and display order
 * Endpoint: GET /api/provinces
 */
export async function getProvinces(): Promise<Province[]> {
  return await fetchAPI<Province[]>('/provinces');
}
