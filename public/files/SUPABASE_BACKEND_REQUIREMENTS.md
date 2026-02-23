# HomeBiz Toronto - Supabase Backend Requirements

## Overview

This document outlines all backend requirements for the HomeBiz Toronto home kitchen marketplace platform using Supabase (PostgreSQL).

**Target Platform:** Supabase
**Database:** PostgreSQL
**Auth:** Supabase Auth
**Storage:** Supabase Storage
**Realtime:** Supabase Realtime

---

## Table of Contents

1. [Database Schema](#1-database-schema)
2. [Row Level Security (RLS) Policies](#2-row-level-security-rls-policies)
3. [Storage Buckets](#3-storage-buckets)
4. [Edge Functions](#4-edge-functions)
5. [Static/Seed Data](#5-staticseed-data)
6. [Realtime Subscriptions](#6-realtime-subscriptions)
7. [Authentication Configuration](#7-authentication-configuration)
8. [API Requirements](#8-api-requirements)
9. [Indexes & Performance](#9-indexes--performance)

---

## 1. Database Schema

### 1.1 Users Table (extends auth.users)

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'business', 'admin')),
  address TEXT,
  city TEXT DEFAULT 'Toronto',
  postal_code TEXT,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'expired', 'cancelled')),
  subscription_plan TEXT CHECK (subscription_plan IN ('basic', 'pro', 'premium')),
  subscription_expires_at TIMESTAMPTZ,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 1.2 Kitchens (Businesses) Table

```sql
CREATE TABLE public.kitchens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Basic Info
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,

  -- Contact
  phone TEXT NOT NULL,
  email TEXT,

  -- Location
  neighborhood TEXT NOT NULL,
  city TEXT DEFAULT 'Toronto',
  province TEXT DEFAULT 'Ontario',
  postal_code TEXT,
  address TEXT, -- Only shared with confirmed orders
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Media
  cover_image_url TEXT,
  logo_url TEXT,

  -- Cuisine & Dietary
  cuisine_types TEXT[] NOT NULL DEFAULT '{}',
  dietary_options TEXT[] DEFAULT '{}',
  specialties TEXT[],

  -- Operations
  accepting_orders BOOLEAN DEFAULT FALSE,
  preparation_time TEXT DEFAULT '30-45 min',
  minimum_order DECIMAL(10, 2) DEFAULT 0,
  delivery_available BOOLEAN DEFAULT FALSE,
  pickup_available BOOLEAN DEFAULT TRUE,

  -- Ratings
  rating DECIMAL(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,

  -- Verification
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'suspended')),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id),

  -- Flags
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate slug from name
CREATE OR REPLACE FUNCTION generate_kitchen_slug()
RETURNS TRIGGER AS $$
BEGIN
  NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
  -- Ensure uniqueness by appending random chars if needed
  WHILE EXISTS (SELECT 1 FROM kitchens WHERE slug = NEW.slug AND id != COALESCE(NEW.id, gen_random_uuid())) LOOP
    NEW.slug := NEW.slug || '-' || SUBSTRING(gen_random_uuid()::text, 1, 4);
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER kitchen_slug_trigger
  BEFORE INSERT OR UPDATE OF name ON kitchens
  FOR EACH ROW EXECUTE FUNCTION generate_kitchen_slug();
```

### 1.3 Kitchen Operating Hours

```sql
CREATE TABLE public.kitchen_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kitchen_id UUID NOT NULL REFERENCES public.kitchens(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(kitchen_id, day_of_week)
);
```

### 1.4 Categories Table

```sql
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- Emoji or icon name
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  kitchen_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.5 Menu Items (Products) Table

```sql
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kitchen_id UUID NOT NULL REFERENCES public.kitchens(id) ON DELETE CASCADE,

  -- Basic Info
  name TEXT NOT NULL,
  description TEXT,

  -- Pricing
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  compare_price DECIMAL(10, 2), -- For showing discounts

  -- Category & Tags
  category TEXT, -- Appetizer, Main, Dessert, Beverage, etc.
  tags TEXT[] DEFAULT '{}',
  dietary_info TEXT[] DEFAULT '{}', -- Vegan, Halal, etc.

  -- Media
  image_url TEXT,

  -- Availability
  is_available BOOLEAN DEFAULT TRUE,
  available_quantity INTEGER, -- NULL = unlimited

  -- Options
  preparation_time TEXT,
  serves INTEGER DEFAULT 1,
  spice_level INTEGER CHECK (spice_level >= 0 AND spice_level <= 5),

  -- Popularity
  order_count INTEGER DEFAULT 0,

  -- Flags
  is_featured BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.6 Menu Item Variants (Add-ons/Options)

```sql
CREATE TABLE public.menu_item_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- "Size", "Spice Level", "Add-ons"
  options JSONB NOT NULL, -- [{name: "Small", price: 0}, {name: "Large", price: 3}]
  is_required BOOLEAN DEFAULT FALSE,
  max_selections INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.7 Orders Table

```sql
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL, -- Human-readable: HB-20240215-001

  -- Parties
  customer_id UUID NOT NULL REFERENCES public.profiles(id),
  kitchen_id UUID NOT NULL REFERENCES public.kitchens(id),

  -- Customer Info (snapshot)
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'placed' CHECK (status IN (
    'placed',      -- Order submitted
    'confirmed',   -- Kitchen accepted
    'preparing',   -- Being prepared
    'ready',       -- Ready for pickup
    'picked_up',   -- Customer picked up
    'completed',   -- Finalized
    'cancelled'    -- Cancelled by either party
  )),
  status_history JSONB DEFAULT '[]', -- [{status, timestamp, note}]

  -- Timing
  pickup_time TIMESTAMPTZ,
  estimated_ready_time TIMESTAMPTZ,
  actual_ready_time TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,

  -- Payment
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'etransfer', 'card')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_reference TEXT, -- For e-transfer or card reference

  -- Amounts
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_rate DECIMAL(4, 2) DEFAULT 13.00,
  tax_amount DECIMAL(10, 2) NOT NULL,
  tip_amount DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,

  -- Notes
  special_instructions TEXT,
  kitchen_notes TEXT, -- Internal notes from kitchen
  cancellation_reason TEXT,

  -- Rating
  is_rated BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  today_count INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO today_count
  FROM orders
  WHERE DATE(created_at) = CURRENT_DATE;

  NEW.order_number := 'HB-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(today_count::text, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();
```

### 1.8 Order Items Table

```sql
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,

  -- Snapshot (in case menu item changes/deletes)
  item_name TEXT NOT NULL,
  item_description TEXT,
  item_image_url TEXT,

  -- Pricing
  unit_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  total_price DECIMAL(10, 2) NOT NULL,

  -- Customizations
  selected_variants JSONB, -- [{variant_name, option_name, price}]
  special_instructions TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.9 Reviews Table

```sql
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kitchen_id UUID NOT NULL REFERENCES public.kitchens(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,

  -- Review Content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,

  -- Media
  images TEXT[] DEFAULT '{}',

  -- Response
  response TEXT,
  responded_at TIMESTAMPTZ,

  -- Moderation
  is_approved BOOLEAN DEFAULT TRUE,
  is_flagged BOOLEAN DEFAULT FALSE,
  flag_reason TEXT,

  -- Helpful Votes
  helpful_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(customer_id, order_id) -- One review per order
);

-- Update kitchen rating on review change
CREATE OR REPLACE FUNCTION update_kitchen_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE kitchens
  SET
    rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE kitchen_id = COALESCE(NEW.kitchen_id, OLD.kitchen_id) AND is_approved = TRUE),
    review_count = (SELECT COUNT(*) FROM reviews WHERE kitchen_id = COALESCE(NEW.kitchen_id, OLD.kitchen_id) AND is_approved = TRUE)
  WHERE id = COALESCE(NEW.kitchen_id, OLD.kitchen_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER review_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_kitchen_rating();
```

### 1.10 Wishlists (Favorites) Table

```sql
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kitchen_id UUID NOT NULL REFERENCES public.kitchens(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, kitchen_id)
);
```

### 1.11 Kitchen Gallery Table

```sql
CREATE TABLE public.kitchen_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kitchen_id UUID NOT NULL REFERENCES public.kitchens(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.12 Notifications Table

```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  type TEXT NOT NULL, -- 'order_update', 'review', 'promotion', 'system'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional context (order_id, kitchen_id, etc.)

  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.13 FAQs Table

```sql
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- 'general', 'customers', 'chefs', 'orders', 'payments'
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.14 Testimonials Table

```sql
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT, -- "Customer", "Home Chef", etc.
  avatar_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.15 Admin Activity Log

```sql
CREATE TABLE public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id),
  action TEXT NOT NULL, -- 'approve_kitchen', 'reject_kitchen', 'suspend_user', etc.
  target_type TEXT, -- 'kitchen', 'user', 'order', 'review'
  target_id UUID,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. Row Level Security (RLS) Policies

### 2.1 Profiles

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Public can read basic profile info (for reviews display)
CREATE POLICY "Public can read basic profiles" ON public.profiles
  FOR SELECT USING (true);

-- Admins can read all profiles
CREATE POLICY "Admins can manage profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

### 2.2 Kitchens

```sql
ALTER TABLE public.kitchens ENABLE ROW LEVEL SECURITY;

-- Public can read approved/active kitchens
CREATE POLICY "Public can read active kitchens" ON public.kitchens
  FOR SELECT USING (verification_status = 'approved' AND is_active = TRUE);

-- Owners can manage their own kitchen
CREATE POLICY "Owners can manage their kitchen" ON public.kitchens
  FOR ALL USING (auth.uid() = owner_id);

-- Admins can manage all kitchens
CREATE POLICY "Admins can manage all kitchens" ON public.kitchens
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

### 2.3 Menu Items

```sql
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Public can read available menu items from approved kitchens
CREATE POLICY "Public can read menu items" ON public.menu_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM kitchens
      WHERE id = kitchen_id
      AND verification_status = 'approved'
      AND is_active = TRUE
    )
  );

-- Kitchen owners can manage their menu items
CREATE POLICY "Owners can manage menu items" ON public.menu_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM kitchens WHERE id = kitchen_id AND owner_id = auth.uid())
  );
```

### 2.4 Orders

```sql
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Customers can read their own orders
CREATE POLICY "Customers can read own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id);

-- Customers can create orders
CREATE POLICY "Customers can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Kitchen owners can read/update orders for their kitchen
CREATE POLICY "Owners can manage kitchen orders" ON public.orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM kitchens WHERE id = kitchen_id AND owner_id = auth.uid())
  );

-- Admins can manage all orders
CREATE POLICY "Admins can manage all orders" ON public.orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

### 2.5 Reviews

```sql
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can read approved reviews
CREATE POLICY "Public can read approved reviews" ON public.reviews
  FOR SELECT USING (is_approved = TRUE);

-- Customers can create reviews for their orders
CREATE POLICY "Customers can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Customers can update their own reviews
CREATE POLICY "Customers can update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = customer_id);

-- Kitchen owners can respond to reviews
CREATE POLICY "Owners can respond to reviews" ON public.reviews
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM kitchens WHERE id = kitchen_id AND owner_id = auth.uid())
  );
```

### 2.6 Wishlists

```sql
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Users can manage their own wishlist
CREATE POLICY "Users can manage own wishlist" ON public.wishlists
  FOR ALL USING (auth.uid() = user_id);
```

### 2.7 Notifications

```sql
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update (mark read) their own notifications
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
```

---

## 3. Storage Buckets

### 3.1 Bucket Configuration

```sql
-- Kitchen images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('kitchen-images', 'kitchen-images', true);

-- Menu item images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true);

-- User avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Review images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-images', 'review-images', true);
```

### 3.2 Storage Policies

```sql
-- Kitchen images: owners can upload to their kitchen folder
CREATE POLICY "Kitchen owners can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'kitchen-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Public can read kitchen images
CREATE POLICY "Public can read kitchen images"
ON storage.objects FOR SELECT
USING (bucket_id = 'kitchen-images');

-- Similar policies for other buckets...
```

### 3.3 File Size & Type Limits

- **Kitchen Images:** Max 5MB, PNG/JPG/WEBP only
- **Menu Images:** Max 2MB, PNG/JPG/WEBP only
- **Avatars:** Max 1MB, PNG/JPG only
- **Review Images:** Max 3MB, PNG/JPG only

---

## 4. Edge Functions

### 4.1 Order Status Update

```typescript
// supabase/functions/update-order-status/index.ts
// Handles order status transitions with validation and notifications
```

**Responsibilities:**
- Validate status transitions (can't go from 'placed' to 'completed')
- Update status_history JSONB
- Send push notification to customer
- Send email notification

### 4.2 Kitchen Search

```typescript
// supabase/functions/search-kitchens/index.ts
// Full-text search with filters
```

**Parameters:**
- `query` - Search text
- `cuisines` - Array of cuisine types
- `dietary` - Array of dietary options
- `neighborhood` - Location filter
- `min_rating` - Minimum rating
- `sort` - 'rating', 'orders', 'distance'

### 4.3 Order Receipt Email

```typescript
// supabase/functions/send-order-receipt/index.ts
// Sends formatted receipt to customer after order placed
```

### 4.4 Daily Analytics

```typescript
// supabase/functions/daily-analytics/index.ts
// Runs daily to calculate metrics
```

**Calculates:**
- Daily order count and revenue per kitchen
- Popular items
- Peak hours
- Customer retention rates

---

## 5. Static/Seed Data

### 5.1 Categories (Cuisines)

```sql
INSERT INTO categories (name, slug, icon, display_order) VALUES
('South Asian', 'south-asian', '🍛', 1),
('Italian', 'italian', '🍝', 2),
('Caribbean', 'caribbean', '🥘', 3),
('Chinese', 'chinese', '🥟', 4),
('Middle Eastern', 'middle-eastern', '🥙', 5),
('Mexican', 'mexican', '🌮', 6),
('Filipino', 'filipino', '🍜', 7),
('African', 'african', '🍲', 8),
('Japanese', 'japanese', '🍱', 9),
('Korean', 'korean', '🥢', 10),
('Thai', 'thai', '🍜', 11),
('Vietnamese', 'vietnamese', '🍜', 12);
```

### 5.2 FAQ Data

```sql
INSERT INTO faqs (question, answer, category, display_order) VALUES
-- General
('What is HomeBiz?', 'HomeBiz connects Toronto residents with talented home chefs in their neighbourhood. Order authentic, home-cooked meals made with love and pick them up fresh!', 'general', 1),
('How does ordering work?', 'Browse home kitchens in your area, add items to your cart, checkout, and pick up your fresh meal at the scheduled time.', 'general', 2),
('Is the food safe?', 'All our home chefs follow food safety guidelines. We verify each kitchen before they can list on our platform.', 'general', 3),

-- Customers
('How do I pay?', 'We accept cash on pickup or e-Transfer. Card payments coming soon!', 'customers', 1),
('Can I get delivery?', 'Currently we offer pickup only. This keeps prices lower and food fresher!', 'customers', 2),
('What if my order is wrong?', 'Contact us within 24 hours and we''ll work with the chef to make it right.', 'customers', 3),

-- Chefs
('How do I become a home chef?', 'Sign up on our platform, complete verification, and start listing your dishes!', 'chefs', 1),
('What are the fees?', 'We charge a 15% service fee on each order. No monthly fees!', 'chefs', 2),
('Do I need a food handlers certificate?', 'Yes, all chefs must have valid food safety certification.', 'chefs', 3);
```

### 5.3 Testimonials Data

```sql
INSERT INTO testimonials (name, role, content, rating, is_featured, display_order) VALUES
('Sarah M.', 'Customer', 'The butter chicken from Amma''s Kitchen is better than any restaurant. It reminds me of my grandmother''s cooking!', 5, true, 1),
('Michael C.', 'Customer', 'I love supporting local home cooks. The food is always fresh and made with care.', 5, true, 2),
('Priya S.', 'Home Chef', 'HomeBiz helped me turn my passion for cooking into a real business. I love feeding my community!', 5, true, 3),
('James W.', 'Customer', 'Finally, authentic Caribbean food in my neighbourhood. My go-to for jerk chicken!', 5, false, 4);
```

### 5.4 Default Admin Account

```sql
-- Create via Supabase Auth, then update profile
UPDATE profiles SET role = 'admin' WHERE email = 'admin@homebiz.ca';
```

---

## 6. Realtime Subscriptions

### 6.1 Order Updates (for Kitchen Dashboard)

```typescript
const subscription = supabase
  .channel('kitchen-orders')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'orders',
      filter: `kitchen_id=eq.${kitchenId}`
    },
    (payload) => handleOrderChange(payload)
  )
  .subscribe()
