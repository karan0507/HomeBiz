You are a senior full-stack engineer working on **HomeBiz Toronto**, a home kitchen marketplace.

Two codebases:
- `homebiz-frontend` — Next.js (App Router), TypeScript, Supabase client
- `homebiz-backend` — Supabase: Postgres, RLS, Edge Functions

---

## PHASE 0: OPERATING MODE

1. **PLAN MODE (Opus)** — analysis + plan only, no code changes.
2. **EXECUTION MODE (Sonnet 4.5)** — implement the approved plan as agents.
3. Never switch modes without explicit instruction.
4. Always: concise, no extra docs, no duplicate files.

---

## PHASE 1: PLAN MODE — STRUCTURE

When I say **"PLAN MODE (Opus): start planning"**:

1. Do NOT write code.
2. Produce a short structured plan:

### A. Scope & Current State
- What is relevant to the task. Identify mock data, placeholders.

### B. Gaps vs Requirements
- Tables: profiles, kitchens, menu_items, menu_item_variants, orders, order_items, reviews, wishlists, kitchen_gallery, notifications, categories, faqs, testimonials, admin_logs, dietary_options, kitchen_hours.
- Roles: customer, business, admin.
- RLS on all sensitive tables.

### C. Frontend Plan
- Affected pages + required components.
- API calls: method + path + input/output types.
- Validation, loading, error, success states.
- Where to remove mock data and wire real API.
- UI checklist: WCAG contrast, focus states, keyboard nav, ARIA, mobile-first, typography, button states.

### D. Backend Plan
- Edge Functions / API routes: method, URL, request/response shapes, error codes.
- DB changes: tables, columns, indexes, constraints.
- RLS policies.
- CORS: allowed origins, OPTIONS handling.
- Response envelope: `{ success, data, error }`.
- Validation + auth/role checks.
- Sensitive field rule: `orders.status` only via Edge Function.

### E. Test Plan
- Unit: components, hooks, utilities.
- Integration: API calls frontend → backend.
- Smoke: login, place order, update order status.

### Token discipline
- Plan fits in a single response. No code blocks unless illustrating shape. No full file dumps.

---

## PHASE 2: EXECUTION MODE

When I say **"EXECUTION MODE (Sonnet 4.5)"**:
- Implement the approved plan step by step.
- One agent per concern (e.g. UI agent, service agent, migration agent).
- Mark tasks complete after each step.

---

## FRONTEND RULES

1. No `npm run dev` / build commands.
2. No new files unless explicitly requested.
3. API: assume endpoints exist. Don't invent new routes without proposing first.
4. State: follow existing pattern only (no new global state solutions).
5. Debounce: use stable `useCallback` + custom debounce outside render.
6. Forms: validate required fields, show clear errors.
7. API calls: always handle loading + error + success.
8. Never assume success; check returned status/shape.

---

## SUPABASE CONFIG

- URL: `https://vjafstxtjxfeaumyxakl.supabase.co`
- Anon key: in `.env.example`
- API base (frontend): `http://localhost:3001/api` (dev) / `https://api.homebiz.ca/api` (prod)

---

## API STATUS

### Wired in Frontend (service files exist)

| Endpoint | Service | Fallback |
|---|---|---|
| `GET /categories` | `categories.service.ts` | mock |
| `GET /categories?featured=true` | `categories.service.ts` | mock |
| `GET /categories/:slug` | `categories.service.ts` | null |
| `GET /kitchens` | `kitchens.service.ts` | — |
| `GET /kitchens?featured=true` | `kitchens.service.ts` | mock |
| `GET /kitchens/:slug` | `kitchens.service.ts` | null |
| `GET /kitchens/:id` | `kitchens.service.ts` | null |
| `GET /business/kitchens` | `kitchens.service.ts` | — |
| `POST /kitchens` | `kitchens.service.ts` | — |
| `PATCH /kitchens/:id` | `kitchens.service.ts` | — |
| `DELETE /kitchens/:id` | `kitchens.service.ts` | — |
| `GET /kitchens/:id/hours` | `kitchens.service.ts` | — |

### Not Yet Wired (still mock or missing service)

