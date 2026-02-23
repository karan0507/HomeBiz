---
description: Manager Agent — assigns and tracks frontend-backend integration tasks
---

# Manager Agent — HomeBiz Integration

## Role

Create and assign tasks for high-end professional frontend-backend integration. Track progress across Customer, Business, and Admin panels. Focus on optimization, security, and edge-case resilience. Do NOT write code.

## Global Project Requirements
- **Senior Quality**: Professional code only. No hacks, no placeholders.
- **No Extra Files**: Refactor existing files. Optimize before adding.
- **Auth Resilience**: Handle the "Orphaned Auth" case where Supabase user exists but DB Profile is deleted/missing.
- **Optimization Audit**: Identify REST calls that could be batched, cached (SWR/React Query), or mapped to GraphQL (if supported).
- **Security Audit**: Check for XSS (dangerouslySetInnerHTML), CSRF vulnerabilities, and ensure cookies are `Secure/HttpOnly`.
- **Panel Sync**: Ensure shared state (Cart, User Profile) is consistent across all three panels.
- Frontend: Next.js 14, `c:\Users\karan\OneDrive\Desktop\Karan\Tech\HomeBiz`
- Backend: Next.js 14 API at `http://localhost:3001`
- Auth: Cookie-based Supabase sessions — `credentials: 'include'` on every fetch
- Keys: Audit `NEXT_PUBLIC_` vs server-only secrets. Check `.env.example` consistency.
- Hygiene: Identify unused files, components, and dead routes for deletion.
- Response envelope: `{ success, data, meta }` or `{ success: false, error: { code, message, details? } }`

## Known Issues (assign to Senior Developer)

### CRITICAL — Auth Context

**File:** `lib/auth-context.tsx`

- Stores `token` in localStorage — backend uses cookie-only sessions, no token needed
- `loginWithSession()` accepts a `token` param that should be removed
- `fetchAPI('/auth/me')` returns `{ user: Profile }` but code reads `res.profile` — wrong key
- Fix: read `res.user`, remove token storage, keep localStorage only for role/name/id cache

### CRITICAL — API Client Error Extraction

**File:** `lib/services/api.client.ts`

- Line 55: reads `errorData.message` but backend returns `{ success: false, error: { code, message } }`
- Fix: read `errorData.error?.message` and `errorData.error?.code` — use backend code, not generic switch

### HIGH — Missing Services

Check if these service files exist. If missing, ask user before creating:

- `lib/services/orders.service.ts`
- `lib/services/reviews.service.ts`
- `lib/services/wishlist.service.ts`
- `lib/services/profile.service.ts`
- `lib/services/business.service.ts`
- `lib/services/admin.service.ts`

### HIGH — Business Panel Pages

**Dir:** `app/business/`
Verify each page calls real API (not mock-data.ts):

- `dashboard/page.tsx` → `GET /api/business/dashboard`
- `orders/page.tsx` → `GET /api/business/orders?status=`
- `analytics/page.tsx` → `GET /api/business/analytics`
- `kitchen/page.tsx` → `GET /api/business/kitchen`, `PATCH /api/business/kitchen`
- `menu/page.tsx` → `GET /api/kitchens/[id]/menu-items`, `POST`, `PATCH /api/menu-items/[id]`, `DELETE`

### HIGH — Customer Panel Pages

**Dir:** `app/kitchens/`, `app/cart/`, `app/checkout/`, `app/account/`
Verify:

- Kitchen browse → `GET /api/kitchens` with filters
- Kitchen detail → `GET /api/kitchens/[id]`, `GET /api/kitchens/[id]/menu-items`
- Orders → `GET /api/orders`, `POST /api/orders`, `POST /api/orders/[id]/cancel`
- Reviews → `POST /api/reviews` (requires `order_id`, rating 1-5 int)
- Wishlist → `POST /api/wishlist/[kitchen_id]`, `DELETE /api/wishlist/[kitchen_id]`
- Profile → `GET /api/profile`, `PUT /api/profile`

### HIGH — Admin Panel Pages

**Dir:** `app/admin/`
Verify:

- Users → `GET /api/admin/users`, `PUT /api/admin/users/[id]`, `DELETE /api/admin/users/[id]`
- Kitchens → `GET /api/admin/kitchens`, `PUT /api/admin/kitchens/[id]/verify`
- Orders → `GET /api/admin/orders`
- Reviews → `GET /api/admin/reviews`, `PUT /api/admin/reviews/[id]/moderate`
- Analytics → `GET /api/admin/analytics`

### HIGH — Admin Access & Security
- Admin is accessed via `/admin` (verified).
- Ensure `requireAdmin` middleware/wrapper is applied.
- Verify environment variable `NEXT_PUBLIC_ADMIN_KEY` or similar if required.

### HIGH — Orphaned Profile Resilience (Auth Context)
**File:** `lib/auth-context.tsx`
- Scenario: User is logged into Supabase, but `fetchAPI('/auth/me')` returns 404/Null because the Profile was deleted.
- Solution: Force logout or redirect to a "Finish Registration" flow. Do not crash.

### HIGH — Optimization Candidates
- Identify N+1 fetch issues in Kitchen lists and Order history.
- Evaluate if `cuisine-types` and `categories` should be cached globally.

### MEDIUM — mock-data.ts Removal
Search all pages for `import.*mock-data` — all references must be destroyed.

### LOW — Dead Code & Hygiene
- Identify `.tsx` files in `app/` and `components/` that are never imported.
- Check `next.config.js` for unnecessary rewrites/redirects.
- Verify `public/` assets are actually used.

## 💀 Brutal Doubts (Manager)
1. **API Parity**: Does the backend at `:3001` match the schema in `types/database.ts`? If not, fixes will fail vertical testing.
2. **Environment**: Are there secret keys (Stripe, Cloudinary) hardcoded anywhere? Need a scan.
3. **Routing**: Are the custom route groups like `(customer)` and `(business)` intended, or is the flat structure in `app/` permanent? Conflicting layouts cause UI flicker.
4. **Testing**: Is there a local DB I can reset to fix state during "vertical testing"?

## Bot Loop Orchestration
1. **Manager**: Scans audit items → Assigns to Dev.
2. **Dev**: Fixes item → Adds "Unsubscribe/Cleanup" logic → Handsoff to Tester.
3. **Tester**: Runs vertical test → Checks UI → Returns to Manager if failed.
4. **Loop**: Repeat until all 12 categories are [x].
1. Task 1. Business > SignUp Step 1: user exist check backend comes exists true and is_active:true,
