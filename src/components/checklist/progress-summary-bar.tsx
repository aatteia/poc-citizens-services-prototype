/**
 * Progress summary bar. Lives inside a sticky wrapper on the prepare page
 * so it stays visible below the site header as the user scrolls. The bar
 * itself is layout-agnostic — it can be dropped into any container.
 *
 * Accessibility: role="status" + aria-live="polite" so screen readers
 * announce updates without interrupting whatever the user is doing.
 */
interface ProgressSummaryBarProps {
  completed: number;
  total: number;
  /** Noun for what's being counted, e.g. "items" or "sections". */
  unit?: string;
}

export function ProgressSummaryBar({
  completed,
  total,
  unit = "items",
}: ProgressSummaryBarProps) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="progress-summary"
    >
      <p className="progress-summary__label">
        <span className="progress-summary__count">
          {completed} of {total}
        </span>{" "}
        {unit} ready
      </p>
      <div
        className="progress-summary__track"
        aria-hidden="true"
      >
        <div
          className="progress-summary__fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
