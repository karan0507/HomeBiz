/**
 * Provinces Service
 * Calls backend API for Canadian provinces/territories
 * Backend returns string[] (province codes/names), mapped to Province objects
 */

import { fetchAPI } from './api.client';
import type { Province } from '@/types/database';

/**
 * Get all Canadian provinces and territories
 * Endpoint: GET /api/provinces  →  string[]
 * Maps each string to { code, name } so the UI can use p.code / p.name
 */
export async function getProvinces(): Promise<Province[]> {
  const raw = await fetchAPI<any>('/provinces');

  if (!Array.isArray(raw)) return [];

  return raw.map((item) => {
    // If it's already an object with code/name, use them but ensure they are strings
    if (typeof item === 'object' && item !== null) {
      const code = String(item.code || item.id || '');
      const name = String(item.name || item.label || code);
      return { code, name };
    }
    // If it's a string, use it for both
    const val = String(item);
    return { code: val, name: val };
  });
}
