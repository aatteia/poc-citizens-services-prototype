import Link from "next/link";

import { Breadcrumb } from "@/components/nav/breadcrumb";
import { SideRail } from "@/components/nav/side-rail";
import { FactBox, FactBoxItem, FactBoxList } from "@/components/content/fact-box";
import { PageMeta } from "@/components/content/page-meta";
import { PageRating } from "@/components/feedback/page-rating";
import { buttonVariants } from "@/components/ui/button";
import { carerPayments } from "@/lib/nav-data";
import { BRAND_NAME } from "@/lib/brand";

const sections = [
  { id: "who", label: "Who can get it" },
  { id: "how-much", label: "How much you'll get" },
  { id: "how-to-claim", label: "How to claim" },
  { id: "manage", label: "Manage your payment" },
] as const;

export default function CarerOverviewPage() {
  return (
    <div className="page">
      <div className="page__grid">
        <SideRail
          parentLabel="Carers"
          parentHref="#"
          items={carerPayments}
          ariaLabel="Carer payments and services"
        />

        <div className="page__main">
          <div className="page__breadcrumb">
            <Breadcrumb
              items={[
                { label: "Home", href: "#" },
                { label: "Carers", href: "#" },
                { label: "Carer Payment" },
              ]}
            />
          </div>
          <header className="page__hero">
            <p className="page__eyebrow">For carers</p>
            <h1 className="page__title">Carer Payment</h1>
            <p className="page__intro">
              Carer Payment is income support for people who provide constant
              daily care for someone with a severe disability, medical
              condition, or who is frail due to age. Use this short check to
              see if you may be eligible &mdash; it takes about two minutes.
            </p>

            <div className="page__cta-row">
              <Link
                href="/carers/prepare"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                Prepare to claim
              </Link>
              <Link
                href="#"
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                Check if you&rsquo;re eligible
              </Link>
            </div>

            <div className="page__hero-facts">
              <FactBox title="Key facts">
                <FactBoxList>
                  <FactBoxItem
                    label="Fortnightly rate"
                    value="Up to $1,200.90"
                    caption="For a single carer. Partnered carers receive less."
                  />
                  <FactBoxItem
                    label="Income free area"
                    value="$218.00 / fortnight"
                    caption="Payment reduces by 50c per dollar above this."
                  />
                  <FactBoxItem
                    label="Work limit"
                    value="Up to 25 hours per week"
                    caption="Including travel time to and from work."
                  />
                </FactBoxList>
              </FactBox>
            </div>
          </header>

          <section id="who" className="page__section">
            <h2 className="page__section-title">Who can get it</h2>
            <p>
              You can get Carer Payment if you provide constant care for an
              adult or child with a severe disability, medical condition, or
              who is frail aged. The care you give must be daily and
              significant &mdash; not occasional help.
            </p>
            <p>
              You also need to meet the residency rules and the income and
              assets tests. Only one person caring for the same care receiver
              can get Carer Payment at a time.
            </p>
          </section>

          <section id="how-much" className="page__section">
            <h2 className="page__section-title">How much you&rsquo;ll get</h2>
            <p>
              The maximum fortnightly rate for a single carer is around
              $1,200, including the Pension Supplement. Your actual rate
              depends on your income, your assets, and your partner&rsquo;s
              income if you have one.
            </p>
            <p>
              Use the Payment and Service Finder to estimate your specific
              fortnightly amount once you&rsquo;ve gathered your income
              details.
            </p>
          </section>

          <section id="how-to-claim" className="page__section">
            <h2 className="page__section-title">How to claim</h2>
            <p>
              You claim Carer Payment through your myGov account once
              you&rsquo;ve linked Centrelink. Most claims take around 30
              minutes to complete online, but the medical evidence step can
              take 2&ndash;4 weeks to arrange.
            </p>
            <p>
              Before you start, gather your identification, bank details,
              income information, and details about the person you care for.
              The <Link href="/carers/prepare">Prepare to claim</Link>{" "}
              checklist walks you through everything you&rsquo;ll need.
            </p>
          </section>

          <section id="manage" className="page__section">
            <h2 className="page__section-title">Manage your payment</h2>
            <p>
              Keep your details up to date through myGov so your payment
              stays correct. Tell {BRAND_NAME} within 14 days if your
              income, relationship status, address, or the care situation
              changes &mdash; for example, if the person you care for is
              admitted to hospital for more than 25 hours in a week.
            </p>
          </section>

          <PageRating />
          <PageMeta lastUpdated="24 May 2026" qcReference="QC 60214" />
        </div>

        <aside className="page__sidebar" aria-labelledby="on-this-page">
          <p id="on-this-page" className="page__sidebar-title">
            On this page
          </p>
          <ol className="page__sidebar-list">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="page__sidebar-link">
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
