# Extending the prototype

## Add a new question to the eligibility flow

1. **`src/lib/questions.ts`** — add a new `Question` object to the `questions` array. Assign the next `QuestionId` (e.g. `"q7"`), a `step` number, a `shortLabel` for the progress indicator, a `legend`, and `options`. Update the `QuestionId` type union.

2. **`src/lib/eligibility.ts`** — if the new question affects the outcome, add a branch to the `evaluate` function. If it is informational only (like Q5 and Q6), no change is needed here.

3. **`src/app/check/`** — create a new route directory (e.g. `q7/`) with a `page.tsx`:
   ```tsx
   import { QuestionPage } from "@/components/flow/question-page";
   export default function Q7() { return <QuestionPage step={7} />; }
   export const metadata = { title: "Question 7 of 7 — Check if you're eligible — Parenting Payment" };
   ```

4. **`src/components/flow/question-page.tsx`** — update the `total` prop passed to `ProgressIndicator` if the step count has changed.

5. **`src/app/check/result/eligible/page.tsx`** and **`ineligible/page.tsx`** — the answer summary renders all questions automatically from the `questions` array, so no change is needed there.

6. **`bin/test-eligibility.ts`** — add test cases covering any new branch the question introduces.

---

## Add a new checklist item

1. **`src/lib/carer-checklist.ts`** — add a new `ChecklistItemConfig` object to the relevant group's `items` array. Assign the next stable integer `id` (continue from 12). Write a `label` and a `helper` string.

2. If the item changes the readiness threshold for its section, update the `requiredCount` on that group.

No other files need to change — the checklist page and group components iterate the data array dynamically.

---

## Add a new checklist section

1. **`src/lib/carer-checklist.ts`** — add a new `ChecklistGroupConfig` object to the `carerChecklist` array. Provide an `id`, `title`, `description`, a Lucide icon import, `requiredCount`, and an `items` array. The `SECTION_TOTAL` export is derived automatically from `carerChecklist.length`.

2. No other files need to change — `PreparePage` maps over the array and the progress bar derives its total from `SECTION_TOTAL`.

---

## Add a new payment scenario (new top-level flow)

Use the Parenting Payment scenario as the template.

1. **`src/lib/`** — create a questions file (e.g. `carer-questions.ts`) and an eligibility file (e.g. `carer-eligibility.ts`) following the same patterns as `questions.ts` and `eligibility.ts`.

2. **`src/app/`** — create a new route tree (e.g. `carer-check/q1/`, `carer-check/q2/`, etc.) mirroring the structure under `check/`. Add a `layout.tsx` wrapping the new flow in a `FlowProvider`.

3. **`src/app/carer-check/result/`** — add `eligible/page.tsx` and `ineligible/page.tsx` using the same redirect-guard + answer-summary pattern.

4. **`src/lib/nav-data.ts`** — add the new sibling items to the relevant `SideRailItem` array, or create a new array for the new section's side-rail.

5. **`src/components/nav/`** — add the new section to the site header navigation if needed.

---

## Add a new page

1. Create a directory under `src/app/` (e.g. `src/app/about/`) with a `page.tsx`.

2. Use the existing page shell pattern — `<div className="page">` wrapping `<div className="page__grid">` with `<SideRail>`, `<div className="page__main">`, and `<aside className="page__sidebar">`. See `src/app/page.tsx` for the reference implementation.

3. Add breadcrumb items to match the page's position in the hierarchy.

4. Add any new nav links to `src/lib/nav-data.ts` and the site header.

---

## Add a new government theme

The SA theme lives entirely in `src/app/globals.css` under the `html[data-theme="sa"]` selector block (Layer 2). To add another theme:

1. **`src/app/globals.css`** — add a new `html[data-theme="your-theme"]` block following the same pattern: map Attica raw token values to the ShadCN semantic token names (`--primary`, `--background`, `--foreground`, etc.).

2. **`src/app/layout.tsx`** — update the `data-theme` attribute on the `<html>` element to use the new theme identifier.

3. If the theme requires different fonts, update the `next/font/google` imports in `layout.tsx` and apply them via CSS variables in the new theme block.

The three-layer architecture means Layer 1 (Attica raws) and Layer 3 (Tailwind bridge) need no changes — only Layer 2 is theme-specific.

---

## Connect a real backend

The prototype uses no backend. Here is what you would add for each concern:

**Session persistence (eligibility answers)**
Replace the in-memory `FlowProvider` reducer with a `localStorage`-backed store, or move answers into a server-side session (e.g. `iron-session`) keyed to an authenticated user. The `evaluate()` function would remain a pure function — only the storage layer changes.

**Checklist persistence**
Replace the `useState<Record<number, boolean>>` in `PreparePage` with a call to an API route (`/api/checklist/[userId]`) that reads and writes to a database. The UI receives the state as a prop and the toggle handler fires an optimistic update + a `fetch`.

**Form submission**
Add a `<form>` with a Server Action (Next.js App Router) or an API route handler. The Server Action would validate inputs, write to the database, and redirect to a confirmation page. The eligibility check result page's "Apply through myGov" button would become a real link to a myGov deep-link after the user authenticates.

**Authentication**
Add NextAuth.js v5 with the myGov provider (or a mock OIDC provider for staging). Wrap authenticated routes in a middleware check. The `FlowProvider` would be replaced by a server-fetched session object.

**Content management**
Replace the static `questions.ts` and `carer-checklist.ts` constants with API calls to a CMS (e.g. Contentful, Sanity) so that payment rates, income thresholds, and checklist item copy can be updated without a code deployment.
