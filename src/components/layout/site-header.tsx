import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";

import { MobileMenuButton } from "@/components/layout/mobile-menu-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

/**
 * Header chrome mirroring servicesaustralia.gov.au (2026 redesign):
 *   row 1 (cyan):    wordmark  |  theme toggle · search · myGov · Sign in
 *                                  "Create account · Online help"
 *   row 2 (white):   primary nav   — Individuals (active) / Health professionals / Businesses / Community groups
 *   row 3 (white-2): secondary nav — Families (active) / Work / Housing / Health / Carers / Study
 *
 * Search, myGov, Sign in and the nav links are all non-functional href="#"
 * stubs in this prototype — they exist for visual fidelity only.
 */

type NavItem = { label: string; href: string; current?: boolean };

const primaryNav: readonly NavItem[] = [
  { label: "Individuals", href: "/", current: true },
  { label: "Health professionals", href: "#" },
  { label: "Businesses", href: "#" },
  { label: "Community groups", href: "#" },
];

const secondaryNav: readonly NavItem[] = [
  { label: "Families", href: "/", current: true },
  { label: "Work", href: "#" },
  { label: "Housing", href: "#" },
  { label: "Health", href: "#" },
  { label: "Carers", href: "#" },
  { label: "Study", href: "#" },
];

export function SiteHeader() {
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

            <button
              type="button"
              className="site-header__mygov"
              aria-haspopup="menu"
              aria-expanded="false"
            >
              <span className="site-header__mygov-logo">
                my<em>Gov</em>
              </span>
              <span>Individuals</span>
              <ChevronDown size={16} aria-hidden="true" />
            </button>

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
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.label}
                </Link>
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
                <Link
                  href={item.href}
                  className="site-nav-secondary__link"
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
