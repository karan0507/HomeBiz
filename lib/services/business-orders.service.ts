/**
 * Business Orders Service
 * Calls backend API for business order management
 */

import { fetchAPI } from './api.client';
import { transformOrder } from './orders.service';

import { Order, OrderItem } from './orders.service';
export type { Order, OrderItem };

// Business-specific order filters
export interface BusinessOrderFilters {
  status?: 'placed' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'completed' | 'cancelled';
}

/**
 * Get all orders for business kitchen
 */
export async function getBusinessOrders(filters?: BusinessOrderFilters): Promise<Order[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);

  const endpoint = `/business/orders${params.toString() ? `?${params.toString()}` : ''}`;
  const orders = await fetchAPI<any[]>(endpoint);
  return orders.map(transformOrder);
}

/**
 * Accept order (placed → confirmed)
 */
export async function acceptOrder(orderId: string): Promise<Order> {
  const order = await fetchAPI<any>(`/orders/${orderId}/accept`, {
    method: 'PUT',
  });
  return transformOrder(order);
}

/**
 * Reject order (any status → cancelled)
 */
export async function rejectOrder(orderId: string, reason?: string): Promise<Order> {
  const order = await fetchAPI<any>(`/orders/${orderId}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  });
  return transformOrder(order);
}

/**
 * Update order status
 * Valid transitions: placed→confirmed, confirmed→preparing, preparing→ready, ready→picked_up, picked_up→completed
 */
export async function updateOrderStatus(
  orderId: string,
  status: 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'completed' | 'cancelled',
  note?: string
): Promise<Order> {
  const order = await fetchAPI<any>(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note }),
  });
  return transformOrder(order);
}

/**
 * Update pickup time
 */
export async function updatePickupTime(orderId: string, pickupTime: string): Promise<Order> {
  const order = await fetchAPI<any>(`/orders/${orderId}/time`, {
    method: 'PUT',
    body: JSON.stringify({ pickup_time: pickupTime }),
  });
  return transformOrder(order);
}