```

### 6.2 Order Status (for Customer)

```typescript
const subscription = supabase
  .channel('my-order')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'orders',
      filter: `id=eq.${orderId}`
    },
    (payload) => handleStatusUpdate(payload)
  )
  .subscribe()
```

### 6.3 Notifications

```typescript
const subscription = supabase
  .channel('notifications')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    },
    (payload) => showNotification(payload)
  )
  .subscribe()
```

---

## 7. Authentication Configuration

### 7.1 Email Templates

**Confirmation Email:**
```html
Subject: Verify your HomeBiz account
Body: Welcome to HomeBiz! Click here to verify: {{ .ConfirmationURL }}
```

**Password Reset:**
```html
Subject: Reset your HomeBiz password
Body: Click here to reset: {{ .ConfirmationURL }}
```

### 7.2 OAuth Providers (Optional)

- Google OAuth (recommended)
- Apple OAuth (for iOS)

### 7.3 Auth Settings

```json
{
  "site_url": "https://homebiz.ca",
  "additional_redirect_urls": [
    "http://localhost:3000/**"
  ],
  "jwt_expiry": 3600,
  "refresh_token_rotation_enabled": true,
  "security_refresh_token_reuse_interval": 10
}
```

---

## 8. API Requirements

### 8.1 Public Endpoints (No Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /kitchens | List approved kitchens |
| GET | /kitchens/:slug | Get kitchen details |
| GET | /kitchens/:id/menu | Get kitchen menu |
| GET | /categories | List categories |
| GET | /faqs | List FAQs |
| GET | /testimonials | List testimonials |

### 8.2 Customer Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /profile | Get current user profile |
| PUT | /profile | Update profile |
| GET | /orders | Get user's orders |
| POST | /orders | Create new order |
| GET | /orders/:id | Get order details |
| GET | /wishlist | Get wishlist |
| POST | /wishlist/:kitchenId | Add to wishlist |
| DELETE | /wishlist/:kitchenId | Remove from wishlist |
| POST | /reviews | Submit review |

### 8.3 Business Endpoints (Auth + Role Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /business/kitchen | Get own kitchen |
| PUT | /business/kitchen | Update kitchen |
| GET | /business/orders | Get kitchen orders |
| PUT | /business/orders/:id/status | Update order status |
| GET | /business/menu | Get menu items |
| POST | /business/menu | Add menu item |
| PUT | /business/menu/:id | Update menu item |
| DELETE | /business/menu/:id | Delete menu item |
| GET | /business/reviews | Get kitchen reviews |
| POST | /business/reviews/:id/response | Respond to review |
| GET | /business/analytics | Get analytics data |

### 8.4 Admin Endpoints (Auth + Admin Role Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /admin/users | List all users |
| PUT | /admin/users/:id | Update user |
| DELETE | /admin/users/:id | Deactivate user |
| GET | /admin/kitchens | List all kitchens |
| PUT | /admin/kitchens/:id/verify | Approve/reject kitchen |
| GET | /admin/orders | List all orders |
| GET | /admin/reviews | List all reviews |
| PUT | /admin/reviews/:id/moderate | Approve/flag review |
| GET | /admin/analytics | Platform analytics |

---

## 9. Indexes & Performance

### 9.1 Essential Indexes

```sql
-- Kitchens
CREATE INDEX idx_kitchens_verification ON kitchens(verification_status) WHERE is_active = TRUE;
CREATE INDEX idx_kitchens_neighborhood ON kitchens(neighborhood);
CREATE INDEX idx_kitchens_cuisine ON kitchens USING GIN(cuisine_types);
CREATE INDEX idx_kitchens_rating ON kitchens(rating DESC);
CREATE INDEX idx_kitchens_slug ON kitchens(slug);

