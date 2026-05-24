import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          href="/"
          className="site-header__wordmark"
          aria-label="Services Australia — home"
        >
          {/* The Australian Government logo (Commonwealth Coat of Arms +
              "Australian Government"). The parent <a> aria-label conveys the
              accessible name of the link; this image is decorative within it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/australian-government-stacked.svg"
            alt=""
            aria-hidden="true"
            width={130}
            height={67}
            className="site-header__logo"
          />
          <span className="site-header__divider" aria-hidden="true" />
          <span className="site-header__brand">Services Australia</span>
        </Link>

        <div
          role="search"
          className="site-header__search"
          aria-label="Search Services Australia (non-functional in prototype)"
        >
          <label htmlFor="site-search" className="sr-only">
            Search
          </label>
          <input
            id="site-search"
            type="search"
            placeholder="Search"
            autoComplete="off"
            className="site-header__search-input"
          />
          <button
            type="button"
            className="site-header__search-button"
            aria-label="Search"
          >
            <SearchIcon />
          </button>
        </div>

        <button
          type="button"
          className="site-header__menu"
          aria-label="Menu"
          aria-expanded="false"
        >
          <MenuIcon />
        </button>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
