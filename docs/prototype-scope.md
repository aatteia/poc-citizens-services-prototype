# Prototype scope

## What is implemented

### Parenting Payment scenario

- Overview page (`/`) with key facts, four content sections (who can get it, how much, how to claim, manage), and a side-rail sibling-payment list
- Six-question eligibility check (`/check/q1` through `/check/q6`) with a segmented progress indicator and back-navigation
- Eligibility logic engine (`src/lib/eligibility.ts`) — pure function, no I/O, covers all documented branch conditions
- Two result pages: eligible (`/check/result/eligible`) and ineligible (`/check/result/ineligible`)
  - Eligible: payment rate fact box, next steps, full answer summary, reset flow
  - Ineligible: reason-specific copy, three related-payment cards, answer summary, reset flow
- Q4 "I'm not sure" inline callout directing users to the Payment and Service Finder
- Redirect guard on both result pages — deep-links and refreshes bounce back to Q1

### Carer Payment scenario

- Overview page (`/carers`) with key facts, four content sections, and a side-rail sibling list
- Prepare-to-claim checklist (`/carers/prepare`) with four sections, twelve items total
  - Section readiness: each section has a configurable `requiredCount` (Identity needs any 3 of 4, others need all)
  - Per-item collapsible "Why do I need this?" helper
  - Sticky progress summary bar tracking sections complete (not raw items)
  - Completion banner appears when all four sections are ready
  - Print stylesheet: renders checklist only, helpers always expanded, checked state via ■ glyph, Georgia serif, 20mm margins

### Shared infrastructure

- SA government theme: Attica structural tokens as Layer 1, `html[data-theme="sa"]` SA navy override as Layer 2, Tailwind bridge as Layer 3
- Responsive site header with myGov dropdown, dark mode toggle, mobile hamburger menu
- Skip-to-content link (first focusable element on every page)
- Breadcrumb navigation on all pages
- Page rating widget (thumbs up/down, no backend)
- Page metadata footer (last updated date, QC reference number)
- Design system reference page at `/components`

---

## What is not implemented

| Feature | Notes |
|---|---|
| Carer Payment eligibility check | The button exists on `/carers` ("Check if you're eligible") but links to `#`. A parallel Q-flow was out of scope for this build. |
| Real form submission | All "Apply through myGov" and claim buttons link to `#`. No claim data is sent anywhere. |
| Authentication / myGov sign-in | Prototype is fully anonymous. The myGov dropdown in the header is illustrative only. |
| Payment amount estimation | The Payment and Service Finder link (referenced in Q4 callout and Carer overview) is a real link to the live Services Australia tool, but no estimator is built in-prototype. |
| Document upload | Referenced in the original scope note but not built. Would require a real backend. |
| Persistence | Eligibility flow answers are in-memory React context — cleared on refresh or tab close. Checklist state is local component state — same behaviour. Intentional. |
| Family Tax Benefit, Child Care Subsidy, and other sibling payments | Listed in the side-rail with `href="#"`. Not in scope. |
| Carer Allowance, Carer Gateway | Listed in the Carer side-rail with `href="#"`. Not in scope. |
| Backend / database | No server-side state, no API routes, no database. All data is static or in-memory. |

---

## Known prototype limitations

- The eligibility logic covers Parenting Payment only. Carer Payment eligibility rules are not modelled.
- Dollar figures (payment rates, income test thresholds) are accurate as of May 2026 but will drift without maintenance.
- The "Check if you're eligible" button on the Carer Payment page is a dead link. A reviewer exploring the Carer scenario will find this.
- Side-rail sibling payments are all stub links. A reviewer clicking them will go nowhere.
