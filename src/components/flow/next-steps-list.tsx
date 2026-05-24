import type { ReactNode } from "react";

interface Step {
  title: string;
  description: ReactNode;
}

interface NextStepsListProps {
  steps: Step[];
}

export function NextStepsList({ steps }: NextStepsListProps) {
  return (
    <ol className="next-steps">
      {steps.map((step, idx) => (
        <li key={`${idx}-${step.title}`} className="next-steps__item">
          <span className="next-steps__number" aria-hidden="true">
            {idx + 1}
          </span>
          <div className="next-steps__body">
            <p className="next-steps__title">{step.title}</p>
            <p className="next-steps__description">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
