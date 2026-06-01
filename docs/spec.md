# Specification: Citizens' Services prototype

## What this is

Citizens' Services is a prototype of a Services Australia–branded government payments portal demonstrating two citizen-facing flows: a branching eligibility checker for Parenting Payment and a prepare-to-claim checklist for Carer Payment. The real-world problem it addresses is the difficulty people face determining whether they are likely eligible for a government payment before committing to a 20–30 minute online claim — and the consequent drop-off when claimants reach the myGov claim form unprepared. The prototype is intended to demonstrate AGDS-adjacent UX patterns, accessible multi-step form design, and a clean government design system implementation to interviewers and portfolio reviewers in a digital government or service design context.

---

## Scope: what is implemented

- **Parenting Payment scenario** — overview page with key facts, four content sections, and a side-rail of related family payments; six-question eligibility check with a segmented progress indicator and back-navigation; two result pages (eligible and ineligible) with answer summaries, tailored next steps, and a reset action; early-exit branching on Q2 (residency = No); Q4 "I'm not sure" inline callout
- **Carer Payment scenario** — overview page with key facts, four content sections, and a carer side-rail; prepare-to-claim checklist with four sections, twelve items, per-item collapsible helper text, per-section `requiredCount` readiness model, sticky progress summary bar, and a completion banner
- **Print stylesheet** on the prepare-to-claim page — renders checklist only, helpers always expanded, checked state via ■ glyph, Georgia serif, 20mm margins
- **Shared site shell** — responsive header with myGov dropdown, dark mode toggle, mobile hamburger menu; skip-to-content link; breadcrumb navigation; page rating widget; page metadata footer
- **Design system reference** at `/components` — every component in every state, with accessibility and design notes

---

## Scope: what is not implemented

- Carer Payment eligibility check — the button exists on the Carer Payment overview but links to `#`
- Real form submission — all claim and apply buttons are stubs
- Authentication — the prototype is fully anonymous; the myGov header element is illustrative
- Document upload — referenced in the original scope but excluded; requires a real backend
- Payment amount estimation — the Payment and Service Finder is linked out to the live Services Australia tool, not built in
- Persistence — flow answers are in-memory React context; checklist state is local component state; both reset on refresh, intentionally
- Sibling payment pages — Family Tax Benefit, Child Care Subsidy, Carer Allowance, Carer Gateway are listed in the side-rail with `href="#"`

---

## Key design principles

**Early exit on disqualifying answers.** The eligibility flow exits immediately when Q2 (residency) is answered No, rather than asking all six questions. Each ineligible result page shows a reason-specific explanation — residency, child age, or income — not a generic rejection. This models real service design: collect only what you need, and when the answer is definitive, stop.

**Section-level readiness, not item-level counting.** The checklist tracks whether each section has met its `requiredCount` — the minimum number of ticked items needed for that section to be considered ready. The Identity section accepts any 3 of 4 documents because Centrelink accepts multiple valid combinations. Raw item counting would misrepresent the user's actual readiness.

**Accessibility as a design constraint, not a compliance pass.** Status banners use `role="alert"` for negative outcomes and `role="status"` for positive ones. The skip-to-content link is the first focusable element on every page. Checked checklist items shift label colour rather than applying strikethrough, which degrades readability for low-vision users. Focus is moved to the result heading on page load.

**No data, no risk, stated plainly.** The prototype banner in the header states explicitly that nothing is saved and no claim is lodged. Answer state is cleared on tab close. This is not just a technical constraint — it is a deliberate trust signal for users who might otherwise hesitate to answer sensitive income or family situation questions.

**Government content rules throughout.** All copy uses sentence case, avoids jargon, and follows Services Australia plain-English conventions. Payment rates and thresholds are real figures accurate as of May 2026. Content is structured around what the user needs to know to act, not what is convenient to explain.

---

## Constraints

- **Accessibility:** WCAG 2.1 AA minimum. Correct semantic HTML throughout. `<fieldset>` + `<legend>` for all radio groups. `aria-describedby` linking error messages to their inputs. `aria-current="page"` on active breadcrumb items. Focus management: result pages move focus to the `<h1>` on mount.
- **Component library:** Base UI React (`@base-ui/react`). No ShadCN, no Radix UI directly. All interactive components (radio groups, disclosure/collapse, buttons) use Base UI primitives. Style is applied through the Attica/SA CSS layer, not through component-level class variants from a design system package.
- **CSS architecture:** Three layers in `src/app/globals.css` — Layer 1: Attica raw token declarations in `:root`; Layer 2: `html[data-theme="sa"]` block mapping raws to ShadCN semantic names (`--primary`, `--background`, `--foreground`, `--muted`, `--border`, `--ring`); Layer 3: `@theme inline` Tailwind bridge. Do not collapse these layers.
- **No real backend:** No database, no API routes, no server actions, no environment variables beyond Next.js defaults. Static prototype only.
- **Government copy rules:** Sentence case. Plain English. No jargon. No passive voice where active is available.
- **Tailwind v4:** Uses `@tailwindcss/postcss` not the v3 config file. `@theme inline` not `@layer theme`. Consult `node_modules/next/dist/docs/` for any Next.js API that may have changed since training data.

---

## Success criteria

A working rebuild must demonstrate:

1. A user who answers Q2 (residency) "No" is shown an ineligible result page with a residency-specific explanation, without being asked the remaining four questions.
2. A user who answers all six questions with qualifying answers is shown the eligible result page with a correct answer summary and a "What to do next" list; clicking "Start again" resets the flow to Q1 with all answers cleared.
3. The Carer Payment checklist progress bar updates when items are ticked, reaches 100% only when all four sections have met their `requiredCount`, and the completion banner appears at that moment.
4. The print stylesheet for the prepare-to-claim page renders a clean document with helper text always expanded, checked items marked with ■, and no header, nav, or footer.
5. The `/components` page renders every component variant and state without error, and is reachable by direct URL without authentication.
