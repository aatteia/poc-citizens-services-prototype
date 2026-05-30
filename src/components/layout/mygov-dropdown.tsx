"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * myGov sign-in dropdown, matching the government header pattern.
 *
 * Anatomy (top → bottom):
 *   [header]   myGov logo  |  "Individuals" heading + description
 *   [item]     PRODA       |  description
 *   [item]     Centrelink Business Online
 *   [item]     Child Support Business Online
 *
 * Non-functional in this prototype — all hrefs are "#".
 * ARIA: button with aria-haspopup / aria-expanded; panel is role="menu".
 */

const portals = [
  {
    id: "proda",
    label: "PRODA",
    description:
      "Log in to access HPOS, Business Hub, Aged Care Provider Portal and a range of other government online services.",
    href: "#",
  },
  {
    id: "centrelink",
    label: "Centrelink Business Online",
    description: null,
    href: "#",
  },
  {
    id: "child-support",
    label: "Child Support Business Online",
    description: null,
    href: "#",
  },
] as const;

export function MyGovDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div ref={containerRef} className="mygov-dropdown">
      <button
        type="button"
        className="site-header__mygov"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="mygov-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="site-header__mygov-logo" aria-hidden="true">
          my<em>Gov</em>
        </span>
        <span>Individuals</span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`mygov-dropdown__chevron${open ? " mygov-dropdown__chevron--open" : ""}`}
        />
      </button>

      {open && (
        <div
          id="mygov-menu"
          className="mygov-dropdown__panel"
          role="menu"
          aria-label="myGov sign-in options"
        >
          {/* Top: myGov Individuals summary */}
          <div className="mygov-dropdown__header" role="none">
            <div className="mygov-dropdown__badge" aria-hidden="true">
              <span className="mygov-dropdown__badge-my">my</span>
              <span className="mygov-dropdown__badge-gov">Gov</span>
            </div>
            <div className="mygov-dropdown__header-text">
              <p className="mygov-dropdown__header-title">Individuals</p>
              <p className="mygov-dropdown__header-desc">
                myGov is a simple and secure way to access online government
                services.
              </p>
            </div>
          </div>

          {/* Portal links */}
          <ul className="mygov-dropdown__list" role="none">
            {portals.map((portal) => (
              <li key={portal.id} role="none">
                <a
                  href={portal.href}
                  className="mygov-dropdown__item"
                  role="menuitem"
                >
                  <span className="mygov-dropdown__item-label">
                    {portal.label}
                  </span>
                  {portal.description && (
                    <span className="mygov-dropdown__item-desc">
                      {portal.description}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
