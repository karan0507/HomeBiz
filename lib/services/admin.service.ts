/**
 * Admin Service
 * Calls backend API for admin operations
 */

import { fetchAPI } from './api.client';
import type { Profile } from './profile.service';
import type { Kitchen } from '@/types/database';

// Admin user list response
export interface AdminUser extends Profile {
  // Inherits all Profile fields
}

// Admin kitchen list response with owner info
export interface AdminKitchen extends Kitchen {
  owner: {
    id: string;
    email: string;
    name: string;
    phone: string | null;
  };
}

// Admin order response
export interface AdminOrder {
  id: string;
  order_number: string;
  customer_id: string;
  kitchen_id: string;
  status: string;
  total: number;
  created_at: string;
  kitchen: {
    id: string;
    name: string;
    slug: string;
  };
  customer: {
    id: string;
    email: string;
    name: string;
  };
}

// Admin review response
export interface AdminReview {
  id: string;
  kitchen_id: string;
  customer_id: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  is_flagged: boolean;
  flag_reason: string | null;
  created_at: string;
  customer: {
    id: string;
    email: string;
    name: string;
  };
  kitchen: {
    id: string;
    name: string;
    slug: string;
  };
}

// Analytics types
export interface AdminAnalytics {
  best_selling_products: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  best_selling_kitchens: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  hot_selling_hours: Array<{
    hour: number;
    count: number;
  }>;
  reviews_per_business: Array<{
    kitchen_name: string;
    total_reviews: number;
    avg_rating: number;
  }>;
  period: {
    date_from: string;
    date_to: string;
  };
}

// Filter types
export interface UserFilters {
  page?: number;
  per_page?: number;
  role?: 'customer' | 'business' | 'admin';
  search?: string;
}

export interface KitchenFilters {
  page?: number;
  per_page?: number;
  status?: 'pending' | 'approved' | 'rejected' | 'suspended';
}

export interface OrderFilters {
  page?: number;
  per_page?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
}

export interface ReviewFilters {
  page?: number;
  per_page?: number;
  flagged?: boolean;
}

// ============ USER MANAGEMENT ============

/**
 * Get all users (paginated)
 */
export async function getUsers(filters?: UserFilters): Promise<{ users: AdminUser[]; meta: any }> {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.per_page) params.append('per_page', filters.per_page.toString());
  if (filters?.role) params.append('role', filters.role);
  if (filters?.search) params.append('search', filters.search);

  const response = await fetchAPI<any>(`/admin/users?${params.toString()}`);
  return response;
}

/**
 * Update user
 */
export async function updateUser(
  userId: string,
  updates: { role?: 'customer' | 'business' | 'admin'; is_active?: boolean }
): Promise<AdminUser> {
  return await fetchAPI<AdminUser>(`/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

/**
 * Deactivate user (soft delete)
 */
export async function deleteUser(userId: string): Promise<{ message: string }> {
  return await fetchAPI<{ message: string }>(`/admin/users/${userId}`, {
    method: 'DELETE',
  });
}

// ============ KITCHEN MANAGEMENT ============

/**
 * Get all kitchens (including unverified)
 */
export async function getKitchens(filters?: KitchenFilters): Promise<{ kitchens: AdminKitchen[]; meta: any }> {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.per_page) params.append('per_page', filters.per_page.toString());
  if (filters?.status) params.append('status', filters.status);

  const response = await fetchAPI<any>(`/admin/kitchens?${params.toString()}`);
  return response;
}

/**
 * Verify kitchen
 */
export async function verifyKitchen(
  kitchenId: string,
  status: 'approved' | 'rejected' | 'suspended'
): Promise<Kitchen> {
  return await fetchAPI<Kitchen>(`/admin/kitchens/${kitchenId}/verify`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

// ============ ORDER MANAGEMENT ============

/**
 * Get all orders
 */
export async function getOrders(filters?: OrderFilters): Promise<{ orders: AdminOrder[]; meta: any }> {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.per_page) params.append('per_page', filters.per_page.toString());
  if (filters?.status) params.append('status', filters.status);
  if (filters?.date_from) params.append('date_from', filters.date_from);
  if (filters?.date_to) params.append('date_to', filters.date_to);

  const response = await fetchAPI<any>(`/admin/orders?${params.toString()}`);
  return response;
}

// ============ REVIEW MODERATION ============

/**
 * Get all reviews
 */
export async function getReviews(filters?: ReviewFilters): Promise<{ reviews: AdminReview[]; meta: any }> {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.per_page) params.append('per_page', filters.per_page.toString());
  if (filters?.flagged !== undefined) params.append('flagged', filters.flagged.toString());

  const response = await fetchAPI<any>(`/admin/reviews?${params.toString()}`);
  return response;
}

/**
 * Moderate review
 */
export async function moderateReview(
  reviewId: string,
  action: 'approve' | 'reject' | 'flag',
  reason?: string
): Promise<AdminReview> {
  return await fetchAPI<AdminReview>(`/admin/reviews/${reviewId}/moderate`, {
    method: 'PUT',
    body: JSON.stringify({ action, reason }),
  });
}

// ============ CATEGORY MANAGEMENT ============

/**
 * Create category
 */
export async function createCategory(payload: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image_url?: string;
  display_order?: number;
  is_active?: boolean;
}): Promise<any> {
  return await fetchAPI<any>('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Update category
 */
export async function updateCategory(categoryId: string, payload: any): Promise<any> {
  return await fetchAPI<any>(`/admin/categories/${categoryId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

/**
 * Delete category
 */
export async function deleteCategory(categoryId: string): Promise<{ message: string }> {
  return await fetchAPI<{ message: string }>(`/admin/categories/${categoryId}`, {
    method: 'DELETE',
  });
}

// ============ ANALYTICS ============

/**
 * Get admin analytics
 */
export async function getAnalytics(dateFrom?: string, dateTo?: string): Promise<AdminAnalytics> {
  const params = new URLSearchParams();
  if (dateFrom) params.append('date_from', dateFrom);
  if (dateTo) params.append('date_to', dateTo);

  return await fetchAPI<AdminAnalytics>(`/admin/analytics?${params.toString()}`);
}
