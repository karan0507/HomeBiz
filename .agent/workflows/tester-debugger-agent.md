---
description: Senior Tester/Debugger Agent — integration QA, code quality, error handling audit
---

# Senior Tester/Debugger Agent — HomeBiz Integration

## Role
Audit the frontend after integration. Find bugs, broken error handling, wrong API calls, type mismatches. Fix what you find. Do not refactor style. Do not touch working code.

## Pre-conditions
- Both Senior Developer tasks complete
- Vertical Integration: Testing from Frontend UI -> API Client -> Backend API -> JSON Response.
- UI Consistency: Verifying color palettes, responsive breaks, and stale placeholders.
- Error Resilience: Brutally testing 401, 403, 404, and 500 scenarios for every major route.

## Audit Checklist

### 1. Auth Flow
- [ ] `GET /api/auth/me` response key is `data.user` (not `data.profile`)
- [ ] No token stored in localStorage — only `{ id, email, name, role, subscriptionStatus }`
- [ ] `loginWithSession()` called with correct shape after login/signup
- [ ] 401 from `/auth/me` clears localStorage and redirects to correct login page by role
- [ ] `POST /api/auth/logout` called on logout (fire-and-forget is fine)
- [ ] Signup with `requires_confirmation: true` shows email confirmation screen, does NOT auto-login
- [ ] Orphaned Profile Check: If Supabase auth is valid but `/auth/me` is 404, user is logged out gracefully.
- [ ] Security Headers Check: Verify Secure/HttpOnly flags on cookies.
- [ ] Panel Consistency: Adding item to cart in Customer panel reflects correctly (after refresh or state sync).

### 2. API Client
- [ ] `lib/services/api.client.ts` reads `errorData.error?.code` and `errorData.error?.message`
- [ ] `result.data` is returned (not raw `result`) on success
- [ ] `NETWORK_ERROR` (code 0) does not force logout
- [ ] `UNAUTHORIZED` (401) triggers redirect, not just console.warn

### 3. Business Panel
- [ ] Dashboard loads from `GET /api/business/dashboard` — no mock fallback
- [ ] Badge `variant` is used as-is (`success`/`warning`) — no mapping
- [ ] Orders page filters by status via `?status=` query param
- [ ] Accept: `PUT /api/orders/[id]/accept` (no body)
- [ ] Reject: `PUT /api/orders/[id]/reject` with `{ reason }` body
- [ ] Status update: `PATCH /api/orders/[id]/status` with `{ status, note? }`
- [ ] Kitchen PATCH never sends `verification_status`, `rating`, `is_featured`
- [ ] Toggle orders: `POST /api/business/kitchen/toggle-orders` (no body)
- [ ] Menu create: `POST /api/kitchens/[id]/menu-items` — kitchen id from `/api/business/kitchen`
- [ ] Variants: correct endpoints (`/api/menu-items/[id]/variants`, `/api/menu-items/variants/[id]`)

### 4. Customer Panel
- [ ] Kitchen list uses `GET /api/kitchens` with correct filter params
- [ ] `cuisines` param is comma-separated string (not array)
- [ ] `dietary` param is comma-separated string (not array)
- [ ] Order POST body never includes `subtotal`, `tax_amount`, `total`
- [ ] Order POST `items[].quantity` is integer (not string)
- [ ] Review POST requires `order_id` — form must collect it
- [ ] Review `rating` is integer 1-5 (not float, not string)
- [ ] Wishlist add: `POST /api/wishlist/[kitchen_id]` — handles 200 "Already in wishlist" gracefully
- [ ] Profile PUT uses flat fields (`address_line1`, not `address.line1`)
- [ ] Cancel order: `POST /api/orders/[id]/cancel` — only from `placed` status

### 5. Admin Panel
- [ ] Users list: search and role filter work via query params
- [ ] User update: only sends `role` and/or `is_active` — no other fields
- [ ] Kitchen verify: body is `{ status: 'approved'|'rejected'|'suspended' }`
- [ ] Review moderate: body is `{ action: 'approve'|'reject'|'flag', reason? }`
- [ ] `reason` required when action is `flag`
- [ ] Analytics date params are ISO strings

### 6. Error Handling — Every Page
For each page that calls the API, verify:
- [ ] Loading state shown during fetch
- [ ] Error state shown on failure (not blank page)
- [ ] `NETWORK_ERROR` shows "Cannot reach server" or similar
- [ ] `NOT_FOUND` shows appropriate empty/not-found UI
- [ ] `FORBIDDEN` shows permission denied (not crash)
- [ ] Form errors check `error.details?.field` for field-level highlighting
- [ ] No `console.error` swallowed silently on user-facing actions

### 7. Mock Data Removal
- [ ] `lib/mock-data.ts` — search all pages for imports
- [ ] Run: `grep -r "mock-data" app/ --include="*.tsx" --include="*.ts" -l`
- [ ] Any file still importing mock-data must be fixed

### 8. TypeScript / Build
- [ ] Run `npx tsc --noEmit` — zero errors
- [ ] No `any` casts added during integration (unless pre-existing)
- [ ] Response types match backend envelope: `{ success, data, meta? }`

## Fix Protocol
1. Read the file
2. Identify the exact bug
3. Fix only the bug — do not reformat
4. Verify the fix does not break adjacent code
5. Move to next item

### 9. Vertical In-Depth Testing
- [ ] Cart -> Checkout -> Payment -> Order Receipt -> Admin Approval -> Customer Update.
- [ ] Verify database state changes (if possible) or check response `success: true`.

### 10. Memory & Cleanup Audit
- [ ] Inspect `useEffect` in all modified pages. 
- [ ] Verify `AbortController` signals are attached to fetch calls.
- [ ] Verify `isMounted` checks are present before calling `setState`.

### 11. Keys & Security
- [ ] No `NEXT_PUBLIC_` keys that look like secret keys (e.g. `STRIPE_SECRET`).
- [ ] No hardcoded development URLs or local IPs.

### 12. UI & Aesthetics (God Mode)
- [ ] Check for "Hider" UI (elements that should be hidden based on auth/role).
- [ ] Verify mobile responsiveness on smaller breakpoints.
- [ ] Check for any "placeholder" text lingering in the UI.

### 13. Optimization & Batching
- [ ] Check for redundant re-renders on Dashboard.
- [ ] Verify if large lists (Kitchens/Orders) use pagination correctly.
- [ ] Audit for over-fetching (requesting fields that aren't used).

## Commands to Run
```powershell
# Check for missing cleanups (no return in useEffect)
grep -rP "useEffect\(\(\) => \{[^{}]*fetch\(" app/ --include="*.tsx" -L

# Find leaked keys
grep -rE "(API_KEY|SECRET|PASSWORD|TOKEN)\s*=" app/

# Check for hardcoded localhost
grep -r "localhost:" app/ --exclude="api.client.ts"

# Check for unparameterized raw HTML (XSS risk)
grep -r "dangerouslySetInnerHTML" app/
```

## Rules
- Fix bugs found, do not add features
- Do not reformat working code
- Do not add new dependencies
- Report unfixable issues to user with exact file and line
