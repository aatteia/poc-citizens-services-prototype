# Design decisions

## Data layer — no database, no API routes

**Decision:** All content is static TypeScript. Eligibility logic lives in `src/lib/eligibility.ts` as a pure function over an in-memory answers object. Checklist content lives in `src/lib/carer-checklist.ts` as a typed constant array. No API routes, no server actions, no database.

**Reason:** This is a prototype demonstrating UX patterns and government design compliance, not a data architecture. A database would add deployment complexity, cost, and failure modes with zero benefit. Static data is also fully reproducible — no seed scripts, no migrations, no environment setup for reviewers.

**Production implication:** A real system would replace `eligibility.ts` with a rules engine backed by a database of payment parameters (rates, thresholds, date ranges) that can be updated without a deployment. The question flow would likely become server-rendered with session state.

---

## State management — React context for flow, local state for checklist

**Decision:** The eligibility flow uses a `FlowProvider` (React context + `useReducer`) scoped to the `/check` layout. The checklist uses plain `useState` in the prepare page. No Zustand, no Jotai, no global store.

**Reason:** The flow context needs to survive navigation between question pages. The checklist is self-contained and never shared. Using the minimum mechanism for each — context where cross-route sharing is genuinely needed, local state where it is not — keeps the code readable and avoids prematurely centralising state that doesn't need to be.

**Production implication:** A real system would need session persistence (the user closes the tab and returns later, the answers are still there). That would likely be `localStorage` hydrated into context on mount, or a server-side session stored against an authenticated user ID.

---

## Component library — Base UI React, no ShadCN

**Decision:** All interactive components (radio cards, buttons, disclosure panels) use `@base-ui/react` primitives. No ShadCN, no Radix UI directly. Design tokens are applied through the Attica/SA CSS layer, not through component-level class variants from a design system package.

**Reason:** Base UI provides unstyled, accessible primitives with a stable API that doesn't fight the design system's CSS. ShadCN assumes its own token vocabulary (which is similar to what we use, but not identical). Building directly on Base UI primitives gives full control over the rendered markup and removes the friction of overriding a third-party component's defaults.

**Production implication:** In a real AGDS-compliant system you would likely use the [GOLD Design System](https://gold.designsystemau.org/) React component library, which is purpose-built for Australian government digital services. The patterns built here (radio cards, eligibility flows, checklist groups) would be replaced by GOLD equivalents.

---

## CSS architecture — three-layer Attica system

**Decision:** `globals.css` has three distinct layers: (1) Attica raw token declarations, (2) a `html[data-theme="sa"]` selector block that maps those raws to ShadCN semantic names using SA navy as primary, (3) a `@theme inline` bridge that exposes the semantic tokens as Tailwind utilities.

**Reason:** This architecture separates concerns cleanly. Layer 1 is shared across every portfolio prototype. Layer 2 is swappable — changing to a different government theme means only rewriting Layer 2. Layer 3 is a Tailwind compatibility shim that costs nothing and unlocks utility classes on any semantic token. The SA theme block was designed to be compatible with the `shadcn-gov-themes` registry for future contribution.

**Production implication:** A production AGDS implementation would use AGDS design tokens directly rather than Attica. The three-layer approach would still be valid — Layer 1 would hold AGDS raws, Layer 2 would map them to component-level semantics.

---

## Eligibility logic — pure function, deterministic branch table

**Decision:** `eligibility.ts` exports a single `evaluate(answers)` function. It returns `eligible`, `ineligible` (with a typed reason), or `null` (incomplete). The branch table is documented in the file header. A smoke test in `bin/test-eligibility.ts` exercises all branches.

**Reason:** A pure function is the safest way to implement rules that need to be exactly right. It can be unit-tested in isolation, it has no side effects, and the branch logic is visible in one place. The smoke test provides a sanity check without a test framework dependency.

**Production implication:** Real eligibility rules are far more complex — they depend on income assessment dates, assets exemptions, partner income, residency history, and legislative amendments. They would live in a rules engine (likely a database-backed decision tree) with a full test suite and an audit log of which rule version produced each outcome.

---

## Checklist readiness — section-level, configurable `requiredCount`

**Decision:** The checklist tracks readiness per section, not per item. Each section has a `requiredCount` — the minimum number of ticked items for that section to count as ready. Identity needs any 3 of 4 items; Caring arrangement needs both items. The progress bar counts sections ready, not items ticked.

**Reason:** Not every item in every section is strictly mandatory. The Identity section gives the user options (passport OR birth certificate). A raw item count would punish users who legitimately tick fewer items and would misrepresent their readiness. The per-section model matches how Centrelink actually assesses applications — they need enough identity evidence, not a specific set.

**Production implication:** In a real claim system, item-level validation would be server-enforced against the specific policy rules for each claim type and date of effect.

---

## No-strikethrough checked state

**Decision:** Checked checklist items shift their label colour to muted but do not apply a strikethrough. A small navy checkbox fill provides the checked signal.

**Reason:** Strikethrough on completed items is a common pattern but fails WCAG for low-vision users — the text becomes harder to read at the moment you might want to re-read what you've gathered. The colour shift + checkbox provides sufficient distinction without degrading readability.

**Production implication:** No change needed. This is the correct pattern for accessibility-sensitive content.
