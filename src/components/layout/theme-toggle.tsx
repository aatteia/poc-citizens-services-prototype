"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Light / dark theme toggle styled to match the servicesaustralia.gov.au
 * pill control in the cyan header band. Persists the choice in localStorage
 * under "sa-theme" and reflects it via the `dark` class on <html>.
 *
 * The pre-paint script in layout.tsx is responsible for setting the class
 * before the first render to avoid a flash; this component just reads and
 * writes the current state.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Read the initial value the pre-paint script applied so the active half
  // of the pill matches what the user already sees. SSR can't see the DOM
  // and the pre-paint script runs before hydration, so this *must* be a
  // post-mount sync rather than a lazy useState initialiser — otherwise we
  // get a hydration mismatch on first paint. The lint rule that warns
  // against setState-in-effect is overly strict for this DOM-sync case.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
  }, []);

  function setMode(next: "light" | "dark") {
    setTheme(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    try {
      window.localStorage.setItem("sa-theme", next);
    } catch {
      /* localStorage may be unavailable (e.g. private-mode quotas) — silent */
    }
  }

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="theme-toggle"
    >
      <button
        type="button"
        className="theme-toggle__half"
        data-active={theme === "light"}
        aria-pressed={theme === "light"}
        onClick={() => setMode("light")}
      >
        <Sun size={14} aria-hidden="true" />
        <span>Light</span>
      </button>
      <button
        type="button"
        className="theme-toggle__half"
        data-active={theme === "dark"}
        aria-pressed={theme === "dark"}
        onClick={() => setMode("dark")}
      >
        <Moon size={14} aria-hidden="true" />
        <span>Dark</span>
      </button>
    </div>
  );
}
