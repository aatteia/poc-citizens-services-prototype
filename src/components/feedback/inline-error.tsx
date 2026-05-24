import type { ReactNode } from "react";

interface InlineErrorProps {
  id: string;
  children: ReactNode;
}

/**
 * InlineError — referenced via aria-describedby from the form control.
 * role="alert" announces the message when the message first appears.
 */
export function InlineError({ id, children }: InlineErrorProps) {
  return (
    <p id={id} role="alert" tabIndex={-1} className="inline-error">
      <span className="inline-error__icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" fill="currentColor" />
          <path
            d="M10 5.5v5M10 13v.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="inline-error__text">{children}</span>
    </p>
  );
}
