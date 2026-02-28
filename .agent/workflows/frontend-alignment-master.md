# Frontend Alignment Master Plan
**Date:** 2026-02-21
**Objective:** Align frontend with backend schema changes (UPDATE LOG 2026-02-21)

## Breaking Changes Summary
1. **Categories → Cuisine Types**: `categories` table removed, use `cuisine_types` with UUIDs
2. **Junction Tables**: `kitchens.cuisine_types` now uses `kitchen_cuisine_types` junction (UUID foreign keys)
3. **Province CODE**: `profiles.province` and `kitchens.province` use CODE ('ON') not full name
4. **New Tables**: addresses, payment_transactions, order_status_timeline, kitchen_stories, kitchen_events

## Execution Order (Dependencies)

### Phase 1: Foundation (P0 - Blocks Everything)
- [ ] **Task #1** — Create types/database.ts wrapper (senior-developer-agent)
- [ ] **Task #2** — Delete deprecated categories files (manager-agent)
- [ ] **Task #3** — Create cuisine-types & dietary-options services (senior-developer-agent)
- [ ] **Task #4** — Update provinces service (senior-developer-agent)
- [ ] **Task #5** — Update kitchens.service.ts (senior-developer-agent)

### Phase 2: Customer Flow (P0 - User Facing)
- [ ] **Task #8** — Fix customer signup (senior-developer-agent)
- [ ] **Task #10** — Update kitchen browsing/filtering (senior-developer-agent)
- [ ] **Task #15** — Test customer flow (tester-debugger-agent)

### Phase 3: Business Flow (P0 - User Facing)
- [ ] **Task #9** — Fix business signup (senior-developer-agent)
- [ ] **Task #16** — Test business flow (tester-debugger-agent)

### Phase 4: Admin & Extensions (P1-P2)
- [ ] **Task #11** — Admin cuisine-types page (senior-developer-agent)
- [ ] **Task #12** — Admin dietary-options page (senior-developer-agent)
- [ ] **Task #6** — Profile addresses service (senior-developer-agent)
- [ ] **Task #7** — Orders timeline/payments endpoints (senior-developer-agent)
- [ ] **Task #13** — Admin payments stub (senior-developer-agent)
- [ ] **Task #14** — Business stories/events stubs (senior-developer-agent)
- [ ] **Task #17** — Test admin flow (tester-debugger-agent)

## Agent Assignments

### senior-developer-agent
Tasks: #1, #3, #4, #5, #6, #7, #8, #9, #10, #11, #12, #13, #14

### manager-agent
Tasks: #2

### tester-debugger-agent
Tasks: #15, #16, #17

## Critical Path
1 → 2 → 3 → 4 → 5 → [8, 9, 10] → [15, 16] → [6, 7, 11-14] → 17

## Questions to Resolve
- [ ] Confirm existing signup forms already split first_name/last_name (mentioned in completed tasks)
- [ ] Verify if kitchen detail pages join cuisine_types or need separate fetch
- [ ] Check if any components hardcode dietary options array

## Success Criteria
✅ All API calls use UUIDs for cuisines/dietary (not text names)
✅ All province fields send CODE ('ON') not full name
✅ Zero references to old `/api/categories` endpoints
✅ Type system derives from supabase.ts (single source of truth)
✅ All three flows (customer, business, admin) tested end-to-end
