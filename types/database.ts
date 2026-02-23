export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'customer' | 'business' | 'admin'
export type SubscriptionStatus = 'free' | 'active' | 'expired' | 'cancelled'
export type SubscriptionPlan = 'basic' | 'pro' | 'premium'
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'suspended'
export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'completed' | 'cancelled'
export type PaymentMethod = 'cash' | 'etransfer' | 'card'
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed'
export type NotificationType = 'order_update' | 'review' | 'promotion' | 'system'
export type FAQCategory = 'general' | 'customers' | 'chefs' | 'orders' | 'payments'
export type QuantityUnit = 'g' | 'kg' | 'oz' | 'lb' | 'ml' | 'l' | 'piece' | 'serving' | 'portion' | 'dozen' | 'pack'

// ============================================================================
// PROFILE
// ============================================================================

export interface Profile {
  id: string
  email: string
  name: string
  firstName?: string // Computed
  lastName?: string // Computed
  first_name?: string
  last_name?: string
  phone?: string
  avatar_url?: string
  avatarUrl?: string // Computed
  role: UserRole
  address_line1?: string
  addressLine1?: string // Computed
  address_line2?: string | null
  addressLine2?: string | null // Computed
  city: string
  province?: string
  postal_code?: string
  postalCode?: string // Computed
  latitude?: number | null
  longitude?: number | null
  subscription_status: SubscriptionStatus
  subscriptionStatus?: SubscriptionStatus // Computed
  subscription_plan?: SubscriptionPlan
  subscriptionPlan?: SubscriptionPlan // Computed
  subscription_expires_at?: string
  subscriptionExpiresAt?: string // Computed
  email_verified: boolean
  emailVerified?: boolean // Computed
  phone_verified: boolean
  phoneVerified?: boolean // Computed
  email_change_count?: number
  emailChangeCount?: number // Computed
  fcm_token?: string
  fcmToken?: string // Computed
  push_enabled?: boolean
  pushEnabled?: boolean // Computed
  is_active: boolean
  isActive?: boolean // Computed
  last_login_at?: string
  lastLoginAt?: string // Computed
  created_at: string
  createdAt?: string // Computed
  updated_at: string
  updatedAt?: string // Computed
}

export interface ProfileUpdate {
  first_name?: string
  last_name?: string
  name?: string
  phone?: string
  avatar_url?: string
  address_line1?: string
  address_line2?: string | null
  city?: string
  province?: string
  postal_code?: string
}

// ============================================================================
// KITCHEN
// ============================================================================

export interface Kitchen {
  id: string
  owner_id: string
  name: string
  slug: string
  description?: string
  short_description?: string
  phone: string
  email?: string
  neighborhood: string
  city: string
  province: string
  postal_code?: string
  postalCode?: string // Computed
  address?: string
  latitude?: number | null
  longitude?: number | null
  cover_image_url?: string
  coverImageUrl?: string // Computed
  logo_url?: string
  logoUrl?: string // Computed
  tagline?: string
  specialties?: string[]
  food_handler_certificate?: boolean
  food_handler_certificate_number?: string
  foodHandlerCertificateNumber?: string // Computed
  accepting_orders: boolean
  acceptingOrders?: boolean // Computed
  preparation_time: string
  preparationTime?: string // Computed
  prep_time_min?: number
  prepTimeMin?: number // Computed
  prep_time_max?: number
  prepTimeMax?: number // Computed
  minimum_order: number
  minimumOrder?: number // Computed
  delivery_available: boolean
  deliveryAvailable?: boolean // Computed
  pickup_available: boolean
  pickupAvailable?: boolean // Computed
  rating: number
  review_count: number
  reviewCount?: number // Computed
  total_orders: number
  totalOrders?: number // Computed
  total_revenue?: number
  commission_rate?: number
  service_radius_km?: number
  stripe_account_id?: string
  stripe_onboarding_complete?: boolean
  verification_status: VerificationStatus
  verified_at?: string
  verified_by?: string
  is_verified?: boolean // Computed
  isVerified?: boolean // Computed
  is_featured: boolean
  isFeatured?: boolean // Computed
  is_active: boolean
  isActive?: boolean // Computed
  cuisine_type_ids?: string[]
  dietary_option_ids?: string[]
  cuisineTypes?: string[] // Final display strings
  dietaryOptions?: string[] // Final display strings
  created_at: string
  createdAt?: string // Computed
  updated_at: string
  updatedAt?: string // Computed
  search_vector?: string
}