| Endpoint | Priority | Notes |
|---|---|---|
| `POST /auth/signup` | P0 | role encryption + address coords required |
| `POST /auth/login` | P0 | — |
| `GET /profile` | P0 | — |
| `PUT /profile` | P1 | — |
| `GET /orders` | P1 | — |
| `POST /orders` | P1 | — |
| `GET /orders/:id` | P1 | — |
| `GET /wishlist` | P2 | — |
| `POST /wishlist/:kitchenId` | P2 | — |
| `DELETE /wishlist/:kitchenId` | P2 | — |
| `POST /reviews` | P2 | — |
| `GET /business/dashboard` | P0 | needs dynamic stats + badge data |
| `GET /business/orders` | P1 | — |
| `PUT /business/orders/:id/status` | P1 | via Edge Function only |
| `GET /business/menu` | P1 | — |
| `POST /business/menu` | P1 | — |
| `PUT /business/menu/:id` | P1 | — |
| `DELETE /business/menu/:id` | P1 | — |
| `GET /business/reviews` | P2 | — |
| `POST /business/reviews/:id/response` | P2 | — |
| `GET /business/analytics` | P2 | — |
| `GET /admin/users` | P1 | — |
| `PUT /admin/users/:id` | P1 | — |
| `DELETE /admin/users/:id` | P1 | — |
| `GET /admin/kitchens` | P1 | — |
| `PUT /admin/kitchens/:id/verify` | P1 | — |
| `GET /admin/orders` | P2 | — |
| `GET /admin/reviews` | P2 | — |
| `PUT /admin/reviews/:id/moderate` | P2 | — |
| `GET /admin/analytics` | P2 | — |
| `GET /provinces` | P1 | NEW — needed for signup form |
| `GET /dietary-options` | P2 | NEW — currently hardcoded in frontend |

### Frontend ↔ Backend Field Mismatches (fix before integration)

| Field in `kitchens.service.ts` | Backend schema field | Action |
|---|---|---|
| `cover_image` | `cover_image_url` | ✅ Fixed in `kitchens.service.ts` |
| `logo` | `logo_url` | ✅ Fixed in `kitchens.service.ts` |
| `is_verified` | Not in schema | Add to `kitchens` table or derive from `verification_status` |
| `food_handler_certificate` | Not in schema | Add column to `kitchens` table |
| `tagline` | Not in schema | Add column to `kitchens` table |
| `KitchenFilters.lat/lon/radius` | Not in service | Add to `KitchenFilters` + backend |

---

## TASKS

### Completed
- [x] Landing page wired to real categories + kitchens API
- [x] CORS error resolved
- [x] Business + admin mobile view
- [x] `address-autocomplete` component created (untracked)
- [x] `geolocation.ts`, `loading-state.ts`, `route-guards.tsx` created (untracked)
- [x] `FRONTEND_REQUIREMENTS.md` written
- [x] `API_MAPPING_RULES.md` written
- [x] `api.client.ts` with error handling + mock flag
- [x] `categories.service.ts` with transform + mock fallback
- [x] `kitchens.service.ts` with transform + mock fallback
- [x] `kitchens.service.ts` field fix: `cover_image` → `cover_image_url`, `logo` → `logo_url`
- [x] `auth-context.tsx`: added `loginWithSession(userData, token)` — replaces mock-based signup after real backend call
- [x] Business signup: firstName/lastName split, check-exists on Next (step 1), description required, step 2 Next disabled until all required filled, address `line1` mapping, toast errors, no double-signup
- [x] Customer signup: firstName/lastName split, check-exists on email/phone blur, phone required, address `line1` mapping, toast errors, no double-signup
- [x] All required field labels use red `*` (`<span className="text-destructive">`)

### In Progress
- [ ] Stage + commit untracked files (`address-autocomplete`, `geolocation`, `loading-state`, `route-guards`)

### Remaining — P0
- [ ] `POST /auth/login` service (wire login pages to real backend)
- [ ] `GET /business/dashboard` service (dynamic stats + badges)
- [ ] Remove mock data fallbacks once backend is live

### Remaining — P1
- [ ] `GET /profile` + `PUT /profile` service
- [ ] Orders service (customer: list, create, get)
- [ ] Business orders service (list, update status via Edge Function)
- [ ] Business menu service (CRUD)
- [ ] Admin users + kitchens services
- [ ] `GET /provinces` endpoint + wire to signup form
- [ ] Add `KitchenFilters` lat/lon/radius for radius-based search

### Remaining — P2
- [ ] Wishlist service
- [ ] Reviews service (customer post, business respond)
- [ ] Analytics service (business + admin)
- [ ] `GET /dietary-options` — replace hardcoded list
- [ ] WCAG audit on all modified pages
- [ ] Realtime subscriptions (order status, notifications)
