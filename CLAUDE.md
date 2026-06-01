# poc-citizens-services-prototype

A government citizen-services prototype demonstrating a Services Australia-branded interface — initially scoped to a Carer Payment / Carer Allowance eligibility and document-upload flow. Built to interview and portfolio standard.

## Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 with `@theme inline` token bridge
- **Components**: Base UI React (`@base-ui/react`) — no ShadCN
- **Design system**: Attica structural tokens (Layer 1) + SA government theme override (Layer 2) — see `src/app/globals.css`
- **No database, no auth, no payments** — static prototype only

## Project Structure
```
src/
  app/
    globals.css          # Layer 1: Attica raw tokens → Layer 2: [data-theme="sa"] → Layer 3: @theme inline
    layout.tsx
    page.tsx             # Entry / landing
    carers/              # Carer Payment eligibility flow
    check/               # Eligibility checker
    components/          # Page-level component compositions
  components/
    ui/                  # Primitive UI components (buttons, inputs, etc.)
    nav/                 # Navigation shell
    layout/              # Page layout wrappers
    flow/                # Multi-step form / wizard components
    checklist/           # Checklist UI
    content/             # Content blocks
    feedback/            # Alerts, notifications, status messages
  lib/                   # Utilities and shared logic
```

## CSS Architecture (three-layer)
1. **Layer 1 — Attica raw tokens**: Full Attica palette, spacing, radii, shadow, type scale — always present, verbatim
2. **Layer 2 — SA theme**: `html[data-theme="sa"]` block maps Attica raws to ShadCN semantic vocabulary (`--primary`, `--background`, etc.) using SA navy (`#1B4F72`) as primary. Comment in globals.css notes this block is structurally compatible with `shadcn-gov-themes` for future contribution.
3. **Layer 3 — Tailwind bridge**: `@theme inline` exposes tokens as Tailwind utilities

## Conventions
- No Prisma, no NextAuth, no Stripe — any auth/data logic is mocked
- Government content rules: sentence case, plain English, no jargon
- Primary colour is SA navy, not Attica Eminence purple
- Component props typed inline; no shared prop types file needed at prototype scale

## Key Commands
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run typecheck  # tsc --noEmit
npm run lint       # ESLint
```
