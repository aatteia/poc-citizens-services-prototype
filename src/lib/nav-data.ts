/**
 * Shared navigation data used by the side-rail across both scenarios.
 * Keeps sibling-page lists consistent across all informational pages
 * within a given section.
 */

export type SideRailItem = {
  label: string;
  href: string;
  current?: boolean;
};

export const familyPayments = [
  { label: "Parenting Payment", href: "/", current: true },
  { label: "Family Tax Benefit", href: "#" },
  { label: "Child Care Subsidy", href: "#" },
  { label: "Paid Parental Leave", href: "#" },
  { label: "Newborn Upfront Payment and Newborn Supplement", href: "#" },
  { label: "Dad and Partner Pay", href: "#" },
  { label: "Stillborn Baby Payment", href: "#" },
] as const;

export const carerPayments = [
  { label: "Carer Payment", href: "/carers", current: true },
  { label: "Carer Allowance", href: "#" },
  { label: "Carer Gateway", href: "#" },
] as const;