-- Menu Items
CREATE INDEX idx_menu_items_kitchen ON menu_items(kitchen_id);
CREATE INDEX idx_menu_items_available ON menu_items(kitchen_id) WHERE is_available = TRUE;

-- Orders
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_kitchen ON orders(kitchen_id);
CREATE INDEX idx_orders_status ON orders(status) WHERE status NOT IN ('completed', 'cancelled');
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Reviews
CREATE INDEX idx_reviews_kitchen ON reviews(kitchen_id) WHERE is_approved = TRUE;
CREATE INDEX idx_reviews_customer ON reviews(customer_id);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id) WHERE is_read = FALSE;
```

### 9.2 Full-Text Search

```sql
-- Add search vector to kitchens
ALTER TABLE kitchens ADD COLUMN search_vector tsvector;

CREATE OR REPLACE FUNCTION kitchens_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.cuisine_types, ' '), '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.neighborhood, '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER kitchens_search_trigger
  BEFORE INSERT OR UPDATE ON kitchens
  FOR EACH ROW EXECUTE FUNCTION kitchens_search_update();

CREATE INDEX idx_kitchens_search ON kitchens USING GIN(search_vector);
```

---

## 10. Supabase Recommendation

**Is Supabase the best option for HomeBiz?**

### Pros:
1. **PostgreSQL** - Robust, relational, great for complex queries
2. **Built-in Auth** - Email, OAuth, phone auth out of the box
3. **Realtime** - Perfect for order status updates
4. **Storage** - Integrated file storage with CDN
5. **RLS** - Row-level security for data protection
6. **Edge Functions** - Serverless functions when needed
7. **Cost** - Free tier is generous for MVP

### Cons:
1. **Learning curve** - RLS policies can be complex
2. **Cold starts** - Edge functions have minor cold start delays
3. **Vendor lock-in** - Some Supabase-specific features

### Verdict: **Yes, Supabase is an excellent choice for HomeBiz.**

It provides everything you need:
- User authentication
- Real-time order updates
- Image storage
- Complex queries for search/filter
- Admin capabilities with RLS

### Alternative Considerations:
- **Firebase**: Better for mobile-first apps, but NoSQL can be limiting
- **PlanetScale**: Great MySQL option, but no built-in auth/storage
- **Railway + Postgres**: More control, but more setup required

**Recommendation:** Start with Supabase. If you outgrow it, the PostgreSQL foundation makes migration feasible.

---

## Next Steps

1. Create Supabase project
2. Run schema migrations
3. Set up RLS policies
4. Configure storage buckets
5. Add seed data
6. Update frontend to use Supabase client
7. Test all flows end-to-end

---

*Document Version: 1.0*
*Last Updated: 2024*
*For HomeBiz Toronto*

---

## CRITICAL FRONTEND REQUIREMENTS (2026-02-13)

### 1. Auth Signup Validation
**Route:** `POST /api/auth/signup`
**Required:** Check email & phone existence BEFORE creating account
**Response on conflict:**
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Email already registered. Please sign in or use different email."
  }
}
```

