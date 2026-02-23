# HomeBiz API — Endpoints Reference (Single Source of Truth)

**Updated:** 2026-02-18 | **Base URL:** `http://localhost:3001` (dev)

**Rules for all requests:**

- `Content-Type: application/json` on all POST/PUT/PATCH
- `credentials: 'include'` on every fetch (cookie-based auth)
- All responses: `{ success: true, data: {...}, meta?: {...} }` or `{ success: false, error: { code, message, details? } }`

---

## AUTH ROUTES

### POST /api/auth/signup

**Auth:** None

```json
{
  "first_name": "string required",
  "last_name": "string required",
  "email": "string required",
  "phone": "string required (10+ digits)",
  "password": "string required (min 6)",
  "confirm_password": "string required",
  "role": "customer | business",
  "address_line1": "string required",
  "address_line2": "string?",
  "city": "string required",
  "province": "string required",
  "postal_code": "string required",
  "kitchen": {
    "name": "string required if business",
    "neighborhood": "string required if business",
    "cuisine_types": "string[] required if business",
    "description": "string?",
    "dietary_options": "string[]?",
    "pickup_available": "boolean?",
    "delivery_available": "boolean?"
  }
}
```

**Returns 201:** `{ user: Profile, session: Session|null, requires_confirmation: boolean, kitchen: Kitchen|null, message: string }`
**Errors:** 400 MISSING_FIELD | 400 VALIDATION_ERROR | 409 CONFLICT | 422 VALIDATION_ERROR

---

### POST /api/auth/login

**Auth:** None

```json
{ "email": "string required", "password": "string required" }
```

**Returns 200:** `{ user: Profile, session: Session }`
**Errors:** 400 MISSING_FIELD | 401 INVALID_CREDENTIALS | 401 UNAUTHORIZED | 403 FORBIDDEN (deactivated)

---

### POST /api/auth/logout

**Auth:** Cookie (optional)
**Returns 200:** `{ message: string }`

---

### GET /api/auth/me

**Auth:** Cookie required
**Returns 200:** `{ user: Profile }`
**Errors:** 401 UNAUTHORIZED

---

### POST /api/auth/check-exists

**Auth:** None

```json
{ "email": "string?" OR "phone": "string?" }
```

**Returns 200:** `{ exists: boolean, is_active: boolean }`

---

### POST /api/auth/forgot-password

**Auth:** None

```json
{ "email": "string required" }
```

**Returns 200:** `{ message: string }` (always — does not reveal if email exists)
**Errors:** 400 MISSING_FIELD | 400 VALIDATION_ERROR

---

### POST /api/auth/reset-password

**Auth:** Cookie with active reset session (from email link)

```json
{ "password": "string required (min 6)" }
```

**Returns 200:** `{ message: string, user_id: uuid }`
**Errors:** 400 | 422 VALIDATION_ERROR

---

## CUSTOMER ROUTES

### GET /api/profile

**Auth:** Cookie required
**Returns 200:** `{ profile: Profile }`

### PUT /api/profile

**Auth:** Cookie required

```json
{
  "first_name": "string?",
  "last_name": "string?",
  "email": "string? (once only)",
  "phone": "string?",
  "address_line1": "string?",
  "address_line2": "string|null?",
  "city": "string?",
  "province": "string?",
  "postal_code": "string?"
}
```

**Returns 200:** `{ profile: Profile }`
**Errors:** 400 VALIDATION_ERROR | 409 CONFLICT

---

### GET /api/kitchens

**Auth:** None (public)
**Query:** `?query=string` `?cuisines=a,b` `?dietary=a,b` `?neighborhood=string` `?min_rating=number` `?sort=rating|orders|newest` `?page=1` `?per_page=20` `?lat=number&lon=number&radius=km`
**Returns 200:** `data: Kitchen[], meta: { total, page, per_page, total_pages }`
**Notes:** Only approved + active kitchens. Radius search disables pagination.

### GET /api/kitchens/[id]

**Auth:** None (public)
**Returns 200:** `KitchenWithOwner`
**Notes:** Only approved + active kitchens visible publicly.

### POST /api/kitchens

**Auth:** Cookie, Role: business

```json
{ "name": "string required", "phone": "string required", "neighborhood": "string required", "cuisine_types": "string[] required", ... }
```

