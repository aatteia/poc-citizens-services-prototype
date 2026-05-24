interface ProgressIndicatorProps {
  current: number;
  total: number;
  labels?: readonly string[];
}

export function ProgressIndicator({
  current,
  total,
  labels,
}: ProgressIndicatorProps) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav
      aria-label={`Step ${current} of ${total}`}
      className="progress"
      data-current={current}
    >
      <p className="progress__label">
        Step <strong>{current}</strong> of {total}
      </p>
      <ol className="progress__list">
        {steps.map((step) => {
          const status =
            step < current ? "complete" : step === current ? "current" : "upcoming";
          const label = labels?.[step - 1];
          return (
            <li
              key={step}
              className="progress__step"
              data-status={status}
              aria-current={status === "current" ? "step" : undefined}
            >
              <span className="progress__step-bar" aria-hidden="true" />
              {label && (
                <span className="progress__step-label">
                  <span className="sr-only">
                    {status === "complete"
                      ? "Completed: "
                      : status === "current"
                        ? "Current step: "
                        : ""}
                  </span>
                  {label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
