"use client";

import { ChecklistGroup } from "@/components/checklist/checklist-group";
import { CompletionBanner } from "@/components/checklist/completion-banner";
import { ProgressSummaryBar } from "@/components/checklist/progress-summary-bar";
import { carerChecklist } from "@/lib/carer-checklist";

/**
 * Session 2 component-library demos. Kept in a separate client module
 * because the checklist config carries lucide Icon components (function
 * references) which cannot be passed across the server/client boundary
 * as props. Importing the config inside this client module keeps the
 * Icon references on one side of the boundary.
 */

export function Session2Section() {
  return (
    <>
      <header
        className="library__header"
        style={{
          marginTop: 64,
          borderTop: "1px solid var(--border)",
          paddingTop: 40,
        }}
      >
        <p className="page__eyebrow">Session 2</p>
        <h2 className="library__title" style={{ fontSize: 36 }}>
          Session 2 components
        </h2>
        <p className="library__intro">
          Components introduced to support the Carer Payment &ldquo;Prepare
          to claim&rdquo; checklist scenario.
        </p>
      </header>

      <DemoSection id="checklist-group" title="Checklist group">
        <p className="library__caption">
          Card with icon + heading + per-group completion state. Items
          below share state with the parent so per-group counts and the
          &ldquo;All done&rdquo; badge update reactively.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <DemoTile label="Default state — no items checked">
            <ChecklistGroup
              group={carerChecklist[0]}
              checked={{}}
              onToggle={() => {}}
            />
          </DemoTile>
          <DemoTile label="Partial state — 2 of 4 items checked">
            <ChecklistGroup
              group={carerChecklist[0]}
              checked={{ 1: true, 2: true }}
              onToggle={() => {}}
            />
          </DemoTile>
          <DemoTile label="Complete state — all items checked, badge visible">
            <ChecklistGroup
              group={carerChecklist[0]}
              checked={{ 1: true, 2: true, 3: true, 4: true }}
              onToggle={() => {}}
            />
          </DemoTile>
        </div>
      </DemoSection>

      <DemoSection id="checklist-item" title="Checklist item">
        <p className="library__caption">
          Single-row primitive: checkbox + label + &ldquo;Why do I need
          this?&rdquo; collapsible helper. The label colour shifts to
          muted when checked. No strikethrough — fails for low-vision
          users.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <DemoTile label="Unchecked, helper collapsed">
            <StaticChecklistItem
              checked={false}
              expanded={false}
              label="Medicare card"
              helper="Your Medicare card number links your health records to your Centrelink profile."
            />
          </DemoTile>
          <DemoTile label="Checked, helper collapsed">
            <StaticChecklistItem
              checked={true}
              expanded={false}
              label="Medicare card"
              helper="Your Medicare card number links your health records to your Centrelink profile."
            />
          </DemoTile>
          <DemoTile label="Unchecked, helper expanded">
            <StaticChecklistItem
              checked={false}
              expanded={true}
              label="Medicare card"
              helper="Your Medicare card number links your health records to your Centrelink profile. Make sure it's current and the name matches your other ID."
            />
          </DemoTile>
        </div>
      </DemoSection>

      <DemoSection id="progress-summary" title="Progress summary bar">
        <p className="library__caption">
          role=&ldquo;status&rdquo; with aria-live=&ldquo;polite&rdquo;
          so screen readers announce updates non-disruptively. SA navy
          fill width transitions 200ms ease-out.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <DemoTile label="0 of 12">
            <ProgressSummaryBar completed={0} total={12} />
          </DemoTile>
          <DemoTile label="6 of 12 (50%)">
            <ProgressSummaryBar completed={6} total={12} />
          </DemoTile>
          <DemoTile label="12 of 12 (100%)">
            <ProgressSummaryBar completed={12} total={12} />
          </DemoTile>
        </div>
      </DemoSection>

      <DemoSection id="completion-banner" title="Completion banner">
        <p className="library__caption">
          Extends the session-1 .banner--eligible style for visual
          consistency. role=&ldquo;status&rdquo; (not alert) — the user
          triggered this state deliberately by checking off items.
        </p>
        <DemoTile label="Filled state">
          <CompletionBanner />
        </DemoTile>
      </DemoSection>

      <DemoSection id="print-stylesheet" title="Print stylesheet">
        <p className="library__caption">
          A print stylesheet at <code>/carers/prepare</code> renders the
          checklist only — hiding header, nav, footer, progress bar, and
          the &ldquo;Why do I need this?&rdquo; toggles. Helper text
          always expanded. Checked state communicates via a ■ glyph
          before the label, not green fill — works in black-and-white
          printing and for low-vision users. Page-break-inside: avoid on
          each group. 20mm margins, Georgia serif body font.
        </p>
      </DemoSection>
    </>
  );
}

function DemoSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="library__section"
      aria-labelledby={`${id}-title`}
    >
      <h3
        id={`${id}-title`}
        className="library__section-title"
        style={{ fontSize: 24 }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

function DemoTile({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="library__tile">
      <p className="library__tile-label">{label}</p>
      <div className="library__tile-stage">{children}</div>
    </div>
  );
}

function StaticChecklistItem({
  checked,
  expanded,
  label,
  helper,
}: {
  checked: boolean;
  expanded: boolean;
  label: string;
  helper: string;
}) {
  return (
    <div
      className="checklist-item"
      data-checked={checked ? "true" : "false"}
    >
      <div className="checklist-item__row">
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            flexShrink: 0,
            borderRadius: 3,
            border: "2px solid var(--border-strong)",
            background: checked ? "var(--primary)" : "var(--background)",
            color: "var(--primary-foreground)",
            fontSize: 14,
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          {checked ? "✓" : ""}
        </span>
        <span className="checklist-item__label">{label}</span>
        <span
          className="checklist-item__toggle"
          aria-hidden="true"
          style={{ pointerEvents: "none" }}
        >
          <span className="checklist-item__toggle-label">
            Why do I need this?
          </span>
          <span
            className={`checklist-item__chevron${expanded ? " checklist-item__chevron--open" : ""}`}
            style={{ display: "inline-block" }}
          >
            ⌄
          </span>
        </span>
      </div>
      {expanded && (
        <div className="checklist-item__helper">
          <p>{helper}</p>
        </div>
      )}
    </div>
  );
}
