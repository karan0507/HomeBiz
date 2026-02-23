/**
 * Profile Service
 * Calls backend API for user profile operations
 */

import { fetchAPI } from './api.client';
import type { Profile, ProfileUpdate as UpdateProfilePayload } from '@/types/database';

// API response type (snake_case from backend)
export interface ApiProfile {
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

/**
 * Transform API profile to frontend format
 */
function transformProfile(p: ApiProfile): Profile {
  return {
    id: p.id,
    email: p.email,
    name: p.name,
    first_name: p.first_name,
    last_name: p.last_name,
    firstName: p.first_name,
    lastName: p.last_name,
    phone: p.phone ?? undefined,
    avatar_url: p.avatar_url ?? undefined,
    avatarUrl: p.avatar_url ?? undefined,
    role: p.role,
    address_line1: p.address_line1 ?? undefined,
    addressLine1: p.address_line1 ?? undefined,
    address_line2: p.address_line2 ?? undefined,
    addressLine2: p.address_line2 ?? undefined,
    city: p.city,
    province: p.province ?? undefined,
    postal_code: p.postal_code ?? undefined,
    postalCode: p.postal_code ?? undefined,
    latitude: p.latitude ?? undefined,
    longitude: p.longitude ?? undefined,
    subscription_status: p.subscription_status,
    subscriptionStatus: p.subscription_status,
    subscription_plan: (p.subscription_plan as any) ?? undefined,
    subscriptionPlan: (p.subscription_plan as any) ?? undefined,
    subscription_expires_at: p.subscription_expires_at ?? undefined,
    subscriptionExpiresAt: p.subscription_expires_at ?? undefined,
    email_verified: p.email_verified,
    emailVerified: p.email_verified,
    phone_verified: p.phone_verified,
    phoneVerified: p.phone_verified,
    isActive: p.is_active,
    is_active: p.is_active,
    lastLoginAt: p.last_login_at ?? undefined,
    created_at: p.created_at,
    createdAt: p.created_at,
    updated_at: p.updated_at,
    updatedAt: p.updated_at,
    email_change_count: p.email_change_count,
    fcm_token: p.fcm_token ?? undefined,
    fcmToken: p.fcm_token ?? undefined,
    push_enabled: p.push_enabled,
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
