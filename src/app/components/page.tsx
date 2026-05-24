import type { Metadata } from "next";

import { Breadcrumb } from "@/components/nav/breadcrumb";
import {
  FactBox,
  FactBoxItem,
  FactBoxList,
} from "@/components/content/fact-box";
import { RelatedPaymentCard } from "@/components/content/related-payment-card";
import { InfoCallout } from "@/components/feedback/info-callout";
import { InlineError } from "@/components/feedback/inline-error";
import { StatusBanner } from "@/components/feedback/status-banner";
import { ProgressIndicator } from "@/components/flow/progress-indicator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Design system — Parenting Payment prototype",
  description:
    "Reference page showing every component used in the Parenting Payment eligibility prototype.",
};

const stepLabels = [
  "Family situation",
  "Residency",
  "Child's age",
  "Income",
  "Current payments",
  "Work or study",
];

export default function ComponentLibrary() {
  return (
    <div className="page library">
      <div className="page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Design system" },
          ]}
        />
      </div>

      <header className="library__header">
        <p className="page__eyebrow">Reference</p>
        <h1 className="library__title">Design system</h1>
        <p className="library__intro">
          Every component used in the Parenting Payment eligibility prototype.
          Built on Attica Design System tokens with a Services Australia
          colour reskin. ShadCN primitives on @base-ui/react.
        </p>
      </header>

      <Section id="buttons" title="Buttons">
        <p className="library__caption">
          Pill radius (Attica) · SA navy primary · Roboto Bold · letter-spacing
          0.5px. Three hierarchies, three sizes, destructive modifier.
        </p>
        <Grid cols={3}>
          <Tile label="Primary">
            <Button variant="primary">Continue</Button>
          </Tile>
          <Tile label="Secondary">
            <Button variant="secondary">Back</Button>
          </Tile>
          <Tile label="Tertiary">
            <Button variant="tertiary">Cancel</Button>
          </Tile>
          <Tile label="Primary · large">
            <Button variant="primary" size="lg">Apply through myGov</Button>
          </Tile>
          <Tile label="Primary · small">
            <Button variant="primary" size="sm">More info</Button>
          </Tile>
          <Tile label="Destructive">
            <Button variant="destructive">Delete claim</Button>
          </Tile>
          <Tile label="Primary disabled">
            <Button variant="primary" disabled>Continue</Button>
          </Tile>
          <Tile label="Secondary disabled">
            <Button variant="secondary" disabled>Back</Button>
          </Tile>
          <Tile label="Tertiary disabled">
            <Button variant="tertiary" disabled>Cancel</Button>
          </Tile>
        </Grid>
      </Section>

      <Section id="radio-cards" title="Radio cards">
        <p className="library__caption">
          Tile-style radio option with a 48px+ touch target, hover, selected,
          and error states. Implementation in the question flow uses this
          inside a fieldset with a legend.
        </p>
        <Grid cols={2}>
          <Tile label="Unselected">
            <StaticRadioCard label="Single" />
          </Tile>
          <Tile label="Selected">
            <StaticRadioCard label="In a couple" selected />
          </Tile>
          <Tile label="Hover (simulated)" wide>
            <StaticRadioCard label="Under 8 years" hover />
          </Tile>
          <Tile label="Error state" wide>
            <StaticRadioCard label="Yes, I think so" error />
            <div style={{ marginTop: 12 }}>
              <InlineErrorStub />
            </div>
          </Tile>
        </Grid>
      </Section>

      <Section id="progress" title="Progress indicator">
        <p className="library__caption">
          Six-step segmented bar with labels. Completed and current segments
          fill SA navy; upcoming segments remain grey. Mobile collapses to a
          text-only &ldquo;Step X of 6&rdquo;.
        </p>
        <Grid cols={2}>
          <Tile label="Step 1 of 6" wide>
            <ProgressIndicator current={1} total={6} labels={stepLabels} />
          </Tile>
          <Tile label="Step 3 of 6" wide>
            <ProgressIndicator current={3} total={6} labels={stepLabels} />
          </Tile>
          <Tile label="Step 6 of 6" wide>
            <ProgressIndicator current={6} total={6} labels={stepLabels} />
          </Tile>
        </Grid>
      </Section>

      <Section id="banners" title="Status banners">
        <p className="library__caption">
          Eligible and info use <code>role=&ldquo;status&rdquo;</code>;
          ineligible and warning use <code>role=&ldquo;alert&rdquo;</code> so
          assistive tech announces the result immediately. 4px left accent.
        </p>
        <div className="library__stack">
          <StatusBanner
            variant="eligible"
            title="Based on your answers, you may be eligible."
          >
            <p>You can continue and apply through myGov.</p>
          </StatusBanner>
          <StatusBanner
            variant="ineligible"
            title="Based on your answers, you may not be eligible."
          >
            <p>You may still be eligible for other payments.</p>
          </StatusBanner>
          <StatusBanner
            variant="info"
            title="Heads up — this is a prototype."
          >
            <p>None of the buttons submit a real claim.</p>
          </StatusBanner>
          <StatusBanner
            variant="warning"
            title="Information missing from your answer."
          >
            <p>Please pick an option before continuing.</p>
          </StatusBanner>
        </div>
      </Section>

      <Section id="fact-box" title="Fact box">
        <p className="library__caption">
          Light SA-blue tint with a 4px left navy border. Used on the overview
          and on the eligible result page.
        </p>
        <FactBox title="Key facts">
          <FactBoxList>
            <FactBoxItem
              label="Fortnightly rate"
              value="Up to $1,096.10"
              caption="For a single principal carer."
            />
            <FactBoxItem
              label="Income test"
              value="Below $2,536.20 / fortnight"
              caption="Including family assistance."
            />
            <FactBoxItem
              label="Child age limit"
              value="Single carers — under 8"
            />
          </FactBoxList>
        </FactBox>
      </Section>

      <Section id="info-callout" title="Inline info callout">
        <p className="library__caption">
          Appears inline below a radio group on Q4 when the user picks
          &ldquo;I&rsquo;m not sure&rdquo;. <code>role=&ldquo;status&rdquo;</code>.
        </p>
        <InfoCallout>
          <p>
            If you&rsquo;re not sure, use the Payment and Service Finder on the
            Services Australia website to estimate your income before you claim.
          </p>
        </InfoCallout>
      </Section>

      <Section id="inline-error" title="Inline error">
        <p className="library__caption">
          <code>role=&ldquo;alert&rdquo;</code>, addressable by id for
          aria-describedby. Triggered when Continue is pressed without a
          selection.
        </p>
        <InlineErrorStub />
      </Section>

      <Section id="related-cards" title="Related payment cards">
        <p className="library__caption">
          Hover lifts the border to SA navy. Used on the ineligible result
          page.
        </p>
        <div className="result__related">
          <RelatedPaymentCard
            title="JobSeeker Payment"
            description="Financial help if you're between 22 and Age Pension age and looking for work."
            href="#"
          />
          <RelatedPaymentCard
            title="Family Tax Benefit Part A"
            description="A payment to help with the cost of raising children."
            href="#"
          />
          <RelatedPaymentCard
            title="Family Tax Benefit Part B"
            description="Extra help for families with one main income."
            href="#"
          />
        </div>
      </Section>

      <Section id="breadcrumb" title="Breadcrumb">
        <p className="library__caption">
          Action-blue links, mid-grey separators. Last item is
          <code> aria-current=&ldquo;page&rdquo;</code> and not a link.
        </p>
        <Breadcrumb
          items={[
            { label: "Home", href: "#" },
            { label: "Payments and services", href: "#" },
            { label: "Families", href: "#" },
            { label: "Parenting Payment" },
          ]}
        />
      </Section>

      <Section id="skip-link" title="Skip to content link">
        <p className="library__caption">
          The first focusable element in the document. Visually hidden until
          focused, then anchors to <code>#main</code>. Tab into the page
          from this hostname to see it.
        </p>
        <div className="library__skip-preview">
          <span className="skip-link skip-link--preview">
            Skip to main content
          </span>
          <p className="library__caption" style={{ marginTop: 8 }}>
            Always renders as the first focusable element on every page.
          </p>
        </div>
      </Section>
    </div>
  );
}

