# Frontend Requirements

## Environment

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<get_from_google_console>
```

## API Calls

### 1. POST /api/auth/signup

**Customer:**

```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "role": "customer",
  "address": {
    "address_line_1": "string",
    "address_line_2": "string",
    "city": "string",
    "province": "string",
    "postal_code": "string",
    "country": "Canada",
    "place_id": "string"
  }
}
```

**Business:** Same + `kitchen` object

```json
{
  "kitchen": {
    "name": "string",
    "description": "string",
    "cuisine_types": ["string"],
    "neighborhood": "string",
    "dietary_options": ["string"],
    "pickup_available": true,
    "delivery_available": false
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": { "id", "email", "name", "role" },
    "session": { "access_token", "refresh_token" }
  }
}
```

**Errors:** CONFLICT, INVALID_ADDRESS, ADDRESS_REQUIRED

### 2. GET /api/categories

**Response:**

```json
{
  "success": true,
  "data": [{ "id", "name", "slug", "icon", "image_url" }]
}
```

### 3. GET /api/kitchens

**Query:** `?radius=5&cuisine=Indian&sort=distance`
**Response:**

```json
{
  "success": true,
  "data": {
    "kitchens": [{ "id", "name", "slug", "cuisine_types", "rating", "distance_km" }]
  }
}
```

## Components

### AddressAutocomplete (`components/ui/address-autocomplete.tsx`)

- Google Places integration
- Auto-fills address fields
- Captures place_id for backend geocoding
- Does NOT send lat/lng to backend

## Pages

- `/signup` - Customer signup with address
- `/business/signup` - 3-step business signup (account → kitchen → address)
- `/` - Landing page (calls categories + kitchens)

## Hardcoded (pending backend decision)

- Dietary options: ["Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-Free", "Dairy-Free", "Nut-Free"]

<!-- *****Backend Requirements for the Business Panel -->
<!-- Root Cause: 401 Fix

  middleware.ts was missing. Supabase SSR stores auth tokens in cookies and needs the middleware to call
  supabase.auth.getUser() on every request to refresh the token before the route handler runs. Without it, getSession()
  inside requireKitchenOwner() always returns null → 401.

  File created: middleware.ts at root.

  ---
  New Route Added

  GET /api/business/kitchen — returns the logged-in owner's kitchen profile (previously no way to get it without knowing
  the kitchen ID).
  PATCH /api/business/kitchen — update kitchen profile (same, without needing the ID).

  ---
  Complete Business Logic Route Map

  All routes require a valid session cookie (credentials: 'include' in fetch, or the equivalent in your API client). All
  responses follow { success: true, data: ... }.

  Auth
  Method: POST
  Route: /api/auth/signup
  Body / Params: first_name, last_name, email, phone, password, password_confirmation, role="business", kitchen_name,
    cuisine_types[], dietary_options[], address_line1, city, province, postal_code
  Returns: { user, session, kitchen, requires_confirmation }
  ────────────────────────────────────────
  Method: POST
  Route: /api/auth/login
  Body / Params: { email, password }
  Returns: { user, session } — session sets cookies
  ────────────────────────────────────────
  Method: POST
  Route: /api/auth/logout
  Body / Params: —
  Returns: { message }
  ────────────────────────────────────────
  Method: GET
  Route: /api/auth/me
  Body / Params: —
  Returns: { profile }
  ────────────────────────────────────────
  Method: POST
  Route: /api/auth/check-exists
  Body / Params: { email } or { phone }
  Returns: { exists, is_active }
  ────────────────────────────────────────
  Method: POST
  Route: /api/auth/forgot-password
  Body / Params: { email }
  Returns: { message }
  ────────────────────────────────────────
  Method: POST
  Route: /api/auth/reset-password
  Body / Params: { password } (needs active reset session)
  Returns: { message, user_id }
  Business Dashboard (all require role = business + valid session)
  Method: GET
  Route: /api/business/dashboard
  Params: —
  Returns: { total_orders, pending_orders, revenue_today, revenue_month, avg_rating, total_reviews, badges[] }
  ────────────────────────────────────────
  Method: GET
  Route: /api/business/stats
  Params: —
  Returns: Same as dashboard (alias)
  ────────────────────────────────────────
  Method: GET
  Route: /api/business/analytics
  Params: ?date_from=ISO&date_to=ISO (optional, defaults 30d)
  Returns: { revenue_by_day[], orders_by_status{}, top_items[], peak_hours[], total_revenue, total_orders }
  ────────────────────────────────────────
  Method: GET
  Route: /api/business/orders
  Params: ?status=placed|confirmed|preparing|ready|completed|cancelled (optional)
  Returns: Order[] with items, kitchen, customer
  ────────────────────────────────────────
  Method: GET
  Route: /api/business/kitchen
  Params: —
  Returns: Kitchen profile
  ────────────────────────────────────────
  Method: PATCH
  Route: /api/business/kitchen
  Params: Any updatable kitchen fields
  Returns: Updated kitchen
  Order Management (kitchen owner only)
  Method: PUT
  Route: /api/orders/[id]/accept
  Body: —
  Returns: Updated order (status → confirmed)
  ────────────────────────────────────────
  Method: PUT
  Route: /api/orders/[id]/reject
  Body: { reason? }
  Returns: Updated order (status → cancelled)
  ────────────────────────────────────────
  Method: PUT
  Route: /api/orders/[id]/time
  Body: { pickup_time: ISO string }
  Returns: Updated order
  ────────────────────────────────────────
  Method: PATCH
  Route: /api/orders/[id]/status
  Body: { status, note? }
  Returns: Updated order — valid transitions: placed→confirmed→preparing→ready→picked_up→completed
  Kitchen & Menu (kitchen owner for writes)
  Method: GET
  Route: /api/kitchens/[id]
  Body / Params: —
  Returns: Full kitchen with menu + reviews
  ────────────────────────────────────────
  Method: PATCH
  Route: /api/kitchens/[id]
  Body / Params: Updatable fields (name, description, cuisine_types, etc.)
  Returns: Updated kitchen
  ────────────────────────────────────────
  Method: GET
  Route: /api/kitchens/[id]/menu-items
  Body / Params: —
  Returns: MenuItem[]
  ────────────────────────────────────────
  Method: POST
  Route: /api/kitchens/[id]/menu-items
  Body / Params: { name, price, category, description?, image_url?, dietary_options[]?, variants[]?, is_available? }
  Returns: Created MenuItem
  ────────────────────────────────────────
  Method: PATCH
  Route: /api/menu-items/[id]
  Body / Params: Any updatable item fields
  Returns: Updated MenuItem
  ────────────────────────────────────────
  Method: DELETE
  Route: /api/menu-items/[id]
  Body / Params: —
  Returns: { message }
  Reviews (kitchen owner)
  Method: GET
  Route: /api/kitchens/[id]/reviews
  Body: ?limit=20
  Returns: Review[] with customer
  ────────────────────────────────────────
  Method: POST
  Route: /api/reviews/[id]/response
  Body: { response: string }
  Returns: Updated review with owner_response and owner_responded_at
  Profile
  Method: GET
  Route: /api/profile
  Body: —
  Returns: { profile }
  ────────────────────────────────────────
  Method: PUT
  Route: /api/profile
  Body: { first_name?, last_name?, email?, phone?, address_line1?, city?, province?, postal_code? }
  Returns: { profile }
  ---
  Frontend Checklist

  Auth client config — your api.client.ts must send cookies:
  // Every fetch call needs:
  credentials: 'include'

  After login — the response session object contains access_token and refresh_token. Supabase SSR stores these in cookies
  automatically via the login route — do not store in localStorage.

  badges[] shape (from dashboard):
  { label: string, value: string, variant: 'success' | 'warning' | 'default', change_pct: number }

  Order status flow:
  placed → confirmed → preparing → ready → picked_up → completed
           (accept)                               OR
  placed/confirmed/preparing/ready → cancelled  (reject)

  PATCH /api/kitchens/[id] updatable fields:
  name, description, phone, cuisine_types[], dietary_options[],
  neighborhood, address_line1, address_line2, city, province, postal_code,
  accepts_orders, min_order_amount, preparation_time_minutes,
  delivery_available, pickup_available, operating_hours{}

  POST /api/kitchens/[id]/menu-items required fields:
  name: string
  price: number          // in dollars, e.g. 12.50
  category: string       // must match a category slug

  POST /api/kitchens/[id]/menu-items optional fields:
  description?: string
  image_url?: string
  dietary_options?: string[]
  is_available?: boolean   // default true
  variants?: { name: string, price_adjustment: number }[] -->