export interface KitchenFilters {
  query?: string;
  cuisines?: string[]; // UUID array (cuisine_type IDs)
  dietary?: string[]; // UUID array (dietary_option IDs)
  neighborhood?: string;
  min_rating?: number;
  sort?: 'rating' | 'orders' | 'newest' | 'distance';
  page?: number;
  per_page?: number;
  lat?: number;
  lon?: number;
  radius?: number; // in km
}

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

export interface KitchenWithOwner extends Kitchen {
  owner: Profile
}

export interface KitchenCreate {
  name: string
  tagline?: string
  description?: string
  short_description?: string
  phone: string
  email?: string
  neighborhood: string
  city?: string
  province?: string
  postal_code?: string
  address?: string
  latitude?: number | null
  longitude?: number | null
  cuisine_type_ids: string[]
  dietary_option_ids?: string[]
  specialties?: string[]
  food_handler_certificate_number: string
  food_handler_certificate?: boolean
  prep_time_min?: number
  prep_time_max?: number
  minimum_order?: number
  delivery_available?: boolean
  pickup_available?: boolean
}

export interface KitchenUpdate {
  name?: string
  tagline?: string
  description?: string
  short_description?: string
  food_handler_certificate?: boolean
  food_handler_certificate_number?: string
  phone?: string
  email?: string
  neighborhood?: string
  postal_code?: string
  address?: string
  cuisine_type_ids?: string[]
  dietary_option_ids?: string[]
  specialties?: string[]
  accepting_orders?: boolean
  prep_time_min?: number | null
  prep_time_max?: number | null
  minimum_order?: number
  delivery_available?: boolean
  pickup_available?: boolean
  cover_image_url?: string
  logo_url?: string
}

// ============================================================================
// KITCHEN HOURS
// ============================================================================

export interface KitchenHours {
  id: string
  kitchen_id: string
  day_of_week: number
  open_time?: string
  close_time?: string
  is_closed: boolean
  created_at: string
}

export interface KitchenHoursSet {
  day_of_week: number
  open_time?: string
  close_time?: string
  is_closed: boolean
}

// ============================================================================
// MENU ITEM
// ============================================================================

export interface MenuItem {
  id: string
  kitchen_id: string
  kitchenId?: string // Computed
  name: string
  description?: string | null
  price: number
  compare_price?: number | null
  comparePrice?: number | null // Computed
  category?: string | null
  tags: string[]
  dietary_info: string[]
  dietaryInfo?: string[] // Computed
  image_url?: string | null
  imageUrl?: string | null // Computed
  is_available: boolean
  isAvailable?: boolean // Computed
  /** @deprecated use order_count for popularity, stock tracking removed */
  available_quantity?: number | null
  availableQuantity?: number | null // Computed
  /** NULL = unlimited */
  stock_quantity?: number | null
  stockQuantity?: number | null // Computed
  /** Numeric amount e.g. 500 */
  quantity?: number | null
  /** Unit for quantity e.g. "g", "oz", "piece" */
  quantity_unit?: QuantityUnit | null
  quantityUnit?: QuantityUnit | null // Computed
  preparation_time?: string | null
  preparationTime?: string | null // Computed
  prep_time_min?: number | null
  prepTimeMin?: number | null // Computed
  prep_time_max?: number | null
  prepTimeMax?: number | null // Computed
  serves?: number | null
  spice_level?: number | null
  spiceLevel?: number | null // Computed
  order_count: number
  orderCount?: number // Computed
  is_featured: boolean
  isFeatured?: boolean // Computed
  is_popular: boolean
  isPopular?: boolean // Computed
  display_order?: number | null
  displayOrder?: number | null // Computed
  created_at: string
  createdAt?: string // Computed
  updated_at: string
  updatedAt?: string // Computed
}

