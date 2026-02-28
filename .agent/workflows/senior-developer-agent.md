---
description: Senior Developer Agent — fixes frontend-backend API integration issues
---

# Senior Developer Agent — HomeBiz Integration

## Role
Fix frontend files to correctly integrate with the backend API. Check files exist before touching them. Do NOT create new files without asking. Do NOT add summaries or extra docs. Match existing code style exactly.

## Backend Contract (non-negotiable)
- Base URL: `http://localhost:3001`
- Subscriptions: Every `useEffect` fetch must have a cleanup (AbortController or `isMounted` flag).
- Backend Mapping: Ensure `camelCase` (frontend) to `snake_case` (backend) mapping is explicit. 
- Keys: Never hardcode keys. Reference `process.env.NEXT_PUBLIC_...` only.
- Resilience: If `/auth/me` fails with 401/404, clear state and redirect. Assume the profile might be deleted.
- Optimization: Use batched fetches or caching where appropriate. Evaluate GraphQL potential for complex data trees.

## Step 1 — Fix api.client.ts

**File:** `lib/services/api.client.ts`

Problem: Error extraction reads wrong keys from response envelope.

Fix lines 54-58:
```ts
// BEFORE
const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
const errorMessage = errorData.message || errorData.error?.message || 'Request failed';
let userMessage = errorMessage;
let errorCode = 'API_ERROR';

// AFTER
const errorData = await response.json().catch(() => ({}));
const errorMessage = errorData.error?.message || errorData.message || 'Request failed';
const backendCode = errorData.error?.code || null;
let userMessage = errorMessage;
let errorCode = backendCode || 'API_ERROR';
```

Also fix line 112:
```ts
// BEFORE
return result.data || result;

// AFTER  
if (result.success === false) {
  const err = result.error || {};
  throw new APIError(err.message || 'Request failed', 0, err.code || 'API_ERROR');
}
return result.data !== undefined ? result.data : result;
```

## Step 2 — Fix auth-context.tsx

**File:** `lib/auth-context.tsx`

Problems:
1. Line 66: reads `res.profile` — should be `res.user`
2. `loginWithSession` stores `token` in localStorage — backend is cookie-only, no token
3. `SessionUser` interface has `token: string` — remove it
4. `loginWithSession` signature has `token` param — remove it

Fix `SessionUser`:
```ts
export interface SessionUser {
  id: string
  email: string
  name: string
  first_name?: string
  last_name?: string
  role: "admin" | "business" | "customer"
  subscriptionStatus?: string
}
```

Fix `loginWithSession`:
```ts
const loginWithSession = (userData: { id: string; email: string; name: string; first_name?: string; last_name?: string; role: string }) => {
  const sessionUser: SessionUser = {
    id: userData.id,
    email: userData.email,
    name: userData.name,
    first_name: userData.first_name,
    last_name: userData.last_name,
    role: userData.role as SessionUser["role"],
    subscriptionStatus: "free",
  }
  setUser(sessionUser)
  localStorage.setItem("user", JSON.stringify(sessionUser))
}
```

Fix session validation (line 66-81):
```ts
fetchAPI<{ user: { id: string; email: string; name: string; first_name?: string; last_name?: string; role: string; subscription_status?: string } }>('/auth/me')
  .then(res => {
    const fresh = res.user
    const updated: SessionUser = {
      id: fresh.id,
      email: fresh.email,
      name: fresh.name,
      first_name: fresh.first_name,
      last_name: fresh.last_name,
      role: fresh.role as SessionUser["role"],
      subscriptionStatus: fresh.subscription_status ?? parsed.subscriptionStatus,
    }
    if (JSON.stringify(updated) !== JSON.stringify(parsed)) {
      setUser(updated)
      localStorage.setItem("user", JSON.stringify(updated))
    }
  })
```

## Step 3 — Audit Service Files

Before touching any page, check these files exist:
- `lib/services/orders.service.ts`
- `lib/services/reviews.service.ts`
- `lib/services/wishlist.service.ts`
- `lib/services/profile.service.ts`
- `lib/services/business.service.ts`
- `lib/services/admin.service.ts`

**If any are missing: STOP. Ask user which ones to create before proceeding.**

## Step 4 — Fix Pages (only if service files exist)

