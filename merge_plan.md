# OGDCL Intern Portal — Merge Plan

## Overview

We have two separate apps that share the same domain — they need to become **one unified Next.js app** (`ogdcl-internship-management-system`) with two roles:

| Role | Entry Path | Description |
|------|-----------|-------------|
| Supervisor | `/supervisor` (or `/`) | Existing full-featured Next.js dashboard |
| Intern | `/intern` | The Vite app, ported as a Next.js client route group |

---

## Architecture

```
src/app/
├── page.tsx                    ← NEW: Role-selection landing page
├── layout.tsx                  ← Root layout (unchanged)
├── globals.css                 ← Add intern-specific CSS tokens
│
├── (supervisor)/               ← Renamed from (dashboard)
│   ├── layout.tsx
│   ├── page.tsx  (dashboard)
│   ├── interns/
│   ├── tasks/
│   ├── messages/
│   ├── reports/
│   └── settings/
│
├── (intern)/                   ← NEW: Intern portal route group
│   ├── layout.tsx              ← Intern shell (no sidebar — self-contained)
│   └── page.tsx                ← Full intern portal (ported from App.tsx)
│
└── api/
    ├── intern/
    │   ├── tasks/route.ts      ← NEW: GET tasks for the logged-in intern
    │   ├── messages/route.ts   ← NEW: GET/POST messages (shared table)
    │   └── profile/route.ts    ← NEW: GET intern profile
    └── ... (existing)
```

---

## Step-by-Step Changes

### 1. Landing / Role-Select Page (`src/app/page.tsx`)
- Replace the current redirect-to-dashboard with a **beautiful role-selection screen**
- Two cards: "Supervisor Login" → `/supervisor` and "Intern Login" → `/intern`
- OGDCL brand, teal/navy gradient, animated entrance

### 2. Rename `(dashboard)` → `(supervisor)` Route Group
- Move all existing supervisor routes under `/supervisor` prefix
- Update sidebar `href` values (`/` → `/supervisor`, `/interns` → `/supervisor/interns`, etc.)
- Update all internal `<Link>` hrefs

### 3. Create Intern Route Group `(intern)`
- **`src/app/(intern)/layout.tsx`**: Minimal layout with `<html>/<body>`, Plus Jakarta Sans font, intern-specific CSS
- **`src/app/(intern)/page.tsx`**: Full port of `create-intern-website-design/src/App.tsx`

### 4. Connect Intern Portal to Real Database
Add new API routes under `/api/intern/`:

**`/api/intern/tasks?internId=N`**
- Returns tasks for a given intern from the shared `tasks` table
- Maps supervisor's `taskStatus` enum → intern's `TaskStatus` display format

**`/api/intern/messages?internId=N`** (GET + POST)  
- GET: returns all messages for intern from shared `messages` table  
- POST: inserts a new message with `role: "intern"`, marks supervisor messages as read  
- This is the **live bridge** between the two portals — supervisor sees intern messages in real-time

**`/api/intern/profile?internId=N`**
- Returns intern profile (name, department, supervisor name)

### 5. Intern Portal Data Integration
Update the intern's `App.tsx` port to:
- Fetch real tasks via `useEffect` → `/api/intern/tasks?internId=1` (demo intern)  
- Replace static `messages` array with live fetch from `/api/intern/messages`  
- Show real supervisor name in the chat header

### 6. CSS / Design System
- Add intern portal's animations (`animate-enter`, `animate-pop`, `animate-fade`) to `globals.css`
- Plus Jakarta Sans font import in the intern layout

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/app/page.tsx` | **Rewrite** — role-selection landing |
| `src/app/(supervisor)/` | **Rename** from `(dashboard)` |
| `src/app/(supervisor)/layout.tsx` | Update `href` prefix |
| `src/app/(supervisor)/page.tsx` | Update `Link` hrefs |
| `src/components/sidebar.tsx` | Update `href` values |
| `src/app/(intern)/layout.tsx` | **Create** |
| `src/app/(intern)/page.tsx` | **Create** — full intern portal |
| `src/app/api/intern/tasks/route.ts` | **Create** |
| `src/app/api/intern/messages/route.ts` | **Create** |
| `src/app/api/intern/profile/route.ts` | **Create** |
| `src/app/globals.css` | Add intern animations |

> [!NOTE]
> The Vite project (`create-intern-website-design`) is **not deleted** — it remains as a standalone design reference. The merge happens entirely within the Next.js project.

> [!IMPORTANT]
> The messaging API creates **real bidirectional communication**: intern messages sent from `/intern` appear immediately in the supervisor's `/supervisor/messages` inbox, and vice versa.