export interface MenuItemWithVariants extends MenuItem {
  variants: MenuItemVariant[]
}

export interface MenuItemCreate {
  name: string
  price: number
  description?: string
  category?: string
  tags?: string[]
  dietary_info?: string[]
  image_url?: string
  prep_time_min?: number
  prep_time_max?: number
  serves?: number
  spice_level?: number
  display_order?: number
  is_available?: boolean
  is_featured?: boolean
  is_popular?: boolean
  /** How much of the item — e.g. 500 (grams), 16 (oz) */
  quantity?: number | null
  /** Required when quantity is set */
  quantity_unit?: QuantityUnit | null
}

export interface MenuItemUpdate {
  name?: string;
  description?: string | null;
  price?: number;
  category?: string | null;
  tags?: string[];
  dietary_info?: string[];
  image_url?: string | null;
  is_available?: boolean;
  quantity?: number | null;
  quantity_unit?: QuantityUnit | null;
  prep_time_min?: number | null;
  prep_time_max?: number | null;
  serves?: number | null;
  spice_level?: number | null;
  is_featured?: boolean;
  is_popular?: boolean;
  display_order?: number | null;
}

// ============================================================================
// MENU ITEM VARIANT
// ============================================================================

export interface MenuItemVariant {
  id: string
  menu_item_id: string
  menuItemId?: string // Computed
  name: string
  options: VariantOption[]
  is_required: boolean
  isRequired?: boolean // Computed
  max_selections: number
  maxSelections?: number // Computed
  created_at: string
}

export interface VariantOption {
  name: string
  price: number
}

export interface MenuItemVariantCreate {
  name: string
  options: VariantOption[]
  is_required?: boolean
  max_selections?: number
}

// ============================================================================
// ORDER
// ============================================================================

export interface Order {
  id: string
  order_number: string
  orderNumber?: string // Computed
  customer_id: string
  customerId?: string // Computed
  kitchen_id: string
  kitchenId?: string // Computed
  customer_name: string
  customerName?: string // Computed
  customer_phone: string
  customerPhone?: string // Computed
  customer_email?: string
  customerEmail?: string // Computed
  status: OrderStatus
  status_history: OrderStatusHistory[]
  statusHistory?: OrderStatusHistory[] // Computed
  fulfillment_type?: 'pickup' | 'delivery'
  fulfillmentType?: 'pickup' | 'delivery' // Computed
  is_asap?: boolean
  scheduled_for?: string
  pickup_time?: string
  pickupTime?: string // Computed
  estimated_ready_time?: string
  estimatedReadyTime?: string // Computed
  actual_ready_time?: string
  actualReadyTime?: string // Computed
  picked_up_at?: string
  pickedUpAt?: string // Computed
  payment_method: PaymentMethod
  paymentMethod?: PaymentMethod // Computed
  payment_status: PaymentStatus
  paymentStatus?: PaymentStatus // Computed
  payment_reference?: string
  paymentReference?: string // Computed
  subtotal: number
  tax_rate: number
  taxRate?: number // Computed
  tax_amount: number
  taxAmount?: number // Computed
  tip_amount: number
  tipAmount?: number // Computed
  discount_amount: number
  discountAmount?: number // Computed
  platform_fee_rate?: number
  platform_fee_amount?: number
  chef_payout_amount?: number
  payout_status?: string
  payout_reference?: string
  total: number
  delivery_address?: any
  deliveryAddress?: any // Computed
  delivery_fee?: number
  deliveryFee?: number // Computed
  delivery_partner_id?: string
  deliveryPartnerId?: string // Computed
  estimated_delivery_at?: string
  estimatedDeliveryAt?: string // Computed
  delivered_at?: string
  deliveredAt?: string // Computed
  special_instructions?: string
  specialInstructions?: string // Computed
  kitchen_notes?: string
  kitchenNotes?: string // Computed
  cancellation_reason?: string
  cancellationReason?: string // Computed
  is_rated: boolean
  isRated?: boolean // Computed
  created_at: string
  createdAt?: string // Computed
  updated_at: string
  updatedAt?: string // Computed
}

