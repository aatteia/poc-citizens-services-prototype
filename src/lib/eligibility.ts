import type { QuestionId } from "./questions";

/**
 * Eligibility logic — pure function over the recorded answers.
 *
 * Branch table (matches the brief, USER JOURNEYS section):
 *
 *   Q2 = "no"                                  → ineligible  reason="residency"
 *   Q1 = "single" AND Q3 ∈ {"8-13","14-plus"}  → ineligible  reason="child-age"
 *   Q4 = "no"                                  → ineligible  reason="income"
 *   otherwise (Q1–Q4 answered, anything else)  → eligible
 *   any of Q1–Q4 unanswered                    → null  (flow incomplete)
 *
 * Q5 and Q6 are informational and never change the outcome.
 */

export type Answers = Partial<Record<QuestionId, string>>;

export type IneligibilityReason = "residency" | "child-age" | "income";

export type EligibilityResult =
  | { outcome: "eligible" }
  | { outcome: "ineligible"; reason: IneligibilityReason };

/**
 * Returns the result of the eligibility check, or `null` if the answer set
 * does not yet contain enough information to decide (Q1–Q4 must be answered
 * for any conclusion to be drawn; Q5–Q6 are not required to reach a result
 * because they don't affect the outcome).
 *
 * The function is pure — no I/O, no side effects — so it can be exercised
 * directly by the smoke script at bin/test-eligibility.ts.
 */
export function evaluate(answers: Answers): EligibilityResult | null {
  // Residency exit can fire as soon as Q2 is answered "no", even before
  // later steps are seen. This matches the brief: Q2 "No" exits to ineligible.
  if (answers.q2 === "no") {
    return { outcome: "ineligible", reason: "residency" };
  }

  // Child-age exit needs both Q1 and Q3 — single + child 8+
  if (
    answers.q1 === "single" &&
    (answers.q3 === "8-13" || answers.q3 === "14-plus")
  ) {
    return { outcome: "ineligible", reason: "child-age" };
  }

  // Income exit can fire as soon as Q4 = "no"
  if (answers.q4 === "no") {
    return { outcome: "ineligible", reason: "income" };
  }

  // To declare eligibility, Q1–Q4 all need to have a value.
  // Q5 and Q6 are informational and do not gate the conclusion.
  if (answers.q1 && answers.q2 && answers.q3 && answers.q4) {
    return { outcome: "eligible" };
  }

  return null;
}
