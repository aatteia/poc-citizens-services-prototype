import Link from "next/link";

import { Breadcrumb } from "@/components/nav/breadcrumb";
import { SideRail } from "@/components/nav/side-rail";
import { FactBox, FactBoxItem, FactBoxList } from "@/components/content/fact-box";
import { PageMeta } from "@/components/content/page-meta";
import { PageRating } from "@/components/feedback/page-rating";
import { buttonVariants } from "@/components/ui/button";
import { familyPayments } from "@/lib/nav-data";

const sections = [
  { id: "who", label: "Who can get it" },
  { id: "how-much", label: "How much you'll get" },
  { id: "how-to-claim", label: "How to claim" },
  { id: "manage", label: "Manage your payment" },
] as const;

export default function OverviewPage() {
  return (
    <div className="page">
      <div className="page__grid">
        <SideRail
          parentLabel="Families"
          parentHref="#"
          items={familyPayments}
          ariaLabel="Family payments"
        />

        <div className="page__main">
          <div className="page__breadcrumb">
            <Breadcrumb
              items={[
                { label: "Home", href: "#" },
                { label: "Families", href: "#" },
                { label: "Parenting Payment" },
              ]}
            />
          </div>
          <header className="page__hero">
            <p className="page__eyebrow">For families</p>
            <h1 className="page__title">Parenting Payment</h1>
            <p className="page__intro">
              Parenting Payment is income support for the main carer of a young
              child. Use this short check to see if you may be eligible — it
              takes about two minutes and your answers aren&rsquo;t saved.
            </p>

            <div className="page__cta-row">
              <Link
                href="/check/q1"
                className={buttonVariants({ variant: "primary", size: "lg" })}
                aria-describedby="cta-helper"
              >
                Check if you&rsquo;re eligible
              </Link>
              <p id="cta-helper" className="page__cta-helper">
                Anonymous · No sign-in required
              </p>
            </div>

            <div className="page__hero-facts">
              <FactBox title="Key facts">
                <FactBoxList>
                  <FactBoxItem
                    label="Fortnightly rate"
                    value="Up to $1,096.10"
                    caption="For a single principal carer. Couples receive less."
                  />
                  <FactBoxItem
                    label="Income test"
                    value="Below $2,536.20 / fortnight"
                    caption="Singles, including family assistance. Couples and partnered amounts differ."
                  />
                  <FactBoxItem
                    label="Child age limit"
                    value="Single carers — under 8"
                    caption="Partnered carers — under 6."
                  />
                </FactBoxList>
              </FactBox>
            </div>
          </header>

          <section id="who" className="page__section">
            <h2 className="page__section-title">Who can get it</h2>
            <p>
              You can get Parenting Payment if you&rsquo;re the principal carer
              of a child under the age limit, you meet the residency rules, and
              your income and assets are under the relevant limits. Only one
              parent or carer in a couple can get it.
            </p>
            <p>
              You also need to be in Australia on the day you submit your
              claim, and you need to meet mutual obligation requirements such
              as a job plan once your youngest child turns 6.
            </p>
          </section>

          <section id="how-much" className="page__section">
            <h2 className="page__section-title">How much you&rsquo;ll get</h2>
            <p>
              The amount you get depends on your family situation, your income,
              and your partner&rsquo;s income if you have one. The maximum for
              a single principal carer is around $1,096 per fortnight,
              including the Pension Supplement.
            </p>
            <p>
              Use the eligibility check above to see whether you may qualify,
              then use the Payment and Service Finder to estimate your specific
              fortnightly amount.
            </p>
          </section>

          <section id="how-to-claim" className="page__section">
            <h2 className="page__section-title">How to claim</h2>
            <p>
              You claim Parenting Payment through your myGov account once
              you&rsquo;ve linked Centrelink. Most claims take around 20
              minutes to complete online. Before you start, gather your
              identification, bank details, and information about your income
              and your partner&rsquo;s income.
            </p>
            <p>
              If you can&rsquo;t claim online, you can also claim in person at
              a service centre or by calling the Families line.
            </p>
          </section>

          <section id="manage" className="page__section">
            <h2 className="page__section-title">Manage your payment</h2>
            <p>
              Keep your details up to date through myGov so your payment stays
              correct. Tell Services Australia within 14 days if your income,
              relationship status, address, or your child&rsquo;s circumstances
              change.
            </p>
          </section>

          <PageRating />
          <PageMeta lastUpdated="24 May 2026" qcReference="QC 60243" />
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
