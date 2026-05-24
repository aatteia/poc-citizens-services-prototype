# Plan — SA Parenting Payment eligibility prototype (session 1, rev 2)

## What changed since rev 1

Three things, all driven by your feedback:

1. **Typography:** locked to Attica's stack — **Roboto** for headings and
   **Open Sans** for body — loaded locally from the .ttf files in the
   Attica zip via `next/font/local`. Public Sans / Google Fonts is dropped.
2. **Deletion list:** confirmed. Prisma, NextAuth, Stripe, dashboard, and
   auth groups all go. The repo will be a clean Next 16 + Tailwind v4 +
   TypeScript + shadcn-on-base-ui app — Vercel-deploy-ready with zero
   server-side dependencies.
3. **Architectural alignment with [shadcn-gov-themes](https://github.com/aatteia/shadcn-gov-themes).**
   I inspected the repo. Even though we are not pulling in the Health /
   NSW / CivicTheme themes (the brief is explicit on that), we **adopt its
   architectural conventions** so this prototype feels like a sibling of
   that codebase, not a parallel design. Specifically:

   - **shadcn primitive base:** `@base-ui/react`, not `@radix-ui`. Modern
     shadcn moved to base-ui in 2025 and gov-themes already runs on it.
   - **Token vocabulary:** the shadcn-standard semantic names
     (`--primary`, `--primary-foreground`, `--background`, `--foreground`,
     `--card`, `--muted`, `--accent`, `--destructive`, `--border`,
     `--input`, `--ring`, `--radius`) drive every shadcn component. SA
     navy + Attica colours are bound to those names so shadcn components
     pick them up automatically.
   - **Theme block shape:** an `html[data-theme="sa"]` selector matching
     the shape of `health` / `nsw` / `civictheme` blocks in
     gov-themes' `globals.css`. `data-theme="sa"` is hard-set on `<html>`
     in the root layout. **No theme switcher UI is rendered** (per brief).
     This means the prototype can later be lifted into gov-themes as a
     fourth theme by copying the block.
   - **`@theme inline` mapping:** same pattern gov-themes uses to expose
     CSS variables as Tailwind utility classes (`bg-primary`,
     `text-foreground`, `border-border`, etc.).
   - **`cn()` helper:** `clsx` + `tailwind-merge`, identical signature to
     gov-themes' `src/lib/utils.ts`.

## 1. Goal (unchanged)

A polished coded prototype that reimagines the **Parenting Payment
eligibility** journey on the Services Australia site, demonstrating
interaction-pattern design, design-system fluency, WCAG 2.2 AA rigour,
and a strong hand-off artefact for the Lead Interaction Designer
interview (LH-06307). Local dev for design refinement; deploy to
**Vercel** for public hosting at the end.

Stack: **Next.js 16.2.6** (App Router) · **React 19.2.4** · **Tailwind v4** ·
**TypeScript 5 strict** · **shadcn/ui on `@base-ui/react`** · **CVA + clsx + tailwind-merge** ·
**lucide-react** for icons.

## 2. Repo hygiene — confirmed deletion list

These exist in the scaffold and are out of scope. They will be deleted
in step 1 of the build, in one pass, before any feature work:

| Path | Reason |
| --- | --- |
| `src/app/(auth)/` (`login`, `register`, `forgot-password`, layout) | no auth in prototype |
| `src/app/(dashboard)/` (`dashboard`, layout) | no dashboard in prototype |
| `src/app/api/auth/`, `src/app/api/webhooks/` | no API routes in prototype |
| `src/lib/auth.ts`, `src/lib/db.ts`, `src/lib/stripe.ts` | no auth, DB, or payments |
| `src/hooks/use-session.ts` | no auth |
| `src/generated/` | Prisma client output |
| `prisma/`, `prisma.config.ts` | no DB |
| `src/components/ui/button.tsx` (placeholder) | replaced by shadcn-generated Button |
| `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css` | rewritten |

Dependencies pruned from `package.json` (and lockfile regenerated):
`@auth/prisma-adapter`, `@prisma/adapter-pg`, `@prisma/client`,
`dotenv`, `next-auth`, `pg`, `prisma`, `stripe`, `@types/pg`.

Dependencies added: `@base-ui/react`, `class-variance-authority`,
`clsx`, `tailwind-merge`, `lucide-react`, `tw-animate-css` (matching
gov-themes' set).

`.env.local` is no longer required for the prototype but will be kept as
`.env.local.example` so anyone cloning the repo can see that it expects
nothing.

## 3. Vercel deployment posture

- **Zero server-side state.** All flow state lives in React; nothing
  persists across reloads. No DB connection, no auth provider, no
  Stripe webhook, no env vars required at runtime.
- **All routes are static-friendly.** Every page is either a server
  component rendering hard-coded copy or a client component that uses
  in-memory context. Next.js will prerender what it can; the rest
  hydrates on the client. No `dynamic = 'force-dynamic'` flags needed.
- **Deployment path:** `vercel link` → `vercel deploy --prod` (Vercel
  CLI not yet installed locally; we will install it as part of the
  deploy step). No `vercel.ts` needed for this prototype — the defaults
  cover it. If we later add custom headers, redirects, or rewrites,
  we add `vercel.ts` at that point.
- **Fonts:** local self-hosting via `next/font/local` keeps build-time
  costs predictable and avoids any Google Fonts call from Vercel's
  edge — also means the Attica .ttf files end up in `_next/static/media`
  and ship with the build.

## 4. Token foundation — `src/app/globals.css`

### 4.1 Three-layer token strategy

> **The reconciliation between Attica and shadcn:** shadcn components
> reach for semantic role tokens (`--primary`, `--foreground`, etc.)
> while Attica ships a raw-palette token system (`--eminence-600`,
> `--smalt-700`, etc.). We layer them: Attica raw ramps stay available
> for any direct use; shadcn semantic names are the bridge that wire
> SA navy and other brand colours into every shadcn primitive without
> per-component overrides.

Top of file:

```css
@import "tailwindcss";
@import "tw-animate-css";
```

Then in order:

1. **`:root`** — full Attica raw ramps verbatim from
   `attica-design-system/project/colors_and_type.css`. Eminence, Mauve,
   Smalt, Cerulean, Nobel, Black tints, Buff, semantic colours
   (info/success/warning/error), restricted (Lomandra, Hibiscus),
   spacing scale, radius scale, elevation scale, typography scale.
   This is the design-system fidelity layer.

2. **`html[data-theme="sa"]`** — **shadcn-standard semantic token block**,
   shaped identically to the `health` / `nsw` / `civictheme` blocks
   in gov-themes. Both `--color-*` and the bare `--*` form are written
   because both are referenced by different parts of the shadcn ecosystem
   (this is the exact pattern in gov-themes' globals.css). Values:

   ```css
   html[data-theme="sa"] {
     --radius: 0.5rem;            /* 8px — Attica card radius */

     /* Surfaces */
     --background: #ffffff;       --color-background: #ffffff;
     --foreground: #1A1A1A;       --color-foreground: #1A1A1A;   /* Attica nobel-800 / black-800 */

     --card: #ffffff;             --color-card: #ffffff;
     --card-foreground: #1A1A1A;  --color-card-foreground: #1A1A1A;

     --popover: #ffffff;          --color-popover: #ffffff;
     --popover-foreground: #1A1A1A; --color-popover-foreground: #1A1A1A;

     /* Primary — SA navy */
     --primary: #1B4F72;          --color-primary: #1B4F72;
     --primary-foreground: #ffffff; --color-primary-foreground: #ffffff;

     /* Secondary — light SA blue tint, for less-prominent surfaces */
     --secondary: #E8F4FD;        --color-secondary: #E8F4FD;
     --secondary-foreground: #1B4F72; --color-secondary-foreground: #1B4F72;

     /* Muted — Attica nobel-50 for section backgrounds */
     --muted: #F5F5F5;            --color-muted: #F5F5F5;
     --muted-foreground: #5C5C5C; --color-muted-foreground: #5C5C5C;

     /* Accent — same as secondary for this brand */
     --accent: #E8F4FD;           --color-accent: #E8F4FD;
     --accent-foreground: #1B4F72; --color-accent-foreground: #1B4F72;

     /* Destructive — Attica error-500 */
     --destructive: #B01F13;      --color-destructive: #B01F13;
     --destructive-foreground: #ffffff; --color-destructive-foreground: #ffffff;

     /* Borders / inputs */
     --border: #EBEBEB;           --color-border: #EBEBEB;   /* Attica nobel-200 */
     --input:  #ADADAD;           --color-input:  #ADADAD;   /* Attica nobel-300 */

     /* Focus ring — SA action blue */
     --ring: #005EA2;             --color-ring: #005EA2;
   }
   ```

3. **SA semantic helpers** — names not in shadcn's vocabulary but used
   by our custom components (banners, fact box, link). Same `data-theme="sa"`
   block:

   ```css
   --fg-link: #005EA2;
   --fg-link-hover: #003F73;
   --primary-hover: #154060;
   --primary-active: #0F2D47;

   /* Banner tints */
   --eligible-bg: #E8F5E9;   --eligible-border: #1D7324;
   --ineligible-bg: #FFF8E1; --ineligible-border: #7A5800;
   --info-bg: #E8F4FD;       --info-border: #1B4F72;

   /* Footer */
   --footer-bg: #0D2D44;     --footer-fg: #ffffff;
   ```

4. **`@theme inline { ... }`** — exposes the shadcn semantic tokens AND
   the Attica structural tokens as Tailwind utility classes. Pattern
   matches gov-themes:

   ```css
   @theme inline {
     /* shadcn colour aliases */
     --color-background: var(--background);
     --color-foreground: var(--foreground);
     --color-card: var(--card);
     --color-card-foreground: var(--card-foreground);
     --color-primary: var(--primary);
     --color-primary-foreground: var(--primary-foreground);
     /* … secondary, muted, accent, destructive, border, input, ring … */

     /* Attica structural — already on :root, just exposing for Tailwind */
     --radius-xs: 4px;
     --radius-sm: 8px;
     --radius-md: 12px;
     --radius-lg: 16px;
     --radius-pill: 200px;

     --shadow-xs: 0px 2px 4px 0px rgba(0,0,0,0.10);
     --shadow-sm: 0px 4px 8px 0px rgba(0,0,0,0.10);
     --shadow-md: 0px 8px 16px 0px rgba(0,0,0,0.10);
     --shadow-lg: 0px 12px 24px 0px rgba(0,0,0,0.10);

     /* Fonts — set in layout.tsx via next/font/local CSS variables */
     --font-sans: var(--font-open-sans), system-ui, -apple-system, sans-serif;
     --font-heading: var(--font-roboto), var(--font-open-sans), sans-serif;
   }
   ```

5. **Base layer** — body-level defaults and a skip-link utility:

   ```css
   @layer base {
     html { background: var(--background); }
     body {
       font-family: var(--font-sans);
       color: var(--foreground);
       background: var(--background);
       -webkit-font-smoothing: antialiased;
     }
     h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }
     a { color: var(--fg-link); text-underline-offset: 3px; }
     a:hover { color: var(--fg-link-hover); }

     .skip-link {
       position: absolute; top: -100px; left: 16px;
       background: var(--primary); color: var(--primary-foreground);
       padding: 12px 16px; border-radius: 4px;
       z-index: 100; text-decoration: none;
     }
     .skip-link:focus { top: 16px; }
   }
   ```

### 4.2 Typography — `next/font/local` (Attica fonts)

Copy four `.ttf` files from `attica-design-system/project/fonts/` into
`src/app/fonts/`:

- `Roboto-VariableFont_wdth_wght.ttf` (and Italic variant)
- `OpenSans-VariableFont_wdth_wght.ttf` (and Italic variant)

In `src/app/layout.tsx`:

```ts
import localFont from 'next/font/local';

const roboto = localFont({
  src: [
    { path: './fonts/Roboto-VariableFont_wdth_wght.ttf', weight: '100 900', style: 'normal' },
    { path: './fonts/Roboto-Italic-VariableFont_wdth_wght.ttf', weight: '100 900', style: 'italic' },
  ],
  variable: '--font-roboto',
  display: 'swap',
});

const openSans = localFont({
  src: [
    { path: './fonts/OpenSans-VariableFont_wdth_wght.ttf', weight: '300 800', style: 'normal' },
    { path: './fonts/OpenSans-Italic-VariableFont_wdth_wght.ttf', weight: '300 800', style: 'italic' },
  ],
  variable: '--font-open-sans',
  display: 'swap',
});
```

Applied to `<html>` className: `${roboto.variable} ${openSans.variable}`.
Default body font: Open Sans. Headings: Roboto (per Attica).

Inter (Attica's UI / icon font) is **not** loaded. The brief makes no
ask for it and Open Sans is sufficient for UI text.

## 5. `<html>` root layout

```tsx
<html lang="en-AU" data-theme="sa" suppressHydrationWarning
      className={`${roboto.variable} ${openSans.variable}`}>
  <body>
    <a href="#main" className="skip-link">Skip to main content</a>
    <SiteHeader />
    <main id="main" tabIndex={-1}>{children}</main>
    <SiteFooter />
  </body>
</html>
```

- `data-theme="sa"` is hard-coded — no theme switcher UI.
- `suppressHydrationWarning` per gov-themes convention (safe because we
  never mutate `data-theme` client-side).
- Skip-link is the first body child (first focusable element).

## 6. shadcn primitives — what we add, on base-ui

Install via `npx shadcn@latest init` (selecting base-ui as the primitive
library), then `npx shadcn@latest add button radio-group collapsible`.
The CLI will pick up our token names automatically because we follow
the shadcn vocab.

| Primitive | Source | Override approach |
| --- | --- | --- |
| `Button` | shadcn (plain CVA, no base-ui primitive needed) | CVA variants `primary` `secondary` `tertiary` `destructive`, sizes `sm` `default` `lg`. Default rounded-`var(--radius-pill)` (Attica pill). 40 px min-height (default), 48 px (lg). Focus ring `outline-2 outline-offset-2 outline-ring`. |
| `RadioGroup` + `RadioGroupItem` | shadcn on `@base-ui/react` `RadioGroup` | Used as the dot inside a tile-style `RadioCard` wrapper (see §8). The radio circle keeps Attica's selection style: 20 × 20, 6 px inset SA-navy ring when selected. |
| `Collapsible` | shadcn on `@base-ui/react` `Collapsible` | Trigger styled as tertiary button + rotating chevron. Used once on the eligible result page. |

If the shadcn CLI is incompatible with Next 16 / Tailwind v4 at the
time of build, fall back to manually copying the relevant component
files from the gov-themes repo (or the shadcn `@base-ui` registry) and
adjusting paths. This is a known-recoverable path because the gov-themes
button compiles fine in the v4 setup and lives in
`src/components/ui/button.tsx`.

## 7. State, data, and logic (unchanged from rev 1)

### 7.1 `src/lib/questions.ts`

Single source of truth for the six questions:

```ts
export type QuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6';

export type Question = {
  id: QuestionId;
  step: 1 | 2 | 3 | 4 | 5 | 6;
  legend: string;
  helperText?: string;
  options: Array<{
    value: string;
    label: string;
    callout?: string;     // Q4 'I'm not sure' inline callout
  }>;
};

export const questions: readonly Question[] = [ … ];   // 6 entries
```

Hardcoded copy per the brief (Q4 helper text = "under $2,536.20 per
fortnight (including family assistance)", etc.).

### 7.2 `src/lib/eligibility.ts` — pure function

```ts
type Answers = Partial<Record<QuestionId, string>>;
type Result =
  | { outcome: 'eligible' }
  | { outcome: 'ineligible'; reason: 'residency' | 'child-age' | 'income' };

export function evaluate(answers: Answers): Result | null;
```

- Returns `null` if any of Q1–Q4 is missing — the caller redirects.
- Q2 = `'no'` → `{ outcome: 'ineligible', reason: 'residency' }`.
- Q1 = `'single'` AND Q3 ∈ `{'8-13', '14+'}` → `child-age`.
- Q4 = `'no'` → `income`.
- All other paths reaching Q6 → `{ outcome: 'eligible' }`.

Pure, testable in isolation, no I/O. Hand-verified branch table to live
as a JSDoc table in the file header.

### 7.3 `src/lib/flow-context.tsx`

Client-side `useReducer<FlowState, FlowAction>` over `{ answers: Answers }`.
Actions: `SET_ANSWER`, `RESET`. `<FlowProvider>` mounted at
`src/app/check/layout.tsx`. No persistence — refresh resets state; result
pages redirect to `/check/q1` when `evaluate` returns `null`.

## 8. Custom components (`src/components/`)

ShadCN-generated primitives live in `src/components/ui/`. Custom prototype
components live in `src/components/` (subfolders by category). Following
gov-themes' folder convention.

| Component | Path | Notes |
| --- | --- | --- |
| `Button` | `src/components/ui/button.tsx` | shadcn-generated, SA-overridden via CVA |
| `RadioGroup` / `RadioGroupItem` | `src/components/ui/radio-group.tsx` | shadcn-on-base-ui |
| `Collapsible` | `src/components/ui/collapsible.tsx` | shadcn-on-base-ui |
| `RadioCard` | `src/components/ui/radio-card.tsx` | Tile-style wrapper around RadioGroupItem — 1 px border, 8 px radius, 12 × 16 padding, hover/selected → SA-navy border + 4 px left inset highlight, 48 px min touch target. |
| `SiteHeader` | `src/components/layout/site-header.tsx` | White, 4 px SA-navy bottom border. "Australian Government" eyebrow → "Services Australia" wordmark in Roboto Bold. Non-functional search input. Mobile collapses to non-functional hamburger icon. |
| `SiteFooter` | `src/components/layout/site-footer.tsx` | `--footer-bg` `#0D2D44`, three-column link grid, ABN, accessibility/privacy/disclaimer + "Design system" link to `/components`. |
| `SkipLink` | inline in `layout.tsx` | First focusable element on every page. |
| `Breadcrumb` | `src/components/nav/breadcrumb.tsx` | `items: { href?: string; label: string }[]`. Last is `aria-current="page"`. Action-blue links, mid-grey `›` separator. |
| `ProgressIndicator` | `src/components/flow/progress-indicator.tsx` | `<nav aria-label="Progress">` → `<ol>` of six pills. Filled SA navy for completed, navy outline + label for current, light grey for upcoming. `aria-current="step"` on current. Mobile (≤ 768 px) collapses to text-only "Step X of 6". |
| `StatusBanner` | `src/components/feedback/status-banner.tsx` | `variant: 'eligible' \| 'ineligible' \| 'info' \| 'warning'`. 4 px left border + tinted background. `role="status"` for eligible/info, `role="alert"` for ineligible/warning. |
| `FactBox` | `src/components/content/fact-box.tsx` | Light SA-blue background `--info-bg`, 4 px left border SA navy. Used on overview key facts + eligible result payment-range. |
| `RelatedPaymentCard` | `src/components/content/related-payment-card.tsx` | White card, 1 px border `--border`, 8 px radius, shadow-sm, hover border lifts to SA navy. Title + 1-line description + "Find out more" link. |
| `InfoCallout` | `src/components/feedback/info-callout.tsx` | Inline tinted box used for Q4 "I'm not sure" message. |
| `InlineError` | `src/components/feedback/inline-error.tsx` | `role="alert"`, icon + error-coloured text, addressable by `id` for `aria-describedby`. |
| `AnswerSummary` | `src/components/flow/answer-summary.tsx` | `<Collapsible>` containing `<dl>` of Q&A pairs. |
| `NextStepsList` | `src/components/flow/next-steps-list.tsx` | Numbered list for the eligible-result myGov steps. |

`cn()` helper in `src/lib/utils.ts`, copied verbatim from gov-themes.

## 9. Route map and per-screen content

```
/                              → Overview                  (server)
/check/layout.tsx              → mounts <FlowProvider>     (server + client wrapper)
/check/q1 … /check/q6          → QuestionPage step={N}     (client)
/check/result/eligible         → EligibleResult            (client, redirects if state incomplete)
/check/result/ineligible       → IneligibleResult          (client, redirects if state incomplete)
/components                    → Component library         (server, static)
```

Per-screen breakdown as in rev 1 — unchanged. Summary:

- **`/`** — breadcrumb, two-column layout (sidebar collapses on mobile),
  H1 "Parenting Payment", plain-language intro, FactBox of key facts,
  primary CTA "Check if you're eligible" → `/check/q1`. Body sections
  for "Who can get it", "How much you'll get", "How to claim", "Manage
  your payment" with anchor IDs.
- **`/check/q[1-6]`** — shared `QuestionPage` component, six one-line
  page files. Breadcrumb, H1 "Check if you're eligible" (stable across
  all six), ProgressIndicator, `<form>` → `<fieldset>` → `<legend>`
  (question text) → helper text → RadioGroup of RadioCards → InlineError
  region → Continue (primary) + Back (tertiary). On submit, write to
  context, call `evaluate(answers)`, route accordingly. On mount, focus
  the H1.
- **`/check/result/eligible`** — guard redirect; StatusBanner (eligible),
  FactBox with payment range, three-step NextStepsList, AnswerSummary
  collapsible, "Apply through myGov" (primary, `href="#"`) + "Start
  again" (secondary, dispatches RESET and routes to `/check/q1`).
- **`/check/result/ineligible`** — guard redirect; StatusBanner
  (ineligible) with reason-driven copy, three RelatedPaymentCards
  (JobSeeker, FTB A, FTB B), "Check another payment" + "Start again".
- **`/components`** — static reference grid of every component in every
  state. Discoverable via the footer "Design system" link only.

## 10. Accessibility checklist (WCAG 2.2 AA) — unchanged

Treated as acceptance criteria per screen, verified manually in the QA
pass:

- [ ] Skip link is the first focusable element on every page; lands on `#main`.
- [ ] Tab order matches visual order at desktop and 390 px.
- [ ] Every radio group inside `<fieldset>` with `<legend>` = question text.
- [ ] Progress is `<nav aria-label="Progress">` → `<ol>`, current step `aria-current="step"`, root `aria-label="Step X of 6"`.
- [ ] H1 receives focus on every step advance (`tabIndex={-1}` + `.focus()` in `useEffect`).
- [ ] StatusBanner: eligible/info `role="status"`, ineligible/warning `role="alert"`.
- [ ] InlineError: `role="alert"`, `aria-invalid="true"` on fieldset, `aria-describedby` on radio group.
- [ ] Text contrast ≥ 4.5:1, UI contrast ≥ 3:1. SA navy on white = 7.5:1 ✓. Banner text colours verified per banner during build.
- [ ] All touch targets ≥ 48 × 48 px (RadioCard rows, buttons, hamburger).
- [ ] Visible focus ring on every interactive element, SA-blue `#005EA2`, 2 px outline + 2 px offset.
- [ ] All buttons are real `<button>`; all links real `<a>`.
- [ ] `<html lang="en-AU">`.
- [ ] Per-page `<title>` is descriptive (e.g., "Question 3 of 6 — Check if you're eligible — Parenting Payment").
- [ ] Mobile sticky header does not cover the skip-link landing target.

## 11. Build order

I will track these as TaskCreate items once you approve. Each ends with
a named, runnable verification.

1. **Repo hygiene** — delete out-of-scope paths, prune deps, regenerate lockfile.
   *Verify:* `npm install` clean, `npm run dev` boots a blank page, `tsc --noEmit` passes.
2. **Foundation CSS + fonts** — copy Attica .ttf files into `src/app/fonts/`,
   rewrite `globals.css` with the three-layer token strategy, rewrite
   `layout.tsx` to load Roboto + Open Sans and apply `data-theme="sa"`.
   *Verify:* a test paragraph in `page.tsx` renders Open Sans, with a
   Roboto H1, dev-tools shows `--primary: #1B4F72` resolved.
3. **Layout shell** — `SiteHeader`, `SiteFooter`, `SkipLink`. Tailwind
   utility-only at this point, no shadcn deps yet.
   *Verify:* shell looks right at 1280 px and 390 px; skip-link appears
   on first Tab.
4. **shadcn install + primitives** — `shadcn init` + add Button, RadioGroup,
   Collapsible. Apply SA + Attica CVA overrides to Button. Add `cn()` helper.
   *Verify:* a `<Button>Continue</Button>` in `page.tsx` renders as SA-navy
   pill with white text, focus ring is SA-blue.
5. **Custom primitives** — Breadcrumb, ProgressIndicator, StatusBanner,
   FactBox, RelatedPaymentCard, InfoCallout, InlineError, RadioCard,
   AnswerSummary, NextStepsList.
   *Verify:* `/components` route (built in step 11) will catch any issues;
   no separate test here.
6. **Questions config + eligibility logic** — `src/lib/questions.ts`,
   `src/lib/eligibility.ts`. Add a smoke-test file (NOT a Jest run — a
   tiny hand-runnable script under `bin/test-eligibility.ts` that logs
   the branch table) since the project has no test framework.
   *Verify:* `npx tsx bin/test-eligibility.ts` prints expected outcomes
   for the four spec branches.
7. **Flow context** — `src/lib/flow-context.tsx` + `src/app/check/layout.tsx`.
   *Verify:* dev-tools React tree shows FlowProvider wrapping `/check/*` pages.
8. **Overview page** — `src/app/page.tsx`.
   *Verify:* desktop + mobile screenshots match the brief's layout intent.
9. **Question pages** — shared `QuestionPage` + six one-line page files.
   *Verify:* walk both journeys end-to-end (eligible, Q3-exit
   ineligible) with keyboard only.
10. **Result pages** — eligible and ineligible, with redirect guard.
    *Verify:* both journey screenshots; refreshing the eligible page
    redirects to `/check/q1`.
11. **Component library `/components`** — static reference route.
    *Verify:* every component renders with all stated states.
12. **A11y QA pass** — keyboard-only walk-through, focus-ring inspection
    at every stop, mobile viewport check at 390 × 844, contrast
    spot-checks on banners, headings tree validated via dev-tools
    accessibility panel.
13. **Polish pass** — typography rhythm, spacing consistency,
    anything obviously thin.
14. **Vercel deploy prep** — install `vercel` CLI, `vercel link`, run
    `vercel deploy` (preview first), verify the live preview, then
    `vercel deploy --prod`. Add the preview URL to the plan as the
    final artefact. (This step may move to a separate session.)

## 12. Out of scope (restating)

No auth, no DB, no Prisma, no Stripe, no myGov integration, no search,
no hamburger drawer, no real-time data, no animation beyond Attica's
120 ms transitions, no WCAG annotation overlay, no theme switcher UI,
no test framework (Jest/Vitest not installed — a single hand-runnable
smoke script for the eligibility branch table is the bar).

Mobile breakpoint: 390 px. Desktop: 1280 px container, bleed to 1440 px viewport.

## 13. What I need from you to start

- **Approve this revised plan** as the build contract, or tell me what
  to change.

Once you say go, I will start at section 11 step 1 (repo hygiene), and
work through the build order. I will keep you informed at the end of
each step rather than at the end of every file.
