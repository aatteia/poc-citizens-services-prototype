# SA Parenting Eligibility — Session 2 plan

**Branch:** `scenario-2`
**Status:** Draft — awaiting approval before any build work begins.

---

## 1. Conflicts with existing architecture (flagged for decision)

The brief is internally consistent with one exception and a handful of
token/dependency mismatches with what session 1 actually shipped. None of
these require restructuring the existing IA. Each is resolvable inside the
current framework. Listed in priority order.

### 1.1 Icon set — Font Awesome vs `lucide-react`

The brief specifies Font Awesome icons (`fa-id-card`,
`fa-hand-holding-heart`, `fa-file-invoice-dollar`, `fa-calendar-check`,
`fa-circle-check`, `fa-chevron-down/up`). Session 1 standardised on
`lucide-react` — every existing icon usage (header search, myGov chevron,
breadcrumb chevron, banner icons, page-rating faces, footer socials)
goes through lucide. Adding Font Awesome would mean shipping two icon
libraries side by side, which contradicts the design system consistency
the brief otherwise asks for.

**Proposed resolution:** map every FA name in the brief to its closest
lucide equivalent and use lucide throughout. Mapping:

| Brief (FA)                  | Proposed (lucide)  |
|-----------------------------|--------------------|
| `fa-id-card`                | `IdCard`           |
| `fa-hand-holding-heart`     | `HeartHandshake`   |
| `fa-file-invoice-dollar`    | `ReceiptText`      |
| `fa-calendar-check`         | `CalendarCheck`    |
| `fa-circle-check`           | `CircleCheck`      |
| `fa-chevron-down` / `-up`   | `ChevronDown` / `ChevronUp` |

**Alternative (only if explicitly preferred):** add `@fortawesome/react-fontawesome` as a new dependency and use FA for session-2 icons only. Not recommended.

### 1.2 Token names referenced in the brief vs what exists

The brief mentions `--border-default` and `--bg-subtle`. These names do
not exist. The closest existing tokens are:

| Brief reference         | Existing token (use this)        |
|-------------------------|----------------------------------|
| `--border-default`      | `--border-strong` (interactive boundaries, 4.5:1 AA-compliant) |
| `--bg-subtle`           | `--muted` (`#F5F5F5` light / `#1C232C` dark) |

No new tokens will be added. This honours the brief's "no new colour
tokens" rule.

### 1.3 `shadcn` Checkbox primitive is not yet in the project

The brief mandates the shadcn Checkbox primitive. The project currently
ships a custom radio-card and the shadcn Collapsible, but no Checkbox.
This is an additive change, not a structural one.

**Proposed resolution:** add `@radix-ui/react-checkbox` and place a
shadcn-style wrapper at `src/components/ui/checkbox.tsx` matching the
existing `collapsible.tsx` pattern (Radix primitive re-export with
Attica/SA classes applied). No existing files are modified.

### 1.4 `/carers/prepare` "full-width content layout (no sidebar)"

Every existing page uses the `.page__grid` 3-column layout (left side-rail
+ main + right "on this page" sidebar). The prepare page needs a single
content column.

**Proposed resolution:** add a new layout modifier `.page--prepare` (or
equivalent block class) alongside the existing `.page`/`.page__grid`
rules. The existing 3-column grid stays untouched. The prepare page
opts out by not rendering `<SideRail>` and `<aside>`, and uses a
narrower max-width container for legibility (~768px content column).

### 1.5 Sticky progress bar stacked under the sticky header

The site header is already `position: sticky; top: 0` with
`--header-height: 196px`. The brief's progress bar should sit "below
breadcrumb, above H1 on scroll" — i.e. it lives in normal flow above the
H1 and becomes the second sticky element below the header when the page
scrolls past it.

