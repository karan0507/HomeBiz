/**
 * Addresses Service
 * Manage user delivery addresses (Phase 2)
 */

import { fetchAPI } from './api.client';
import type { Address, AddressInput } from '@/types/database';

/**
 * Get all addresses for current user
 * Endpoint: GET /api/profile/addresses
 */
export async function getAddresses(): Promise<Address[]> {
  return await fetchAPI<Address[]>('/profile/addresses');
}

/**
 * Add new address
 * Endpoint: POST /api/profile/addresses
 */
export async function addAddress(data: AddressInput): Promise<Address> {
  return await fetchAPI<Address>('/profile/addresses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update existing address
 * Endpoint: PATCH /api/profile/addresses/[id]
 */
export async function updateAddress(id: string, data: Partial<AddressInput>): Promise<Address> {
  return await fetchAPI<Address>(`/profile/addresses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete address (soft delete)
 * Endpoint: DELETE /api/profile/addresses/[id]
 */
export async function deleteAddress(id: string): Promise<void> {
  await fetchAPI(`/profile/addresses/${id}`, { method: 'DELETE' });
}
