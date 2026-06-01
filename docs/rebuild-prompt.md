# Rebuild: Citizens' Services prototype
# Original build: 2026-05 — Playbook v1.3.0
# Rebuilt: [leave blank — filled in when rebuild runs]

This is a rebuild session. Citizens' Services is a Services Australia–branded government payments portal demonstrating a branching Parenting Payment eligibility check and a Carer Payment prepare-to-claim checklist, intended for portfolio and interview audiences in a digital government or service design context. The original was built using Playbook v1.3.0. This is a fresh rebuild to take advantage of improvements in Claude's capability.

Do not reference the original codebase. Build from scratch using this document, the playbook's current templates, and the current reference files.

Use the playbook at `/Users/adamatteia/working/playbook` for reference files and defaults. Where this document is silent on a decision, use the playbook's current defaults.

---

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) | App Router only — no Pages Router. Use the current version from `reference/stack-defaults.md`. |
| Language | TypeScript strict | `"strict": true` in tsconfig. No `any`. |
| Styling | Tailwind CSS v4 | `@tailwindcss/postcss`. `@theme inline` bridge. Not v3 config file. |
| Components | Base UI React (`@base-ui/react`) | No ShadCN. No Radix UI directly. All interactive primitives (radio groups, disclosure, buttons) from Base UI. |
| State | React context + useReducer for flow; useState for checklist | `FlowProvider` (context + useReducer) scoped to the `/check` layout for cross-route answer persistence. Plain `useState` in the prepare page — no cross-route sharing needed. |
| Data | Static TypeScript constants | No database, no API routes, no server actions. All content is in `src/lib/`. |
| Deployment | Vercel | Git push to main → automatic production build. |

If a dependency listed here is no longer recommended by the playbook's current `reference/stack-defaults.md`, use the current recommended default and note the change.

---

## What this prototype demonstrates

Citizens' Services models the citizen-facing layer of a government payments portal — specifically the two points in the user journey where drop-off is highest: determining likely eligibility before starting a formal claim, and knowing what documents to gather before the claim begins. The prototype demonstrates branching multi-step form logic with typed eligibility rules, accessible government UX patterns (early exit, reason-specific outcomes, per-item contextual help), and a three-layer Attica/SA design system implementation. The intended audience is interviewers and portfolio reviewers in digital government, service design, and front-end engineering contexts.

---

## Scope: what is in scope

- **Parenting Payment scenario**
  - Overview page (`/`): key facts box (fortnightly rate, income test, child age limit), four content sections (Who can get it, How much, How to claim, Manage), on-this-page sidebar with section anchors, side-rail listing related family payments
  - Six-question eligibility check (`/check/q1`–`/check/q6`): segmented progress indicator with step labels, radio-card answer options, back-navigation, answer persistence across questions
  - Eligibility logic: pure TypeScript function `evaluate(answers)` returning `eligible`, `{ outcome: "ineligible", reason: "residency" | "child-age" | "income" }`, or `null` (incomplete); early exit on Q2 = No; income exit on Q4 = No; child-age exit when Q1 = single AND Q3 ≥ 8 years
  - Q4 "I'm not sure" inline callout directing to Payment and Service Finder
  - Eligible result page: green status banner, estimated payment range fact box, numbered next-steps list, answer summary of all six questions, "Start again" reset
  - Ineligible result page: reason-specific copy, three related-payment cards (JobSeeker, FTB Part A, FTB Part B), answer summary, "Start again" reset
  - Redirect guard on both result pages: incomplete or mismatched flow state redirects to Q1

- **Carer Payment scenario**
  - Overview page (`/carers`): key facts box (fortnightly rate, income free area, work limit), four content sections, on-this-page sidebar, carer side-rail
  - Prepare-to-claim checklist (`/carers/prepare`): four sections (Your identity, About the person you care for, Your income and assets, Your caring arrangement), twelve items total, per-item collapsible "Why do I need this?" helper, per-section `requiredCount` readiness model, sticky progress summary bar (tracks sections, not items), completion banner when all four sections ready
  - Print stylesheet: renders checklist only, helper text always expanded, checked items marked with ■ glyph, Georgia serif body, 20mm margins, `page-break-inside: avoid` on each section group

