/**
 * Profile Service
 * Calls backend API for user profile operations
 */

import { fetchAPI } from './api.client';

// API response type (snake_case from backend)
interface ApiProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatar_url: string | null;
  role: 'customer' | 'business' | 'admin';
  address: string | null;
  city: string;
  postal_code: string | null;
  subscription_status: 'free' | 'active' | 'expired' | 'cancelled';
  subscription_plan: string | null;
  subscription_expires_at: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  email_change_count: number;
  address_line1: string | null;
  address_line2: string | null;
  latitude: number | null;
  longitude: number | null;
  first_name: string;
  last_name: string;
  province: string | null;
  fcm_token: string | null;
  push_enabled: boolean;
}

// Frontend type (camelCase for components)
export interface Profile {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  role: 'customer' | 'business' | 'admin';
  address: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string;
  province: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  subscriptionStatus: 'free' | 'active' | 'expired' | 'cancelled';
  subscriptionPlan: string | null;
  subscriptionExpiresAt: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  emailChangeCount: number;
  fcmToken: string | null;
  pushEnabled: boolean;
}

// Update profile payload
export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string | null;
  city?: string;
  province?: string;
  postal_code?: string;
}

/**
 * Transform API profile to frontend format
 */
function transformProfile(p: any): Profile {
  return {
    ...p,
    id: p.id,
    email: p.email,
    name: p.name,
    firstName: p.first_name,
    lastName: p.last_name,
    phone: p.phone,
    avatarUrl: p.avatar_url,
    role: p.role,
    addressLine1: p.address_line1,
    addressLine2: p.address_line2,
    city: p.city,
    province: p.province,
    postalCode: p.postal_code,
    latitude: p.latitude,
    longitude: p.longitude,
    subscriptionStatus: p.subscription_status,
    subscriptionPlan: p.subscription_plan,
    subscriptionExpiresAt: p.subscription_expires_at,
    emailVerified: p.email_verified,
    phoneVerified: p.phone_verified,
    isActive: p.is_active,
    lastLoginAt: p.last_login_at,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    emailChangeCount: p.email_change_count,
    fcmToken: p.fcm_token,
    pushEnabled: p.push_enabled,
  };
}

/**
 * Get current user's profile
 */
export async function getProfile(): Promise<Profile> {
  const response = await fetchAPI<{ profile: ApiProfile }>('/profile');
  return transformProfile(response.profile);
}

/**
 * Update current user's profile
 */
export async function updateProfile(updates: UpdateProfilePayload): Promise<Profile> {
  const response = await fetchAPI<{ profile: ApiProfile }>('/profile', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return transformProfile(response.profile);
}
