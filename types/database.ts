/**
 * Database Type Definitions
 *
 * IMPORTANT: This file wraps auto-generated types from supabase.ts
 * - Base table types come from supabase.ts (DO NOT duplicate here)
 * - Only add computed/joined types here
 * - supabase.ts is the single source of truth
 */

import { Database } from './supabase';

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Extract table row type from Database
 * Usage: Tables<'profiles'> gets the Row type for profiles table
 */
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

// ============================================================================
// BASE TABLE TYPES (imported from supabase.ts)
// ============================================================================

export type Profile = Tables<'profiles'>;
export type CuisineType = Tables<'cuisine_types'>;
export type DietaryOption = Tables<'dietary_options'>;
export type Province = Tables<'provinces'>;
export type MenuItem = Tables<'menu_items'>;
export type MenuItemVariant = Tables<'menu_item_variants'>;
export type Order = Tables<'orders'>;
export type OrderItem = Tables<'order_items'>;
export type Review = Tables<'reviews'>;
export type Wishlist = Tables<'wishlists'>;
export type KitchenHours = Tables<'kitchen_hours'>;
export type KitchenGallery = Tables<'kitchen_gallery'>;
export type Notification = Tables<'notifications'>;
export type FAQ = Tables<'faqs'>;
export type Testimonial = Tables<'testimonials'>;
export type AdminLog = Tables<'admin_logs'>;

// Phase 2 / Future tables
export type Address = Tables<'addresses'>;
export type PushToken = Tables<'push_tokens'>;
export type PaymentTransaction = Tables<'payment_transactions'>;
export type OrderStatusTimeline = Tables<'order_status_timeline'>;
export type KitchenStory = Tables<'kitchen_stories'>;
export type KitchenEvent = Tables<'kitchen_events'>;
export type DeliveryZone = Tables<'delivery_zones'>;
export type DeliveryPartner = Tables<'delivery_partners'>;

// ============================================================================
// COMPUTED TYPES (kitchen with derived fields)
// ============================================================================

/**
 * Kitchen with computed is_verified field
 * is_verified = verification_status === 'approved'
 */
export type Kitchen = Tables<'kitchens'> & {
  is_verified: boolean;
  cuisine_types?: { id: string; name: string }[]; // New JSONB format from RPC
  dietary_options?: { id: string; name: string }[]; // New JSONB format from RPC
  cuisineTypes: string[]; // Final display strings
  dietaryOptions: string[]; // Final display strings
  isVerified: boolean;
  acceptingOrders: boolean;
  minimumOrder: number;
  reviewCount: number;
  totalOrders: number;
  rating: number;
  // Master Spec: Unified duration fields
  prep_time_min: number;
  prep_time_max: number;
  preparationTime?: string; // Legacy UI compat
};

// ============================================================================
// JOINED TYPES (API responses with relations)
// ============================================================================

/**
 * Kitchen with owner profile joined
 */
export type KitchenWithOwner = Kitchen & {
  owner: Profile;
};

/**
 * MenuItem with all variants
 */
export type MenuItemWithVariants = MenuItem & {
  variants: MenuItemVariant[];
};

/**
 * Order with all line items
 */
export type OrderWithItems = Order & {
  items: OrderItem[];
  kitchen?: {
    id: string;
    name: string;
    slug: string;
  };
  customer?: {
    id: string;
    name: string;
    email: string;
  };
};

/**
 * Review with customer info (for public display)
 */
export type ReviewWithCustomer = Review & {
  customer: Pick<Profile, 'id' | 'name' | 'avatar_url'>;
};

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Kitchen filters for GET /api/kitchens
 */
export interface KitchenFilters {
  query?: string;
  cuisines?: string[]; // UUID array (cuisine_type IDs)
  dietary?: string[]; // UUID array (dietary_option IDs)
  neighborhood?: string;
  min_rating?: number;
  sort?: 'rating' | 'orders' | 'newest' | 'distance';
  page?: number;
  per_page?: number;
  // Radius search
  lat?: number;
  lon?: number;
  radius?: number; // in km
}

/**
 * Order filters for GET /api/orders
 */
export interface OrderFilters {
  status?: Order['status'];
  date_from?: string;
  date_to?: string;
  kitchen_id?: string;
}

/**
 * Review filters for GET /api/reviews
 */
export interface ReviewFilters {
  kitchen_id?: string;
  customer_id?: string;
  min_rating?: number;
  flagged?: boolean;
}

// ============================================================================
// FORM INPUT TYPES
// ============================================================================

/**
 * Customer signup payload
 */
export interface CustomerSignupInput {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  province: string; // Province CODE ('ON', 'BC')
  postal_code: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Business signup payload
 */
export interface BusinessSignupInput extends CustomerSignupInput {
  role: 'business';
  kitchen: {
    name: string;
    neighborhood: string;
    cuisine_type_ids: string[]; // UUID array
    dietary_option_ids?: string[]; // UUID array
    description?: string;
    tagline?: string;
    pickup_available?: boolean;
    delivery_available?: boolean;
  };
}

/**
 * Address creation/update payload
 */
export interface AddressInput {
  address_line1: string;
  address_line2?: string | null;
  city: string;
  province_code: string; // Province CODE
  postal_code?: string | null;
  label?: string | null; // "Home", "Work", etc.
  is_default?: boolean;
}

/**
 * Kitchen creation/update payload (business owner)
 */
export interface KitchenInput {
  name?: string;
  tagline?: string;
  description?: string;
  short_description?: string;
  phone?: string;
  email?: string;
  neighborhood?: string;
  postal_code?: string;
  address?: string;
  cuisine_type_ids?: string[]; // UUID array
  dietary_option_ids?: string[]; // UUID array
  specialties?: string[];
  accepting_orders?: boolean;
  preparation_time?: string;
  prep_time_min?: number;
  prep_time_max?: number;
  minimum_order?: number;
  delivery_available?: boolean;
  pickup_available?: boolean;
  cover_image_url?: string;
  logo_url?: string;
  food_handler_certificate?: boolean;
}

/**
 * Menu item creation/update payload
 */
export interface MenuItemInput {
  name?: string;
  description?: string;
  price?: number;
  compare_price?: number;
  category?: string;
  tags?: string[];
  dietary_info?: string[];
  image_url?: string;
  is_available?: boolean;
  available_quantity?: number | null;
  prep_time_min?: number;
  prep_time_max?: number;
  serves?: number;
  spice_level?: number;
  is_featured?: boolean;
  display_order?: number;
}

/**
 * Order creation payload
 */
export interface CreateOrderInput {
  kitchen_id: string;
  payment_method: 'cash' | 'etransfer' | 'card';
  items: {
    menu_item_id: string;
    quantity: number;
    selected_variants?: {
      variant_name: string;
      option_name: string;
      price: number;
    }[];
    special_instructions?: string;
  }[];
  pickup_time?: string; // ISO timestamp
  tip_amount?: number;
  discount_amount?: number;
  special_instructions?: string;
}

/**
 * Review creation payload
 */
export interface CreateReviewInput {
  kitchen_id: string;
  order_id: string;
  rating: number; // 1-5
  comment?: string;
  images?: string[];
}

// ============================================================================
// API RESPONSE ENVELOPES
// ============================================================================

export interface APISuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}

export interface APIErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;

// Re-export Database type for direct access
export type { Database };
