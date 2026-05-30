"use client";

import { useMemo, useState } from "react";

import { Breadcrumb } from "@/components/nav/breadcrumb";
import { ChecklistGroup } from "@/components/checklist/checklist-group";
import { CompletionBanner } from "@/components/checklist/completion-banner";
import { PageMeta } from "@/components/content/page-meta";
import { PageRating } from "@/components/feedback/page-rating";
import { ProgressSummaryBar } from "@/components/checklist/progress-summary-bar";
import {
  SECTION_TOTAL,
  carerChecklist,
  isGroupReady,
} from "@/lib/carer-checklist";

/**
 * Prepare-to-claim checklist for Carer Payment.
 *
 * State model:
 *   checked: Record<number, boolean>   — keyed by item id 1..12
 *   sectionsReady                      — sections meeting their requiredCount
 *   allDone                            — every section ready
 *
 * Readiness is tracked per section (see `isGroupReady`), not by raw item
 * count: a section needs its `requiredCount`, and the page is ready once
 * all sections are. Over-ticking a section can't inflate progress.
 *
 * No persistence — refresh resets to empty per the brief.
 * Single useState (no useReducer, no context) per the brief.
 */
export default function PreparePage() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const toggle = (id: number) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const sectionsReady = useMemo(
    () => carerChecklist.filter((group) => isGroupReady(group, checked)).length,
    [checked],
  );
  const allDone = sectionsReady === SECTION_TOTAL;

  return (
    <div className="page page--prepare">
      <div className="page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Home", href: "#" },
            { label: "Carers", href: "#" },
            { label: "Carer Payment", href: "/carers" },
            { label: "Prepare to claim" },
          ]}
        />
      </div>

      <div className="page__main">
        <h1 className="prepare__title">Prepare to claim Carer Payment</h1>

        <div className="prepare__progress-wrap">
          <div className="prepare__progress-inner">
            <ProgressSummaryBar
              completed={sectionsReady}
              total={SECTION_TOTAL}
              unit="sections"
            />
          </div>
        </div>

        <p className="prepare__intro">
          Gather these documents and complete these steps before you start
          your claim. Having everything ready means your claim is less
          likely to be delayed.
        </p>

        <div className="prepare__groups">
          {carerChecklist.map((group) => (
            <ChecklistGroup
              key={group.id}
              group={group}
              checked={checked}
              onToggle={toggle}
            />
          ))}
        </div>

        {allDone && <CompletionBanner />}

        <PageRating />
        <PageMeta lastUpdated="24 May 2026" qcReference="QC 60218" />
      </div>
    </div>
  );
}
