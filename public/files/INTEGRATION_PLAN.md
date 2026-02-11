# Vertical Integration Plan - Stage by Stage

## DUPLICATES REMOVED
✓ Deleted: components/three/ (unused, 400KB bloat)
✓ Created: lib/services/api.client.ts (shared fetchAPI)
✓ Removed duplicate fetchAPI from categories.service.ts
✓ Removed duplicate fetchAPI from kitchens.service.ts

## BACKEND REQUIREMENTS (HomeBizBackend)
Port: 3001 (avoid conflict)
Base: http://localhost:3001/api

Required Endpoints:
GET  /api/categories
GET  /api/categories/:slug
GET  /api/kitchens
GET  /api/kitchens/:slug
POST /api/auth/login
POST /api/auth/signup
GET  /api/menu-items
GET  /api/orders
GET  /api/reviews

---

## STAGE 1: Categories (DONE ✓)
Status: Integrated, waiting for backend
Frontend: app/categories/page.tsx
Service: lib/services/categories.service.ts
Hook: hooks/useCategories.ts
Backend: GET /api/categories

Test: Start backend, verify categories load

---

## STAGE 2: Kitchens (READY)
Files to Change: 2
Time: 10 min

### Backend Setup:
Endpoint: GET /api/kitchens?cuisines=&search=&min_rating=
Endpoint: GET /api/kitchens/:slug

### Frontend Changes:
File: app/kitchens/page.tsx
- Remove: import { mockBusinesses, mockCategories }
- Add: import { useKitchens } from '@/hooks/useKitchens'
- Replace: const filteredKitchens = useMemo(() => { let result = [...mockBusinesses]
- With: const { kitchens, loading, error } = useKitchens(filters)

File: app/kitchens/[slug]/page.tsx  
- Remove: import { mockBusinesses }
- Add: import { useKitchen } from '@/hooks/useKitchens'
- Replace mock lookup with hook

Test: Verify search, filters, kitchen details

---

## STAGE 3: Authentication
Files to Change: 3
Time: 30 min

### Backend Setup:
POST /api/auth/signup { name, email, password, role }
POST /api/auth/login { email, password }
POST /api/auth/logout
GET  /api/auth/me (verify token)

### Frontend Changes:
Create: lib/services/auth.service.ts
Create: hooks/useAuth.ts
Update: lib/auth-context.tsx (remove mockUsers, use API)
Update: app/login/page.tsx
Update: app/signup/page.tsx
Update: app/business/login/page.tsx

Test: Login, signup, logout, session persistence

---

## STAGE 4: Menu Items
Files to Change: 6
Time: 20 min

### Backend Setup:
GET  /api/menu-items?kitchen_id=
GET  /api/menu-items/:id
POST /api/menu-items (business only)
PATCH /api/menu-items/:id
DELETE /api/menu-items/:id

### Frontend Changes:
Create: lib/services/menu-items.service.ts
Create: hooks/useMenuItems.ts
Update: app/business/products/page.tsx
Update: app/business/services/page.tsx
Update: app/cart/page.tsx
Update: lib/cart-context.tsx

Test: View menu, add items, cart functionality

---

## STAGE 5: Orders
Files to Change: 4
Time: 20 min

### Backend Setup:
GET  /api/orders (user's orders)
GET  /api/orders/:id
POST /api/orders (create)
PATCH /api/orders/:id (update status)

### Frontend Changes:
Create: lib/services/orders.service.ts
Create: hooks/useOrders.ts
Update: app/account/page.tsx
Update: app/business/orders/page.tsx
Update: app/business/dashboard/page.tsx
Update: app/checkout/page.tsx

Test: Place order, view orders, update status

---

## STAGE 6: Reviews
Files to Change: 2
Time: 15 min

### Backend Setup:
GET  /api/reviews?kitchen_id=
POST /api/reviews

### Frontend Changes:
Create: lib/services/reviews.service.ts
Create: hooks/useReviews.ts
Update: app/business/reviews/page.tsx
Update: app/kitchens/[slug]/page.tsx (show reviews)

Test: Submit review, view reviews

---

## STAGE 7: Admin Panel
Files to Change: 4
Time: 30 min

### Backend Setup:
GET  /api/admin/dashboard
GET  /api/admin/users
GET  /api/admin/businesses
PATCH /api/admin/businesses/:id (approve/reject)

### Frontend Changes:
Update: app/admin/dashboard/page.tsx
Update: app/admin/users/page.tsx
Update: app/admin/businesses/page.tsx
Update: app/admin/categories/page.tsx

Test: Admin actions, approvals

---

## STAGE 8: Cleanup
Files to Delete: 1
Time: 5 min

Delete: lib/mock-data.ts (1668 lines)
Verify: No imports remain

---

## TESTING CHECKLIST (Per Stage)

1. Backend endpoint responds
2. Frontend shows loading state
3. Frontend shows data
4. Frontend shows error state
5. Frontend shows empty state
6. Filters/search work
7. CRUD operations work
8. No console errors
9. No TypeScript errors
10. Mobile responsive

---

## PARALLEL WORK STRATEGY

### You Work On:
Backend endpoints (HomeBizBackend project)

### I Test:
1. Start backend: npm run dev (port 3001)
2. Update .env.local: NEXT_PUBLIC_API_URL=http://localhost:3001/api
3. Test endpoint: curl http://localhost:3001/api/categories
4. Start frontend: npm run dev
5. Verify page loads data
6. Report results

We complete each stage before moving to next.
No skipping. No assumptions.