- **Shared site shell**
  - Responsive header: site wordmark, "Parenting Payment" and "Carer Payment" nav links, myGov dropdown (illustrative, no auth), dark mode toggle, mobile hamburger menu
  - Skip-to-content link as first focusable element on every page
  - Breadcrumb navigation on all pages
  - Page rating widget (thumbs up/down — no backend; interaction is visual only)
  - Page metadata footer (last updated date, QC reference number)

- **Design system reference** at `/components`: every component in every state with accessibility and design notes; not linked from the nav but reachable by direct URL

---

## Scope: what is not in scope

- Carer Payment eligibility check — the "Check if you're eligible" button on `/carers` should link to `#`, not to a real flow
- Real form submission — all "Apply through myGov" and claim buttons link to `#`
- Authentication — prototype is fully anonymous; myGov dropdown is illustrative only
- Document upload — excluded; would require a real backend
- Payment amount estimation — Payment and Service Finder is a text link to an external URL, not built in
- Persistence — flow answers clear on refresh (in-memory context only); checklist state clears on refresh (local component state only)
- Sibling payment pages — listed in side-rails with `href="#"` only

---

## Citizen flows (no roles — public prototype)

This prototype is citizen-facing and has no authentication or role switching. All flows are available to any visitor.

**Parenting Payment applicant** — the main carer of a young child who wants to check likely eligibility before committing to the full myGov claim process.

**Carer Payment applicant** — a person providing daily care for someone with a severe disability or medical condition, who wants to understand what documents to gather before starting a 30-minute claim.

No named personas are needed — the flows are not data-driven. The prototype uses realistic payment figures and government copy to establish credibility, not user-specific data.

---

## User journeys

### 1. Complete Parenting Payment eligibility check — eligible outcome

Start: `/` overview page.

1. User clicks **Check if you're eligible** (primary large button).
   → `/check/q1`
2. Q1: "Are you single or in a couple?" User selects either option. Clicks **Continue**.
   → `/check/q2`
3. Q2: "Are you an Australian resident?" User selects **Yes**. Clicks **Continue**.
   → `/check/q3`
4. Q3: "How old is your youngest child?" User selects **Under 8 years**. Clicks **Continue**.
   → `/check/q4`
5. Q4: "Is your income below the limit?" User selects **Yes, I think so**. Clicks **Continue**.
   → `/check/q5`
6. Q5: "Are you currently receiving a Services Australia payment?" User selects any option. Clicks **Continue**.
   → `/check/q6`
7. Q6: "Are you working or studying?" User selects any option. Clicks **Continue**.
   → `/check/result/eligible`
8. Eligible result page: focus moves to `<h1>`. Green status banner. Payment range fact box. "What to do next" list. Full six-question answer summary. **Start again** button resets to Q1.

End state: User sees their likely eligible outcome and the steps to claim.

---

### 2. Parenting Payment eligibility check — residency exit

Start: `/check/q1` (Q1 answered with any value).

1. Q2: User selects **No**. Clicks **Continue**.
   → `/check/result/ineligible` immediately. Q3–Q6 are skipped.
2. Ineligible page: residency-specific copy. Answer summary shows only Q1 and Q2. Three related-payment cards.

End state: User sees the specific residency reason and related alternatives.

---

### 3. Parenting Payment eligibility check — income exit

Start: Q1 = single or couple; Q2 = Yes; Q3 = any value that has not triggered child-age exit.

1. Q4: User selects **No**. Clicks **Continue**.
   → `/check/result/ineligible`.
2. Ineligible page: income-specific copy.

End state: User sees the income reason and related alternatives.

---

### 4. Carer Payment prepare-to-claim checklist — full completion

