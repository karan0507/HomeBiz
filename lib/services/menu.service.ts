/**
 * Menu Service (Business)
 * Calls backend API for menu item management
 */

import { fetchAPI } from './api.client';
import type {
  MenuItem,
  MenuItemWithVariants,
  MenuItemVariant,
  MenuItemCreate as CreateMenuItemPayload,
  MenuItemUpdate as UpdateMenuItemPayload,
  MenuItemVariantCreate as CreateVariantPayload,
  QuantityUnit
} from '@/types/database';

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
  stock_quantity?: number | null;
  quantity?: number | null;
  quantity_unit?: QuantityUnit | null;
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

/**
 * Transform API menu item variant to frontend format
 */
function transformVariant(v: ApiMenuItemVariant): MenuItemVariant {
  return {
    id: v.id,
    menu_item_id: v.menu_item_id,
    menuItemId: v.menu_item_id,
    name: v.name,
    options: v.options,
    is_required: v.is_required,
    isRequired: v.is_required,
    max_selections: v.max_selections,
    maxSelections: v.max_selections,
    created_at: v.created_at,
  };
}

/**
 * Transform API menu item to frontend format
 */
function transformMenuItem(item: ApiMenuItem): MenuItem & { variants?: MenuItemVariant[] } {
  return {
    id: item.id,
    kitchen_id: item.kitchen_id,
    kitchenId: item.kitchen_id,
    name: item.name,
    description: item.description ?? undefined,
    price: item.price,
    compare_price: item.compare_price ?? undefined,
    comparePrice: item.compare_price ?? undefined,
    category: item.category ?? undefined,
    tags: item.tags,
    dietary_info: item.dietary_info,
    dietaryInfo: item.dietary_info,
    image_url: item.image_url ?? undefined,
    imageUrl: item.image_url ?? undefined,
    is_available: item.is_available,
    isAvailable: item.is_available,
    available_quantity: item.available_quantity ?? undefined,
    availableQuantity: item.available_quantity ?? undefined,
    stock_quantity: item.stock_quantity ?? undefined,
    stockQuantity: item.stock_quantity ?? undefined,
    quantity: item.quantity ?? undefined,
    quantity_unit: item.quantity_unit ?? undefined,
    quantityUnit: item.quantity_unit ?? undefined,
    prep_time_min: item.prep_time_min,
    prepTimeMin: item.prep_time_min,
    prep_time_max: item.prep_time_max,
    prepTimeMax: item.prep_time_max,
    preparationTime: item.prep_time_min ? `${item.prep_time_min}-${item.prep_time_max} mins` : undefined,
    serves: item.serves ?? undefined,
    spice_level: item.spice_level ?? undefined,
    spiceLevel: item.spice_level ?? undefined,
    order_count: item.order_count,
    orderCount: item.order_count,
    is_featured: item.is_featured,
    isFeatured: item.is_featured,
    is_popular: item.is_popular,
    isPopular: item.is_popular,
    display_order: item.display_order,
    displayOrder: item.display_order,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

/**
 * Transform API menu item with variants
 */
function transformMenuItemWithVariants(item: ApiMenuItem): any {
  return {
    ...transformMenuItem(item),
    variants: item.variants?.map(transformVariant) || [],
  };
}

/**
 * Get all menu items for a kitchen
 */
export async function getMenuItems(kitchenId: string): Promise<MenuItemWithVariants[]> {
  const items = await fetchAPI<ApiMenuItem[]>(`/kitchens/${kitchenId}/menu-items`);
  return items.map(transformMenuItemWithVariants);
}

/**
 * Create menu item
 */
export async function createMenuItem(kitchenId: string, payload: CreateMenuItemPayload): Promise<MenuItemWithVariants> {
  const item = await fetchAPI<ApiMenuItem>(`/kitchens/${kitchenId}/menu-items`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return transformMenuItemWithVariants(item);
}

/**
 * Update menu item
 */
export async function updateMenuItem(itemId: string, payload: UpdateMenuItemPayload): Promise<MenuItemWithVariants> {
  const item = await fetchAPI<ApiMenuItem>(`/menu-items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return transformMenuItemWithVariants(item);
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