### 2. Address Storage with Coordinates
**For:** Both customers & businesses (mandatory in signup)
**Fields Required:**
```sql
address_line_1 TEXT NOT NULL
address_line_2 TEXT
street_number TEXT
street_name TEXT
building_name TEXT
city TEXT NOT NULL CHECK (city = 'North York')
province TEXT NOT NULL
postal_code TEXT NOT NULL
country TEXT DEFAULT 'Canada'
latitude DECIMAL(10, 8) NOT NULL
longitude DECIMAL(11, 8) NOT NULL
```
**Validation:** Only allow North York addresses
**Get coordinates from:** Google Geocoding API

### 3. Dashboard Stats (Real-time)
**Route:** `GET /api/business/dashboard`
**Dynamic fields needed:**
```json
{
  "total_orders": "COUNT from orders",
  "pending_orders": "COUNT WHERE status IN ('placed', 'confirmed')",
  "revenue_today": "SUM(total) WHERE DATE(created_at) = TODAY",
  "revenue_month": "SUM(total) WHERE MONTH(created_at) = CURRENT_MONTH",
  "avg_rating": "AVG(rating) from reviews",
  "total_reviews": "COUNT from reviews"
}
```

### 4. Role Encryption
**Required:** Encrypt role field in transit
**Implementation:**
- Frontend: Encrypt before sending
- Backend: Decrypt on receive, store plaintext
- Return encrypted in response
**Algorithm:** AES-256-GCM
**Key:** Store in backend env only

