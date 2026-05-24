"use client";

import { Volume2 } from "lucide-react";

/**
 * Mobile-only sticky "Listen" bar matching the ReadSpeaker-style audio
 * control at the bottom of servicesaustralia.gov.au mobile pages.
 * Non-functional — visual fidelity only.
 *
 * The bar is positioned via fixed + bottom 0; main content gets a matching
 * bottom padding on mobile so the bar doesn't cover form CTAs.
 */
export function ListenBar() {
  return (
    <div className="listen-bar">
      <button type="button" className="listen-bar__button" aria-label="Listen to this page">
        <Volume2 size={20} aria-hidden="true" />
        <span>Listen</span>
      </button>
    </div>
  );
}
