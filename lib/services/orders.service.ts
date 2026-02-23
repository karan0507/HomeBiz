/**
 * Orders Service (Customer)
 * Calls backend API for customer order operations
 */

import { fetchAPI } from './api.client';

// API response types (snake_case from backend)
interface ApiOrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name: string;
  item_description: string | null;
  item_image_url: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
  selected_variants: Array<{
    variant_name: string;
    option_name: string;
    price: number;
  }> | null;
  special_instructions: string | null;
  created_at: string;
}

interface ApiOrder {
  id: string;
  order_number: string;
  customer_id: string;
  kitchen_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  status: 'placed' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'completed' | 'cancelled';
  status_history: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
  pickup_time: string | null;
  estimated_ready_time: string | null;
  actual_ready_time: string | null;
  picked_up_at: string | null;
  payment_method: 'cash' | 'etransfer' | 'card';
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  payment_reference: string | null;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  tip_amount: number;
  discount_amount: number;
  total: number;
  special_instructions: string | null;
  kitchen_notes: string | null;
  cancellation_reason: string | null;
  is_rated: boolean;
  created_at: string;
  updated_at: string;
  items?: ApiOrderItem[];
  kitchen?: {
    id: string;
    name: string;
    slug: string;
    phone: string;
    email: string | null;
    address: string | null;
    neighborhood: string;
  };
}

// Frontend types (camelCase)
export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string | null;
  itemName: string;
  itemDescription: string | null;
  itemImageUrl: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  selectedVariants: Array<{
    variantName: string;
    optionName: string;
    price: number;
  }> | null;
  specialInstructions: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  kitchenId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  status: 'placed' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'completed' | 'cancelled';
  statusHistory: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
  pickupTime: string | null;
  estimatedReadyTime: string | null;
  actualReadyTime: string | null;
  pickedUpAt: string | null;
  paymentMethod: 'cash' | 'etransfer' | 'card';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentReference: string | null;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  tipAmount: number;
  discountAmount: number;
  total: number;
  specialInstructions: string | null;
  kitchenNotes: string | null;
  cancellationReason: string | null;
  isRated: boolean;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  kitchen?: {
    id: string;
    name: string;
    slug: string;
    phone: string;
    email: string | null;
    address: string | null;
    neighborhood: string;
  };
}

// Create order payload
export interface CreateOrderPayload {
  kitchen_id: string;
  payment_method: 'cash' | 'etransfer' | 'card';
  items: Array<{
    menu_item_id: string;
    quantity: number;
    selected_variants?: Array<{
      variant_name: string;
      option_name: string;
      price: number;
    }>;
    special_instructions?: string;
  }>;
  pickup_time?: string;
  tip_amount?: number;
  discount_amount?: number;
  special_instructions?: string;
}

/**
 * Transform API order item to frontend format
 */
function transformOrderItem(item: ApiOrderItem): OrderItem {
  return {
    id: item.id,
    orderId: item.order_id,
    menuItemId: item.menu_item_id,
    itemName: item.item_name,
    itemDescription: item.item_description,
    itemImageUrl: item.item_image_url,
    unitPrice: item.unit_price,
    quantity: item.quantity,
    totalPrice: item.total_price,
    selectedVariants: item.selected_variants?.map(v => ({
      variantName: v.variant_name,
      optionName: v.option_name,
      price: v.price
    })) || null,
    specialInstructions: item.special_instructions,
    createdAt: item.created_at,
  };
}

/**
 * Transform API order to frontend format
 */
export function transformOrder(order: any): Order {
  return {
    ...order,
    id: order.id,
    orderNumber: order.order_number,
    customerId: order.customer_id,
    kitchenId: order.kitchen_id,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    customerEmail: order.customer_email,
    status: order.status,
    statusHistory: order.status_history,
    pickupTime: order.pickup_time,
    fulfillmentType: order.fulfillment_type,
    estimatedReadyTime: order.estimated_ready_time,
    actualReadyTime: order.actual_ready_time,
    pickedUpAt: order.picked_up_at,
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    paymentReference: order.payment_reference,
    subtotal: order.subtotal,
    taxRate: order.tax_rate,
    taxAmount: order.tax_amount,
    tipAmount: order.tip_amount,
    discountAmount: order.discount_amount,
    total: order.total,
    specialInstructions: order.special_instructions,
    kitchenNotes: order.kitchen_notes,
    cancellationReason: order.cancellation_reason,
    isRated: order.is_rated,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    items: order.items?.map((item: any) => ({
      ...item,
      orderId: item.order_id,
      menuItemId: item.menu_item_id,
      itemName: item.item_name,
      itemDescription: item.item_description,
      itemImageUrl: item.item_image_url,
      unitPrice: item.unit_price,
      totalPrice: item.total_price,
      selectedVariants: item.selected_variants?.map((v: any) => ({
        variantName: v.variant_name,
        optionName: v.option_name,
        price: v.price
      })) || null,
      specialInstructions: item.special_instructions,
      createdAt: item.created_at,
    })),
    kitchen: order.kitchen ? {
      ...order.kitchen,
      logoUrl: order.kitchen.logo_url,
    } : undefined,
  };
}

/**
 * Get all orders for current user
 */
export async function getOrders(): Promise<Order[]> {
  const orders = await fetchAPI<ApiOrder[]>('/orders');
  return orders.map(transformOrder);
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<Order> {
  const order = await fetchAPI<ApiOrder>(`/orders/${orderId}`);
  return transformOrder(order);
}

/**
 * Create new order
 */
export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const order = await fetchAPI<ApiOrder>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return transformOrder(order);
}

/**
 * Cancel order (only from 'placed' status)
 */
export async function cancelOrder(orderId: string, reason?: string): Promise<Order> {
  const order = await fetchAPI<ApiOrder>(`/orders/${orderId}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
  return transformOrder(order);
}

/**
 * Get order status timeline (Phase 2)
 * Endpoint: GET /api/orders/[id]/timeline
 */
export async function getOrderTimeline(orderId: string) {
  return await fetchAPI(`/orders/${orderId}/timeline`);
}

/**
 * Get payment transactions for order (Phase 2)
 * Endpoint: GET /api/orders/[id]/payments
 */
export async function getOrderPayments(orderId: string) {
  return await fetchAPI(`/orders/${orderId}/payments`);
}
