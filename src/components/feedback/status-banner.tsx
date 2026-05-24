import type { ReactNode } from "react";

type Variant = "eligible" | "ineligible" | "info" | "warning";

interface StatusBannerProps {
  variant: Variant;
  title: string;
  children?: ReactNode;
}

/**
 * StatusBanner — full-width tinted banner with a 4px left accent border.
 * Eligible/info use role="status" (polite). Ineligible/warning use role="alert"
 * (assertive) so screen readers announce the result immediately.
 */
export function StatusBanner({ variant, title, children }: StatusBannerProps) {
  const role =
    variant === "ineligible" || variant === "warning" ? "alert" : "status";

  return (
    <div className={`banner banner--${variant}`} role={role}>
      <span className="banner__icon" aria-hidden="true">
        <IconFor variant={variant} />
      </span>
      <div className="banner__body">
        <p className="banner__title">{title}</p>
        {children && <div className="banner__content">{children}</div>}
      </div>
    </div>
  );
}

function IconFor({ variant }: { variant: Variant }) {
  if (variant === "eligible") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <path
          d="M7 12.5l3 3 7-7"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (variant === "ineligible" || variant === "warning") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l11 19H1L12 2z" fill="currentColor" />
        <path d="M12 9v5M12 16.5v.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M12 11v6M12 7.5v.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
