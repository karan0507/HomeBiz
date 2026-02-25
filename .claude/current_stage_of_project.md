# HomeBiz — Current Stage of Project
**Date: 2026-02-24 | Version: Testing / Pre-Beta**

---

## What Is This Project

HomeBiz is a two-repo full-stack marketplace for home chefs in Toronto.

| Repo | Purpose | Port |
|---|---|---|
| `HomeBiz` | Next.js 16 frontend (customer + business + admin UI) | 3000 |
| `HomeBizBackend` | Next.js 16 API-only backend + Supabase DB | 3001 |

**Frontend → Backend communication:** REST via `fetchAPI()` in `lib/services/api.client.ts`. The frontend never reads from Supabase directly except for Realtime subscriptions.

---

## Architecture Decisions (Keep These)

- **Backend owns all DB reads/writes** — frontend talks to `localhost:3001` (dev) / backend URL (prod)
- **Auth: cookie-based** — Supabase sets `httpOnly` cookies on login. Frontend validates on load via `GET /api/auth/me`
- **localStorage** — used only for cart persistence and fast-load user display (validated against `/auth/me` every load)
- **`supabase-client.ts`** — kept intentionally for future Realtime order subscriptions. NOT for data queries
- **RLS** — enabled on 7 tables. Backend service client bypasses RLS (correct). Frontend anon client cannot bypass it
- **`cart-context.tsx`** — correctly prevents mixing items from different kitchens (shows confirmation dialog)

---

## ✅ Completed — Frontend

- [x] All 19 app routes created (landing, kitchens, kitchen detail, cart, checkout, account, business dashboard, admin dashboard, etc.)
- [x] 12 service files covering all backend endpoints
- [x] `AuthProvider` — session restore + background validation + logout on 401
- [x] `CartProvider` — localStorage cart + multi-kitchen protection + wishlist sync
- [x] Route guards: `useAuthGuard`, `useBusinessGuard`, `useAdminGuard`, `useGuestGuard`
- [x] `fetchAPI` — deduplication, 10s timeout, network error handling, envelope unwrapping
- [x] Security headers in `next.config.mjs` (HSTS, XSS, CSP frame options)
- [x] `FeaturedKitchens` — error fallback UI on 500
- [x] Fixed: duplicate React keys in `main-layout.tsx` footer nav
- [x] Fixed: `getFeaturedKitchens` called wrong URL `/kitchens/featured` → now `/kitchens?featured=true`
- [x] Fixed: `auth-context.tsx` StrictMode race condition (`initialized.current = false` removed)
- [x] Fixed: `notifications.tsx` dead error codes removed, mapped to actual backend `INTERNAL_ERROR`

---

## ✅ Completed — Backend

- [x] 13 API route groups: auth, kitchens, menu-items, orders, reviews, wishlist, categories, cuisine-types, dietary-options, provinces, profile, business/\*, admin/\*
- [x] Auth: `requireAuth`, `requireRole`, `requireAdmin`, `requireKitchenOwner`
- [x] Error handling: `AppError` class + Supabase/PostgREST error code maps
- [x] CORS: per-route with `handleCorsOptions` / `setCorsHeaders`
- [x] RLS: enabled on profiles, kitchens, orders, addresses, push_tokens, payment_transactions, order_status_timeline
- [x] Admin bypass: DB-level policy checks `role = 'admin'`
- [x] RPCs: `create_order_with_items`, `get_business_dashboard`, `search_kitchens`, `get_kitchen_payment_summary`
- [x] Triggers: `generate_order_number`, `generate_transaction_number`, `sync_kitchen_location`
- [x] 14 migrations applied, seed data for provinces + cuisines + dietary options
- [x] Middleware: session refresh on every request

---

## ❌ Pending — Frontend (Priority Order)

### P1 — Bugs / Correctness
- [ ] **`GET /api/kitchens` does not filter `featured=true`** — backend route reads params but `getKitchens()` DB function ignores it → **backend fix needed** (send to backend)
- [ ] **`_rsc=` filter in `api.client.ts`** — remove this entirely. RSC calls never reach client-side fetch. It's dead code that causes false positives
- [ ] **Route guards are client-side only** — admin/business pages flash before redirect. Add `middleware.ts` to frontend for server-side redirects
- [ ] **`initialized.current` check in auth** — `if (initialized.current) return` at top of effect prevents re-validation on tab focus restore. Consider a shorter debounce instead

### P2 — Code Cleanup
- [ ] **`lib/loading-state.ts`** — `loadingManager`, `LoadingKeys`, `useLoading` — zero imports found in entire codebase. Delete this file
- [ ] **`lib/geolocation.ts` `geocodeAddress()`** — uses a hardcoded lookup table of Toronto neighborhoods as mock geocoding. Replace with a call to `GET /api/geocode?address=...` (backend uses Nominatim). The functions `calculateDistance`, `filterByDistance`, `sortByDistance`, `getUserLocation`, `formatDistance` are all valid and used
- [ ] **`next-themes`** — installed but no functional dark mode toggle in UI. Either wire it up or remove the package
- [ ] **`images: { unoptimized: true }` in `next.config.mjs`** — disables Next.js image optimization. Remove for Vercel deployment
- [ ] **`@vercel/analytics`** — only works on Vercel. Remove if deploying to Netlify

