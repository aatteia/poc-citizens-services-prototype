/**
 * Shared navigation data used by the homepage and result pages
 * to keep the left side-rail sibling list consistent across all
 * informational pages in the Families section.
 */

export const familyPayments = [
  { label: "Parenting Payment", href: "/", current: true },
  { label: "Family Tax Benefit", href: "#" },
  { label: "Child Care Subsidy", href: "#" },
  { label: "Paid Parental Leave", href: "#" },
  { label: "Newborn Upfront Payment and Newborn Supplement", href: "#" },
  { label: "Dad and Partner Pay", href: "#" },
  { label: "Stillborn Baby Payment", href: "#" },
] as const;
