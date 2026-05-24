/**
 * Hand-runnable smoke test for the eligibility branch table.
 *
 * Run with:  npx tsx bin/test-eligibility.ts
 *
 * Exits with code 0 on success and 1 on first failure, printing a row per
 * case to stdout. Replaces a test framework for a single-purpose prototype.
 */

import { evaluate, type Answers, type EligibilityResult } from "../src/lib/eligibility";

interface Case {
  name: string;
  answers: Answers;
  expect: EligibilityResult | null;
}

const cases: Case[] = [
  {
    name: "Eligible — single parent, under-8 child, low income, full flow",
    answers: { q1: "single", q2: "yes", q3: "under-8", q4: "yes", q5: "no", q6: "no" },
    expect: { outcome: "eligible" },
  },
  {
    name: "Eligible — couple, under-8 child, not-sure income, completes",
    answers: { q1: "couple", q2: "yes", q3: "under-8", q4: "not-sure", q5: "yes", q6: "both" },
    expect: { outcome: "eligible" },
  },
  {
    name: "Ineligible — Q2 No (residency) exits early before later questions answered",
    answers: { q1: "single", q2: "no" },
    expect: { outcome: "ineligible", reason: "residency" },
  },
  {
    name: "Ineligible — single parent, child 8-13 (child-age)",
    answers: { q1: "single", q2: "yes", q3: "8-13" },
    expect: { outcome: "ineligible", reason: "child-age" },
  },
  {
    name: "Ineligible — single parent, child 14+ (child-age)",
    answers: { q1: "single", q2: "yes", q3: "14-plus" },
    expect: { outcome: "ineligible", reason: "child-age" },
  },
  {
    name: "Not ineligible by child-age when in a couple (couples don't have the age limit at this stage)",
    answers: { q1: "couple", q2: "yes", q3: "14-plus", q4: "yes" },
    expect: { outcome: "eligible" },
  },
  {
    name: "Ineligible — Q4 No (income)",
    answers: { q1: "single", q2: "yes", q3: "under-8", q4: "no" },
    expect: { outcome: "ineligible", reason: "income" },
  },
  {
    name: "Null — nothing answered",
    answers: {},
    expect: null,
  },
  {
    name: "Null — Q1–Q3 only, Q4 missing",
    answers: { q1: "single", q2: "yes", q3: "under-8" },
    expect: null,
  },
];

function fmt(result: EligibilityResult | null): string {
  if (result === null) return "null";
  if (result.outcome === "eligible") return "eligible";
  return `ineligible:${result.reason}`;
}

let failures = 0;
for (const c of cases) {
  const got = evaluate(c.answers);
  const ok = JSON.stringify(got) === JSON.stringify(c.expect);
  const flag = ok ? "  PASS" : "  FAIL";
  console.log(`${flag}  ${c.name}`);
  if (!ok) {
    console.log(`         expected ${fmt(c.expect)}`);
    console.log(`         got      ${fmt(got)}`);
    failures += 1;
  }
}

console.log(
  `\n${cases.length - failures}/${cases.length} passed${failures ? ` — ${failures} failure(s)` : ""}.`,
);
process.exit(failures === 0 ? 0 : 1);