export interface OrderStatusHistory {
  status: OrderStatus
  timestamp: string
  note?: string
}

export interface OrderWithItems extends Order {
  items: OrderItem[]
  kitchen?: Kitchen
  customer?: Profile
}

export interface OrderCreate {
  kitchen_id: string
  fulfillment_type: 'pickup' | 'delivery'
  pickup_time?: string
  payment_method: PaymentMethod
  items: OrderItemCreate[]
  tip_amount?: number
  discount_amount?: number
  special_instructions?: string
}

export interface OrderItemCreate {
  menu_item_id: string
  quantity: number
  selected_variants?: SelectedVariant[]
  special_instructions?: string
}

export interface SelectedVariant {
  variant_name: string
  option_name: string
  price: number
}

// ============================================================================
// ORDER ITEM
// ============================================================================

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id?: string
  item_name: string
  item_description?: string
  item_image_url?: string
  unit_price: number
  quantity: number
  total_price: number
  selected_variants?: SelectedVariant[]
  special_instructions?: string
  created_at: string
}

// ============================================================================
// REVIEW
// ============================================================================

export interface Review {
  id: string
  kitchen_id: string
  customer_id: string
  order_id?: string
  rating: number
  comment?: string
  images: string[]
  response?: string
  responded_at?: string
  is_approved: boolean
  is_flagged: boolean
  flag_reason?: string
  helpful_count: number
  created_at: string
  updated_at: string
}

export interface ReviewWithCustomer extends Review {
  customer: Profile
}

export interface ReviewCreate {
  kitchen_id: string
  order_id?: string
  rating: number
  comment?: string
  images?: string[]
}

export interface ReviewResponse {
  response: string
}

// ============================================================================
// CUISINE TYPE
// ============================================================================

export interface CuisineType {
  id: string
  name: string
  slug: string
  icon?: string
  display_order: number
  is_active: boolean
  created_at: string
}

// ============================================================================
// DIETARY OPTION
// ============================================================================

export interface DietaryOption {
  id: string
  name: string
  display_order: number
  is_active: boolean
}

// ============================================================================
// WISHLIST
// ============================================================================

export interface Wishlist {
  id: string
  user_id: string
  kitchen_id: string
  created_at: string
}

export interface WishlistWithKitchen extends Wishlist {
  kitchen: Kitchen
}

// ============================================================================
// KITCHEN GALLERY
// ============================================================================

export interface KitchenGalleryImage {
  id: string
  kitchen_id: string
  image_url: string
  caption?: string
  display_order: number
  is_cover: boolean
  created_at: string
}

// ============================================================================
// NOTIFICATION
// ============================================================================

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  data?: Json
  is_read: boolean
  read_at?: string
  created_at: string
}

// ============================================================================
// FAQ
// ============================================================================

