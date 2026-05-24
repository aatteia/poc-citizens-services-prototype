"use client";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsiblePanel,
} from "@/components/ui/collapsible";

export interface AnswerEntry {
  step: number;
  question: string;
  answer: string;
}

interface AnswerSummaryProps {
  entries: AnswerEntry[];
}

export function AnswerSummary({ entries }: AnswerSummaryProps) {
  return (
    <Collapsible defaultOpen={false} className="answer-summary">
      <CollapsibleTrigger className="answer-summary__trigger">
        <span>Show your answers</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <dl className="answer-summary__list">
          {entries.map((entry) => (
            <div key={entry.step} className="answer-summary__item">
              <dt className="answer-summary__question">
                <span className="answer-summary__step">Step {entry.step}</span>
                {entry.question}
              </dt>
              <dd className="answer-summary__answer">{entry.answer}</dd>
            </div>
          ))}
        </dl>
      </CollapsiblePanel>
    </Collapsible>
  );
}
