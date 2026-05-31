"use client";

import { Menu } from "lucide-react";

import { MOBILE_MENU_EVENT } from "@/components/layout/mobile-menu";

/**
 * Hamburger button that dispatches `sa:open-menu` for the layout-level
 * <MobileMenu /> to handle. Hidden on desktop via CSS — the desktop user has
 * the full utility cluster plus the primary/secondary nav strips inline.
 *
 * The menu is rendered once at the layout level, so this works on every
 * route regardless of whether the page renders a <SideRail />.
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