**Returns 201:** `Kitchen`

### PATCH /api/kitchens/[id]

**Auth:** Cookie, must be owner or admin
**Allowed fields:** `name, tagline, description, short_description, phone, email, neighborhood, postal_code, address, cuisine_types, dietary_options, specialties, accepting_orders, preparation_time, minimum_order, delivery_available, pickup_available, cover_image_url, logo_url, food_handler_certificate`
**Returns 200:** `Kitchen`
**Security note:** Admin-only fields (verification_status, is_featured, rating) are stripped at route level.

### DELETE /api/kitchens/[id]

**Auth:** Cookie, must be owner or admin
**Returns 200:** `{ message: string }`

---

### GET /api/kitchens/[id]/menu-items

**Auth:** None (public)
**Returns 200:** `MenuItemWithVariants[]` (all items including unavailable)

### POST /api/kitchens/[id]/menu-items

**Auth:** Cookie, must be kitchen owner

```json
{
  "name": "string required",
  "price": "number required",
  "category": "string required",
  "description": "string?",
  "dietary_info": "string[]?",
  "image_url": "string?",
  "spice_level": "0-5?",
  "serves": "number?",
  "preparation_time": "string?"
}
```

**Returns 201:** `MenuItem`

### PATCH /api/menu-items/[id]

**Auth:** Cookie, must be kitchen owner

```json
{ "name"?, "price"?, "description"?, "category"?, "is_available"?, "available_quantity"?, "is_featured"?, "display_order"?, ... }
```

**Returns 200:** `MenuItem`

### DELETE /api/menu-items/[id]

**Auth:** Cookie, must be kitchen owner
**Returns 200:** `{ message: string }`

### GET /api/menu-items/[id]/variants

**Auth:** None (public)
**Returns 200:** `MenuItemVariant[]`

### POST /api/menu-items/[id]/variants

**Auth:** Cookie, must be kitchen owner

```json
{
  "name": "string required",
  "options": [{ "name": "string", "price": 0 }],
  "is_required": "boolean?",
  "max_selections": "number?"
}
```

**Returns 201:** `MenuItemVariant`

### PATCH /api/menu-items/variants/[id]

**Auth:** Cookie, must be kitchen owner

```json
{ "name"?, "options"?, "is_required"?, "max_selections"? }
```

**Returns 200:** `MenuItemVariant`

### DELETE /api/menu-items/variants/[id]

**Auth:** Cookie, must be kitchen owner
**Returns 200:** `{ message: string }`

---

### GET /api/kitchens/[id]/reviews

**Auth:** None (public) | `?limit=number` (default 20)
**Returns 200:** `ReviewWithCustomer[]` (approved only)

---

### GET /api/orders

