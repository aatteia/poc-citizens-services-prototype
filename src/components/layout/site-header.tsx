"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

import { MobileMenuButton } from "@/components/layout/mobile-menu-button";
import { MyGovDropdown } from "@/components/layout/mygov-dropdown";
import { ThemeToggle } from "@/components/layout/theme-toggle";

/**
 * Header chrome mirroring servicesaustralia.gov.au (2026 redesign):
 *   row 1 (cyan):    wordmark  |  theme toggle · search · myGov · Sign in
 *                                  "Create account · Online help"
 *   row 2 (white):   primary nav   — Individuals (always active)
 *   row 3 (white-2): secondary nav — Families · Carers active by route
 *
 * Active-state logic:
 *   - Primary nav: Individuals is always the active item (the whole
 *     prototype lives inside the Individuals audience context).
 *   - Secondary nav: Families is active on `/` and `/check/**`,
 *     Carers is active on `/carers/**`. No item is active on the
 *     component library page (`/components`).
 *
 * Non-functional items render as <span aria-disabled> with a native
 * title-attribute tooltip — they are visually present so the prototype
 * communicates the IA of the real site, but inert.
 */

type FunctionalNavItem = {
  label: string;
  href: string;
  matches?: readonly string[];
  alwaysCurrent?: boolean;
};
type DisabledNavItem = { label: string; disabled: true };
type NavItem = FunctionalNavItem | DisabledNavItem;

const primaryNav: readonly NavItem[] = [
  { label: "Individuals", href: "/", alwaysCurrent: true },
  { label: "Health professionals", disabled: true },
  { label: "Businesses", disabled: true },
  { label: "Community groups", disabled: true },
];

const secondaryNav: readonly NavItem[] = [
  { label: "Families", href: "/", matches: ["/", "/check"] },
  { label: "Work", disabled: true },
  { label: "Housing", disabled: true },
  { label: "Health", disabled: true },
  { label: "Carers", href: "/carers", matches: ["/carers"] },
  { label: "Study", disabled: true },
];

const DISABLED_TITLE = "This section is not part of this prototype";

function isFunctional(item: NavItem): item is FunctionalNavItem {
  return !("disabled" in item);
}

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

export function SiteHeader() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="site-header">
      {/* ===== Row 1: cyan band ===== */}
      <div className="site-header__band">
        <Link
          href="/"
          className="site-header__wordmark"
          aria-label="Services Australia — home"
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
          <span className="site-header__brand">Services Australia</span>
        </Link>

        <div className="site-header__utility">
          <div className="site-header__utility-row">
            <ThemeToggle />

            <div
              role="search"
              className="site-header__search"
              aria-label="Search Services Australia (non-functional in prototype)"
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
                {isFunctional(item) ? (
                  <Link
                    href={item.href}
                    className="site-nav-primary__link"
                    aria-current={
                      item.alwaysCurrent ||
                      matchesPathname(item.matches, pathname)
                        ? "page"
                        : undefined
                    }
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="site-nav-primary__link site-nav-primary__link--disabled"
                    title={DISABLED_TITLE}
                    aria-disabled="true"
                  >
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ===== Row 3: secondary contextual nav ===== */}
      <nav aria-label="Section" className="site-nav-secondary">
        <div className="site-nav-secondary__inner">
          <ul className="site-nav-secondary__list">
            {secondaryNav.map((item) => (
              <li key={item.label}>
                {isFunctional(item) ? (
                  <Link
                    href={item.href}
                    className="site-nav-secondary__link"
                    aria-current={
                      matchesPathname(item.matches, pathname)
                        ? "page"
                        : undefined
                    }
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="site-nav-secondary__link site-nav-secondary__link--disabled"
                    title={DISABLED_TITLE}
                    aria-disabled="true"
                  >
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
