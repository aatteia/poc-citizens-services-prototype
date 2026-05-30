"use client";

import Link from "next/link";
import { CircleCheck, Printer } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

/**
 * Completion banner shown when every section has met its required item
 * count (i.e. all sections are "ready" — not necessarily all 12 items).
 * Reuses the session-1 `.banner--eligible` styling so the green
 * "success" treatment is consistent across both scenarios.
 *
 * Accessibility:
 *   - role="status" (not "alert"). The user triggered this state
 *     deliberately by checking off items — it should not interrupt
 *     screen reader flow the way an alert would.
 *   - Buttons have visible labels; icons are aria-hidden.
 */
export function CompletionBanner() {
  return (
    <div className="banner banner--eligible completion-banner" role="status">
      <span className="banner__icon">
        <CircleCheck size={24} aria-hidden="true" />
      </span>
      <div className="banner__body">
        <p className="banner__title">You look ready to claim</p>
        <div className="banner__content">
          <p>
            You&rsquo;ve gathered everything you need. Starting your claim
            online takes around 20 minutes.
          </p>
        </div>
        <div className="completion-banner__actions">
          <Link
            href="#"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            Start your claim
          </Link>
          <button
            type="button"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
            onClick={() => window.print()}
          >
            <Printer size={18} aria-hidden="true" />
            Print this checklist
          </button>
        </div>
      </div>
    </div>
  );
}