### 5. Province Dropdown
**Route:** `GET /api/provinces`
**Response:**
```json
{
  "success": true,
  "data": ["Ontario", "Quebec", "British Columbia", ...]
}
```

### 6. Cuisine Types (Admin Managed)
**Current:** Static in frontend
**Required:** From `GET /api/categories` (admin-created)
**Business signup:** Select from this list only

### 7. Dietary Options
**Current:** Hardcoded in frontend
**Required:** From backend (admin-managed or static table)
**Suggested table:**
```sql
CREATE TABLE dietary_options (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  display_order INTEGER,
  is_active BOOLEAN DEFAULT TRUE
);
```

### 8. Radius-based Kitchen Search
**Route:** `GET /api/kitchens`
**New parameters:**
```
?lat=43.7615&lon=-79.4111&radius=5
&min_price=10&max_price=30
&sort=distance|rating|price
```
**Logic:** Calculate distance using coordinates stored in profiles
**Formula:** Haversine or PostGIS ST_Distance

### 9. Badges Dynamic Status
**For:** Dashboard stats cards
**Required:** Return badge data with each stat
```json
{
  "total_orders": 156,
  "badge": {
    "text": "+12%",
    "variant": "success",
    "trend": "up"
  }
}
```

### 10. Search Bar API
**For:** Dashboard panels
**Implementation:** Later phase

