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
