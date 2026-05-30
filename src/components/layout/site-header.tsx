"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

import { MobileMenuButton } from "@/components/layout/mobile-menu-button";
import { MyGovDropdown } from "@/components/layout/mygov-dropdown";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BRAND_NAME } from "@/lib/brand";

/**
 * Header chrome (2026 gov redesign pattern):
 *   row 1 (cyan):    wordmark  |  theme toggle · search · myGov · Sign in
 *                                  "Create account · Online help"
 *   row 2 (white):   primary nav   — Individuals · Design system
 *   row 3 (white-2): secondary nav — Families · Carers active by route
 *
 * The nav is simplified to interactive items only (no inert/disabled
 * entries). Both Families and Carers live under Individuals; the Design
 * system showcase is surfaced as its own primary item.
 *
 * Active-state logic (exactly one current item per nav):
 *   - An item is current when its `matches` hit the pathname.
 *   - If no primary item matches, the `defaultCurrent` item (Individuals)
 *     is current. This is what keeps Individuals lit on `/`, `/check/**`
 *     and `/carers/**` while letting Design system take over on
 *     `/components/**` without both showing aria-current.
 *   - The secondary strip belongs to the Individuals section only, so it
 *     is hidden whenever the Design system section is active.
 */

type NavItem = {
  label: string;
  href: string;
  matches?: readonly string[];
  /** Current when nothing else in the same nav matches the pathname. */
  defaultCurrent?: boolean;
};

const primaryNav: readonly NavItem[] = [
  { label: "Individuals", href: "/", defaultCurrent: true },
  { label: "Design system", href: "/components", matches: ["/components"] },
];

const secondaryNav: readonly NavItem[] = [
  { label: "Families", href: "/", matches: ["/", "/check"] },
  { label: "Carers", href: "/carers", matches: ["/carers"] },
];

/** Primary section that owns the Families/Carers secondary strip. */
const SECONDARY_NAV_SECTION = "Individuals";

function matchesPathname(
  matches: readonly string[] | undefined,
  pathname: string,
) {
  if (!matches) return false;
  return matches.some((m) => {
    if (m === "/") return pathname === "/";
    return pathname === m || pathname.startsWith(m + "/");
  });
}

/**
 * Resolve which item in a nav is current. An explicit `matches` hit wins;
 * otherwise the `defaultCurrent` item is the fallback. Returns the label
 * of the current item (or null) so callers can both set aria-current and
 * decide section-dependent rendering.
 */
function currentNavLabel(
  items: readonly NavItem[],
  pathname: string,
): string | null {
  const matched = items.find((item) => matchesPathname(item.matches, pathname));
  if (matched) return matched.label;
  return items.find((item) => item.defaultCurrent)?.label ?? null;
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";

  const currentPrimary = currentNavLabel(primaryNav, pathname);
  const currentSecondary = currentNavLabel(secondaryNav, pathname);
  const showSecondaryNav = currentPrimary === SECONDARY_NAV_SECTION;

  return (
    <header className="site-header">
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