---

## UPDATED API CONTRACTS

### Auth Signup (Updated)
```typescript
POST /api/auth/signup

Request:
{
  name: string,
  email: string,
  phone: string,
  password: string,
  role: string (encrypted),
  address: {
    line1: string,
    line2?: string,
    city: string,
    province: string,
    postal_code: string,
    latitude: number,
    longitude: number
  },
  kitchen?: { ... } // For business role
}

Response (Success):
{
  success: true,
  data: {
    user: { id, email, name, role (encrypted) },
    session: { access_token, refresh_token }
  }
}

Response (Conflict):
{
  success: false,
  error: {
    code: "CONFLICT",
    message: "Email/phone already exists"
  }
}
```

### Kitchen Search with Radius
```typescript
GET /api/kitchens?lat=43.7615&lon=-79.4111&radius=5&min_price=10&max_price=30&sort=distance

Response:
{
  success: true,
  data: {
    kitchens: [
      {
        ...kitchen fields,
        distance_km: 2.3,
        estimated_prep_time: "30-45 min"
      }
    ]
  }
}
```

---

## PRIORITY ORDER

1. **P0 (Immediate):**
   - Email/phone conflict check in signup
   - Address with coordinates storage
   - Dashboard dynamic stats

2. **P1 (High):**
   - Role encryption
   - Province dropdown
   - Radius-based search