/* =========================================================================
   Local layout helpers — these only exist on this page.
   ========================================================================= */

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="library__section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="library__section-title">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Grid({
  cols,
  children,
}: {
  cols: 2 | 3;
  children: React.ReactNode;
}) {
  return (
    <div
      className="library__grid"
      data-cols={cols}
    >
      {children}
    </div>
  );
}

function Tile({
  label,
  wide,
  children,
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`library__tile${wide ? " library__tile--wide" : ""}`}>
      <p className="library__tile-label">{label}</p>
      <div className="library__tile-body">{children}</div>
    </div>
  );
}

/* Static rendering of RadioCard states so we can display them without a
   live RadioGroup driving state. The real component lives in
   src/components/ui/radio-card.tsx and is used in the question flow. */
function StaticRadioCard({
  label,
  selected,
  hover,
  error,
}: {
  label: string;
  selected?: boolean;
  hover?: boolean;
  error?: boolean;
}) {
  const classes = [
    "radio-card",
    selected ? "is-selected" : "",
    hover ? "is-hover" : "",
    error ? "is-error" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes}>
      <span
        className="radio-card__input"
        data-checked={selected ? "" : undefined}
      />
      <span className="radio-card__copy">
        <span className="radio-card__label">{label}</span>
      </span>
    </div>
  );
}

function InlineErrorStub() {
  return (
    <InlineError id="library-error">Select an answer to continue.</InlineError>
  );
}
