## Build Session Prompt

Fill in the bracketed fields and submit to Claude Code to start a build session.

```
This is a build session.

Project: [one sentence — what this prototype demonstrates and who it's for]

User journey to demonstrate: [describe the one or two journeys this session should make demoable end to end]

Key screens or features in scope for this session:
- [screen or feature 1]
- [screen or feature 2]
- [screen or feature 3 — delete if not needed]

Visual reference: [attach a screenshot, or name the app/design system to echo — e.g. "GOV.AU design system", "Linear dashboard", "Vercel dashboard"]

Database / auth / payments required: [yes or no — if yes, specify what]

Before writing the plan, complete the following setup steps in order:

1. Generate AUTH_SECRET and set AUTH_URL:
   - Run `openssl rand -base64 32` and write the output to AUTH_SECRET in .env.local
   - Set AUTH_URL=http://localhost:3000 in .env.local

2. Identify what credentials you need based on the requirements above.
   Ask me for each one you cannot generate yourself — one at a time, with a plain-language
   explanation of what it is and where to get it. Wait for my answer before proceeding.
   Credentials you may need:
   - DATABASE_URL (if database required)
   - OAuth client ID and secret, e.g. AUTH_GITHUB_ID / AUTH_GITHUB_SECRET (if auth required)
   - STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (if payments required)
   - STRIPE_WEBHOOK_SECRET — run `npm run stripe:listen` and copy the printed secret

3. Once all credentials are in .env.local:
   - If auth is required: configure the appropriate provider(s) in src/lib/auth.ts
   - If database is required: run `npm run db:push` to create the tables
   - Run `npm run dev` and confirm the server starts without errors

4. Write the plan to /plans/[session-name].md and confirm it with me before building anything.
