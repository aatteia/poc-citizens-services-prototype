# Interview guide

## What this is

Citizens' Services is a prototype of a government payments portal, modelled on Services Australia. It demonstrates two things that are genuinely hard to get right in government digital services: a multi-step eligibility check that branches based on the user's situation, and a pre-claim checklist that helps people gather the right documents before they start a formal claim process.

The prototype is not connected to any real system. No data is saved, no claims are lodged, and no real myGov login is required. It is a demonstration of UX patterns, accessibility decisions, and design system implementation.

---

## Who uses it

There are no login roles or personas in this prototype — it is citizen-facing, and anyone who arrives at the site can use both flows.

**Parenting Payment applicant** — a parent (single or partnered) who is the main carer for a young child and wants to know quickly whether they are likely eligible for income support before going through the full myGov claim process. They need a clear, low-friction answer, not a long form.

**Carer Payment applicant** — a person providing daily care for someone with a severe disability or medical condition. They may be new to the welfare system and unsure what they need. They want to feel prepared before they start a 30-minute online claim, especially knowing that the medical evidence step can take weeks to arrange.

---

## How to navigate the prototype

The site has two main sections, accessible from the top navigation:

- **Parenting Payment** — the homepage (`/`). Click **Check if you're eligible** to start the flow.
- **Carer Payment** — navigate via the top nav. Click **Prepare to claim** to start the checklist.

The dark mode toggle (top right) switches between light and dark themes. The myGov dropdown (top right) is illustrative — it does not log in or out.

On mobile, the navigation collapses into a hamburger menu (top right).

---

## Walkthrough: Parenting Payment eligibility check

**Start at:** the homepage `/`

**Step-by-step:**

1. Read the overview page — note the key facts box (fortnightly rate, income test, child age limit), the four content sections (Who can get it, How much, How to claim, Manage), and the side-rail listing related family payments.
2. Click **Check if you're eligible**.
3. Answer each of the six questions. You can go back at any step using the Back button.
4. On Question 4 (income), select **I'm not sure** — an inline callout appears directing you to the Payment and Service Finder. This is an example of contextual help that appears only when needed.
5. Complete all six questions to reach a result.

**What to highlight:**
- The segmented progress indicator at the top of each question page — labels collapse to "Step X of 6" on mobile.
- The result page shows a summary of every answer you gave, labelled by question. This is the answer summary component.
- The eligible result page shows an estimated payment range and a numbered next-steps list. The ineligible result page shows a reason-specific explanation and three related payments the user might qualify for instead.
- Click **Start again** on either result page to reset the flow completely.

**Demonstrating ineligibility:** On Question 2 (residency), answer **No** — you will be taken immediately to the ineligible result page with a residency-specific explanation, skipping the remaining questions. This demonstrates early exit branching.

---

## Walkthrough: Carer Payment prepare-to-claim checklist

**Start at:** Carer Payment overview (`/carers`)

**Step-by-step:**

1. Read the overview page — same layout as the Parenting Payment page: key facts, four content sections, side-rail.
2. Click **Prepare to claim**.
3. Work through the four sections: Your identity, About the person you care for, Your income and assets, Your caring arrangement.
4. For each item, click the **Why do I need this?** toggle to expand the helper text explaining what Centrelink needs and why.
5. Tick items as you review them. Watch the progress bar at the top update as sections become ready.

**What to highlight:**
- The progress bar tracks *sections* complete, not individual items. The Identity section is ready once any 3 of 4 items are ticked (because Centrelink accepts a passport OR a birth certificate — not both required).
- The sticky progress bar stays visible as you scroll — scroll slowly to watch it track the header height.
- When all four sections are ready, a completion banner appears at the bottom of the page.
- Press **Cmd+P** (or **Ctrl+P**) to open the print dialog — the print stylesheet hides the header, nav, and footer, and renders a clean printable checklist with all helper text expanded. Checked items are marked with a ■ glyph (visible in black-and-white printing, unlike a green fill).

---

## Key design principles

**Government plain language.** All copy uses sentence case, avoids jargon, and follows Services Australia's plain-English conventions. The eligibility questions are written to be answerable in under five seconds.

**Early exit on disqualifying answers.** The eligibility flow exits immediately if the user answers No to the residency question — there is no point asking six questions when one answer determines the outcome. Each ineligible result page explains the specific reason, not a generic "you're not eligible" message.

**Accessibility over convention.** The checklist uses a colour shift (not a strikethrough) for completed items, because strikethrough reduces readability for low-vision users. Status banners use `role="alert"` for negative results and `role="status"` for positive ones, matching the urgency of the information. The skip-to-content link is the first focusable element on every page.

**No data, no risk.** The prototype never stores, transmits, or logs anything. Answers are in-memory only and cleared on refresh. This is stated explicitly on the prototype banner in the header.

---

## What a production system would add

- Authentication through myGov — the user would need a verified identity before submitting a claim
- Server-side session persistence — answers survive a page refresh or a return visit
- Real form submission — the eligibility check would feed directly into a Centrelink claim pre-fill
- Document upload — identity documents and medical evidence would be attached digitally
- Payment estimation — the Payment and Service Finder integration would be built in, not linked out
- Full Carer Payment eligibility logic — the "Check if you're eligible" button on the Carer page would run a parallel flow
- GOLD Design System components — replacing the Attica-based prototype theme with the official Australian Government design system
