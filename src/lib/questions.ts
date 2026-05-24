/**
 * The six questions in the Parenting Payment eligibility check.
 * Copy is the single source of truth — also referenced by the answer summary.
 */

export type QuestionId = "q1" | "q2" | "q3" | "q4" | "q5" | "q6";

export interface QuestionOption {
  value: string;
  label: string;
  /** Optional inline callout that appears below the radio group when this option is selected. */
  callout?: string;
}

export interface Question {
  id: QuestionId;
  step: 1 | 2 | 3 | 4 | 5 | 6;
  /** Short label shown in the progress bar and the answer summary. */
  shortLabel: string;
  /** The question itself — used as the <legend> of the form fieldset. */
  legend: string;
  /** Optional helper text shown immediately under the legend. */
  helperText?: string;
  options: readonly QuestionOption[];
}

export const questions: readonly Question[] = [
  {
    id: "q1",
    step: 1,
    shortLabel: "Family situation",
    legend: "Are you single or in a couple?",
    options: [
      { value: "single", label: "Single" },
      { value: "couple", label: "In a couple" },
    ],
  },
  {
    id: "q2",
    step: 2,
    shortLabel: "Residency",
    legend: "Are you an Australian resident?",
    helperText:
      "To get Parenting Payment you need to be an Australian resident and physically in Australia on the day you claim.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "q3",
    step: 3,
    shortLabel: "Child's age",
    legend: "How old is your youngest child?",
    options: [
      { value: "under-8", label: "Under 8 years" },
      { value: "8-13", label: "8 to 13 years" },
      { value: "14-plus", label: "14 years or older" },
    ],
  },
  {
    id: "q4",
    step: 4,
    shortLabel: "Income",
    legend: "Is your income below the limit?",
    helperText:
      "Parenting Payment uses an income test. For a single parent, your fortnightly income generally needs to be under $2,536.20 per fortnight, including family assistance.",
    options: [
      { value: "yes", label: "Yes, I think so" },
      { value: "no", label: "No" },
      {
        value: "not-sure",
        label: "I'm not sure",
        callout:
          "If you're not sure, use the Payment and Service Finder on the Services Australia website to estimate your income before you claim.",
      },
    ],
  },
  {
    id: "q5",
    step: 5,
    shortLabel: "Current payments",
    legend: "Are you currently receiving a Services Australia payment?",
    helperText:
      "This includes payments such as JobSeeker, Family Tax Benefit, Carer Payment, or Age Pension.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
  {
    id: "q6",
    step: 6,
    shortLabel: "Work or study",
    legend: "Are you working or studying?",
    helperText:
      "Work and study don't affect your eligibility, but they may affect how much you can get.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "both", label: "Both" },
    ],
  },
];

export const questionsById: Readonly<Record<QuestionId, Question>> =
  Object.freeze(
    questions.reduce(
      (acc, q) => {
        acc[q.id] = q;
        return acc;
      },
      {} as Record<QuestionId, Question>,
    ),
  );

/** Look up the human label for an answer value. */
export function answerLabel(
  questionId: QuestionId,
  value: string | undefined,
): string {
  if (!value) return "Not answered";
  const opt = questionsById[questionId].options.find((o) => o.value === value);
  return opt?.label ?? value;
}
