import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import type { SideRailItem } from "@/lib/nav-data";

/**
 * Left side-rail with a "< Parent section" back link and a vertical list of
 * sibling pages. Mirrors the desktop pattern on servicesaustralia.gov.au:
 * the current page is highlighted with a tinted background and a 3px navy
 * left accent border.
 *
 * Desktop-only — hidden by CSS at ≤1024px. On mobile the same section links
 * (plus the rest of the header chrome) live in the layout-level
 * <MobileMenu /> (src/components/layout/mobile-menu.tsx), which resolves the
 * section from the route, so this component no longer owns a drawer.
 */

export type { SideRailItem };

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
  return (
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
  );
}