### P3 — Features Not Yet Built
- [ ] **Realtime order status** — `supabase-client.ts` is ready, but no component subscribes yet. Business dashboard and customer order tracking need it
- [ ] **Checkout tax calculation** — `const total = cartTotal` — no tax applied. Backend should return tax rate per kitchen/province
- [ ] **Address autocomplete** — `address-autocomplete.tsx` has `// TODO: Re-enable Google Places` — currently 4 manual text fields
- [ ] **Kitchen stories / events** — tables exist in DB, no backend routes, no frontend pages
- [ ] **Delivery partner tracking** — tables exist in DB, no implementation

---

## ❌ Pending — Backend (Send This List to Backend)

### P1 — Bugs / Correctness
- [ ] **`GET /api/kitchens` ignores `featured=true` param** — frontend sends `?featured=true&per_page=6`, backend's `getKitchens()` DB query never filters on it. Add `WHERE is_featured = true` when the param is present
- [ ] **`middleware.ts` is deprecated** — Next.js 16 says to use `proxy.ts` instead. This will break on Vercel deployment
- [ ] **`next.config.js` is empty** — add at minimum: `poweredByHeader: false`, CORS headers, and `output: 'standalone'` for container deployment

### P2 — Security
- [ ] **No rate limiting** — `/api/auth/login` and `/api/auth/signup` have no rate limit. Add Upstash or simple IP-based limiter in middleware
- [ ] **`backend.log` is committed to git** — contains error stack traces with email addresses. Delete and add to `.gitignore`
- [ ] **RLS missing on**: `reviews`, `menu_items`, `kitchen_stories`, `delivery_partners`, `kitchen_events` — any authenticated user can read/write these directly via anon Supabase client
- [ ] **No seed migration for first admin user** — there's no way to bootstrap an admin without direct DB access

### P3 — Code Cleanup
- [ ] **Unpinned deps** — `"@supabase/ssr": "latest"` and `"next": "latest"` in `package.json`. Pin to exact versions
- [ ] **Remove unused packages** — `geist` (font, no UI), `autoprefixer`, `postcss`, `tailwindcss` (backend has no CSS/pages)
- [ ] **`checkAdminRole()` alias** — dead function, remove from `auth.ts`
- [ ] **`isKitchenOwner()` and `requireKitchenOwner()`** — overlapping functions. Merge or deprecate `isKitchenOwner`
- [ ] **`errors.ts` `instanceof Error` string-match fallback** — remove lines 174-183. The PGRST_ERRORS map already handles these cases. String matching on error messages is fragile

---

## RLS Status (Critical Gaps)

| Table | RLS Enabled | Notes |
|---|---|---|
| `profiles` | ✅ | Select public, update own, admin all |
| `kitchens` | ✅ | Active+approved public, owner all, admin all |
| `orders` | ✅ | Customer + kitchen owner select, admin all |
| `addresses` | ✅ | Owner all |
| `push_tokens` | ✅ | Owner all |
| `payment_transactions` | ✅ | Customer + business select, admin all |
| `order_status_timeline` | ✅ | RLS enabled |
| `reviews` | ❌ | **OPEN — add SELECT public, INSERT authenticated, UPDATE/DELETE own** |
| `menu_items` | ❌ | **OPEN — add SELECT public (active only), kitchen owner all** |
| `kitchen_stories` | ❌ | No RLS |
| `delivery_partners` | ❌ | No RLS |
| `kitchen_events` | ❌ | No RLS |

---

## Deployment Plan

| Service | Platform | Status |
|---|---|---|
| Frontend | **Vercel** (recommended) | Not deployed |
| Backend | **Vercel** (short term) / **Railway** (when WebSockets needed) | Not deployed |
| Database | Supabase (keep) | Live |

**Do not deploy to Netlify.** `@vercel/analytics` breaks silently, Next.js image optimization is limited, and edge middleware support is partial.

**Steps before first deploy:**
1. Fix backend `middleware.ts` → rename to `proxy.ts`
2. Add backend `next.config.js` security headers
3. Set `NEXT_PUBLIC_API_URL` to the deployed backend URL in frontend `.env`
4. Remove `images: { unoptimized: true }` from frontend config
5. Add rate limiting middleware to backend

---

## WebSockets / Realtime

- `supabase-client.ts` is wired and ready (Supabase Realtime client configured)
- `setupRealtimeConnection()` with exponential backoff reconnect is implemented
- **Nothing subscribes to it yet** — next step is to subscribe to `orders` table changes in:
  - `/business/orders` page (new order alerts)
  - `/account` order detail page (status updates)

---

## Files to Delete

| File | Reason |
|---|---|
| `lib/loading-state.ts` | Zero imports across entire codebase |
| `tsc-errors.txt` (root) | Log file committed to git, add to `.gitignore` |
| `HomeBizBackend/backend.log` | Committed log with sensitive data, add to `.gitignore` |

---

## Is Supabase the Right DB?

**Yes.** Auth, RLS, PostGIS for geo search, and Realtime subscriptions are all in use or planned. Switching would be a 2-week regression for zero gain at this stage.

---

## Do We Rebuild?

**No.** Architecture is sound. DB schema is excellent. What remains is:
1. Bug fixes (featured filter, middleware deprecation)
2. Security hardening (rate limiting, remaining RLS)
3. Realtime wiring
4. Deployment config
5. Code cleanup (dead files, unpinned deps)

**Estimated effort: 1 week of focused work.**
