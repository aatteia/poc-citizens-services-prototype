import Link from "next/link";

const linkGroups: Array<{
  heading: string;
  links: Array<{ label: string; href: string }>;
}> = [
  {
    heading: "About",
    links: [
      { label: "About us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "News", href: "#" },
      { label: "Reports and statistics", href: "#" },
    ],
  },
  {
    heading: "Contact us",
    links: [
      { label: "Phone us", href: "#" },
      { label: "Visit us in person", href: "#" },
      { label: "Write to us", href: "#" },
      { label: "Feedback and complaints", href: "#" },
    ],
  },
  {
    heading: "Information in your language",
    links: [
      { label: "Information in your language", href: "#" },
      { label: "Indigenous Australians", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          {linkGroups.map((group) => (
            <nav
              key={group.heading}
              aria-label={group.heading}
              className="site-footer__column"
            >
              <h2 className="site-footer__heading">{group.heading}</h2>
              <ul className="site-footer__list">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="site-footer__link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <hr className="site-footer__divider" />

        <div className="site-footer__meta">
          <p className="site-footer__abn">ABN — 90 794 605 008</p>
          <ul className="site-footer__meta-links">
            <li>
              <a href="#" className="site-footer__link">
                Accessibility
              </a>
            </li>
            <li>
              <a href="#" className="site-footer__link">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="site-footer__link">
                Copyright
              </a>
            </li>
            <li>
              <a href="#" className="site-footer__link">
                Disclaimer
              </a>
            </li>
            <li>
              <Link href="/components" className="site-footer__link">
                Design system
              </Link>
            </li>
          </ul>
          <p className="site-footer__copyright">
            © Commonwealth of Australia — Prototype only. Not an official Services Australia service.
          </p>
        </div>
      </div>
    </footer>
  );
}
