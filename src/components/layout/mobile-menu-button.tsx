"use client";

import { Menu } from "lucide-react";

import { MOBILE_MENU_EVENT } from "@/components/nav/side-rail";

/**
 * Hamburger button that dispatches `sa:open-menu` for the SideRail drawer
 * to handle. Hidden on desktop via CSS — the desktop user has the full
 * left rail, primary, and secondary nav strips inline.
 *
 * If the current page doesn't render a <SideRail />, the button still
 * dispatches but nothing listens, which is a graceful no-op.
 */
export function MobileMenuButton() {
  return (
    <button
      type="button"
      className="site-header__menu"
      aria-label="Open menu"
      aria-haspopup="dialog"
      onClick={() => window.dispatchEvent(new CustomEvent(MOBILE_MENU_EVENT))}
    >
      <Menu size={18} aria-hidden="true" />
      <span>Menu</span>
    </button>
  );
}