### Pattern for every page fix:
1. **Unsubscribe/Cleanup**: Use an `AbortController` or `isMounted` ref in `useEffect` to prevent state updates on unmounted components.
   ```ts
   useEffect(() => {
     let mounted = true;
     const controller = new AbortController();
     // ... fetch with { signal: controller.signal }
     return () => { mounted = false; controller.abort(); };
   }, []);
   ```
2. **Backend Mapping**: Map backend `snake_case` to frontend `camelCase` if local types require it.
3. **Error Handling**: Use the `APIError` class from `lib/services/api.client.ts`.
4. **Mock Removal**: Literally delete any code referencing `lib/mock-data.ts`.
5. **Keys**: Audit component for any leaked strings (API keys, IDs). Move to `.env`.

### Business Panel fixes:

**`app/business/orders/page.tsx`**
- Fetch: `GET /api/business/orders?status={filter}`
- Order actions: `PUT /api/orders/[id]/accept`, `PUT /api/orders/[id]/reject`, `PATCH /api/orders/[id]/status`

**`app/business/dashboard/page.tsx`**
- Fetch: `GET /api/business/dashboard`
- Badge variants are `success` or `warning` — map directly, no transformation

**`app/business/analytics/page.tsx`**
- Fetch: `GET /api/business/analytics?date_from=ISO&date_to=ISO`

**`app/business/kitchen/page.tsx`**
- GET: `GET /api/business/kitchen`
- PATCH: `PATCH /api/business/kitchen` — whitelist only: `name, description, phone, cuisine_types, dietary_options, accepting_orders, preparation_time, minimum_order, cover_image_url, logo_url`
- Toggle: `POST /api/business/kitchen/toggle-orders`

**`app/business/menu/page.tsx`** (or equivalent)
- List: `GET /api/kitchens/[id]/menu-items` (kitchen id from `/api/business/kitchen`)
- Create: `POST /api/kitchens/[id]/menu-items`
- Update: `PATCH /api/menu-items/[id]`
- Delete: `DELETE /api/menu-items/[id]`
- Variants: `GET/POST /api/menu-items/[id]/variants`, `PATCH/DELETE /api/menu-items/variants/[id]`

### Customer Panel fixes:

**Kitchen browse** (`app/kitchens/` or `app/businesses/`)
- `GET /api/kitchens?query=&cuisines=&dietary=&neighborhood=&min_rating=&sort=&page=&per_page=`

**Order placement** (`app/checkout/`)
- `POST /api/orders` — never include subtotal/tax/total in body
- Required: `kitchen_id`, `payment_method`, `items[].menu_item_id`, `items[].quantity`

**Reviews** (`app/account/` or order detail)
- `POST /api/reviews` — requires `order_id`, `kitchen_id`, `rating` (int 1-5)
- Order must be `completed` or `picked_up`

**Wishlist**
- Add: `POST /api/wishlist/[kitchen_id]`
- Remove: `DELETE /api/wishlist/[kitchen_id]`
- List: `GET /api/wishlist`

**Profile** (`app/account/`)
- `GET /api/profile` → `data.profile`
- `PUT /api/profile` — flat fields: `first_name, last_name, phone, email, address_line1, address_line2, city, province, postal_code`

### Admin Panel fixes:

**Users** (`app/admin/users/`)
- `GET /api/admin/users?search=&role=&page=&per_page=`
- `PUT /api/admin/users/[id]` — body: `{ role?, is_active? }`
- `DELETE /api/admin/users/[id]` — soft deactivate

**Kitchens** (`app/admin/kitchens/`)
- `GET /api/admin/kitchens?status=pending|approved|rejected|suspended`
- `PUT /api/admin/kitchens/[id]/verify` — body: `{ status: approved|rejected|suspended }`

**Reviews** (`app/admin/reviews/`)
- `GET /api/admin/reviews?flagged=true`
- `PUT /api/admin/reviews/[id]/moderate` — body: `{ action: approve|reject|flag, reason? }`

**Categories** (`app/admin/categories/`)
- `POST /api/admin/categories` — body: `{ name, slug, ... }`
- `PATCH /api/admin/categories/[id]`
- `DELETE /api/admin/categories/[id]`

**Analytics** (`app/admin/analytics/`)
- `GET /api/admin/analytics?date_from=ISO&date_to=ISO`

## Rules
- Match existing code style (no reformatting)
- No new dependencies unless unblockable
- No new files unless refactoring from a bloated single file
- One file at a time.
- Optimization Focus: Use `useMemo` for derived state and memoize heavy components. Verify if `api.client` can support batched requests.
