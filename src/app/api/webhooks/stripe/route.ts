import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";

// Disable body parsing — Stripe requires the raw body to verify the signature.
export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook verification failed: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      // TODO: provision subscription access for the user
      break;
    case "customer.subscription.updated":
      // TODO: sync subscription status change to the database
      break;
    case "customer.subscription.deleted":
      // TODO: revoke access when subscription ends
      break;
    default:
      // Unhandled event types are silently ignored
      break;
  }

  return NextResponse.json({ received: true });
}
