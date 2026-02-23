/**
 * Menu Service (Business)
 * Calls backend API for menu item management
 */

import { fetchAPI } from './api.client';

// API response types (snake_case from backend)
interface ApiMenuItemVariant {
  id: string;
  menu_item_id: string;
  name: string;
  options: Array<{
    name: string;
    price: number;
  }>;
  is_required: boolean;
  max_selections: number;
  created_at: string;
}

interface ApiMenuItem {
  id: string;
  kitchen_id: string;
  name: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  category: string | null;
  tags: string[];
  dietary_info: string[];
  image_url: string | null;
  is_available: boolean;
  available_quantity: number | null;
  prep_time_min: number;
  prep_time_max: number;
  serves: number;
  spice_level: number | null;
  order_count: number;
  is_featured: boolean;
  is_popular: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  variants?: ApiMenuItemVariant[];
}

// Frontend types (camelCase)
export interface MenuItemVariant {
  id: string;
  menuItemId: string;
  name: string;
  options: Array<{
    name: string;
    price: number;
  }>;
  isRequired: boolean;
  maxSelections: number;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  kitchenId: string;
  name: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  category: string | null;
  tags: string[];
  dietaryInfo: string[];
  imageUrl: string | null;
  isAvailable: boolean;
  availableQuantity: number | null;
  prepTimeMin: number;
  prepTimeMax: number;
  serves: number;
  spiceLevel: number | null;
  orderCount: number;
  isFeatured: boolean;
  isPopular: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  variants?: MenuItemVariant[];
}

// Create/Update payloads
export interface CreateMenuItemPayload {
  name: string;
  price: number;
  category: string;
  description?: string;
  dietary_info?: string[];
  image_url?: string;
  spice_level?: number;
  serves?: number;
  prep_time_min?: number;
  prep_time_max?: number;
  is_available?: boolean;
  available_quantity?: number;
  is_featured?: boolean;
  display_order?: number;
}

export interface UpdateMenuItemPayload {
  name?: string;
  price?: number;
  description?: string;
  category?: string;
  is_available?: boolean;
  available_quantity?: number;
  is_featured?: boolean;
  display_order?: number;
  dietary_info?: string[];
  image_url?: string;
  spice_level?: number;
  serves?: number;
  prep_time_min?: number;
  prep_time_max?: number;
}

export interface CreateVariantPayload {
  name: string;
  options: Array<{
    name: string;
    price: number;
  }>;
  is_required?: boolean;
  max_selections?: number;
}

/**
 * Transform API menu item variant to frontend format
 */
function transformVariant(v: ApiMenuItemVariant): MenuItemVariant {
  return {
    id: v.id,
    menuItemId: v.menu_item_id,
    name: v.name,
    options: v.options,
    isRequired: v.is_required,
    maxSelections: v.max_selections,
    createdAt: v.created_at,
  };
}

/**
 * Transform API menu item to frontend format
 */
function transformMenuItem(item: ApiMenuItem): MenuItem {
  return {
    id: item.id,
    kitchenId: item.kitchen_id,
    name: item.name,
    description: item.description,
    price: item.price,
    comparePrice: item.compare_price,
    category: item.category,
    tags: item.tags,
    dietaryInfo: item.dietary_info,
    imageUrl: item.image_url,
    isAvailable: item.is_available,
    availableQuantity: item.available_quantity,
    prepTimeMin: item.prep_time_min || 30,
    prepTimeMax: item.prep_time_max || 45,
    serves: item.serves,
    spiceLevel: item.spice_level,
    orderCount: item.order_count,
    isFeatured: item.is_featured,
    isPopular: item.is_popular,
    displayOrder: item.display_order,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    variants: item.variants?.map(transformVariant),
  };
}

/**
 * Get all menu items for a kitchen
 */
export async function getMenuItems(kitchenId: string): Promise<MenuItem[]> {
  const items = await fetchAPI<ApiMenuItem[]>(`/kitchens/${kitchenId}/menu-items`);
  return items.map(transformMenuItem);
}

/**
 * Create menu item
 */
export async function createMenuItem(kitchenId: string, payload: CreateMenuItemPayload): Promise<MenuItem> {
  const item = await fetchAPI<ApiMenuItem>(`/kitchens/${kitchenId}/menu-items`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return transformMenuItem(item);
}

/**
 * Update menu item
 */
export async function updateMenuItem(itemId: string, payload: UpdateMenuItemPayload): Promise<MenuItem> {
  const item = await fetchAPI<ApiMenuItem>(`/menu-items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return transformMenuItem(item);
}

/**
 * Delete menu item
 */
export async function deleteMenuItem(itemId: string): Promise<void> {
  await fetchAPI(`/menu-items/${itemId}`, {
    method: 'DELETE',
  });
}

/**
 * Get variants for a menu item
 */
export async function getMenuItemVariants(itemId: string): Promise<MenuItemVariant[]> {
  const variants = await fetchAPI<ApiMenuItemVariant[]>(`/menu-items/${itemId}/variants`);
  return variants.map(transformVariant);
}

/**
 * Create menu item variant
 */
export async function createMenuItemVariant(itemId: string, payload: CreateVariantPayload): Promise<MenuItemVariant> {
  const variant = await fetchAPI<ApiMenuItemVariant>(`/menu-items/${itemId}/variants`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return transformVariant(variant);
}

/**
 * Update menu item variant
 */
export async function updateMenuItemVariant(variantId: string, payload: Partial<CreateVariantPayload>): Promise<MenuItemVariant> {
  const variant = await fetchAPI<ApiMenuItemVariant>(`/menu-items/variants/${variantId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return transformVariant(variant);
}

/**
 * Delete menu item variant
 */
export async function deleteMenuItemVariant(variantId: string): Promise<void> {
  await fetchAPI(`/menu-items/variants/${variantId}`, {
    method: 'DELETE',
  });
}