**Proposed resolution:** `position: sticky; top: var(--header-height);
z-index: 40` (one below the header's z-50). Works with no other changes.

---

## 2. Routes in scope (delta from session 1)

| Route               | New / Existing | Notes                                                   |
|---------------------|----------------|---------------------------------------------------------|
| `/`                 | Existing       | Untouched. Files content lives here.                    |
| `/check/q[1-6]`     | Existing       | Untouched.                                              |
| `/check/result/*`   | Existing       | Untouched.                                              |
| `/components`       | Existing       | **Appended only.** New "Session 2 components" section at bottom. |
| `/carers`           | **New**        | Carer Payment overview. Structural clone of `/`.        |
| `/carers/prepare`   | **New**        | Prepare-to-claim checklist. Original layout.            |

---

## 3. Navigation refactor (only permitted change to session-1 chrome)

Currently `src/components/layout/site-header.tsx` is a server component
with hardcoded `current: true` on Families. Two behaviours need to be
added:

1. Active-tab state derived from `pathname` (so the secondary nav
   updates between Families and Carers as the user moves scenarios).
2. Non-functional nav items rendered as non-link elements with the
   "not part of this prototype" tooltip.

### 3.1 File changes

- **`src/components/layout/site-header.tsx`** — convert to client
  component (`"use client"`), import `usePathname` from
  `next/navigation`. Replace nav arrays with the new shape below.
  Render each item as either a `<Link>` (functional) or a `<span>`
  with `aria-disabled="true"` and `title` (non-functional).
- **`src/lib/nav-data.ts`** — extend to export a new `carerPayments`
  array mirroring the existing `familyPayments` shape:
  ```ts
  export const carerPayments = [
    { label: "Carer Payment",   href: "/carers", current: true },
    { label: "Carer Allowance", href: "#" },
    { label: "Carer Gateway",   href: "#" },
  ] as const;
  ```

### 3.2 New nav config (inside `site-header.tsx`)

```ts
type FunctionalNav   = { label: string; href: string; matches: readonly string[] };
type DisabledNav     = { label: string; disabled: true };
type NavItem         = FunctionalNav | DisabledNav;

const primaryNav: readonly NavItem[] = [
  { label: "Individuals",         href: "/", matches: ["/"] /* always-on */ },
  { label: "Health professionals", disabled: true },
  { label: "Businesses",           disabled: true },
  { label: "Community groups",     disabled: true },
];

const secondaryNav: readonly NavItem[] = [
  { label: "Families", href: "/",       matches: ["/", "/check"] },
  { label: "Work",     disabled: true },
  { label: "Housing",  disabled: true },
  { label: "Health",   disabled: true },
  { label: "Carers",   href: "/carers", matches: ["/carers"] },
  { label: "Study",    disabled: true },
];
```

Active state derivation:

```ts
function isActive(matches: readonly string[], pathname: string) {
  return matches.some(
    (m) => pathname === m || pathname.startsWith(m === "/" ? "/check" : m + "/")
  );
}
```

(Individuals — primary nav — is hardcoded `aria-current="page"`
unconditionally per the brief.)

### 3.3 Disabled item rendering

```tsx
<span
  className="site-nav-primary__link site-nav-primary__link--disabled"
  title="This section is not part of this prototype"
  aria-disabled="true"
>
  {item.label}
</span>
```

CSS additions (appended, no edits to existing rules):

```css
.site-nav-primary__link--disabled,
.site-nav-secondary__link--disabled {
  cursor: default;
  color: var(--muted-foreground);
}
.site-nav-primary__link--disabled:hover,
.site-nav-secondary__link--disabled:hover {
  background: transparent;
  color: var(--muted-foreground);
}
```

This honours the brief: "cursor: default, no hover state".

---

## 4. Screen breakdown

### 4.1 `/carers` — Carer Payment overview

**Layout:** `.page__grid` (existing 3-column grid). No new layout
primitive needed. Strict structural clone of `src/app/page.tsx`.

**Component reuse (all session-1 components, no changes):**
`<SideRail>`, `<Breadcrumb>`, `<FactBox>` + `<FactBoxItem>`,
`<PageRating>`, `<PageMeta>`, `buttonVariants` (for both CTAs).

**Content substitutions:**

| Slot               | Value                                                                     |
|--------------------|---------------------------------------------------------------------------|
| Breadcrumb         | Home › Carers › Carer Payment                                             |
| Eyebrow            | "For carers"                                                              |
| H1                 | "Carer Payment"                                                           |
| Intro              | Brief copy verbatim                                                       |
| Primary CTA        | "Prepare to claim" → `/carers/prepare` (primary, lg)                      |
| Secondary CTA      | "Check if you're eligible" → `#` (secondary variant, lg) — visible only   |
| Fact box           | 3 items: Fortnightly rate / Income free area / Work limit                 |
| On-this-page anchors | `who`, `how-much`, `how-to-claim`, `manage` — same ids as `/`           |
| Body sections      | 4 sections × 2–3 plain-language sentences (drafted in build step)         |
| SideRail           | `carerPayments` from `nav-data.ts`, `parentLabel="Carers"`, `parentHref="#"` |

**Files created:**
- `src/app/carers/page.tsx`

### 4.2 `/carers/prepare` — Prepare to claim checklist

**Layout:** new `.page--prepare` modifier providing a single ~768px
content column. No sidebar.

**Page structure (top → bottom):**

```
<header>      → existing SiteHeader (sticky)
<div .page .page--prepare>
  <div .page__breadcrumb>           → Home › Carers › Carer Payment › Prepare to claim
  <div .prepare__progress>          → sticky progress bar (sticks to top: var(--header-height))
  <div .prepare__main>
    <h1>                            → "Prepare to claim Carer Payment"
    <p .prepare__intro>             → intro paragraph from brief
    <ChecklistGroup × 4>            → groups 1–4
    {allChecked && <CompletionBanner />}
  </div>
</div>
<footer>      → existing SiteFooter
```

**State management (`useState`, single source of truth):**

```ts
const [checked, setChecked] = useState<Record<number, boolean>>({});
const total      = 12;
const completed  = Object.values(checked).filter(Boolean).length;
const allDone    = completed === total;
const toggle     = (id: number) => setChecked((s) => ({ ...s, [id]: !s[id] }));
```

Per-group completion derived inline:
```ts
const groupComplete = group.items.every((it) => checked[it.id]);
const groupCount    = group.items.filter((it) => checked[it.id]).length;
```

No `useReducer`, no context, no `localStorage` — matches brief.

**Files created:**
- `src/app/carers/prepare/page.tsx` (`"use client"`)
- `src/lib/carer-checklist.ts` — 4-group × 12-item config array

---

## 5. New components (session 2)

All new components live in a new directory `src/components/checklist/`
to keep them scope-separable from session-1 primitives. They consume
existing tokens only.

### 5.1 `ProgressSummaryBar`
- Props: `completed: number`, `total: number`
- Role: `role="status"`, `aria-live="polite"`
- Text left: "X of 12 items ready"
- Fill bar right: container `width: 100%`, height `6px`, `border-radius:
  var(--radius-pill)`, fill colour `var(--primary)`, fill width
  `(completed / total) * 100%`, transition `width 200ms ease-out`
- Background: `var(--muted)` on the bar's outer container; vertical
  padding 12px
- Sticky behaviour is on the wrapper, not the component itself, so the
  same component is reusable in the component library at rest

### 5.2 `ChecklistGroup`
- Props: `group: GroupConfig`, `checked: Record<number, boolean>`,
  `onToggle: (id: number) => void`
- White card, `border-radius: var(--radius)` (= 8px), border
  `1px solid var(--border-strong)`, `box-shadow: var(--shadow-sm)`,
  padding 24px
- Header row: icon (20px, `var(--primary)`) + `<h2>` (heading font,
  20px) + right-aligned completion pill when `groupComplete`
- Completion pill: green (`background: var(--eligible-bg)`, text
  `var(--eligible-text)`), pill radius, `CircleCheck` icon, label
  "All done", visually-hidden `sr-only` span: "All items in this
  group are complete"
- Group description: body-s (14px), `color: var(--muted-foreground)`
- Items list: stacked, 1px dividers between (`border-bottom:
  1px solid var(--border)`)

### 5.3 `ChecklistItem`
- Props: `item: ItemConfig`, `checked: boolean`, `onToggle: () => void`
- Layout: 48px min-height, flex row
- Left: `<Checkbox>` (shadcn primitive, navy fill on checked)
- Centre: `<label htmlFor={id}>` body-m
- Right: "Why do I need this?" toggle button with `ChevronDown` (rotates
  to `ChevronUp` when expanded); `aria-expanded`, `aria-controls`
- Helper panel: shadcn `<Collapsible>` content, `background: var(--muted)`,
  inset 16px padding, body-s, `color: var(--muted-foreground)`
- Checked state: label colour switches to `var(--muted-foreground)`.
  **No strikethrough.**
- Each item has its own local `useState` for the collapsible (independent
  of the checkbox state, which lives on the parent)

### 5.4 `CompletionBanner`
- Reuses `.banner--eligible` styling from session 1 (no new banner
  variant)
- `role="status"` (NOT `role="alert"` — the brief is explicit about this)
- Icon: `CircleCheck` (lucide), `var(--eligible-border)`
- Title: "You look ready to claim"
- Body: "You've gathered everything you need. Starting your claim online
  takes around 20 minutes."
- Primary CTA: "Start your claim" → `#`
- Secondary CTA: "Print this checklist" → `onClick={() => window.print()}`

### 5.5 shadcn `Checkbox` primitive (new file)
- `src/components/ui/checkbox.tsx` — Radix wrapper with Attica/SA classes
- Visual: 20px square, 2px `var(--border-strong)` border, `var(--primary)`
  fill + white `Check` icon when checked, `var(--ring)` focus outline,
  `cursor: pointer`
- Disabled state styled (not used in this scope but present for the
  primitive to be complete)
- Dependency: `@radix-ui/react-checkbox` (~3 KB gzip, identical pattern
  to the already-installed `@radix-ui/react-collapsible`)

---

## 6. Print stylesheet

Added to `globals.css` under a new `@media print` block. Scoped via a
`.page--prepare` class on the page root so it only fires on the prepare
page. Other pages keep default browser print behaviour.

```css
@media print {
  .page--prepare ~ * { display: none !important; }
  body:has(.page--prepare) .site-header,
  body:has(.page--prepare) .site-footer,
  body:has(.page--prepare) .prepare__progress,
  body:has(.page--prepare) .checklist-item__toggle,
  body:has(.page--prepare) .completion-banner__actions {
    display: none !important;
  }
  body:has(.page--prepare) {
    font-family: Georgia, serif;
    color: #000;
    background: #fff;
  }
  @page { margin: 20mm; }
  .checklist-group { page-break-inside: avoid; break-inside: avoid; }
  .checklist-item__helper { display: block !important; }    /* force-expand */
  .checklist-item[data-checked="true"] .checklist-item__label::before {
    content: "■ ";
  }
  .checklist-item[data-checked="false"] .checklist-item__label::before {
    content: "☐ ";
  }
}
```

The `data-checked` attribute is set on each item row so the print CSS can
read it without depending on the live Radix state.

---

## 7. `/components` page additions (append-only)

A new section appended to the bottom of `src/app/components/page.tsx`:

```
═══ Session 2 components ═══

  ChecklistGroup
    • Default (no items checked, no badge)
    • Partial (2 of 4 checked, "2 of 4" mini-count next to H2)
    • Complete (all checked, "All done" pill visible)

  ChecklistItem
    • Unchecked + collapsed
    • Checked + collapsed
    • Unchecked + expanded helper text

  ProgressSummaryBar
    • 0 of 12
    • 6 of 12
    • 12 of 12

  CompletionBanner
    • Filled state

  Print stylesheet note
    • Text-only paragraph: "A print stylesheet renders the checklist only,
      hiding nav, header, and footer, with helper text always expanded."
```

For the static previews, the components accept a `static` mode prop OR
each demo wraps a controlled instance with `useState` of its own — same
pattern as `StaticRadioCard` already used at the bottom of the page.

---

## 8. Accessibility checklist (carried into build)

- Checkbox + `<label for/id>` association — supplied by shadcn primitive
- Checked state communicated by fill + check glyph (not colour alone)
- Group completion pill has `<span className="sr-only">` text
- Progress bar `role="status"` + `aria-live="polite"`
- "Why do I need this?" button: `aria-expanded`, `aria-controls` to the
  panel `id`
- Completion banner: `role="status"`, not `alert`
- Print: `■` / `☐` glyphs before label (state without colour)
- Focus ring on checkbox uses `var(--ring)` (SA action blue, AA-compliant)
- All disabled nav items: `aria-disabled="true"` + `title` attribute

---

## 9. Build order

1. **Plan approved.** _(blocking)_
2. **Nav data + nav refactor**
   - Extend `src/lib/nav-data.ts` with `carerPayments`.
   - Convert `site-header.tsx` to client component; introduce
     `FunctionalNav` / `DisabledNav` types, `usePathname` active-state
     logic, and disabled-item rendering.
   - Append `--disabled` modifier CSS to `globals.css`.
   - Smoke-test by visiting `/` (Families active) and `/components`
     (Families also active since `/components` is not a scenario route —
     **flag:** confirm desired behaviour for `/components` — current
     proposal is to leave secondary nav inert (no item highlighted) on
     `/components`).
3. **Carer overview page** (`/carers`)
   - New `src/app/carers/page.tsx` — clone of `src/app/page.tsx` with
     content swaps and `carerPayments` rail.
   - Verify breadcrumb, fact box, CTAs, anchors render correctly.
4. **shadcn Checkbox primitive**
   - `npm i @radix-ui/react-checkbox`.
   - `src/components/ui/checkbox.tsx` Radix wrapper.
   - Visual verification in isolation (component library entry).
5. **Checklist config + components**
   - `src/lib/carer-checklist.ts` config array.
   - `src/components/checklist/` directory:
     `progress-summary-bar.tsx`, `checklist-group.tsx`,
     `checklist-item.tsx`, `completion-banner.tsx`.
   - Append `@layer components` rules for each to `globals.css`.
6. **Prepare page** (`/carers/prepare`)
   - `src/app/carers/prepare/page.tsx` (`"use client"`).
   - Wires state, derived values, renders progress bar + 4 groups +
     conditional completion banner.
   - Add `.page--prepare` layout rule to `globals.css`.
7. **Print stylesheet**
   - Append `@media print` block to `globals.css`.
   - Verify with `cmd-P` (Print Preview) on `/carers/prepare`.
8. **Component library additions**
   - Append "Session 2 components" section to `src/app/components/page.tsx`.
9. **Type check + manual smoke test**
   - `npx tsc --noEmit`.
   - Click-through both scenarios: `/` → check flow, `/` → Carers tab →
     `/carers` → Prepare to claim → check items → completion banner →
     Print preview.

Each step is a discrete commit on the `scenario-2` branch.

---

## 10. Open questions for the user

1. **Icon set conflict (1.1).** Map to lucide (recommended) or add Font
   Awesome as a new dependency?
2. **`/components` page secondary-nav active state.** No scenario applies
   there. Proposal: render all secondary items inert (none highlighted).
   Acceptable?
3. **`PageRating` / `PageMeta` on `/carers/prepare`.** The brief omits
   them. Proposal: include them at the bottom of the prepare page for
   consistency with every other content page. Acceptable, or leave them
   off?
4. **Carer overview body copy** for the four sections (Who / How much /
   How to claim / Manage). The brief asks for 2–3 sentences each but
   does not supply text. Proposal: I draft plain-language copy aligned
   with the official servicesaustralia.gov.au tone (similar density to
   the existing Parenting Payment page). Acceptable?

---

## 11. Out of scope (re-stated from brief for verification)

- No Carer eligibility question flow
- No Carer Allowance or Carer Gateway content
- No persistence (refresh resets the checklist)
- No mobile hamburger drawer changes
- No animation beyond existing 120 ms hover + 200 ms progress fill
- No changes to any session-1 screen other than the shared header

---

**End of plan.** Please review and approve, or push back on any item
above. No build work will start until I have explicit go-ahead.
