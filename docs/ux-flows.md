# UX flows

## Navigation structure

**Layout:** Fixed top header, full-width. No sidebar on the shell level — individual page layouts use a three-column grid (side-rail / main / on-this-page sidebar) for informational pages.

**Top header contains:**
- Site logo / wordmark (left) — links to `/`
- Primary nav links: "Parenting Payment" (`/`) and "Carer Payment" (`/carers`) — centre or left of header on desktop
- myGov dropdown (right) — illustrative, no real auth
- Dark mode toggle (right)
- Mobile hamburger menu (right, visible below breakpoint)

**No role switcher** — this prototype is fully public and citizen-facing. All flows are available to any visitor.

**Navigation table:**

| Item | Route | Notes |
|---|---|---|
| Parenting Payment | `/` | Overview page; entry to the eligibility check |
| Carer Payment | `/carers` | Overview page; entry to the prepare checklist |
| Eligibility check | `/check/q1` … `/check/q6` | Not in top nav — entered from the Parenting Payment CTA |
| Check result | `/check/result/eligible` or `/check/result/ineligible` | Not in top nav — reached only by completing the flow |
| Prepare to claim | `/carers/prepare` | Not in top nav — entered from the Carer Payment CTA |
| Design system reference | `/components` | Not in top nav — direct URL only |

---

## Flow 1 — Parenting Payment eligibility check

### 1a. Eligible path (all qualifying answers)

**Start:** Parenting Payment overview page (`/`)

1. User reads the overview. Key facts box shows fortnightly rate (up to $1,096.10), income test threshold ($2,536.20 / fortnight), and child age limit. Four content sections are available via the on-this-page sidebar (Who can get it, How much, How to claim, Manage).
2. User clicks **Check if you're eligible** (primary button, large). A helper line reads "Anonymous · No sign-in required".
   → Navigates to `/check/q1`.
3. Q1 — "Are you single or in a couple?" Two options: Single, In a couple. Progress indicator shows Step 1 of 6 with label "Family situation" active.
4. User selects an option and clicks **Continue**.
   → Navigates to `/check/q2`.
5. Q2 — "Are you an Australian resident?" Helper text explains the residency rule. Two options: Yes, No.
6. User selects **Yes** and clicks **Continue**.
   → Navigates to `/check/q3`.
7. Q3 — "How old is your youngest child?" Three options: Under 8 years, 8 to 13 years, 14 years or older.
8. User selects **Under 8 years** and clicks **Continue**.
   → Navigates to `/check/q4`.
9. Q4 — "Is your income below the limit?" Helper text states the income threshold. Three options: Yes I think so, No, I'm not sure.
10. User selects **Yes, I think so** and clicks **Continue**.
    → Navigates to `/check/q5`.
11. Q5 — "Are you currently receiving a Services Australia payment?" Helper text lists example payments. Three options: Yes, No, Not sure.
12. User selects an option and clicks **Continue**.
    → Navigates to `/check/q6`.
13. Q6 — "Are you working or studying?" Helper text notes this affects amount, not eligibility. Three options: Yes, No, Both.
14. User selects an option and clicks **Continue**.
    → Navigates to `/check/result/eligible`.
15. Eligible result page loads. Focus moves to the `<h1>` heading. A green status banner reads "Based on your answers, you may be eligible." Page shows: estimated payment range fact box, "What to do next" numbered list (check payment amount, create myGov account, link Centrelink, submit claim), answer summary of all six questions with labels and selected values.
16. User clicks **Start again**.
    → Navigates to `/check/q1` with all answers cleared.

**End state:** User has seen their likely eligibility outcome and the next steps to claim.

---

### 1b. Ineligible path — residency exit (early branch)

**Start:** Parenting Payment overview page (`/`)

1–4. Same as 1a steps 1–4 (Q1 answered, navigated to Q2).
5. Q2 — User selects **No**.
6. User clicks **Continue**.
   → Navigates directly to `/check/result/ineligible`. Q3–Q6 are never shown.
7. Ineligible result page loads with residency-specific copy: "Parenting Payment is only available to people who meet the Australian residency rules." Page shows: answer summary (Q1 and Q2 only, since no further answers were collected), three related payment cards (JobSeeker Payment, Family Tax Benefit Part A, Family Tax Benefit Part B).
8. User can click **Start again** to return to Q1.

**End state:** User understands the specific reason they are not eligible and sees alternative payments to explore.

---

### 1c. Ineligible path — child age exit

**Start:** Q3 reached with a single-parent answer at Q1.

1. Q3 — User selects **8 to 13 years** or **14 years or older**.
2. User clicks **Continue**.
   → Navigates to Q4.
