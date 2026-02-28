export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            addresses: {
                Row: {
                    address_line1: string
                    address_line2: string | null
                    city: string
                    country_code: string
                    created_at: string | null
                    id: string
                    is_active: boolean | null
                    is_default: boolean | null
                    label: string | null
                    latitude: number | null
                    longitude: number | null
                    postal_code: string | null
                    province_code: string
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    address_line1: string
                    address_line2?: string | null
                    city?: string
                    country_code?: string
                    created_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    is_default?: boolean | null
                    label?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    postal_code?: string | null
                    province_code?: string
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    address_line1?: string
                    address_line2?: string | null
                    city?: string
                    country_code?: string
                    created_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    is_default?: boolean | null
                    label?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    postal_code?: string | null
                    province_code?: string
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "addresses_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "customer_order_stats"
                        referencedColumns: ["customer_id"]
                    },
                    {
                        foreignKeyName: "addresses_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            admin_logs: {
                Row: {
                    action: string
                    admin_id: string
                    created_at: string | null
                    details: Json | null
                    id: string
                    ip_address: unknown
                    target_id: string | null
                    target_type: string | null
                }
                Insert: {
                    action: string
                    admin_id: string
                    created_at?: string | null
                    details?: Json | null
                    id?: string
                    ip_address?: unknown
                    target_id?: string | null
                    target_type?: string | null
                }
                Update: {
                    action?: string
                    admin_id?: string
                    created_at?: string | null
                    details?: Json | null
                    id?: string
                    ip_address?: unknown
                    target_id?: string | null
                    target_type?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "admin_logs_admin_id_fkey"
                        columns: ["admin_id"]
                        isOneToOne: false
                        referencedRelation: "customer_order_stats"
                        referencedColumns: ["customer_id"]
                    },
                    {
                        foreignKeyName: "admin_logs_admin_id_fkey"
                        columns: ["admin_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            cuisine_types: {
                Row: {
                    created_at: string | null
                    display_order: number | null
                    icon: string | null
                    id: string
                    is_active: boolean | null
                    name: string
                    slug: string
                }
                Insert: {
                    created_at?: string | null
                    display_order?: number | null
                    icon?: string | null
                    id?: string
                    is_active?: boolean | null
                    name: string
                    slug: string
                }
                Update: {
                    created_at?: string | null
                    display_order?: number | null
                    icon?: string | null
                    id?: string
                    is_active?: boolean | null
                    name?: string
                    slug?: string
                }
                Relationships: []
            }
            delivery_partners: {
                Row: {
                    created_at: string | null
                    current_latitude: number | null
                    current_longitude: number | null
                    id: string
                    is_active: boolean | null
                    last_location_update: string | null
                    name: string
                    phone: string
                    profile_id: string | null
                    rating: number | null
                    total_deliveries: number | null
                    vehicle_type: string | null
                }
                Insert: {
                    created_at?: string | null
                    current_latitude?: number | null
                    current_longitude?: number | null
                    id?: string
                    is_active?: boolean | null
                    last_location_update?: string | null
                    name: string
                    phone: string
                    profile_id?: string | null
                    rating?: number | null
                    total_deliveries?: number | null
                    vehicle_type?: string | null
                }
                Update: {
                    created_at?: string | null
                    current_latitude?: number | null
                    current_longitude?: number | null
                    id?: string
                    is_active?: boolean | null
                    last_location_update?: string | null
                    name?: string
                    phone?: string
                    profile_id?: string | null
                    rating?: number | null
                    total_deliveries?: number | null
                    vehicle_type?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "delivery_partners_profile_id_fkey"
                        columns: ["profile_id"]
                        isOneToOne: false
                        referencedRelation: "customer_order_stats"
                        referencedColumns: ["customer_id"]
                    },
                    {
                        foreignKeyName: "delivery_partners_profile_id_fkey"
                        columns: ["profile_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            delivery_zones: {
                Row: {
                    created_at: string | null
                    delivery_fee: number
                    estimated_time_max: number | null
                    estimated_time_min: number | null
                    id: string
                    is_active: boolean | null
                    kitchen_id: string
                    min_order_for_delivery: number | null
                    polygon_coordinates: Json | null
                    radius_km: number | null
                    updated_at: string | null
                    zone_name: string | null
                    zone_type: string
                }
                Insert: {
                    created_at?: string | null
                    delivery_fee?: number
                    estimated_time_max?: number | null
                    estimated_time_min?: number | null
                    id?: string
                    is_active?: boolean | null
                    kitchen_id: string
                    min_order_for_delivery?: number | null
                    polygon_coordinates?: Json | null
                    radius_km?: number | null
                    updated_at?: string | null
                    zone_name?: string | null
                    zone_type?: string
                }
                Update: {
                    created_at?: string | null
                    delivery_fee?: number
                    estimated_time_max?: number | null
                    estimated_time_min?: number | null
                    id?: string
                    is_active?: boolean | null
                    kitchen_id?: string
                    min_order_for_delivery?: number | null
                    polygon_coordinates?: Json | null
                    radius_km?: number | null
                    updated_at?: string | null
                    zone_name?: string | null
                    zone_type?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "delivery_zones_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "admin_kitchen_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "delivery_zones_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchen_monthly_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "delivery_zones_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchens"
                        referencedColumns: ["id"]
                    },
                ]
            }
            dietary_options: {
                Row: {
                    display_order: number | null
                    id: string
                    is_active: boolean | null
                    name: string
                }
                Insert: {
                    display_order?: number | null
                    id?: string
                    is_active?: boolean | null
                    name: string
                }
                Update: {
                    display_order?: number | null
                    id?: string
                    is_active?: boolean | null
                    name?: string
                }
                Relationships: []
            }
            driver_locations: {
                Row: {
                    driver_id: string
                    id: string
                    latitude: number
                    longitude: number
                    order_id: string | null
                    recorded_at: string | null
                }
                Insert: {
                    driver_id: string
                    id?: string
                    latitude: number
                    longitude: number
                    order_id?: string | null
                    recorded_at?: string | null
                }
                Update: {
                    driver_id?: string
                    id?: string
                    latitude?: number
                    longitude?: number
                    order_id?: string | null
                    recorded_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "driver_locations_driver_id_fkey"
                        columns: ["driver_id"]
                        isOneToOne: false
                        referencedRelation: "delivery_partners"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "driver_locations_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                ]
            }
            faqs: {
                Row: {
                    answer: string
                    category: string | null
                    created_at: string | null
                    display_order: number | null
                    id: string
                    is_active: boolean | null
                    question: string
                    updated_at: string | null
                }
                Insert: {
                    answer: string
                    category?: string | null
                    created_at?: string | null
                    display_order?: number | null
                    id?: string
                    is_active?: boolean | null
                    question: string
                    updated_at?: string | null
                }
                Update: {
                    answer?: string
                    category?: string | null
                    created_at?: string | null
                    display_order?: number | null
                    id?: string
                    is_active?: boolean | null
                    question?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
            kitchen_cuisine_types: {
                Row: {
                    created_at: string | null
                    cuisine_type_id: string
                    id: string
                    kitchen_id: string
                }
                Insert: {
                    created_at?: string | null
                    cuisine_type_id: string
                    id?: string
                    kitchen_id: string
                }
                Update: {
                    created_at?: string | null
                    cuisine_type_id?: string
                    id?: string
                    kitchen_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "kitchen_cuisine_types_cuisine_type_id_fkey"
                        columns: ["cuisine_type_id"]
                        isOneToOne: false
                        referencedRelation: "cuisine_types"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "kitchen_cuisine_types_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "admin_kitchen_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "kitchen_cuisine_types_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchen_monthly_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "kitchen_cuisine_types_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchens"
                        referencedColumns: ["id"]
                    },
                ]
            }
            kitchen_dietary_options: {
                Row: {
                    created_at: string | null
                    dietary_option_id: string
                    id: string
                    kitchen_id: string
                }
                Insert: {
                    created_at?: string | null
                    dietary_option_id: string
                    id?: string
                    kitchen_id: string
                }
                Update: {
                    created_at?: string | null
                    dietary_option_id?: string
                    id?: string
                    kitchen_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "kitchen_dietary_options_dietary_id_fkey"
                        columns: ["dietary_option_id"]
                        isOneToOne: false
                        referencedRelation: "dietary_options"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "kitchen_dietary_options_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "admin_kitchen_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "kitchen_dietary_options_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchen_monthly_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "kitchen_dietary_options_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchens"
                        referencedColumns: ["id"]
                    },
                ]
            }
            kitchen_events: {
                Row: {
                    created_at: string | null
                    description: string | null
                    end_date: string | null
                    event_date: string | null
                    id: string
                    image_url: string | null
                    is_active: boolean | null
                    is_online: boolean | null
                    kitchen_id: string
                    location_note: string | null
                    max_attendees: number | null
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    end_date?: string | null
                    event_date?: string | null
                    id?: string
                    image_url?: string | null
                    is_active?: boolean | null
                    is_online?: boolean | null
                    kitchen_id: string
                    location_note?: string | null
                    max_attendees?: number | null
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    end_date?: string | null
                    event_date?: string | null
                    id?: string
                    image_url?: string | null
                    is_active?: boolean | null
                    is_online?: boolean | null
                    kitchen_id?: string
                    location_note?: string | null
                    max_attendees?: number | null
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "kitchen_events_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "admin_kitchen_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "kitchen_events_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchen_monthly_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "kitchen_events_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchens"
                        referencedColumns: ["id"]
                    },
                ]
            }
            kitchen_gallery: {
                Row: {
                    caption: string | null
                    created_at: string | null
                    display_order: number | null
                    id: string
                    image_url: string
                    is_cover: boolean | null
                    kitchen_id: string
                }
                Insert: {
                    caption?: string | null
                    created_at?: string | null
                    display_order?: number | null
                    id?: string
                    image_url: string
                    is_cover?: boolean | null
                    kitchen_id: string
                }
                Update: {
                    caption?: string | null
                    created_at?: string | null
                    display_order?: number | null
                    id?: string
                    image_url?: string
                    is_cover?: boolean | null
                    kitchen_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "kitchen_gallery_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "admin_kitchen_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "kitchen_gallery_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchen_monthly_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "kitchen_gallery_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchens"
                        referencedColumns: ["id"]
                    },
                ]
            }
            kitchen_hours: {
                Row: {
                    close_time: string | null
                    created_at: string | null
                    day_of_week: number
                    id: string
                    is_closed: boolean | null
                    kitchen_id: string
                    open_time: string | null
                }
                Insert: {
                    close_time?: string | null
                    created_at?: string | null
                    day_of_week: number
                    id?: string
                    is_closed?: boolean | null
                    kitchen_id: string
                    open_time?: string | null
                }
                Update: {
                    close_time?: string | null
                    created_at?: string | null
                    day_of_week?: number
                    id?: string
                    is_closed?: boolean | null
                    kitchen_id?: string
                    open_time?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "kitchen_hours_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "admin_kitchen_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "kitchen_hours_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchen_monthly_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "kitchen_hours_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchens"
                        referencedColumns: ["id"]
                    },
                ]
            }
            kitchen_stories: {
                Row: {
                    caption: string | null
                    created_at: string | null
                    expires_at: string | null
                    id: string
                    is_active: boolean | null
                    kitchen_id: string
                    media_type: string
                    media_url: string
                    thumbnail_url: string | null
                    view_count: number | null
                }
                Insert: {
                    caption?: string | null
                    created_at?: string | null
                    expires_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    kitchen_id: string
                    media_type?: string
                    media_url: string
                    thumbnail_url?: string | null
                    view_count?: number | null
                }
                Update: {
                    caption?: string | null
                    created_at?: string | null
                    expires_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    kitchen_id?: string
                    media_type?: string
                    media_url?: string
                    thumbnail_url?: string | null
                    view_count?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "kitchen_stories_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "admin_kitchen_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "kitchen_stories_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchen_monthly_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "kitchen_stories_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchens"
                        referencedColumns: ["id"]
                    },
                ]
            }
            kitchens: {
                Row: {
                    accepting_orders: boolean | null
                    address: string | null
                    city: string | null
                    commission_rate: number | null
                    cover_image_url: string | null
                    created_at: string | null
                    delivery_available: boolean | null
                    description: string | null
                    email: string | null
                    food_handler_certificate: boolean | null
                    id: string
                    is_active: boolean | null
                    is_featured: boolean | null
                    latitude: number | null
                    logo_url: string | null
                    longitude: number | null
                    minimum_order: number | null
                    name: string
                    neighborhood: string | null
                    owner_id: string
                    phone: string
                    pickup_available: boolean | null
                    postal_code: string | null
                    prep_time_max: number | null
                    prep_time_min: number | null
                    preparation_time: string | null
                    province: string | null
                    rating: number | null
                    review_count: number | null
                    search_vector: unknown
                    service_radius_km: number | null
                    short_description: string | null
                    slug: string
                    specialties: string[] | null
                    stripe_account_id: string | null
                    stripe_onboarding_complete: boolean | null
                    tagline: string | null
                    total_orders: number | null
                    total_revenue: number | null
                    updated_at: string | null
                    verification_status: string | null
                    verified_at: string | null
                    verified_by: string | null
                }
                Insert: {
                    accepting_orders?: boolean | null
                    address?: string | null
                    city?: string | null
                    commission_rate?: number | null
                    cover_image_url?: string | null
                    created_at?: string | null
                    delivery_available?: boolean | null
                    description?: string | null
                    email?: string | null
                    food_handler_certificate?: boolean | null
                    id?: string
                    is_active?: boolean | null
                    is_featured?: boolean | null
                    latitude?: number | null
                    logo_url?: string | null
                    longitude?: number | null
                    minimum_order?: number | null
                    name: string
                    neighborhood?: string | null
                    owner_id: string
                    phone: string
                    pickup_available?: boolean | null
                    postal_code?: string | null
                    prep_time_max?: number | null
                    prep_time_min?: number | null
                    preparation_time?: string | null
                    province?: string | null
                    rating?: number | null
                    review_count?: number | null
                    search_vector?: unknown
                    service_radius_km?: number | null
                    short_description?: string | null
                    slug: string
                    specialties?: string[] | null
                    stripe_account_id?: string | null
                    stripe_onboarding_complete?: boolean | null
                    tagline?: string | null
                    total_orders?: number | null
                    total_revenue?: number | null
                    updated_at?: string | null
                    verification_status?: string | null
                    verified_at?: string | null
                    verified_by?: string | null
                }
                Update: {
                    accepting_orders?: boolean | null
                    address?: string | null
                    city?: string | null
                    commission_rate?: number | null
                    cover_image_url?: string | null
                    created_at?: string | null
                    delivery_available?: boolean | null
                    description?: string | null
                    email?: string | null
                    food_handler_certificate?: boolean | null
                    id?: string
                    is_active?: boolean | null
                    is_featured?: boolean | null
                    latitude?: number | null
                    logo_url?: string | null
                    longitude?: number | null
                    minimum_order?: number | null
                    name?: string
                    neighborhood?: string | null
                    owner_id?: string
                    phone?: string
                    pickup_available?: boolean | null
                    postal_code?: string | null
                    prep_time_max?: number | null
                    prep_time_min?: number | null
                    preparation_time?: string | null
                    province?: string | null
                    rating?: number | null
                    review_count?: number | null
                    search_vector?: unknown
                    service_radius_km?: number | null
                    short_description?: string | null
                    slug?: string
                    specialties?: string[] | null
                    stripe_account_id?: string | null
                    stripe_onboarding_complete?: boolean | null
                    tagline?: string | null
                    total_orders?: number | null
                    total_revenue?: number | null
                    updated_at?: string | null
                    verification_status?: string | null
                    verified_at?: string | null
                    verified_by?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "kitchens_owner_id_fkey"
                        columns: ["owner_id"]
                        isOneToOne: false
                        referencedRelation: "customer_order_stats"
                        referencedColumns: ["customer_id"]
                    },
                    {
                        foreignKeyName: "kitchens_owner_id_fkey"
                        columns: ["owner_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "kitchens_province_fkey"
                        columns: ["province"]
                        isOneToOne: false
                        referencedRelation: "provinces"
                        referencedColumns: ["code"]
                    },
                    {
                        foreignKeyName: "kitchens_verified_by_fkey"
                        columns: ["verified_by"]
                        isOneToOne: false
                        referencedRelation: "customer_order_stats"
                        referencedColumns: ["customer_id"]
                    },
                    {
                        foreignKeyName: "kitchens_verified_by_fkey"
                        columns: ["verified_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            menu_item_variants: {
                Row: {
                    created_at: string | null
                    id: string
                    is_required: boolean | null
                    max_selections: number | null
                    menu_item_id: string
                    name: string
                    options: Json
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    is_required?: boolean | null
                    max_selections?: number | null
                    menu_item_id: string
                    name: string
                    options: Json
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    is_required?: boolean | null
                    max_selections?: number | null
                    menu_item_id?: string
                    name?: string
                    options?: Json
                }
                Relationships: [
                    {
                        foreignKeyName: "menu_item_variants_menu_item_id_fkey"
                        columns: ["menu_item_id"]
                        isOneToOne: false
                        referencedRelation: "admin_menu_item_stats"
                        referencedColumns: ["menu_item_id"]
                    },
                    {
                        foreignKeyName: "menu_item_variants_menu_item_id_fkey"
                        columns: ["menu_item_id"]
                        isOneToOne: false
                        referencedRelation: "menu_items"
                        referencedColumns: ["id"]
                    },
                ]
            }
            menu_items: {
                Row: {
                    available_quantity: number | null
                    category: string | null
                    compare_price: number | null
                    created_at: string | null
                    description: string | null
                    dietary_info: string[] | null
                    display_order: number | null
                    id: string
                    image_url: string | null
                    is_available: boolean | null
                    is_featured: boolean | null
                    is_popular: boolean | null
                    kitchen_id: string
                    name: string
                    order_count: number | null
                    prep_time_max: number | null
                    prep_time_min: number | null
                    preparation_time: string | null
                    price: number
                    serves: number | null
                    spice_level: number | null
                    tags: string[] | null
                    updated_at: string | null
                }
                Insert: {
                    available_quantity?: number | null
                    category?: string | null
                    compare_price?: number | null
                    created_at?: string | null
                    description?: string | null
                    dietary_info?: string[] | null
                    display_order?: number | null
                    id?: string
                    image_url?: string | null
                    is_available?: boolean | null
                    is_featured?: boolean | null
                    is_popular?: boolean | null
                    kitchen_id: string
                    name: string
                    order_count?: number | null
                    prep_time_max?: number | null
                    prep_time_min?: number | null
                    preparation_time?: string | null
                    price: number
                    serves?: number | null
                    spice_level?: number | null
                    tags?: string[] | null
                    updated_at?: string | null
                }
                Update: {
                    available_quantity?: number | null
                    category?: string | null
                    compare_price?: number | null
                    created_at?: string | null
                    description?: string | null
                    dietary_info?: string[] | null
                    display_order?: number | null
                    id?: string
                    image_url?: string | null
                    is_available?: boolean | null
                    is_featured?: boolean | null
                    is_popular?: boolean | null
                    kitchen_id?: string
                    name?: string
                    order_count?: number | null
                    prep_time_max?: number | null
                    prep_time_min?: number | null
                    preparation_time?: string | null
                    price?: number
                    serves?: number | null
                    spice_level?: number | null
                    tags?: string[] | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "menu_items_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "admin_kitchen_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "menu_items_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchen_monthly_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "menu_items_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchens"
                        referencedColumns: ["id"]
                    },
                ]
            }
            notifications: {
                Row: {
                    created_at: string | null
                    data: Json | null
                    id: string
                    is_read: boolean | null
                    message: string
                    read_at: string | null
                    title: string
                    type: string
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    data?: Json | null
                    id?: string
                    is_read?: boolean | null
                    message: string
                    read_at?: string | null
                    title: string
                    type: string
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    data?: Json | null
                    id?: string
                    is_read?: boolean | null
                    message?: string
                    read_at?: string | null
                    title?: string
                    type?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "notifications_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "customer_order_stats"
                        referencedColumns: ["customer_id"]
                    },
                    {
                        foreignKeyName: "notifications_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            order_items: {
                Row: {
                    created_at: string | null
                    id: string
                    item_description: string | null
                    item_image_url: string | null
                    item_name: string
                    menu_item_id: string | null
                    order_id: string
                    quantity: number
                    selected_variants: Json | null
                    special_instructions: string | null
                    total_price: number
                    unit_price: number
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    item_description?: string | null
                    item_image_url?: string | null
                    item_name: string
                    menu_item_id?: string | null
                    order_id: string
                    quantity?: number
                    selected_variants?: Json | null
                    special_instructions?: string | null
                    total_price: number
                    unit_price: number
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    item_description?: string | null
                    item_image_url?: string | null
                    item_name?: string
                    menu_item_id?: string | null
                    order_id?: string
                    quantity?: number
                    selected_variants?: Json | null
                    special_instructions?: string | null
                    total_price?: number
                    unit_price?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "order_items_menu_item_id_fkey"
                        columns: ["menu_item_id"]
                        isOneToOne: false
                        referencedRelation: "admin_menu_item_stats"
                        referencedColumns: ["menu_item_id"]
                    },
                    {
                        foreignKeyName: "order_items_menu_item_id_fkey"
                        columns: ["menu_item_id"]
                        isOneToOne: false
                        referencedRelation: "menu_items"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "order_items_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                ]
            }
            order_status_timeline: {
                Row: {
                    changed_by: string | null
                    changed_by_role: string | null
                    created_at: string | null
                    id: string
                    note: string | null
                    order_id: string
                    previous_status: string | null
                    status: string
                }
                Insert: {
                    changed_by?: string | null
                    changed_by_role?: string | null
                    created_at?: string | null
                    id?: string
                    note?: string | null
                    order_id: string
                    previous_status?: string | null
                    status: string
                }
                Update: {
                    changed_by?: string | null
                    changed_by_role?: string | null
                    created_at?: string | null
                    id?: string
                    note?: string | null
                    order_id?: string
                    previous_status?: string | null
                    status?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "order_status_timeline_changed_by_fkey"
                        columns: ["changed_by"]
                        isOneToOne: false
                        referencedRelation: "customer_order_stats"
                        referencedColumns: ["customer_id"]
                    },
                    {
                        foreignKeyName: "order_status_timeline_changed_by_fkey"
                        columns: ["changed_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "order_status_timeline_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                ]
            }
            orders: {
                Row: {
                    actual_ready_time: string | null
                    cancellation_reason: string | null
                    chef_payout_amount: number | null
                    created_at: string | null
                    customer_email: string | null
                    customer_id: string
                    customer_name: string
                    customer_phone: string
                    delivered_at: string | null
                    delivery_address: Json | null
                    delivery_fee: number | null
                    delivery_partner_id: string | null
                    discount_amount: number | null
                    estimated_delivery_at: string | null
                    estimated_ready_time: string | null
                    fulfillment_type: string
                    id: string
                    is_asap: boolean | null
                    is_rated: boolean | null
                    kitchen_id: string
                    kitchen_notes: string | null
                    order_number: string
                    payment_method: string
                    payment_reference: string | null
                    payment_status: string | null
                    payout_reference: string | null
                    payout_status: string | null
                    picked_up_at: string | null
                    pickup_time: string | null
                    platform_fee_amount: number | null
                    platform_fee_rate: number | null
                    scheduled_for: string | null
                    special_instructions: string | null
                    status: string
                    status_history: Json | null
                    subtotal: number
                    tax_amount: number
                    tax_rate: number | null
                    tip_amount: number | null
                    total: number
                    updated_at: string | null
                }
                Insert: {
                    actual_ready_time?: string | null
                    cancellation_reason?: string | null
                    chef_payout_amount?: number | null
                    created_at?: string | null
                    customer_email?: string | null
                    customer_id: string
                    customer_name: string
                    customer_phone: string
                    delivered_at?: string | null
                    delivery_address?: Json | null
                    delivery_fee?: number | null
                    delivery_partner_id?: string | null
                    discount_amount?: number | null
                    estimated_delivery_at?: string | null
                    estimated_ready_time?: string | null
                    fulfillment_type?: string
                    id?: string
                    is_asap?: boolean | null
                    is_rated?: boolean | null
                    kitchen_id: string
                    kitchen_notes?: string | null
                    order_number: string
                    payment_method: string
                    payment_reference?: string | null
                    payment_status?: string | null
                    payout_reference?: string | null
                    payout_status?: string | null
                    picked_up_at?: string | null
                    pickup_time?: string | null
                    platform_fee_amount?: number | null
                    platform_fee_rate?: number | null
                    scheduled_for?: string | null
                    special_instructions?: string | null
                    status?: string
                    status_history?: Json | null
                    subtotal: number
                    tax_amount: number
                    tax_rate?: number | null
                    tip_amount?: number | null
                    total: number
                    updated_at?: string | null
                }
                Update: {
                    actual_ready_time?: string | null
                    cancellation_reason?: string | null
                    chef_payout_amount?: number | null
                    created_at?: string | null
                    customer_email?: string | null
                    customer_id?: string
                    customer_name?: string
                    customer_phone?: string
                    delivered_at?: string | null
                    delivery_address?: Json | null
                    delivery_fee?: number | null
                    delivery_partner_id?: string | null
                    discount_amount?: number | null
                    estimated_delivery_at?: string | null
                    estimated_ready_time?: string | null
                    fulfillment_type?: string
                    id?: string
                    is_asap?: boolean | null
                    is_rated?: boolean | null
                    kitchen_id?: string
                    kitchen_notes?: string | null
                    order_number?: string
                    payment_method?: string
                    payment_reference?: string | null
                    payment_status?: string | null
                    payout_reference?: string | null
                    payout_status?: string | null
                    picked_up_at?: string | null
                    pickup_time?: string | null
                    platform_fee_amount?: number | null
                    platform_fee_rate?: number | null
                    scheduled_for?: string | null
                    special_instructions?: string | null
                    status?: string
                    status_history?: Json | null
                    subtotal?: number
                    tax_amount?: number
                    tax_rate?: number | null
                    tip_amount?: number | null
                    total?: number
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "orders_customer_id_fkey"
                        columns: ["customer_id"]
                        isOneToOne: false
                        referencedRelation: "customer_order_stats"
                        referencedColumns: ["customer_id"]
                    },
                    {
                        foreignKeyName: "orders_customer_id_fkey"
                        columns: ["customer_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "orders_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "admin_kitchen_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "orders_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchen_monthly_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "orders_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchens"
                        referencedColumns: ["id"]
                    },
                ]
            }
            payment_transactions: {
                Row: {
                    amount: number
                    created_at: string | null
                    currency: string
                    failure_reason: string | null
                    id: string
                    metadata: Json | null
                    order_id: string
                    provider: string
                    provider_charge_id: string | null
                    provider_transaction_id: string | null
                    raw_webhook: Json | null
                    refund_amount: number | null
                    refund_reason: string | null
                    status: string
                    updated_at: string | null
                }
                Insert: {
                    amount: number
                    created_at?: string | null
                    currency?: string
                    failure_reason?: string | null
                    id?: string
                    metadata?: Json | null
                    order_id: string
                    provider?: string
                    provider_charge_id?: string | null
                    provider_transaction_id?: string | null
                    raw_webhook?: Json | null
                    refund_amount?: number | null
                    refund_reason?: string | null
                    status?: string
                    updated_at?: string | null
                }
                Update: {
                    amount?: number
                    created_at?: string | null
                    currency?: string
                    failure_reason?: string | null
                    id?: string
                    metadata?: Json | null
                    order_id?: string
                    provider?: string
                    provider_charge_id?: string | null
                    provider_transaction_id?: string | null
                    raw_webhook?: Json | null
                    refund_amount?: number | null
                    refund_reason?: string | null
                    status?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "payment_transactions_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    address_line1: string | null
                    address_line2: string | null
                    avatar_url: string | null
                    city: string | null
                    created_at: string | null
                    email: string
                    email_change_count: number
                    email_verified: boolean | null
                    fcm_token: string | null
                    first_name: string | null
                    id: string
                    is_active: boolean | null
                    last_login_at: string | null
                    last_name: string | null
                    latitude: number | null
                    longitude: number | null
                    name: string
                    phone: string | null
                    phone_verified: boolean | null
                    postal_code: string | null
                    province: string | null
                    push_enabled: boolean | null
                    role: string
                    subscription_expires_at: string | null
                    subscription_plan: string | null
                    subscription_status: string | null
                    updated_at: string | null
                }
                Insert: {
                    address_line1?: string | null
                    address_line2?: string | null
                    avatar_url?: string | null
                    city?: string | null
                    created_at?: string | null
                    email: string
                    email_change_count?: number
                    email_verified?: boolean | null
                    fcm_token?: string | null
                    first_name?: string | null
                    id: string
                    is_active?: boolean | null
                    last_login_at?: string | null
                    last_name?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    name: string
                    phone?: string | null
                    phone_verified?: boolean | null
                    postal_code?: string | null
                    province?: string | null
                    push_enabled?: boolean | null
                    role?: string
                    subscription_expires_at?: string | null
                    subscription_plan?: string | null
                    subscription_status?: string | null
                    updated_at?: string | null
                }
                Update: {
                    address_line1?: string | null
                    address_line2?: string | null
                    avatar_url?: string | null
                    city?: string | null
                    created_at?: string | null
                    email?: string
                    email_change_count?: number
                    email_verified?: boolean | null
                    fcm_token?: string | null
                    first_name?: string | null
                    id?: string
                    is_active?: boolean | null
                    last_login_at?: string | null
                    last_name?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    name?: string
                    phone?: string | null
                    phone_verified?: boolean | null
                    postal_code?: string | null
                    province?: string | null
                    push_enabled?: boolean | null
                    role?: string
                    subscription_expires_at?: string | null
                    subscription_plan?: string | null
                    subscription_status?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_province_fkey"
                        columns: ["province"]
                        isOneToOne: false
                        referencedRelation: "provinces"
                        referencedColumns: ["code"]
                    },
                ]
            }
            provinces: {
                Row: {
                    code: string
                    country_code: string
                    display_order: number | null
                    id: string
                    is_active: boolean | null
                    name: string
                }
                Insert: {
                    code: string
                    country_code?: string
                    display_order?: number | null
                    id?: string
                    is_active?: boolean | null
                    name: string
                }
                Update: {
                    code?: string
                    country_code?: string
                    display_order?: number | null
                    id?: string
                    is_active?: boolean | null
                    name?: string
                }
                Relationships: []
            }
            push_tokens: {
                Row: {
                    created_at: string | null
                    id: string
                    is_active: boolean | null
                    last_used_at: string | null
                    platform: string
                    token: string
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    last_used_at?: string | null
                    platform: string
                    token: string
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    last_used_at?: string | null
                    platform?: string
                    token?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "push_tokens_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "customer_order_stats"
                        referencedColumns: ["customer_id"]
                    },
                    {
                        foreignKeyName: "push_tokens_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            reviews: {
                Row: {
                    comment: string | null
                    created_at: string | null
                    customer_id: string
                    flag_reason: string | null
                    helpful_count: number | null
                    id: string
                    images: string[] | null
                    is_approved: boolean | null
                    is_flagged: boolean | null
                    kitchen_id: string
                    order_id: string | null
                    rating: number
                    responded_at: string | null
                    response: string | null
                    updated_at: string | null
                }
                Insert: {
                    comment?: string | null
                    created_at?: string | null
                    customer_id: string
                    flag_reason?: string | null
                    helpful_count?: number | null
                    id?: string
                    images?: string[] | null
                    is_approved?: boolean | null
                    is_flagged?: boolean | null
                    kitchen_id: string
                    order_id?: string | null
                    rating: number
                    responded_at?: string | null
                    response?: string | null
                    updated_at?: string | null
                }
                Update: {
                    comment?: string | null
                    created_at?: string | null
                    customer_id?: string
                    flag_reason?: string | null
                    helpful_count?: number | null
                    id?: string
                    images?: string[] | null
                    is_approved?: boolean | null
                    is_flagged?: boolean | null
                    kitchen_id?: string
                    order_id?: string | null
                    rating?: number
                    responded_at?: string | null
                    response?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "reviews_customer_id_fkey"
                        columns: ["customer_id"]
                        isOneToOne: false
                        referencedRelation: "customer_order_stats"
                        referencedColumns: ["customer_id"]
                    },
                    {
                        foreignKeyName: "reviews_customer_id_fkey"
                        columns: ["customer_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reviews_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "admin_kitchen_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "reviews_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchen_monthly_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "reviews_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchens"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reviews_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                ]
            }
            spatial_ref_sys: {
                Row: {
                    auth_name: string | null
                    auth_srid: number | null
                    proj4text: string | null
                    srid: number
                    srtext: string | null
                }
                Insert: {
                    auth_name?: string | null
                    auth_srid?: number | null
                    proj4text?: string | null
                    srid: number
                    srtext?: string | null
                }
                Update: {
                    auth_name?: string | null
                    auth_srid?: number | null
                    proj4text?: string | null
                    srid?: number
                    srtext?: string | null
                }
                Relationships: []
            }
            testimonials: {
                Row: {
                    avatar_url: string | null
                    content: string
                    created_at: string | null
                    display_order: number | null
                    id: string
                    is_active: boolean | null
                    is_featured: boolean | null
                    name: string
                    rating: number | null
                    role: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    content: string
                    created_at?: string | null
                    display_order?: number | null
                    id?: string
                    is_active?: boolean | null
                    is_featured?: boolean | null
                    name: string
                    rating?: number | null
                    role?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    content?: string
                    created_at?: string | null
                    display_order?: number | null
                    id?: string
                    is_active?: boolean | null
                    is_featured?: boolean | null
                    name?: string
                    rating?: number | null
                    role?: string | null
                }
                Relationships: []
            }
            wishlists: {
                Row: {
                    created_at: string | null
                    id: string
                    kitchen_id: string
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    kitchen_id: string
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    kitchen_id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "wishlists_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "admin_kitchen_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "wishlists_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchen_monthly_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "wishlists_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchens"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "wishlists_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "customer_order_stats"
                        referencedColumns: ["customer_id"]
                    },
                    {
                        foreignKeyName: "wishlists_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            admin_kitchen_stats: {
                Row: {
                    avg_order_value: number | null
                    cancelled_orders: number | null
                    completed_orders: number | null
                    is_active: boolean | null
                    joined_at: string | null
                    kitchen_id: string | null
                    kitchen_name: string | null
                    neighborhood: string | null
                    platform_revenue: number | null
                    rating: number | null
                    review_count: number | null
                    total_orders: number | null
                    total_revenue: number | null
                    verification_status: string | null
                    wishlist_count: number | null
                }
                Relationships: []
            }
            admin_menu_item_stats: {
                Row: {
                    created_at: string | null
                    is_available: boolean | null
                    is_featured: boolean | null
                    is_popular: boolean | null
                    item_name: string | null
                    kitchen_id: string | null
                    kitchen_name: string | null
                    menu_item_id: string | null
                    order_count: number | null
                    price: number | null
                    times_ordered: number | null
                    total_revenue_generated: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "menu_items_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "admin_kitchen_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "menu_items_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchen_monthly_stats"
                        referencedColumns: ["kitchen_id"]
                    },
                    {
                        foreignKeyName: "menu_items_kitchen_id_fkey"
                        columns: ["kitchen_id"]
                        isOneToOne: false
                        referencedRelation: "kitchens"
                        referencedColumns: ["id"]
                    },
                ]
            }
            customer_order_stats: {
                Row: {
                    avg_order_value: number | null
                    completed_orders: number | null
                    customer_id: string | null
                    customer_name: string | null
                    last_order_at: string | null
                    total_orders_placed: number | null
                    total_saved: number | null
                    total_spent: number | null
                    unique_kitchens_ordered_from: number | null
                }
                Relationships: []
            }
            geography_columns: {
                Row: {
                    coord_dimension: number | null
                    f_geography_column: unknown
                    f_table_catalog: unknown
                    f_table_name: unknown
                    f_table_schema: unknown
                    srid: number | null
                    type: string | null
                }
                Relationships: []
            }
            geometry_columns: {
                Row: {
                    coord_dimension: number | null
                    f_geometry_column: unknown
                    f_table_catalog: string | null
                    f_table_name: unknown
                    f_table_schema: unknown
                    srid: number | null
                    type: string | null
                }
                Insert: {
                    coord_dimension?: number | null
                    f_geometry_column?: unknown
                    f_table_catalog?: string | null
                    f_table_name?: unknown
                    f_table_schema?: unknown
                    srid?: number | null
                    type?: string | null
                }
                Update: {
                    coord_dimension?: number | null
                    f_geometry_column?: unknown
                    f_table_catalog?: string | null
                    f_table_name?: unknown
                    f_table_schema?: unknown
                    srid?: number | null
                    type?: string | null
                }
                Relationships: []
            }
            kitchen_monthly_stats: {
                Row: {
                    avg_order_value: number | null
                    cancelled_orders: number | null
                    completed_orders: number | null
                    gross_revenue: number | null
                    kitchen_id: string | null
                    kitchen_name: string | null
                    month: string | null
                    net_revenue: number | null
                    platform_fees_paid: number | null
                    total_orders: number | null
                    unique_customers: number | null
                }
                Relationships: []
            }
        }
        Functions: {
            _postgis_deprecate: {
                Args: { newname: string; oldname: string; version: string }
                Returns: undefined
            }
            _postgis_index_extent: {
                Args: { col: string; tbl: unknown }
                Returns: unknown
            }
            _postgis_pgsql_version: { Args: never; Returns: string }
            _postgis_scripts_pgsql_version: { Args: never; Returns: string }
            _postgis_selectivity: {
                Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
                Returns: number
            }
            _postgis_stats: {
                Args: { ""?: string; att_name: string; tbl: unknown }
                Returns: string
            }
            _st_3dintersects: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            _st_contains: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            _st_containsproperly: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            _st_coveredby:
            | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
            | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
            _st_covers:
            | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
            | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
            _st_crosses: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            _st_dwithin: {
                Args: {
                    geog1: unknown
                    geog2: unknown
                    tolerance: number
                    use_spheroid?: boolean
                }
                Returns: boolean
            }
            _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
            _st_intersects: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            _st_linecrossingdirection: {
                Args: { line1: unknown; line2: unknown }
                Returns: number
            }
            _st_longestline: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: unknown
            }
            _st_maxdistance: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: number
            }
            _st_orderingequals: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            _st_overlaps: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            _st_sortablehash: { Args: { geom: unknown }; Returns: number }
            _st_touches: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            _st_voronoi: {
                Args: {
                    clip?: unknown
                    g1: unknown
                    return_polygons?: boolean
                    tolerance?: number
                }
                Returns: unknown
            }
            _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
            addauth: { Args: { "": string }; Returns: boolean }
            addgeometrycolumn:
            | {
                Args: {
                    catalog_name: string
                    column_name: string
                    new_dim: number
                    new_srid_in: number
                    new_type: string
                    schema_name: string
                    table_name: string
                    use_typmod?: boolean
                }
                Returns: string
            }
            | {
                Args: {
                    column_name: string
                    new_dim: number
                    new_srid: number
                    new_type: string
                    schema_name: string
                    table_name: string
                    use_typmod?: boolean
                }
                Returns: string
            }
            | {
                Args: {
                    column_name: string
                    new_dim: number
                    new_srid: number
                    new_type: string
                    table_name: string
                    use_typmod?: boolean
                }
                Returns: string
            }
            disablelongtransactions: { Args: never; Returns: string }
            dropgeometrycolumn:
            | {
                Args: {
                    catalog_name: string
                    column_name: string
                    schema_name: string
                    table_name: string
                }
                Returns: string
            }
            | {
                Args: {
                    column_name: string
                    schema_name: string
                    table_name: string
                }
                Returns: string
            }
            | { Args: { column_name: string; table_name: string }; Returns: string }
            dropgeometrytable:
            | {
                Args: {
                    catalog_name: string
                    schema_name: string
                    table_name: string
                }
                Returns: string
            }
            | { Args: { schema_name: string; table_name: string }; Returns: string }
            | { Args: { table_name: string }; Returns: string }
            enablelongtransactions: { Args: never; Returns: string }
            equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
            geometry: { Args: { "": string }; Returns: unknown }
            geometry_above: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_below: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_cmp: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: number
            }
            geometry_contained_3d: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_contains: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_contains_3d: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_distance_box: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: number
            }
            geometry_distance_centroid: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: number
            }
            geometry_eq: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_ge: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_gt: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_le: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_left: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_lt: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_overabove: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_overbelow: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_overlaps: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_overlaps_3d: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_overleft: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_overright: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_right: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_same: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_same_3d: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geometry_within: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            geomfromewkt: { Args: { "": string }; Returns: unknown }
            gettransactionid: { Args: never; Returns: unknown }
            longtransactionsenabled: { Args: never; Returns: boolean }
            populate_geometry_columns:
            | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
            | { Args: { use_typmod?: boolean }; Returns: string }
            postgis_constraint_dims: {
                Args: { geomcolumn: string; geomschema: string; geomtable: string }
                Returns: number
            }
            postgis_constraint_srid: {
                Args: { geomcolumn: string; geomschema: string; geomtable: string }
                Returns: number
            }
            postgis_constraint_type: {
                Args: { geomcolumn: string; geomschema: string; geomtable: string }
                Returns: string
            }
            postgis_extensions_upgrade: { Args: never; Returns: string }
            postgis_full_version: { Args: never; Returns: string }
            postgis_geos_version: { Args: never; Returns: string }
            postgis_lib_build_date: { Args: never; Returns: string }
            postgis_lib_revision: { Args: never; Returns: string }
            postgis_lib_version: { Args: never; Returns: string }
            postgis_libjson_version: { Args: never; Returns: string }
            postgis_liblwgeom_version: { Args: never; Returns: string }
            postgis_libprotobuf_version: { Args: never; Returns: string }
            postgis_libxml_version: { Args: never; Returns: string }
            postgis_proj_version: { Args: never; Returns: string }
            postgis_scripts_build_date: { Args: never; Returns: string }
            postgis_scripts_installed: { Args: never; Returns: string }
            postgis_scripts_released: { Args: never; Returns: string }
            postgis_svn_version: { Args: never; Returns: string }
            postgis_type_name: {
                Args: {
                    coord_dimension: number
                    geomname: string
                    use_new_name?: boolean
                }
                Returns: string
            }
            postgis_version: { Args: never; Returns: string }
            postgis_wagyu_version: { Args: never; Returns: string }
            show_limit: { Args: never; Returns: number }
            show_trgm: { Args: { "": string }; Returns: string[] }
            st_3dclosestpoint: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: unknown
            }
            st_3ddistance: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: number
            }
            st_3dintersects: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            st_3dlongestline: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: unknown
            }
            st_3dmakebox: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: unknown
            }
            st_3dmaxdistance: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: number
            }
            st_3dshortestline: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: unknown
            }
            st_addpoint: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: unknown
            }
            st_angle:
            | { Args: { line1: unknown; line2: unknown }; Returns: number }
            | {
                Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
                Returns: number
            }
            st_area:
            | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
            | { Args: { "": string }; Returns: number }
            st_asencodedpolyline: {
                Args: { geom: unknown; nprecision?: number }
                Returns: string
            }
            st_asewkt: { Args: { "": string }; Returns: string }
            st_asgeojson:
            | {
                Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
                Returns: string
            }
            | {
                Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
                Returns: string
            }
            | {
                Args: {
                    geom_column?: string
                    maxdecimaldigits?: number
                    pretty_bool?: boolean
                    r: Record<string, unknown>
                }
                Returns: string
            }
            | { Args: { "": string }; Returns: string }
            st_asgml:
            | {
                Args: {
                    geog: unknown
                    id?: string
                    maxdecimaldigits?: number
                    nprefix?: string
                    options?: number
                }
                Returns: string
            }
            | {
                Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
                Returns: string
            }
            | { Args: { "": string }; Returns: string }
            | {
                Args: {
                    geog: unknown
                    id?: string
                    maxdecimaldigits?: number
                    nprefix?: string
                    options?: number
                    version: number
                }
                Returns: string
            }
            | {
                Args: {
                    geom: unknown
                    id?: string
                    maxdecimaldigits?: number
                    nprefix?: string
                    options?: number
                    version: number
                }
                Returns: string
            }
            st_askml:
            | {
                Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
                Returns: string
            }
            | {
                Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
                Returns: string
            }
            | { Args: { "": string }; Returns: string }
            st_aslatlontext: {
                Args: { geom: unknown; tmpl?: string }
                Returns: string
            }
            st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
            st_asmvtgeom: {
                Args: {
                    bounds: unknown
                    buffer?: number
                    clip_geom?: boolean
                    extent?: number
                    geom: unknown
                }
                Returns: unknown
            }
            st_assvg:
            | {
                Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
                Returns: string
            }
            | {
                Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
                Returns: string
            }
            | { Args: { "": string }; Returns: string }
            st_astext: { Args: { "": string }; Returns: string }
            st_astwkb:
            | {
                Args: {
                    geom: unknown
                    prec?: number
                    prec_m?: number
                    prec_z?: number
                    with_boxes?: boolean
                    with_sizes?: boolean
                }
                Returns: string
            }
            | {
                Args: {
                    geom: unknown[]
                    ids: number[]
                    prec?: number
                    prec_m?: number
                    prec_z?: number
                    with_boxes?: boolean
                    with_sizes?: boolean
                }
                Returns: string
            }
            st_asx3d: {
                Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
                Returns: string
            }
            st_azimuth:
            | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
            | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
            st_boundingdiagonal: {
                Args: { fits?: boolean; geom: unknown }
                Returns: unknown
            }
            st_buffer:
            | {
                Args: { geom: unknown; options?: string; radius: number }
                Returns: unknown
            }
            | {
                Args: { geom: unknown; quadsegs: number; radius: number }
                Returns: unknown
            }
            st_centroid: { Args: { "": string }; Returns: unknown }
            st_clipbybox2d: {
                Args: { box: unknown; geom: unknown }
                Returns: unknown
            }
            st_closestpoint: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: unknown
            }
            st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
            st_concavehull: {
                Args: {
                    param_allow_holes?: boolean
                    param_geom: unknown
                    param_pctconvex: number
                }
                Returns: unknown
            }
            st_contains: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            st_containsproperly: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            st_coorddim: { Args: { geometry: unknown }; Returns: number }
            st_coveredby:
            | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
            | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
            st_covers:
            | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
            | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
            st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
            st_curvetoline: {
                Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
                Returns: unknown
            }
            st_delaunaytriangles: {
                Args: { flags?: number; g1: unknown; tolerance?: number }
                Returns: unknown
            }
            st_difference: {
                Args: { geom1: unknown; geom2: unknown; gridsize?: number }
                Returns: unknown
            }
            st_disjoint: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            st_distance:
            | {
                Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
                Returns: number
            }
            | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
            st_distancesphere:
            | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
            | {
                Args: { geom1: unknown; geom2: unknown; radius: number }
                Returns: number
            }
            st_distancespheroid: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: number
            }
            st_dwithin: {
                Args: {
                    geog1: unknown
                    geog2: unknown
                    tolerance: number
                    use_spheroid?: boolean
                }
                Returns: boolean
            }
            st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
            st_expand:
            | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
            | {
                Args: { box: unknown; dx: number; dy: number; dz?: number }
                Returns: unknown
            }
            | {
                Args: {
                    dm?: number
                    dx: number
                    dy: number
                    dz?: number
                    geom: unknown
                }
                Returns: unknown
            }
            st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
            st_force3dm: {
                Args: { geom: unknown; mvalue?: number }
                Returns: unknown
            }
            st_force3dz: {
                Args: { geom: unknown; zvalue?: number }
                Returns: unknown
            }
            st_force4d: {
                Args: { geom: unknown; mvalue?: number; zvalue?: number }
                Returns: unknown
            }
            st_generatepoints:
            | { Args: { area: unknown; npoints: number }; Returns: unknown }
            | {
                Args: { area: unknown; npoints: number; seed: number }
                Returns: unknown
            }
            st_geogfromtext: { Args: { "": string }; Returns: unknown }
            st_geographyfromtext: { Args: { "": string }; Returns: unknown }
            st_geohash:
            | { Args: { geog: unknown; maxchars?: number }; Returns: string }
            | { Args: { geom: unknown; maxchars?: number }; Returns: string }
            st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
            st_geometricmedian: {
                Args: {
                    fail_if_not_converged?: boolean
                    g: unknown
                    max_iter?: number
                    tolerance?: number
                }
                Returns: unknown
            }
            st_geometryfromtext: { Args: { "": string }; Returns: unknown }
            st_geomfromewkt: { Args: { "": string }; Returns: unknown }
            st_geomfromgeojson:
            | { Args: { "": Json }; Returns: unknown }
            | { Args: { "": Json }; Returns: unknown }
            | { Args: { "": string }; Returns: unknown }
            st_geomfromgml: { Args: { "": string }; Returns: unknown }
            st_geomfromkml: { Args: { "": string }; Returns: unknown }
            st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
            st_geomfromtext: { Args: { "": string }; Returns: unknown }
            st_gmltosql: { Args: { "": string }; Returns: unknown }
            st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
            st_hausdorffdistance: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: number
            }
            st_hexagon: {
                Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
                Returns: unknown
            }
            st_hexagongrid: {
                Args: { bounds: unknown; size: number }
                Returns: Record<string, unknown>[]
            }
            st_interpolatepoint: {
                Args: { line: unknown; point: unknown }
                Returns: number
            }
            st_intersection: {
                Args: { geom1: unknown; geom2: unknown; gridsize?: number }
                Returns: unknown
            }
            st_intersects:
            | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
            | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
            st_isvaliddetail: {
                Args: { flags?: number; geom: unknown }
                Returns: Database["public"]["CompositeTypes"]["valid_detail"]
                SetofOptions: {
                    from: "*"
                    to: "valid_detail"
                    isOneToOne: true
                    isSetofReturn: false
                }
            }
            st_length:
            | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
            | { Args: { "": string }; Returns: number }
            st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
            st_linecrossingdirection: {
                Args: { line1: unknown; line2: unknown }
                Returns: number
            }
            st_linefromencodedpolyline: {
                Args: { nprecision?: number; txtin: string }
                Returns: unknown
            }
            st_linefromtext: { Args: { "": string }; Returns: unknown }
            st_linelocatepoint: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: number
            }
            st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
            st_locatealong: {
                Args: { geometry: unknown; leftrightoffset?: number; measure: number }
                Returns: unknown
            }
            st_locatebetween: {
                Args: {
                    frommeasure: number
                    geometry: unknown
                    leftrightoffset?: number
                    tomeasure: number
                }
                Returns: unknown
            }
            st_locatebetweenelevations: {
                Args: { fromelevation: number; geometry: unknown; toelevation: number }
                Returns: unknown
            }
            st_longestline: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: unknown
            }
            st_makebox2d: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: unknown
            }
            st_makeline: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: unknown
            }
            st_makevalid: {
                Args: { geom: unknown; params: string }
                Returns: unknown
            }
            st_maxdistance: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: number
            }
            st_minimumboundingcircle: {
                Args: { inputgeom: unknown; segs_per_quarter?: number }
                Returns: unknown
            }
            st_mlinefromtext: { Args: { "": string }; Returns: unknown }
            st_mpointfromtext: { Args: { "": string }; Returns: unknown }
            st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
            st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
            st_multipointfromtext: { Args: { "": string }; Returns: unknown }
            st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
            st_node: { Args: { g: unknown }; Returns: unknown }
            st_normalize: { Args: { geom: unknown }; Returns: unknown }
            st_offsetcurve: {
                Args: { distance: number; line: unknown; params?: string }
                Returns: unknown
            }
            st_orderingequals: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            st_overlaps: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: boolean
            }
            st_perimeter: {
                Args: { geog: unknown; use_spheroid?: boolean }
                Returns: number
            }
            st_pointfromtext: { Args: { "": string }; Returns: unknown }
            st_pointm: {
                Args: {
                    mcoordinate: number
                    srid?: number
                    xcoordinate: number
                    ycoordinate: number
                }
                Returns: unknown
            }
            st_pointz: {
                Args: {
                    srid?: number
                    xcoordinate: number
                    ycoordinate: number
                    zcoordinate: number
                }
                Returns: unknown
            }
            st_pointzm: {
                Args: {
                    mcoordinate: number
                    srid?: number
                    xcoordinate: number
                    ycoordinate: number
                    zcoordinate: number
                }
                Returns: unknown
            }
            st_polyfromtext: { Args: { "": string }; Returns: unknown }
            st_polygonfromtext: { Args: { "": string }; Returns: unknown }
            st_project: {
                Args: { azimuth: number; distance: number; geog: unknown }
                Returns: unknown
            }
            st_quantizecoordinates: {
                Args: {
                    g: unknown
                    prec_m?: number
                    prec_x: number
                    prec_y?: number
                    prec_z?: number
                }
                Returns: unknown
            }
            st_reduceprecision: {
                Args: { geom: unknown; gridsize: number }
                Returns: unknown
            }
            st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
            st_removerepeatedpoints: {
                Args: { geom: unknown; tolerance?: number }
                Returns: unknown
            }
            st_segmentize: {
                Args: { geog: unknown; max_segment_length: number }
                Returns: unknown
            }
            st_setsrid:
            | { Args: { geog: unknown; srid: number }; Returns: unknown }
            | { Args: { geom: unknown; srid: number }; Returns: unknown }
            st_sharedpaths: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: unknown
            }
            st_shortestline: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: unknown
            }
            st_simplifypolygonhull: {
                Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
                Returns: unknown
            }
            st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
            st_square: {
                Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
                Returns: unknown
            }
            st_squaregrid: {
                Args: { bounds: unknown; size: number }
                Returns: Record<string, unknown>[]
            }
            st_srid:
            | { Args: { geog: unknown }; Returns: number }
            | { Args: { geom: unknown }; Returns: number }
            st_subdivide: {
                Args: { geom: unknown; gridsize?: number; maxvertices?: number }
                Returns: unknown[]
            }
            st_swapordinates: {
                Args: { geom: unknown; ords: unknown }
                Returns: unknown
            }
            st_symdifference: {
                Args: { geom1: unknown; geom2: unknown; gridsize?: number }
                Returns: unknown
            }
            st_symmetricdifference: {
                Args: { geom1: unknown; geom2: unknown }
                Returns: unknown
            }
            st_tileenvelope: {
                Args: {
                    bounds?: unknown
                    margin?: number
                    x: number
                    y: number
                    zoom: number
                }
                Returns: unknown
            }
            st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
            st_transform:
            | {
                Args: { from_proj: string; geom: unknown; to_proj: string }
                Returns: unknown
            }
            | {
                Args: { from_proj: string; geom: unknown; to_srid: number }
                Returns: unknown
            }
            | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
            st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
            st_union:
            | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
            | {
                Args: { geom1: unknown; geom2: unknown; gridsize: number }
                Returns: unknown
            }
            st_voronoilines: {
                Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
                Returns: unknown
            }
            st_voronoipolygons: {
                Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
                Returns: unknown
            }
            st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
            st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
            st_wkttosql: { Args: { "": string }; Returns: unknown }
            st_wrapx: {
                Args: { geom: unknown; move: number; wrap: number }
                Returns: unknown
            }
            unlockrows: { Args: { "": string }; Returns: number }
            updategeometrysrid: {
                Args: {
                    catalogn_name: string
                    column_name: string
                    new_srid_in: number
                    schema_name: string
                    table_name: string
                }
                Returns: string
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            geometry_dump: {
                path: number[] | null
                geom: unknown
            }
            valid_detail: {
                valid: boolean | null
                reason: string | null
                location: unknown
            }
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {},
    },
} as const
