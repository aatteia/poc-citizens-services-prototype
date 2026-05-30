import {
  CalendarCheck,
  HeartHandshake,
  IdCard,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";

import { BRAND_NAME } from "@/lib/brand";

export interface ChecklistItemConfig {
  id: number;
  label: string;
  helper: string;
}

export interface ChecklistGroupConfig {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  items: readonly ChecklistItemConfig[];
  /**
   * Minimum number of items the user must tick for this section to count
   * as "ready". Any combination of items satisfies it — no specific item
   * is mandatory. Set equal to `items.length` for sections where every
   * item is genuinely required. Must be 1 <= requiredCount <= items.length.
   */
  requiredCount: number;
}

/**
 * Carer Payment "prepare to claim" checklist content.
 * 4 groups, 12 items total. Item ids are stable integers 1-12 used as
 * keys in the parent page's useState<Record<number, boolean>>.
 *
 * Readiness is tracked per section, not per item: a section is "ready"
 * once its `requiredCount` is met (see `isGroupReady`), and the page is
 * ready to claim once all 4 sections are ready. Some sections accept a
 * subset of their items (e.g. Identity needs any 3 of 4); others require
 * every item (e.g. Caring arrangement needs both).
 */
export const carerChecklist: readonly ChecklistGroupConfig[] = [
  {
    id: "identity",
    title: "Your identity",
    description:
      "You'll need to prove who you are when you submit your claim.",
    icon: IdCard,
    requiredCount: 3,
    items: [
      {
        id: 1,
        label: "Australian passport or birth certificate",
        helper:
          "Centrelink needs proof of your identity. A current passport is preferred. If you don't have one, a full birth certificate (not an extract) is accepted.",
      },
      {
        id: 2,
        label: "Medicare card",
        helper:
          "Your Medicare card number links your health records to your Centrelink profile. Make sure it's current and the name matches your other ID.",
      },
      {
        id: 3,
        label: "Tax file number (TFN)",
        helper:
          "Your TFN is required by law for all Centrelink payments. You can find it on a previous tax return or through the ATO's online services.",
      },
      {
        id: 4,
        label: "Bank account details (BSB and account number)",
        helper:
          "Carer Payment is paid into an Australian bank account in your name. Have your BSB and account number ready — you'll find these in your banking app or on a bank statement.",
      },
    ],
  },
  {
    id: "care-receiver",
    title: "About the person you care for",
    description:
      "Centrelink needs to understand the care situation to assess your eligibility.",
    icon: HeartHandshake,
    requiredCount: 2,
    items: [
      {
        id: 5,
        label: "Care receiver's full name and date of birth",
        helper:
          "You'll be asked to provide personal details about the person you care for. Have their full legal name and date of birth ready.",
      },
      {
        id: 6,
        label: "Their Medicare card or DVA card number",
        helper:
          "If the person you care for has a Medicare or DVA card, include the number. This helps Centrelink link their health records to your claim.",
      },
      {
        id: 7,
        label: "Medical evidence of their condition",
        helper:
          "You'll need a completed Treating Health Professional (THP) form from their doctor or specialist. Centrelink will send you the form after you start your claim — you don't need it before you begin, but arranging it early reduces delays. Allow 2–4 weeks for a specialist to complete it.",
      },
    ],
  },
  {
    id: "income-assets",
    title: "Your income and assets",
    description:
      "Carer Payment is means tested. You'll need to declare your income and assets.",
    icon: ReceiptText,
    requiredCount: 2,
    items: [
      {
        id: 8,
        label: "Recent payslips or income statement (last 8 weeks)",
        helper:
          "If you're working up to 25 hours per week while caring, you'll need payslips for the past 8 weeks, or an income statement from your employer. Your myGov account may already have this through the ATO if your employer uses Single Touch Payroll.",
      },
      {
        id: 9,
        label: "Details of any other income (investments, rental, etc.)",
        helper:
          "Declare all income sources — bank interest, share dividends, rental income, and any other regular payments. You don't need to include the care receiver's income unless they are your partner.",
      },
      {
        id: 10,
        label: "Asset information (savings, property, vehicles)",
        helper:
          `Centrelink applies an assets test. List the approximate value of your savings, any property you own (other than your home), and vehicles. Your family home is exempt. The full assets test thresholds are available on the ${BRAND_NAME} website.`,
      },
    ],
  },
  {
    id: "caring-arrangement",
    title: "Your caring arrangement",
    description:
      "You'll need to describe how and when you provide care.",
    icon: CalendarCheck,
    requiredCount: 2,
    items: [
      {
        id: 11,
        label: "Your daily care routine (prepared description)",
        helper:
          "You'll be asked to describe the care you provide in a typical day — what tasks you help with, how long it takes, and whether anyone else shares the care. Writing a brief summary before you start will make this section faster to complete.",
      },
      {
        id: 12,
        label: "Contact details of the person's treating doctor",
        helper:
          "Have the name, phone number, and practice address of the main doctor or specialist treating the person you care for. Centrelink may contact them to verify the medical evidence.",
      },
    ],
  },
] as const;

/** Number of sections — the unit the progress bar now tracks. */
export const SECTION_TOTAL = carerChecklist.length;

/** Items ticked within a group, given the page's checked-state map. */
export function countCheckedInGroup(
  group: ChecklistGroupConfig,
  checked: Record<number, boolean>,
): number {
  return group.items.filter((item) => checked[item.id]).length;
}

/**
 * A section is ready once at least `requiredCount` of its items are
 * ticked. Single source of truth shared by the group card and the page
 * so their notions of "done" never drift apart.
 */
export function isGroupReady(
  group: ChecklistGroupConfig,
  checked: Record<number, boolean>,
): boolean {
  return countCheckedInGroup(group, checked) >= group.requiredCount;
}
