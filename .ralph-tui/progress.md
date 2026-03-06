# Ralph Progress Log

This file tracks progress across iterations. Agents update this file
after each iteration and it's included in prompts for context.

## Codebase Patterns (Study These First)

### API Route Pattern
- Auth check via `getServerSession(authOptions)` at top of every route handler
- Return `{ data: ... }` for success, `{ error: "..." }` for errors
- Next.js 15: dynamic route params are `Promise<{ id: string }>` — must `await params`
- 409 status for conflict (e.g., deleting entity with associated transactions)

### Client Component Pattern
- Server page does auth + redirect, renders a `*Client` component
- Client component manages state, fetch calls, and form logic
- Pattern: `fetchX` wrapped in `useCallback`, called in `useEffect`

---

## 2026-03-05 - US-011
- Implemented settings page at `/settings` with Accounts and Categories sections
- Added POST to `/api/accounts` and `/api/categories` (create new)
- Added DELETE `/api/accounts/[id]` and `/api/categories/[id]` (with 409 if transactions exist)
- Created `src/app/settings/page.tsx` (server component, auth guard)
- Created `src/components/SettingsClient.tsx` (client component with forms, lists, delete buttons)
- Categories show 'Sistema' badge for `isSystem=true`; no delete button for system categories
- Delete uses a confirm/cancel pattern inline (no native `confirm()`)
- Color selection via preset swatches + native `<input type="color">`
- **Learnings:**
  - Next.js 15 route params are `Promise` types — must `await params` in dynamic routes
  - The existing accounts/categories GET routes only returned `id, name` — needed to extend select to include `type` and `color, isSystem`
  - typecheck and lint both passed on first attempt
---

