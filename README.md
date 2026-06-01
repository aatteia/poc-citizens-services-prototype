# Citizens' Services prototype

A Services Australia–branded government portal demonstrating two complete citizen-facing flows: a Parenting Payment eligibility check and a Carer Payment prepare-to-claim checklist. Built to interview and portfolio standard.

**Live demo:** https://poc-citizens-services-prototype.vercel.app
**GitHub:** https://github.com/aatteia/poc-citizens-services-prototype
**Component reference:** `/components` — every component in every state, with accessibility and design notes

---

## User journeys

### 1 — Parenting Payment eligibility check

Start at `/` and click **Check if you're eligible**.

A six-question flow determines whether the user may be eligible for Parenting Payment. Questions cover family situation, Australian residency, child age, income, current payments, and work or study. The flow branches on Q2 (residency) and Q4 (income) to exit early with a specific ineligibility reason. Eligible and ineligible result pages each show an answer summary and tailored next steps. The flow resets cleanly when the user clicks **Start again**.

What to look for: the progress indicator, the Q4 inline callout when "I'm not sure" is selected, and the two distinct result pages.

### 2 — Carer Payment prepare-to-claim checklist

Start at `/carers` and click **Prepare to claim**.

A four-section checklist (your identity, the person you care for, income and assets, medical evidence) walks the user through every document and step needed before lodging a Carer Payment claim. Each item has a "Why do I need this?" collapsible helper. A sticky progress bar tracks how many sections are complete. The page has a print stylesheet that renders a clean document with helper text always expanded.

What to look for: the sticky header offset on scroll, the print layout (`Cmd+P` or `Ctrl+P`), and the completion banner when all four sections are ready.

---

## Local setup

```bash
git clone https://github.com/aatteia/poc-citizens-services-prototype.git
cd poc-citizens-services-prototype
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint
npm run build       # Production build
```

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 with `@theme inline` token bridge |
| Components | Base UI React (`@base-ui/react`) — no ShadCN |
| Design system | Attica structural tokens + SA government theme (`html[data-theme="sa"]`) |
| State | React context (`FlowProvider`) for eligibility flow; local state for checklist |
| Data | No database — static content and in-memory form state only |
| Deployment | Vercel (git push → automatic production build) |