Start: `/carers` overview page.

1. User clicks **Prepare to claim** (primary large button).
   → `/carers/prepare`
2. Page loads. Progress bar: "0 of 4 sections ready". Four section cards visible.
3. User ticks items. For each section, the progress bar updates when `requiredCount` is reached:
   - Your identity: any 3 of 4 items → section ready
   - About the person you care for: both items → section ready
   - Your income and assets: both items → section ready
   - Your caring arrangement: both items → section ready
4. User expands "Why do I need this?" on any item → helper text appears inline.
5. All four sections ready → progress bar reads "4 of 4 sections ready" → completion banner appears.

End state: All sections ready. User knows what to gather before lodging a claim.

---

### 5. Print the checklist

Start: `/carers/prepare`, any state.

1. User triggers the browser print dialog (Cmd+P / Ctrl+P).
   → Print stylesheet renders checklist content only: title, four section groups, all helper text expanded, checked items marked ■, no header/nav/footer/progress bar.

End state: User has a printable or PDF checklist for offline use.

---

## Navigation structure

Layout: fixed top header, full-width. Three-column page grid (side-rail / main / on-this-page sidebar) for overview pages. Single-column for flow and checklist pages.

| Item | Route | Visible |
|---|---|---|
| Parenting Payment | `/` | Top nav, always |
| Carer Payment | `/carers` | Top nav, always |
| Eligibility check | `/check/q1`–`/check/q6` | Entered from `/` CTA only |
| Check result | `/check/result/eligible` or `/check/result/ineligible` | Reached by completing flow |
| Prepare to claim | `/carers/prepare` | Entered from `/carers` CTA only |
| Design system reference | `/components` | Direct URL only — not in nav |

---

## Screens in scope

**`/` — Parenting Payment overview**
Shows: page eyebrow "For families", `<h1>` "Parenting Payment", intro paragraph, primary CTA ("Check if you're eligible") with helper text "Anonymous · No sign-in required", key facts box (rate, income test, child age limit), four content sections, on-this-page sidebar (four anchor links), side-rail with related family payments (Parenting Payment active; six siblings as `href="#"`).
Actions: navigate to eligibility check.

**`/check/q1` – `/check/q6` — Question pages**
Shows: breadcrumb, segmented progress indicator (Step N of 6, current segment navy, upcoming grey, step label visible on desktop), `<fieldset>` with `<legend>` as the question, radio-card options, optional helper text under the legend, optional inline callout under radio group (Q4 only, on "I'm not sure" selection), Continue and Back buttons, inline error if Continue is clicked with no selection.
Actions: select answer, continue, go back.

**`/check/result/eligible` — Eligible result**
Shows: status banner (green, `role="status"`), payment range fact box, "What to do next" numbered list, answer summary (all six questions, labelled by `shortLabel`, showing selected option label), "Start again" button.
Actions: click "Apply through myGov" (stub link), click "Start again" (resets flow to Q1).
Redirect guard: if answers don't evaluate to eligible, replaces to `/check/q1`.

**`/check/result/ineligible` — Ineligible result**
Shows: status banner (red, `role="alert"`), reason-specific paragraph, three related-payment cards, answer summary (all answered questions), "Start again" button.
Actions: click a related payment card (stub links), click "Start again".
Redirect guard: same pattern as eligible result.