3. Q4–Q6 answered with any values.
   → Navigates to `/check/result/ineligible`.
4. Ineligible result shows child-age-specific copy: "To get Parenting Payment as a single parent, your youngest child needs to be under 8 years old."

**Note:** This branch fires only when Q1 = "single" AND Q3 is 8–13 or 14-plus. If Q1 = "couple" and Q3 is 8–13 or 14-plus, the flow reaches Q4 and eligibility is determined by the income answer.

**End state:** User understands the age-based ineligibility reason.

---

### 1d. Ineligible path — income exit

**Start:** Any combination of Q1–Q3 that has not already triggered an exit.

1. Q4 — User selects **No**.
2. User clicks **Continue**.
   → Navigates to `/check/result/ineligible`.
3. Ineligible result shows income-specific copy: "Your income is above the limit for Parenting Payment. You may still be eligible for other payments."

**End state:** User understands the income-based ineligibility reason and sees related payments.

---

### 1e. Q4 "I'm not sure" inline callout

**Start:** Q4 loaded.

1. User selects **I'm not sure**.
   → An inline callout appears immediately below the radio group: "If you're not sure, use the Payment and Service Finder on the Services Australia website to estimate your income before you claim."
2. The callout does not block navigation. User can click **Continue** to proceed to Q5, where they will be treated as potentially eligible.

**End state:** User is directed to an external tool for income estimation and can continue the flow.

---

### 1f. Back navigation within the flow

**At any question page:**

1. User clicks **Back**.
   → Returns to the previous question page. Previously selected answer is still shown as selected (answers are held in FlowProvider context for the duration of the session).
2. User can change their answer and click **Continue** to re-enter the forward flow.
   → The flow resumes from the next question; any subsequent answers are preserved unless the path changes (e.g., changing Q1 from "single" to "couple" does not clear Q3, but the eligibility outcome recalculates from the new answers on the result page).

---

## Flow 2 — Carer Payment prepare-to-claim checklist

### 2a. Working through the checklist to completion

**Start:** Carer Payment overview page (`/carers`)

1. User reads the overview. Key facts box shows fortnightly rate (up to $1,200.90), income free area ($218.00 / fortnight), and work limit (up to 25 hours per week). Four content sections available via on-this-page sidebar.
2. User clicks **Prepare to claim** (primary button, large).
   → Navigates to `/carers/prepare`.
3. Prepare-to-claim page loads. A sticky progress bar below the header reads "0 of 4 sections ready". Four section cards are visible: Your identity, About the person you care for, Your income and assets, Your caring arrangement.
4. User expands a checklist item's "Why do I need this?" toggle.
   → A helper text panel appears below the item label with contextual explanation.
5. User ticks items within a section. The section card does not change state until the section's `requiredCount` is met:
   - **Your identity** (needs any 3 of 4): ticking a third item marks the section ready
   - **About the person you care for** (needs both of 2): ticking the second item marks the section ready
   - **Your income and assets** (needs both of 2): same
   - **Your caring arrangement** (needs both of 2): same
6. When a section reaches its `requiredCount`, the progress bar updates: "1 of 4 sections ready", then "2 of 4", etc.
7. When all four sections are ready, the progress bar reads "4 of 4 sections ready" and a completion banner appears at the bottom of the page: "You're ready to claim. Start your claim through myGov." The myGov button links to `#`.

**End state:** All four sections are marked ready. User understands what documents to gather before starting the claim.

---

### 2b. Print the checklist

**Start:** `/carers/prepare`, any checklist state.

1. User presses Cmd+P (macOS) or Ctrl+P (Windows/Linux), or uses the browser print menu.
   → Print stylesheet activates. The printed document shows only the checklist content: page title, the four section groups with their items, helper text always expanded regardless of collapse state on-screen, checked items marked with ■ before the label (not a green checkbox fill — visible in black-and-white).
   → Header, navigation, progress bar, footer, and page rating are hidden in print.
   → `page-break-inside: avoid` on each section group prevents a group splitting across pages.
   → Body typeface switches to Georgia serif. Margins are 20mm.

**End state:** User has a printed or PDF checklist they can work from offline while gathering documents.

---

### 2c. Partial completion — navigating away and returning

**Start:** `/carers/prepare`, some items ticked.

1. User navigates away (clicks a header link, uses browser back, etc.).
   → Checklist state is lost. `useState` is local to the component; there is no persistence layer.
2. User returns to `/carers/prepare`.
   → Page loads with all items unticked and progress bar reset to 0 of 4.

**Note:** This is intentional and matches the brief ("No persistence — refresh resets to empty"). There is no "save progress" feature.

**End state:** User must re-tick items from scratch. This is a known limitation of the prototype.