**Auth:** Cookie required
**Returns 200:** `OrderWithItems[]` (caller's own orders, newest first, limit 20)

### POST /api/orders

**Auth:** Cookie required

```json
{
  "kitchen_id": "uuid required",
  "payment_method": "cash|etransfer|card required",
  "items": [{ "menu_item_id": "uuid required", "quantity": "number required", "selected_variants": [{ "variant_name": "string", "option_name": "string", "price": 0 }]?, "special_instructions": "string?" }],
  "pickup_time": "ISO timestamp?",
  "tip_amount": "number?",
  "discount_amount": "number?",
  "special_instructions": "string?"
}
```

**Returns 201:** `OrderWithItems`
**Errors:** 400 KITCHEN_NOT_ACCEPTING_ORDERS | 400 ITEM_OUT_OF_STOCK | 400 MINIMUM_ORDER_NOT_MET | 404 NOT_FOUND
**Notes:** Tax (13% HST) calculated server-side. Totals are never taken from request.

### GET /api/orders/[id]

**Auth:** Cookie required (customer sees own, kitchen owner sees theirs, admin sees all)
**Returns 200:** `OrderWithItems`
**Errors:** 403 FORBIDDEN | 404 NOT_FOUND

### POST /api/orders/[id]/cancel

**Auth:** Cookie required, must be the customer who placed the order

```json
{ "reason": "string?" }
```

**Returns 200:** `Order` (status: cancelled)
**Errors:** 400 INVALID_ORDER_STATUS (only allowed from 'placed')

### PUT /api/orders/[id]/accept

**Auth:** Cookie required, must be kitchen owner
**Returns 200:** `Order` (status: confirmed)
**Errors:** 400 INVALID_ORDER_STATUS (must be 'placed')

### PUT /api/orders/[id]/reject

**Auth:** Cookie required, must be kitchen owner

```json
{ "reason": "string?" }
```

**Returns 200:** `Order` (status: cancelled)
**Notes:** Allowed from placed/confirmed/preparing/ready — broader than customer cancel.

### PUT /api/orders/[id]/time

**Auth:** Cookie required, must be kitchen owner

```json
{ "pickup_time": "ISO 8601 timestamp required" }
```

**Returns 200:** `Order`
**Errors:** 400 VALIDATION_ERROR (invalid/past time)

### PATCH /api/orders/[id]/status

**Auth:** Cookie required, must be kitchen owner

```json
{
  "status": "confirmed|preparing|ready|picked_up|completed|cancelled required",
  "note": "string?"
}
```

**Returns 200:** `Order`
**Valid transitions:** placed→confirmed|cancelled, confirmed→preparing|cancelled, preparing→ready|cancelled, ready→picked_up|cancelled, picked_up→completed

---

### POST /api/reviews

**Auth:** Cookie required

```json
{
  "kitchen_id": "uuid required",
  "order_id": "uuid required",
  "rating": "1-5 integer required",
  "comment": "string?",
  "images": "string[]?"
}
```

**Returns 201:** `Review`
**Errors:** 400 INVALID_INPUT (kitchen/order mismatch, non-completed order) | 400 ALREADY_EXISTS
**Notes:** One review per order. Order must be completed or picked_up.

### GET /api/reviews/[id]

**Auth:** None (public)
**Returns 200:** `ReviewWithCustomer` (approved reviews only)

### POST /api/reviews/[id]/response

**Auth:** Cookie required, Role: business, must own the kitchen

```json
{ "response": "string required" }
```

**Returns 200:** `Review` (with response + responded_at)

### POST /api/reviews/[id]/helpful

**Auth:** Cookie required
**Returns 200:** `Review` (helpful_count incremented)
**Errors:** 400 INVALID_INPUT (cannot mark own review)

### POST /api/reviews/[id]/flag

**Auth:** Cookie required

```json
{ "reason": "string required" }
```

**Returns 200:** `Review` (is_flagged: true)
**Errors:** 400 INVALID_INPUT (cannot flag own review)

---

### GET /api/wishlist

**Auth:** Cookie required
**Returns 200:** `{ id, created_at, kitchen: { id, name, slug, cover_image_url, logo_url, cuisine_types, rating, review_count, neighborhood } }[]`

### POST /api/wishlist/[kitchen_id]

**Auth:** Cookie required
**Returns 201:** `Wishlist` | 200 `{ message: "Already in wishlist" }`

### DELETE /api/wishlist/[kitchen_id]

**Auth:** Cookie required
**Returns 200:** `{ message: "Removed from wishlist" }` (silent success if not in list)

---

## BUSINESS ROUTES

All require `role: business`. Cookie required.

### GET /api/business/dashboard

**Returns 200:**

```json
{ "total_orders": 0, "pending_orders": 0, "revenue_today": 0.00, "revenue_month": 0.00, "avg_rating": 0.0, "total_reviews": 0, "badges": { "orders": { "text": "+15%", "variant": "success|warning", "trend": "up|down|neutral" }, "revenue": { ... } } }
```

### GET /api/business/stats

**Returns 200:** Same as `/api/business/dashboard` (alias)

### GET /api/business/analytics

**Query:** `?date_from=ISO` `?date_to=ISO` (default: last 30 days)
**Returns 200:**

```json
{
  "revenue_by_day": [{ "date": "2026-02-01", "revenue": 0 }],
  "orders_by_status": { "completed": 0 },
  "top_items": [{ "name": "string", "count": 0, "revenue": 0 }],
  "peak_hours": [{ "hour": 12, "count": 0 }],
  "total_revenue": 0,
  "total_orders": 0
}
```

### GET /api/business/orders

**Query:** `?status=placed|confirmed|preparing|ready|picked_up|completed|cancelled` (optional)
**Returns 200:** `OrderWithItems[]` for the caller's kitchen

### GET /api/business/kitchen

**Returns 200:** `KitchenWithOwner` (bypasses verification filter — owner sees pending kitchen too)

### PATCH /api/business/kitchen

**Allowed fields:** Same as `PATCH /api/kitchens/[id]` whitelist
**Returns 200:** `Kitchen`

---

## ADMIN ROUTES

All require `role: admin`. Cookie required.

### GET /api/admin/users

**Query:** `?page` `?per_page` `?role=customer|business|admin` `?search=string`
**Returns 200:** `Profile[]` with pagination meta

### PUT /api/admin/users/[id]

```json
{ "role": "customer|business|admin?", "is_active": "boolean?" }
```

**Returns 200:** `Profile`

### DELETE /api/admin/users/[id]

**Returns 200:** `{ message: "User deactivated" }` (soft delete — sets is_active=false)

### GET /api/admin/kitchens

**Query:** `?page` `?per_page` `?status=pending|approved|rejected|suspended`
**Returns 200:** All kitchens (including unverified) with `owner: { id, email, name, phone }`

### PUT /api/admin/kitchens/[id]/verify

```json
{ "status": "approved|rejected|suspended required" }
```

**Returns 200:** `Kitchen`

### GET /api/admin/orders

**Query:** `?page` `?per_page` `?status` `?date_from=ISO` `?date_to=ISO`
**Returns 200:** `Order[]` with `kitchen: { id, name, slug }` and `customer: { id, email, name }`

### GET /api/admin/reviews

**Query:** `?page` `?per_page` `?flagged=true`
**Returns 200:** `Review[]` with `customer: { id, email, name }` and `kitchen: { id, name, slug }`

### PUT /api/admin/reviews/[id]/moderate

```json
{
  "action": "approve|reject|flag required",
  "reason": "string required if action=flag"
}
```

**Returns 200:** `Review`

### POST /api/admin/categories

```json
{ "name": "string required", "slug": "string required", "description"?, "icon"?, "image_url"?, "display_order"?, "is_active"? }
```

**Returns 201:** `Category`

### PATCH /api/admin/categories/[id]

**Returns 200:** `Category`

### DELETE /api/admin/categories/[id]

**Returns 200:** `{ message: string }`

### GET /api/admin/analytics

**Query:** `?date_from=ISO` `?date_to=ISO` (default: 30 days)
**Returns 200:** `{ best_selling_products, best_selling_kitchens, hot_selling_hours, reviews_per_business, period }`

---

## UTILITY ROUTES

### GET /api/provinces

**Auth:** None | **Returns 200:** `string[]` (13 Canadian provinces/territories)

### GET /api/categories

**Auth:** None | **Query:** `?page` `?per_page=50`
**Returns 200:** `Category[]` (active only, ordered by display_order)

### GET /api/dietary-options

**Auth:** None | **Returns 200:** `{ id, name, display_order }[]` (active only)
**Seeded values:** Vegetarian, Vegan, Halal, Kosher, Gluten-Free, Dairy-Free, Nut-Free

---

## ERROR CODE REFERENCE

| Code                         | HTTP    | Meaning                                |
| ---------------------------- | ------- | -------------------------------------- |
| UNAUTHORIZED                 | 401     | Not authenticated                      |
| FORBIDDEN                    | 403     | Authenticated but wrong role/ownership |
| INVALID_CREDENTIALS          | 401     | Wrong email or password                |
| NOT_FOUND                    | 404     | Resource does not exist                |
| ALREADY_EXISTS               | 409     | Duplicate (review, email, etc.)        |
| CONFLICT                     | 409     | Unique constraint violation            |
| MISSING_FIELD                | 400     | Required field absent                  |
| VALIDATION_ERROR             | 400/422 | Field format invalid                   |
| INVALID_INPUT                | 400     | Business rule violation                |
| INVALID_ORDER_STATUS         | 400     | Invalid status transition              |
| KITCHEN_NOT_ACCEPTING_ORDERS | 400     | Kitchen not taking orders              |
| ITEM_OUT_OF_STOCK            | 400     | Menu item unavailable                  |
| MINIMUM_ORDER_NOT_MET        | 400     | Below kitchen minimum                  |
| INTERNAL_ERROR               | 500     | Unexpected server error                |
| DATABASE_ERROR               | 500     | DB constraint or query error           |