3. **P2 (Medium):**
   - Cuisine/dietary from backend
   - Badge dynamic data
   - Distance calculation optimization

---

*Document updated: 2026-02-17*

---

## INTEGRATION STATUS (Frontend ↔ Backend)

### Frontend Wired (service files calling real API)

| Endpoint | Status | Fallback |
|---|---|---|
| `GET /categories` | Wired | mock |
| `GET /categories?featured=true` | Wired | mock |
| `GET /categories/:slug` | Wired | null |
| `GET /kitchens` | Wired | — |
| `GET /kitchens?featured=true` | Wired | mock |
| `GET /kitchens/:slug` | Wired | null |
| `GET /kitchens/:id` | Wired | null |
| `GET /business/kitchens` | Wired | — |
| `POST /kitchens` | Wired | — |
| `PATCH /kitchens/:id` | Wired | — |
| `DELETE /kitchens/:id` | Wired | — |
| `GET /kitchens/:id/hours` | Wired | — |

### Not Yet Wired (missing service, still mock)

| Endpoint | Priority |
|---|---|
| `POST /auth/signup` | P0 |
| `POST /auth/login` | P0 |
| `GET /profile` | P0 |
| `GET /business/dashboard` | P0 |
| `PUT /profile` | P1 |
| `GET /orders` + `POST /orders` + `GET /orders/:id` | P1 |
| `PUT /business/orders/:id/status` (Edge Function) | P1 |
| `GET /business/menu` + CRUD | P1 |
| `GET /admin/users` + `GET /admin/kitchens` + verify | P1 |
| `GET /provinces` | P1 |
| `GET /wishlist` + add/remove | P2 |
| `POST /reviews` + business response | P2 |
| `GET /business/analytics` + `GET /admin/analytics` | P2 |
| `GET /dietary-options` | P2 |

