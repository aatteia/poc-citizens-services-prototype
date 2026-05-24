# Scaffold Foundation — Quick Reference

## Creating a New Project from This Template

### Step 1 — Duplicate and rename

In Finder: right-click `/Users/aatteia/working/scaffold-foundation` → Duplicate.
Rename the copy to your project name (e.g. `my-prototype`).

### Step 2 — Run setup

Open a terminal in the new project folder and run:

```bash
bin/setup
```

This copies `.env.local.example` → `.env.local`, runs `npm install`, and generates the Prisma client.

### Step 3 — Start the build session

Fill in the Build Session Prompt below and submit it to Claude Code.

Claude Code will handle the rest before it writes the plan:
- Generate `AUTH_SECRET` and set `AUTH_URL` automatically
- Ask you for any credentials it cannot generate itself (database URL, OAuth keys, Stripe keys)
- Configure auth providers, push the database schema, and verify the dev server starts

You only need to supply credentials when asked.

---

## Key Commands

```bash
npm run dev            # Start dev server (http://localhost:3000)
npm run db:push        # Sync Prisma schema to the database (no migration history)
npm run db:studio      # Open Prisma Studio (visual DB browser)
npm run stripe:listen  # Forward Stripe webhooks to /api/webhooks/stripe
npm run build          # Production build
```

---

## What Is Already Wired

| File | Purpose |
|---|---|
| `src/lib/auth.ts` | NextAuth v5 config — add providers here |
| `src/lib/db.ts` | Prisma client singleton (uses `@prisma/adapter-pg`) |
| `src/lib/stripe.ts` | Stripe client singleton |
| `src/lib/env.ts` | Zod-validated env vars — add new vars here |
| `src/app/api/auth/[...nextauth]/route.ts` | NextAuth API handler — do not modify |
| `src/app/api/webhooks/stripe/route.ts` | Stripe webhook — add cases to the `switch` block |
| `src/app/(auth)/` | Login, register, forgot-password pages |
| `src/app/(dashboard)/layout.tsx` | Redirects unauthenticated users to `/login` |
| `src/components/ui/button.tsx` | Minimal Button component |
| `src/hooks/use-session.ts` | Re-exports `useSession` from next-auth/react |

---

## Architecture Notes

- **Prisma 7**: uses the new `prisma-client` engine. The client is generated to `src/generated/prisma/`. A PostgreSQL driver adapter (`@prisma/adapter-pg`) is required — it is already configured in `lib/db.ts`.
- **NextAuth v5**: session secret is `AUTH_SECRET` (not `NEXTAUTH_SECRET`). Callback URL is `AUTH_URL`.
- **Tailwind v4**: configured via `postcss.config.mjs`, not a `tailwind.config.ts` file.
- **Env validation**: `lib/env.ts` throws at startup if any required variable is missing or malformed. Add new required vars to the Zod schema there.

---

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
```

---

## When You Are Ready to Deploy to Vercel

Do not start this until the prototype is finished and tested locally.

Before submitting the Deploy Session Prompt, do one thing manually: go to [neon.tech](https://neon.tech), create a free project, and copy the connection string. You will paste it when Claude Code asks for it. Everything else is handled by Claude Code.

### Deploy Session Prompt

Fill in the two bracketed fields and submit to Claude Code.

```
This is a deploy session.

Project: [the folder name of the project being deployed]

Payments enabled: [yes or no]

Work through the following steps in order. At each step that requires a
credential or decision from me, ask for it clearly — one question at a time —
and wait for my answer before continuing. Confirm each step is complete before
moving to the next.

1. Push to GitHub
   - Check whether a git remote named origin already exists.
   - If it does not: ask me whether to create a new GitHub repository
     automatically (requires the gh CLI) or whether I will provide a URL.
     Then add the remote and push with: git push -u origin main
   - If origin already exists: push any unpushed commits.

2. Link to Vercel
   - Run: vercel link
     Follow the prompts to connect this project to a Vercel project.
     If no Vercel project exists yet, create one when prompted.
   - Once linked, retrieve the assigned production URL
     (e.g. https://my-project.vercel.app) and note it — it is needed in step 3.

3. Set environment variables in Vercel
   - Ask me for the Neon connection string (DATABASE_URL for production).
   - Use the production URL from step 2 as AUTH_URL.
   - Read all other variable names from .env.local.example.
   - Set every variable using: vercel env add <NAME> production
     Use the production values for DATABASE_URL and AUTH_URL.
     Use the same values as .env.local for everything else.

4. Push the schema to the production database
   - Run db:push against the Neon connection string without modifying .env.local:
     DATABASE_URL="<neon-url>" npm run db:push
   - Confirm the tables were created successfully.

5. Deploy to production
   - Run: vercel --prod
   - Wait for the deployment to complete and confirm the production URL loads.

6. Wire up the Stripe webhook (skip if payments are not enabled)
   - Create the webhook endpoint using the Stripe CLI:
     stripe webhooks create \
       --url <production-url>/api/webhooks/stripe \
       --events checkout.session.completed,customer.subscription.updated,customer.subscription.deleted
   - Copy the signing secret from the output.
   - Add it to Vercel: vercel env add STRIPE_WEBHOOK_SECRET production
   - Redeploy so the new variable takes effect: vercel --prod

7. Confirm everything is working
   - Open the production URL and verify the root page loads.
   - If auth is enabled: confirm the login page is reachable.
   - Report the final production URL and a summary of what was deployed.
```
