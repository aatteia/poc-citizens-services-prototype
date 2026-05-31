/**
 * Shared site navigation model — the single source of truth for the primary
 * and secondary nav strips and for resolving which section a route belongs to.
 *
 * Both the desktop header (src/components/layout/site-header.tsx) and the
 * consolidated mobile menu (src/components/layout/mobile-menu.tsx) import from
 * here so the two never drift apart.
 */

import { carerPayments, familyPayments, type SideRailItem } from "@/lib/nav-data";

export type NavItem = {
  label: string;
  href: string;
  matches?: readonly string[];
  /** Current when nothing else in the same nav matches the pathname. */
  defaultCurrent?: boolean;
};

export const primaryNav: readonly NavItem[] = [
  { label: "Individuals", href: "/", defaultCurrent: true },
  { label: "Design system", href: "/components", matches: ["/components"] },
];

export const secondaryNav: readonly NavItem[] = [
  { label: "Families", href: "/", matches: ["/", "/check"] },
  { label: "Carers", href: "/carers", matches: ["/carers"] },
];

/** Primary section that owns the Families/Carers secondary strip. */
export const SECONDARY_NAV_SECTION = "Individuals";

export function matchesPathname(
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
 * otherwise the `defaultCurrent` item is the fallback. Returns the label of
 * the current item (or null) so callers can both set aria-current and decide
 * section-dependent rendering.
 */
export function currentNavLabel(
  items: readonly NavItem[],
  pathname: string,
): string | null {
  const matched = items.find((item) => matchesPathname(item.matches, pathname));
  if (matched) return matched.label;
  return items.find((item) => item.defaultCurrent)?.label ?? null;
}

export type SectionNav = {
  parentLabel: string;
  parentHref: string;
  ariaLabel: string;
  items: readonly SideRailItem[];
};

/**
 * Resolve the section sibling-page list for a route. Mirrors the per-page
 * <SideRail /> choices so the mobile menu can surface the same "in this
 * section" links on every route — including ones that don't render a rail.
 */
export function sectionForPathname(pathname: string): SectionNav {
  if (pathname === "/carers" || pathname.startsWith("/carers/")) {
    return {
      parentLabel: "Carers",
      parentHref: "/carers",
      ariaLabel: "Carer payments and services",
      items: carerPayments,
    };
  }
  return {
    parentLabel: "Families",
    parentHref: "/",
    ariaLabel: "Family payments",
    items: familyPayments,
  };
}