**`/carers` — Carer Payment overview**
Shows: page eyebrow "For carers", `<h1>` "Carer Payment", intro, two CTAs (Prepare to claim — primary; Check if you're eligible — secondary, stub), key facts box (rate, income free area, work limit), four content sections, on-this-page sidebar, carer side-rail (Carer Payment active; Carer Allowance and Carer Gateway as `href="#"`).
Actions: navigate to prepare-to-claim.

**`/carers/prepare` — Prepare-to-claim checklist**
Shows: breadcrumb, `<h1>`, sticky progress summary bar (N of 4 sections, navy fill, aria-live polite), intro paragraph, four section cards (each with icon, title, description, items), completion banner (when all ready).
Each item: checkbox, label, "Why do I need this?" collapsible toggle with helper text.
Actions: tick/untick items, expand/collapse helpers.

**`/components` — Design system reference**
Shows: every component in every state, grouped by category (inputs, progress, feedback, content, navigation, patterns), with captions explaining accessibility and design decisions.
Actions: none — static reference page.

---

## Visual direction

Services Australia government aesthetic. Professional and accessible. Not corporate SaaS.

**Layout:** Full-width fixed header. Three-column content grid for overview pages (240px side-rail / flexible main / 200px on-this-page sidebar). Side-rail collapses on mobile. Single-column for flow and checklist pages. Generous vertical spacing between sections.

**Colour:** SA navy `#1B4F72` as `--primary`. White background. Light grey (`--muted`) for secondary surfaces. 4px left navy border as the accent pattern for fact boxes and status banners. Status colours: green for eligible/success, red for ineligible/alert, blue-grey for info, amber for warning.

**Typography:** Apply Attica structural tokens. Use Roboto (headings), Open Sans (body), and Inter (UI/labels) via `next/font/google` as in the Attica reference. All government copy in sentence case.

**Components:** Pill-radius buttons (Attica pill style). Radio cards: full-width tile with a 48px minimum touch target, hover state (navy border tint), selected state (navy border + navy left bar), error state (red border). Fact box: light blue tint background, 4px left navy border, label/value/caption rows. Status banner: 4px left border in status colour, `role="alert"` (negative) or `role="status"` (positive). Checklist item: checkbox + label + collapsible helper, no strikethrough on checked.

**Dark mode:** Full dark mode via CSS token overrides on `html.dark`. Toggle visible in the header.

**Theme:** Apply the SA theme block as Layer 2 in `globals.css` using `html[data-theme="sa"]`. See `playbook/reference/attica.md` for the three-layer model and the SA theme token mapping.

---

## Content (static data)

This prototype has no mock data file — content is static TypeScript.

**`src/lib/questions.ts`** — the six Parenting Payment eligibility questions. Each question has: `id` (q1–q6), `step` (1–6), `shortLabel` (shown in progress indicator and answer summary), `legend` (the question text, used as `<legend>`), optional `helperText`, and `options` array (each with `value`, `label`, optional `callout`).

Key question content:
- Q1: "Are you single or in a couple?" Options: Single, In a couple.
- Q2: "Are you an Australian resident?" Helper: residency rule explanation. Options: Yes, No.
- Q3: "How old is your youngest child?" Options: Under 8 years, 8 to 13 years, 14 years or older.
- Q4: "Is your income below the limit?" Helper: "$2,536.20 per fortnight" threshold for singles. Options: Yes I think so, No, I'm not sure (with callout directing to Payment and Service Finder).
- Q5: "Are you currently receiving a Services Australia payment?" Helper: lists example payments. Options: Yes, No, Not sure.
- Q6: "Are you working or studying?" Helper: affects amount not eligibility. Options: Yes, No, Both.

**`src/lib/eligibility.ts`** — pure function `evaluate(answers: Answers): EligibilityResult | null`. Branch table:
- Q2 = "no" → ineligible, reason: "residency" (can fire before Q3–Q6 are answered)
- Q1 = "single" AND Q3 ∈ {"8-13", "14-plus"} → ineligible, reason: "child-age"
- Q4 = "no" → ineligible, reason: "income"
- All of Q1–Q4 answered with any other combination → eligible
- Q1–Q4 not all answered → null

Q5 and Q6 never change the outcome.

**`src/lib/carer-checklist.ts`** — four `ChecklistGroupConfig` objects. Each has: `id`, `title`, `description`, a Lucide icon, `requiredCount`, and `items` (each with `id` as a stable integer 1–12, `label`, `helper`).

Sections and requiredCounts:
- Your identity (`requiredCount: 3`, 4 items): passport/birth certificate; Medicare card; tax file number; bank account details (BSB and account number)
- About the person you care for (`requiredCount: 2`, 3 items): full name and date of birth; Medicare/DVA card number; medical evidence (THP form)
- Your income and assets (`requiredCount: 2`, 3 items): payslips or income statement (last 8 weeks); other income details; asset information (savings, property, vehicles)
- Your caring arrangement (`requiredCount: 2`, 2 items): daily care routine (prepared description); contact details of treating doctor

Payment rates (accurate as of May 2026): Parenting Payment up to $1,096.10 / fortnight for a single principal carer; income test threshold $2,536.20 / fortnight. Carer Payment up to $1,200.90 / fortnight for a single carer; income free area $218.00 / fortnight; work limit 25 hours per week.

---

## Constraints

- **Accessibility:** WCAG 2.1 AA minimum. `<fieldset>` + `<legend>` for all radio groups. `aria-describedby` linking inline error messages to their inputs. `aria-current="page"` on the active breadcrumb item. `role="alert"` on negative status banners and inline errors. `role="status"` on positive banners and progress indicators. Focus moved to `<h1>` on result page mount via `useRef` + `useEffect`.
- **Component library:** Base UI React only. Do not use ShadCN or Radix UI directly. Style all components through CSS classes, not component-level props from a design system package.
- **CSS architecture:** Maintain the three-layer structure in `globals.css`. Layer 1 = Attica raw tokens in `:root`. Layer 2 = `html[data-theme="sa"]` mapping raws to ShadCN semantic names. Layer 3 = `@theme inline` Tailwind bridge. Do not collapse layers.
- **No strikethrough on checked items:** Colour shift only (label goes to `--muted`). Strikethrough reduces readability for low-vision users.
- **No database, no API routes, no environment variables** beyond Next.js defaults.
- **Tailwind v4 API:** Uses `@tailwindcss/postcss` not the v3 config file. Consult current Node modules for any API that may have changed.

---

## Build order

1. **CSS setup** — `globals.css` with all three layers: Attica raw tokens, SA theme Layer 2 block, `@theme inline` bridge. Confirm Tailwind utilities resolve before building any components.
2. **Core data files** — `src/lib/questions.ts`, `src/lib/eligibility.ts`, `src/lib/carer-checklist.ts`, `src/lib/brand.ts` (BRAND_NAME constant), `src/lib/nav-data.ts` (side-rail arrays). Write `bin/test-eligibility.ts` smoke test and run it before touching any UI.
3. **Shared primitives** — `src/components/ui/button.tsx` (pill style, three variants, three sizes), `src/components/ui/radio-card.tsx` (tile radio option with states).
4. **Site shell** — `src/app/layout.tsx`, site header with nav links, myGov dropdown, dark mode toggle, mobile menu. Skip-to-content link. Confirm the shell renders before building any pages.
5. **Shared page components** — `Breadcrumb`, `SideRail`, `PageRating`, `PageMeta`, `FactBox` / `FactBoxItem` / `FactBoxList`, `StatusBanner`, `InfoCallout`, `InlineError`.
6. **Parenting Payment overview page** (`/`) — uses all shared components. Confirm it renders completely before starting the flow.
7. **Eligibility flow** — `FlowProvider` context, `QuestionPage` component, `ProgressIndicator`, question route pages (q1–q6), `AnswerSummary`.
8. **Result pages** — eligible and ineligible, including redirect guards and `NextStepsList`.
9. **Carer Payment overview page** (`/carers`).
10. **Checklist components** — `ChecklistItem`, `ChecklistGroup`, `ProgressSummaryBar`, `CompletionBanner`. Then the prepare page (`/carers/prepare`) and its print stylesheet.
11. **`/components` design system reference page** — build last, after all components are stable.

Build the data layer and eligibility logic before any UI, because the question flow and result pages depend on it. Build overview pages before flows, because they establish the visual language. Build the checklist last because it is the most self-contained scenario.
