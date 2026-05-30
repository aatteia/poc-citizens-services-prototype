"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Breadcrumb } from "@/components/nav/breadcrumb";
import { SideRail } from "@/components/nav/side-rail";
import { FactBox, FactBoxItem, FactBoxList } from "@/components/content/fact-box";
import { PageMeta } from "@/components/content/page-meta";
import { PageRating } from "@/components/feedback/page-rating";
import { StatusBanner } from "@/components/feedback/status-banner";
import { BRAND_NAME } from "@/lib/brand";
import { AnswerSummary } from "@/components/flow/answer-summary";
import { NextStepsList } from "@/components/flow/next-steps-list";
import { Button, buttonVariants } from "@/components/ui/button";
import { evaluate } from "@/lib/eligibility";
import { useFlow } from "@/lib/flow-context";
import { familyPayments } from "@/lib/nav-data";
import { answerLabel, questions } from "@/lib/questions";

const sections = [
  { id: "payment-range", label: "Estimated payment" },
  { id: "next-steps",    label: "What to do next" },
  { id: "your-answers",  label: "Your answers" },
] as const;

export default function EligibleResult() {
  const router = useRouter();
  const { answers, reset } = useFlow();
  const result = useMemo(() => evaluate(answers), [answers]);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  // Redirect guard: if state is incomplete or doesn't actually evaluate to
  // eligible (refresh, deep-link, etc.), bounce back to the start.
  useEffect(() => {
    if (!result || result.outcome !== "eligible") {
      router.replace("/check/q1");
    }
  }, [result, router]);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (!result || result.outcome !== "eligible") {
    return null;
  }

  const summaryEntries = questions.map((q) => ({
    step: q.step,
    question: q.legend,
    answer: answerLabel(q.id, answers[q.id]),
  }));

  function handleStartAgain() {
    reset();
    router.push("/check/q1");
  }

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
                { label: "Home", href: "/" },
                { label: "Families", href: "/" },
                { label: "Parenting Payment", href: "/" },
                { label: "Your result" },
              ]}
            />
          </div>

          <div className="result">
            <h1 ref={headingRef} tabIndex={-1} className="result__heading">
              Your result
            </h1>

            <StatusBanner
              variant="eligible"
              title="Based on your answers, you may be eligible for Parenting Payment."
            >
              <p>
                This isn&rsquo;t a guarantee — {BRAND_NAME} will check the
                full details when you claim through myGov.
              </p>
            </StatusBanner>

            <section className="result__section" aria-labelledby="payment-range">
              <h2 id="payment-range" className="result__section-title">
                Estimated payment
              </h2>
              <FactBox>
                <FactBoxList>
                  <FactBoxItem
                    label="Estimated fortnightly payment"
                    value="Up to $1,096.10"
                    caption="The actual amount depends on your income and family circumstances. You can estimate it more accurately with the Payment and Service Finder."
                  />
                </FactBoxList>
              </FactBox>
            </section>

            <section className="result__section" aria-labelledby="next-steps">
              <h2 id="next-steps" className="result__section-title">
                What to do next
              </h2>
              <NextStepsList
                steps={[
                  {
                    title: "Create or sign in to myGov",
                    description:
                      "If you don't already have a myGov account, set one up at my.gov.au.",
                  },
                  {
                    title: "Link Centrelink to your myGov",
                    description:
                      "You'll need your Customer Reference Number or other identification.",
                  },
                  {
                    title: "Submit your claim online",
                    description:
                      "Most online claims take around 20 minutes. Have your income, partner, and bank details ready.",
                  },
                ]}
              />
            </section>

            <section className="result__section" aria-labelledby="your-answers">
              <h2 id="your-answers" className="result__section-title">
                Your answers
              </h2>
              <AnswerSummary entries={summaryEntries} />
            </section>

            <div className="result__actions">
              <Link
                href="#"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                Apply through myGov
              </Link>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleStartAgain}
              >
                Start again
              </Button>
            </div>

            <PageRating />
            <PageMeta lastUpdated="24 May 2026" qcReference="QC 60243" />
          </div>
        </div>

        <aside className="page__sidebar" aria-labelledby="on-this-page-eligible">
          <p id="on-this-page-eligible" className="page__sidebar-title">
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