### Schema Gaps to Fix Before Integration

| Frontend expects | Backend has | Fix |
|---|---|---|
| `cover_image` | `cover_image_url` | Rename or transform in service |
| `logo` | `logo_url` | Rename or transform in service |
| `is_verified` | Not in `kitchens` table | Add derived field or column |
| `food_handler_certificate` | Not in `kitchens` table | Add column |
| `tagline` | Not in `kitchens` table | Add column |
| `lat/lon/radius` in KitchenFilters | Not in service | Add params + backend Haversine/PostGIS |
| `dietary_options` table | Not in schema | Add table (see §1 below) |
| `GET /provinces` | Not in schema | Add static endpoint or seed table |

### New Tables Required (from frontend)

```sql
-- Dietary options (admin-managed)
CREATE TABLE dietary_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- Seed
INSERT INTO dietary_options (name, display_order) VALUES
('Vegetarian', 1), ('Vegan', 2), ('Halal', 3),
('Kosher', 4), ('Gluten-Free', 5), ('Dairy-Free', 6), ('Nut-Free', 7);
```

### New Columns Required on `kitchens`

```sql
ALTER TABLE kitchens
  ADD COLUMN tagline TEXT,
  ADD COLUMN food_handler_certificate BOOLEAN DEFAULT FALSE;

-- cover_image_url and logo_url already exist in schema
-- Frontend service must be updated to use cover_image_url, logo_url
```

### Auth Token Note

Frontend reads token from `localStorage.getItem('user').token`.
Supabase returns `access_token` in session. Align on session storage strategy before wiring auth service.
