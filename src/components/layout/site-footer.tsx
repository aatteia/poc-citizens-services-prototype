import Link from "next/link";
import { Globe } from "lucide-react";

import { BRAND_NAME } from "@/lib/brand";

/**
 * Footer chrome (2026 gov redesign pattern):
 *   - 5 link columns (brand, Contact, Businesses, Community groups,
 *     Health professionals)
 *   - Languages chip + social-follow icons row
 *   - Meta links (Privacy, Site notices, Accessibility, Access to
 *     information, Accessing our services, plus the prototype's Design
 *     System page link)
 *   - Acknowledgement of Country with a second coat-of-arms + wordmark
 *   - A loud "Prototype only" disclaimer so the footer never reads as
 *     an impersonation of an official government surface
 */

const linkColumns: Array<{
  heading: string;
  links: Array<{ label: string; href: string }>;
}> = [
  {
    heading: BRAND_NAME,
    links: [
      { label: "About us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Forms", href: "#" },
      { label: "Scams", href: "#" },
      { label: "Media", href: "#" },
      { label: "Our Minister", href: "#" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: "Contact us", href: "#" },
      { label: "Find us", href: "#" },
      { label: "Complaints and feedback", href: "#" },
    ],
  },
  {
    heading: "Businesses",
    links: [
      { label: "PRODA", href: "#" },
      { label: "Business Hub", href: "#" },
      { label: "Paid Parental Leave scheme for employers", href: "#" },
    ],
  },
  {
    heading: "Community groups",
    links: [
      { label: "Community resources and help", href: "#" },
      { label: "Providing voluntary work opportunities", href: "#" },
      { label: "Family organisations", href: "#" },
    ],
  },
  {
    heading: "Health professionals",
    links: [
      { label: "Patient care", href: "#" },
      { label: "Payments and claims", href: "#" },
      { label: "Practice administration", href: "#" },
      { label: "Individual practitioners", href: "#" },
      { label: "Resources for health professionals", href: "#" },
    ],
  },
];

const metaLinks: Array<{ label: string; href: string; internal?: boolean }> = [
  { label: "Privacy", href: "#" },
  { label: "Site notices", href: "#" },
  { label: "Accessibility", href: "#" },
  { label: "Access to information", href: "#" },
  { label: "Accessing our services", href: "#" },
  { label: "Design system", href: "/components", internal: true },
];

/* Lucide v1 dropped brand icons (trademarks), so render the four marks
   inline. All are 24×24 viewBox to match Lucide sizing. */
const socials = [
  { label: "Facebook", Icon: FacebookLogo },
  { label: "Instagram", Icon: InstagramLogo },
  { label: "X", Icon: XLogo },
  { label: "YouTube", Icon: YouTubeLogo },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        {/* ===== 5-column link grid ===== */}
        <div className="site-footer__grid">
          {linkColumns.map((group) => (
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

        {/* ===== Languages + social follow row ===== */}
        <div className="site-footer__social-row">
          <div className="site-footer__languages">
            <h2 className="site-footer__heading">Languages</h2>
            <a href="#" className="site-footer__lang-chip">
              <Globe size={16} aria-hidden="true" />
              <span>Tiếng Việt</span>
            </a>
          </div>
          <div className="site-footer__follow">
            <h2 className="site-footer__heading">Follow us</h2>
            <ul className="site-footer__social-list">
              {socials.map(({ label, Icon }) => (
                <li key={label}>
                  <a
                    href="#"
                    aria-label={`Follow ${BRAND_NAME} on ${label}`}
                    className="site-footer__social-link"
                  >
                    <Icon size={20} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="site-footer__divider" />

        {/* ===== Meta links + ABN + prototype disclaimer ===== */}
        <div className="site-footer__meta">
          <ul className="site-footer__meta-links">
            {metaLinks.map((link) =>
              link.internal ? (
                <li key={link.label}>
                  <Link href={link.href} className="site-footer__link">
                    {link.label}
                  </Link>
                </li>
              ) : (
                <li key={link.label}>
                  <a href={link.href} className="site-footer__link">
                    {link.label}
                  </a>
                </li>
              ),
            )}
          </ul>
          <p className="site-footer__abn">ABN — 00 000 000 000</p>
          <p className="site-footer__prototype" role="note">
            Prototype only — not a real government service.
          </p>
        </div>

        <hr className="site-footer__divider" />

        {/* ===== Acknowledgement of Country (second coat-of-arms) ===== */}
        <div className="site-footer__acknowledgement">
          <Link
            href="/"
            className="site-footer__ack-brand"
            aria-label={`${BRAND_NAME} — home`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/australian-government-stacked-white.svg"
              alt=""
              aria-hidden="true"
              width={120}
              height={62}
              className="site-footer__ack-logo"
            />
            <span className="site-footer__ack-wordmark">{BRAND_NAME}</span>
          </Link>
          <p className="site-footer__ack-text">
            {BRAND_NAME} acknowledges the Traditional Custodians of the
            lands we live on. We pay our respects to all Elders, past and
            present, of all Aboriginal and Torres Strait Islander nations.
          </p>
        </div>

        <p className="site-footer__copyright">
          © Commonwealth of Australia
        </p>
      </div>
    </footer>
  );
}

function XLogo({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M17.53 3H20.5l-6.49 7.41L21.75 21h-6l-4.7-6.15L5.7 21H2.73l6.94-7.93L1.93 3h6.16l4.25 5.62L17.53 3Zm-1.05 16.2h1.65L7.62 4.7H5.85l10.63 14.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FacebookLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function InstagramLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M23.5 6.5a3 3 0 0 0-2.11-2.12C19.5 4 12 4 12 4s-7.5 0-9.39.38A3 3 0 0 0 .5 6.5 31.4 31.4 0 0 0 .12 12a31.4 31.4 0 0 0 .38 5.5 3 3 0 0 0 2.11 2.12C4.5 20 12 20 12 20s7.5 0 9.39-.38a3 3 0 0 0 2.11-2.12 31.4 31.4 0 0 0 .38-5.5 31.4 31.4 0 0 0-.38-5.5ZM9.75 15.5v-7L15.5 12l-5.75 3.5Z" />
    </svg>
  );
}
