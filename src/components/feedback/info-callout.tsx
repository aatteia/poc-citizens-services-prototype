import type { ReactNode } from "react";

interface InfoCalloutProps {
  children: ReactNode;
}

/**
 * Inline tinted box. Used for the Q4 "I'm not sure" message. role="status"
 * is fine here — it's supplementary information, not an alert.
 */
export function InfoCallout({ children }: InfoCalloutProps) {
  return (
    <div className="info-callout" role="status">
      <span className="info-callout__icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" fill="currentColor" />
          <path
            d="M10 9v5M10 6.5v.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <div className="info-callout__body">{children}</div>
    </div>
  );
}
