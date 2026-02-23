/**
 * Orders Service (Customer)
 * Calls backend API for customer order operations
 */

import { fetchAPI } from './api.client';
import type {
  Order,
  OrderWithItems,
  OrderItem,
  OrderCreate as CreateOrderPayload,
  OrderItemCreate,
  SelectedVariant,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Kitchen
} from '@/types/database';

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
  status: OrderStatus;
  status_history: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
  fulfillment_type?: 'pickup' | 'delivery' | null;
  pickup_time: string | null;
  estimated_ready_time: string | null;
  actual_ready_time: string | null;
  picked_up_at: string | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
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

/**
 * Transform API order item to frontend format
 */
function transformOrderItem(item: ApiOrderItem): OrderItem {
  return {
    id: item.id,
    order_id: item.order_id,
    menu_item_id: item.menu_item_id ?? undefined,
    item_name: item.item_name,
    item_description: item.item_description ?? undefined,
    item_image_url: item.item_image_url ?? undefined,
    unit_price: item.unit_price,
    quantity: item.quantity,
    total_price: item.total_price,
    selected_variants: item.selected_variants?.map(v => ({
      variant_name: v.variant_name,
      option_name: v.option_name,
      price: v.price
    })) as SelectedVariant[] | undefined,
    special_instructions: item.special_instructions ?? undefined,
    created_at: item.created_at,
  };
}

/**
 * Transform API order to frontend format
 */
export function transformOrder(order: ApiOrder): Order & { kitchen?: Kitchen } {
  return {
    id: order.id,
    order_number: order.order_number,
    orderNumber: order.order_number,
    customer_id: order.customer_id,
    customerId: order.customer_id,
    kitchen_id: order.kitchen_id,
    kitchenId: order.kitchen_id,
    customer_name: order.customer_name,
    customerName: order.customer_name,
    customer_phone: order.customer_phone,
    customerPhone: order.customer_phone,
    customer_email: order.customer_email ?? undefined,
    customerEmail: order.customer_email ?? undefined,
    status: order.status,
    status_history: order.status_history.map(h => ({
      status: h.status as any,
      timestamp: h.timestamp,
      note: h.note
    })),
    statusHistory: order.status_history.map(h => ({
      status: h.status as any,
      timestamp: h.timestamp,
      note: h.note
    })),
    pickup_time: order.pickup_time ?? undefined,
    pickupTime: order.pickup_time ?? undefined,
    estimated_ready_time: order.estimated_ready_time ?? undefined,
    estimatedReadyTime: order.estimated_ready_time ?? undefined,
    actual_ready_time: order.actual_ready_time ?? undefined,
    actualReadyTime: order.actual_ready_time ?? undefined,
    picked_up_at: order.picked_up_at ?? undefined,
    pickedUpAt: order.picked_up_at ?? undefined,
    payment_method: order.payment_method,
    paymentMethod: order.payment_method,
    payment_status: order.payment_status,
    paymentStatus: order.payment_status,
    payment_reference: order.payment_reference ?? undefined,
    paymentReference: order.payment_reference ?? undefined,
    subtotal: order.subtotal,
    tax_rate: order.tax_rate,
    taxRate: order.tax_rate,
    tax_amount: order.tax_amount,
    taxAmount: order.tax_amount,
    tip_amount: order.tip_amount,
    tipAmount: order.tip_amount,
    discount_amount: order.discount_amount,
    discountAmount: order.discount_amount,
    total: order.total,
    special_instructions: order.special_instructions ?? undefined,
    specialInstructions: order.special_instructions ?? undefined,
    kitchen_notes: order.kitchen_notes ?? undefined,
    kitchenNotes: order.kitchen_notes ?? undefined,
    cancellation_reason: order.cancellation_reason ?? undefined,
    cancellationReason: order.cancellation_reason ?? undefined,
    is_rated: order.is_rated,
    isRated: order.is_rated,
    created_at: order.created_at,
    createdAt: order.created_at,
    updated_at: order.updated_at,
    updatedAt: order.updated_at,
    kitchen: order.kitchen ? {
      ...order.kitchen,
      logo_url: (order.kitchen as any).logo_url ?? undefined,
    } as Kitchen : undefined,
  };
}

/**
 * Get all orders for current user
 */
export async function getOrders(): Promise<OrderWithItems[]> {
  const orders = await fetchAPI<ApiOrder[]>('/orders');
  return orders.map(order => ({
    ...transformOrder(order),
    items: order.items?.map(transformOrderItem) || [],
  } as OrderWithItems));
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<OrderWithItems> {
  const order = await fetchAPI<ApiOrder>(`/orders/${orderId}`);
  const baseOrder = transformOrder(order);
  return {
    ...baseOrder,
    items: order.items?.map(transformOrderItem) || [],
  } as OrderWithItems;
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
