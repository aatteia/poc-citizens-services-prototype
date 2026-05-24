"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Breadcrumb } from "@/components/nav/breadcrumb";
import { RelatedPaymentCard } from "@/components/content/related-payment-card";
import { PageMeta } from "@/components/content/page-meta";
import { PageRating } from "@/components/feedback/page-rating";
import { StatusBanner } from "@/components/feedback/status-banner";
import { AnswerSummary } from "@/components/flow/answer-summary";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  evaluate,
  type IneligibilityReason,
} from "@/lib/eligibility";
import { useFlow } from "@/lib/flow-context";
import { answerLabel, questions } from "@/lib/questions";

const reasonCopy: Record<IneligibilityReason, string> = {
  residency:
    "Parenting Payment is only available to people who meet the Australian residency rules.",
  "child-age":
    "To get Parenting Payment as a single parent, your youngest child needs to be under 8 years old.",
  income:
    "Your income is above the limit for Parenting Payment. You may still be eligible for other payments.",
};

export default function IneligibleResult() {
  const router = useRouter();
  const { answers, reset } = useFlow();
  const result = useMemo(() => evaluate(answers), [answers]);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (!result || result.outcome !== "ineligible") {
      router.replace("/check/q1");
    }
  }, [result, router]);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (!result || result.outcome !== "ineligible") {
    return null;
  }

  // Only show summary entries for questions the user actually answered
  const summaryEntries = questions
    .filter((q) => answers[q.id])
    .map((q) => ({
      step: q.step,
      question: q.legend,
      answer: answerLabel(q.id, answers[q.id]),
    }));

  function handleStartAgain() {
    reset();
    router.push("/check/q1");
  }

  return (
    <div className="page page--flow">
      <div className="page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
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
          variant="ineligible"
          title="Based on your answers, you may not be eligible for Parenting Payment."
        >
          <p>{reasonCopy[result.reason]}</p>
        </StatusBanner>

        <section className="result__section" aria-labelledby="related-payments">
          <h2 id="related-payments" className="result__section-title">
            Other payments you might check
          </h2>
          <p className="result__lede">
            You may be eligible for one of these payments instead. Each
            payment has its own eligibility rules.
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
        </section>

        {summaryEntries.length > 0 && (
          <section className="result__section" aria-labelledby="your-answers">
            <h2 id="your-answers" className="result__section-title">
              Your answers
            </h2>
            <AnswerSummary entries={summaryEntries} />
          </section>
        )}

        <div className="result__actions">
          <Link
            href="#"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            Check another payment
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
  );
}
