"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Breadcrumb } from "@/components/nav/breadcrumb";
import { InfoCallout } from "@/components/feedback/info-callout";
import { InlineError } from "@/components/feedback/inline-error";
import { ProgressIndicator } from "@/components/flow/progress-indicator";
import { Button, buttonVariants } from "@/components/ui/button";
import { RadioCard } from "@/components/ui/radio-card";
import { RadioGroup } from "@/components/ui/radio-group";
import { evaluate } from "@/lib/eligibility";
import { useFlow } from "@/lib/flow-context";
import { questions } from "@/lib/questions";

interface QuestionPageProps {
  step: 1 | 2 | 3 | 4 | 5 | 6;
}

export function QuestionPage({ step }: QuestionPageProps) {
  const router = useRouter();
  const { answers, setAnswer } = useFlow();

  const question = useMemo(
    () => questions.find((q) => q.step === step)!,
    [step],
  );

  const stepLabels = useMemo(() => questions.map((q) => q.shortLabel), []);
  const errorId = useId();

  const [selected, setSelected] = useState<string>(
    () => answers[question.id] ?? "",
  );
  const [showError, setShowError] = useState(false);

  // Focus the H1 on mount so screen readers announce the new screen and
  // keyboard users land at the top of content. Skip-link is still the
  // first body focusable, so this happens after navigation, not before it.
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // Reset local state if the user navigates back into the same step
  useEffect(() => {
    setSelected(answers[question.id] ?? "");
    setShowError(false);
  }, [answers, question.id]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) {
      setShowError(true);
      // Move focus to the inline error region
      requestAnimationFrame(() => {
        document.getElementById(errorId)?.focus();
      });
      return;
    }

    // Commit to context, then evaluate the updated answer set
    setAnswer(question.id, selected);
    const next = { ...answers, [question.id]: selected };
    const result = evaluate(next);

    if (result?.outcome === "ineligible") {
      router.push("/check/result/ineligible");
      return;
    }
    if (step === 6) {
      router.push("/check/result/eligible");
      return;
    }
    router.push(`/check/q${step + 1}`);
  }

  const selectedOption = question.options.find((o) => o.value === selected);
  const calloutText = selectedOption?.callout;

  const backHref = step === 1 ? "/" : `/check/q${step - 1}`;
  const backLabel = step === 1 ? "Back to overview" : "Back";

  return (
    <div className="page page--flow">
      <div className="page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Families", href: "#" },
            { label: "Parenting Payment", href: "/" },
            { label: "Check if you're eligible" },
          ]}
        />
      </div>

      <div className="flow">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="flow__heading"
        >
          Check if you&rsquo;re eligible
        </h1>

        <ProgressIndicator current={step} total={6} labels={stepLabels} />

        <form
          onSubmit={handleSubmit}
          noValidate
          aria-describedby={showError ? errorId : undefined}
          className="flow__form"
        >
          <fieldset
            className="flow__fieldset"
            aria-invalid={showError ? true : undefined}
            aria-describedby={showError ? errorId : undefined}
          >
            <legend className="flow__legend">{question.legend}</legend>
            {question.helperText && (
              <p className="flow__helper">{question.helperText}</p>
            )}

            <RadioGroup
              value={selected}
              onValueChange={(v) => {
                const value = typeof v === "string" ? v : String(v ?? "");
                setSelected(value);
                if (showError) setShowError(false);
              }}
              className="flow__options"
            >
              {question.options.map((opt) => (
                <RadioCard
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                />
              ))}
            </RadioGroup>

            {calloutText && (
              <div className="flow__callout">
                <InfoCallout>
                  <p>{calloutText}</p>
                </InfoCallout>
              </div>
            )}

            {showError && (
              <InlineError id={errorId}>
                Select an answer to continue.
              </InlineError>
            )}
          </fieldset>

          <div className="flow__actions">
            <Link
              href={backHref}
              className={buttonVariants({ variant: "tertiary", size: "lg" })}
              aria-label={backLabel}
            >
              <span aria-hidden="true">←</span> {backLabel}
            </Link>
            <Button type="submit" variant="primary" size="lg">
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
