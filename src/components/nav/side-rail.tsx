"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, X } from "lucide-react";

/**
 * Left side-rail with a "< Parent section" back link and a vertical list of
 * sibling pages. Mirrors the desktop pattern on servicesaustralia.gov.au:
 * the current page is highlighted with a tinted background and a 3px navy
 * left accent border.
 *
 * On mobile, the rail itself is hidden by CSS — a paired drawer (rendered
 * here too) is opened when the header dispatches a `sa:open-menu` window
 * event from its hamburger button. The drawer has its own focus trap,
 * Escape handler, and overlay close behaviour.
 *
 * The event name is shared with src/components/layout/mobile-menu-button.tsx —
 * keep the two in sync.
 */

export const MOBILE_MENU_EVENT = "sa:open-menu";

export type SideRailItem = {
  label: string;
  href: string;
  current?: boolean;
};

interface SideRailProps {
  parentLabel: string;
  parentHref: string;
  items: readonly SideRailItem[];
  ariaLabel?: string;
  className?: string;
}

export function SideRail({
  parentLabel,
  parentHref,
  items,
  ariaLabel = "Section pages",
  className,
}: SideRailProps) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => setOpen(false), []);

  // Listen for the header's hamburger dispatch
  useEffect(() => {
    function onOpen() {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    }
    window.addEventListener(MOBILE_MENU_EVENT, onOpen);
    return () => window.removeEventListener(MOBILE_MENU_EVENT, onOpen);
  }, []);

  // Escape closes; restore focus to the trigger.
  useEffect(() => {
    if (!open) {
      lastFocusedRef.current?.focus?.();
      return;
    }
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* Desktop rail — hidden on mobile via CSS */}
      <nav
        aria-label={ariaLabel}
        className={["side-rail", className].filter(Boolean).join(" ")}
      >
        <Link href={parentHref} className="side-rail__back">
          <ChevronLeft size={16} aria-hidden="true" />
          <span>{parentLabel}</span>
        </Link>

        <ul className="side-rail__list">
          {items.map((item) => (
            <li key={item.label}>
              {item.current ? (
                <span
                  className="side-rail__link side-rail__link--current"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="side-rail__link">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile drawer — full-page panel overlaid on top of content */}
      {open && (
        <div
          className="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
        >
          <button
            type="button"
            className="mobile-drawer__scrim"
            aria-label="Close menu"
            onClick={handleClose}
          />
          <div className="mobile-drawer__panel">
            <div className="mobile-drawer__header">
              <span className="mobile-drawer__title">Menu</span>
              <button
                ref={closeRef}
                type="button"
                className="mobile-drawer__close"
                onClick={handleClose}
                aria-label="Close menu"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <Link
              href={parentHref}
              className="side-rail__back"
              onClick={handleClose}
            >
              <ChevronLeft size={16} aria-hidden="true" />
              <span>{parentLabel}</span>
            </Link>
            <ul className="side-rail__list">
              {items.map((item) => (
                <li key={item.label}>
                  {item.current ? (
                    <span
                      className="side-rail__link side-rail__link--current"
                      aria-current="page"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="side-rail__link"
                      onClick={handleClose}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
