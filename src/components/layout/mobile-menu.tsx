"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Search, X } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BRAND_NAME } from "@/lib/brand";
import {
  currentNavLabel,
  primaryNav,
  secondaryNav,
  sectionForPathname,
  SECONDARY_NAV_SECTION,
} from "@/lib/site-nav";

/**
 * Consolidated mobile menu. Opened by the header's hamburger
 * (MobileMenuButton dispatches `sa:open-menu`) and rendered once at the
 * layout level — so it works on every route, including pages that don't
 * render a <SideRail />.
 *
 * Unlike the old SideRail-owned drawer (which only carried the current
 * section's sibling links), this surfaces everything the desktop header
 * offers, so nothing is lost when the cyan band collapses at ≤1024px:
 *   search · Sign in / Create account · myGov portals · primary nav ·
 *   secondary nav · in-this-section links · theme toggle · Online help.
 *
 * The event name is shared with mobile-menu-button.tsx — keep the two in sync.
 */

export const MOBILE_MENU_EVENT = "sa:open-menu";

const portals = [
  { id: "proda", label: "PRODA", href: "#" },
  { id: "centrelink", label: "Centrelink Business Online", href: "#" },
  { id: "child-support", label: "Child Support Business Online", href: "#" },
] as const;

export function MobileMenu() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => setOpen(false), []);

  // Listen for the header's hamburger dispatch.
  useEffect(() => {
    function onOpen() {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    }
    window.addEventListener(MOBILE_MENU_EVENT, onOpen);
    return () => window.removeEventListener(MOBILE_MENU_EVENT, onOpen);
  }, []);

  // Escape closes; restore focus to the trigger when closing.
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

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const currentPrimary = currentNavLabel(primaryNav, pathname);
  const currentSecondary = currentNavLabel(secondaryNav, pathname);
  const showSecondaryNav = currentPrimary === SECONDARY_NAV_SECTION;
  const section = sectionForPathname(pathname);

  return (
    <div
      className="mobile-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
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

        <div className="mobile-menu__body">
          {/* Search */}
          <div
            role="search"
            className="mobile-menu__search"
            aria-label={`Search ${BRAND_NAME} (non-functional in prototype)`}
          >
            <label htmlFor="mobile-search" className="sr-only">
              Search
            </label>
            <input
              id="mobile-search"
              type="search"
              placeholder="Search"
              autoComplete="off"
              className="mobile-menu__search-input"
            />
            <button
              type="button"
              className="mobile-menu__search-button"
              aria-label="Search"
            >
              <Search size={18} aria-hidden="true" />
            </button>
          </div>

          {/* Account actions */}
          <div className="mobile-menu__account">
            <Link
              href="#"
              className="mobile-menu__signin"
              onClick={handleClose}
            >
              Sign in
            </Link>
            <Link
              href="#"
              className="mobile-menu__account-link"
              onClick={handleClose}
            >
              Create account
            </Link>
          </div>

          {/* myGov portals */}
          <section className="mobile-menu__group" aria-labelledby="mm-mygov">
            <p id="mm-mygov" className="mobile-menu__group-title">
              <span className="site-header__mygov-logo" aria-hidden="true">
                my<em>Gov</em>
              </span>{" "}
              Individuals
            </p>
            <ul className="mobile-menu__list">
              {portals.map((portal) => (
                <li key={portal.id}>
                  <a
                    href={portal.href}
                    className="mobile-menu__link"
                    onClick={handleClose}
                  >
                    {portal.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Primary nav */}
          <nav className="mobile-menu__group" aria-label="Primary">
            <ul className="mobile-menu__list">
              {primaryNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="mobile-menu__link"
                    aria-current={
                      item.label === currentPrimary ? "page" : undefined
                    }
                    onClick={handleClose}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Secondary nav (Individuals section only) */}
          {showSecondaryNav && (
            <nav className="mobile-menu__group" aria-label="Section">
              <ul className="mobile-menu__list">
                {secondaryNav.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="mobile-menu__link"
                      aria-current={
                        item.label === currentSecondary ? "page" : undefined
                      }
                      onClick={handleClose}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* In this section (sibling pages) */}
          <nav className="mobile-menu__group" aria-label={section.ariaLabel}>
            <Link
              href={section.parentHref}
              className="side-rail__back"
              onClick={handleClose}
            >
              <ChevronLeft size={16} aria-hidden="true" />
              <span>{section.parentLabel}</span>
            </Link>
            <ul className="side-rail__list">
              {section.items.map((item) => (
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
          </nav>

          {/* Settings footer: theme + help */}
          <div className="mobile-menu__footer">
            <ThemeToggle />
            <a
              href="#"
              className="mobile-menu__link"
              onClick={handleClose}
            >
              Online help
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
