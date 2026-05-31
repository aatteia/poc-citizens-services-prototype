"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

import { MobileMenuButton } from "@/components/layout/mobile-menu-button";
import { MyGovDropdown } from "@/components/layout/mygov-dropdown";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BRAND_NAME } from "@/lib/brand";
import {
  currentNavLabel,
  primaryNav,
  secondaryNav,
  SECONDARY_NAV_SECTION,
} from "@/lib/site-nav";

/**
 * Header chrome (2026 gov redesign pattern):
 *   row 1 (cyan):    wordmark  |  theme toggle · search · myGov · Sign in
 *                                  "Create account · Online help"
 *   row 2 (white):   primary nav   — Individuals · Design system
 *   row 3 (white-2): secondary nav — Families · Carers active by route
 *
 * The nav model and active-state resolution live in src/lib/site-nav.ts so
 * the desktop header and the layout-level <MobileMenu /> stay in sync.
 *
 * At ≤1024px the whole utility cluster and both nav strips collapse into the
 * mobile menu (opened by <MobileMenuButton />) — see globals.css.
 */

/** Below this scroll position the header is always shown (covers the masthead's own height). */
const REVEAL_ZONE = 120;
/** Ignore scroll jitter smaller than this before changing visibility. */
const SCROLL_DELTA = 6;

/**
 * Hide the sticky header while scrolling down, reveal it while scrolling up
 * (the "sticky reveal" pattern). Reclaims vertical space on short screens
 * without removing any navigation — an upward flick brings it back.
 *
 * Returns a `hidden` flag plus a `reveal` callback so keyboard users tabbing
 * into header controls always pull it back into view.
 */
function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      if (Math.abs(delta) > SCROLL_DELTA) {
        if (y <= REVEAL_ZONE || delta < 0) {
          setHidden(false);
        } else {
          setHidden(true);
        }
        lastY.current = y;
      }
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { hidden, reveal: () => setHidden(false) };
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const { hidden, reveal } = useHideOnScroll();

  const currentPrimary = currentNavLabel(primaryNav, pathname);
  const currentSecondary = currentNavLabel(secondaryNav, pathname);
  const showSecondaryNav = currentPrimary === SECONDARY_NAV_SECTION;

  return (
    <header
      className="site-header"
      data-hidden={hidden ? "true" : undefined}
      onFocusCapture={reveal}
    >
      {/* ===== Row 1: cyan band ===== */}
      <div className="site-header__band">
        <Link
          href="/"
          className="site-header__wordmark"
          aria-label={`${BRAND_NAME} — home`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/australian-government-stacked.svg"
            alt=""
            aria-hidden="true"
            width={130}
            height={67}
            className="site-header__logo"
          />
          <span className="site-header__brand">{BRAND_NAME}</span>
        </Link>

        <div className="site-header__utility">
          <div className="site-header__utility-row">
            <ThemeToggle />

            <div
              role="search"
              className="site-header__search"
              aria-label={`Search ${BRAND_NAME} (non-functional in prototype)`}
            >
              <label htmlFor="site-search" className="sr-only">
                Search
              </label>
              <input
                id="site-search"
                type="search"
                placeholder="Search"
                autoComplete="off"
                className="site-header__search-input"
              />
              <button
                type="button"
                className="site-header__search-button"
                aria-label="Search"
              >
                <Search size={18} aria-hidden="true" />
              </button>
            </div>

            <MyGovDropdown />

            <Link href="#" className="site-header__signin">
              Sign in
            </Link>
          </div>

          <ul className="site-header__utility-links">
            <li>
              <a href="#">Create account</a>
            </li>
            <li aria-hidden="true">|</li>
            <li>
              <a href="#">Online help</a>
            </li>
          </ul>
        </div>

        <MobileMenuButton />
      </div>

      {/* ===== Row 2: primary nav ===== */}
      <nav aria-label="Primary" className="site-nav-primary">
        <div className="site-nav-primary__inner">
          <ul className="site-nav-primary__list">
            {primaryNav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="site-nav-primary__link"
                  aria-current={
                    item.label === currentPrimary ? "page" : undefined
                  }
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ===== Row 3: secondary contextual nav (Individuals section only) ===== */}
      {showSecondaryNav && (
        <nav aria-label="Section" className="site-nav-secondary">
          <div className="site-nav-secondary__inner">
            <ul className="site-nav-secondary__list">
              {secondaryNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="site-nav-secondary__link"
                    aria-current={
                      item.label === currentSecondary ? "page" : undefined
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
}