export interface FAQ {
  id: string
  question: string
  answer: string
  category: FAQCategory
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// ============================================================================
// TESTIMONIAL
// ============================================================================

export interface Testimonial {
  id: string
  name: string
  role?: string
  avatar_url?: string
  content: string
  rating: number
  is_featured: boolean
  is_active: boolean
  display_order: number
  created_at: string
}

// ============================================================================
// ADMIN LOG
// ============================================================================

export interface AdminLog {
  id: string
  admin_id: string
  action: string
  target_type?: string
  target_id?: string
  details?: Json
  ip_address?: string
  created_at: string
}

export interface AdminLogWithAdmin extends AdminLog {
  admin: Profile
}

// ============================================================================
// ADDRESS
// ============================================================================

export interface Address {
  id: string
  user_id: string
  label: string
  address_line1: string
  address_line2?: string
  city: string
  province_code: string
  postal_code?: string
  country_code: string
  latitude?: number
  longitude?: number
  is_default: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

// ============================================================================
// PUSH TOKEN
// ============================================================================

export interface PushToken {
  id: string
  user_id: string
  token: string
  platform: 'web' | 'ios' | 'android'
  is_active: boolean
  last_used_at?: string
  created_at: string
}

// ============================================================================
// PAYMENT TRANSACTION
// ============================================================================

export type PaymentTransactionStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded' | 'disputed'
export type PaymentProvider = 'stripe' | 'manual' | 'etransfer' | 'cash'

export interface PaymentTransaction {
  id: string
  transaction_number?: string
  order_id: string
  customer_id?: string
  kitchen_id?: string
  initiated_by?: string
  provider: PaymentProvider
  provider_transaction_id?: string
  provider_charge_id?: string
  amount: number
  currency: string
  status: PaymentTransactionStatus
  failure_reason?: string
  refund_amount?: number
  refund_reason?: string
  refunded_at?: string
  raw_webhook?: Json
  metadata?: Json
  created_at: string
  updated_at: string
}

export interface PaymentTransactionWithOrder extends PaymentTransaction {
  order?: {
    id: string
    order_number: string
    total: number
    payment_method: PaymentMethod
    customer_name: string
    kitchen?: { id: string; name: string; slug: string }
  }
}

export interface PaymentTransactionCreate {
  order_id: string
  provider: PaymentProvider
  amount: number
  currency?: string
  status?: PaymentTransactionStatus
  provider_transaction_id?: string
  provider_charge_id?: string
  metadata?: Json
}

export interface PaymentTransactionUpdate {
  status?: PaymentTransactionStatus
  provider_transaction_id?: string
  provider_charge_id?: string
  failure_reason?: string
  refund_amount?: number
  refund_reason?: string
  refunded_at?: string
  raw_webhook?: Json
  metadata?: Json
}

export interface PaymentListParams {
  page?: number
  per_page?: number
  status?: PaymentTransactionStatus
  provider?: PaymentProvider
  date_from?: string
  date_to?: string
  order_id?: string
  kitchen_id?: string
  customer_id?: string
  search?: string
}

// ============================================================================
// ORDER STATUS TIMELINE
// ============================================================================

export interface OrderStatusTimeline {
  id: string
  order_id: string
  status: string
  previous_status?: string
  changed_by?: string
  changed_by_role?: string
  note?: string
  created_at: string
}

// ============================================================================
// KITCHEN STORY
// ============================================================================

export interface KitchenStory {
  id: string
  kitchen_id: string
  media_url: string
  media_type: 'image' | 'video'
  thumbnail_url?: string
  caption?: string
  view_count: number
  expires_at: string
  is_active: boolean
  created_at: string
}

// ============================================================================
// KITCHEN EVENT
// ============================================================================

export interface KitchenEvent {
  id: string
  kitchen_id: string
  title: string
  description?: string
  event_date?: string
  end_date?: string
  image_url?: string
  location_note?: string
  is_online: boolean
  max_attendees?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// ============================================================================
// DELIVERY ZONE
// ============================================================================

export interface DeliveryZone {
  id: string
  kitchen_id: string
  zone_name?: string
  zone_type: 'radius' | 'polygon'
  radius_km?: number
  polygon_coordinates?: Json
  delivery_fee: number
  min_order_for_delivery?: number
  estimated_time_min?: number
  estimated_time_max?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// ============================================================================
// DELIVERY PARTNER
// ============================================================================

export interface DeliveryPartner {
  id: string
  profile_id?: string
  name: string
  phone: string
  vehicle_type?: string
  is_active: boolean
  current_latitude?: number
  current_longitude?: number
  last_location_update?: string
  rating: number
  total_deliveries: number
  created_at: string
}
// ============================================================================
// SHARED / UTILITY TYPES
// ============================================================================

export interface PaginationMeta {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}
