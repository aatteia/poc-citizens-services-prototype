"use client";

import { ChecklistGroup } from "@/components/checklist/checklist-group";
import { carerChecklist } from "@/lib/carer-checklist";
import { Section, Tile } from "./library-ui";

/**
 * Live ChecklistGroup demo. Isolated in a client module because
 * `carerChecklist` carries lucide Icon components (function references)
 * that can't be serialised across the server/client boundary as props —
 * importing the config here keeps the Icon references client-side.
 *
 * Uses the Identity group (requires any 3 of its 4 items) to show the
 * per-section threshold behaviour: the subset hint, a part-way count, and
 * "All done" reached on a subset rather than every item.
 */
export function ChecklistGroupDemo() {
  const identity = carerChecklist[0];

  return (
    <Section id="checklist-group" title="Checklist group">
      <p className="library__caption">
        A section is &ldquo;ready&rdquo; once its required number of items is
        met — not necessarily all of them. Sections that accept a subset show
        a hint (e.g. &ldquo;any 3 of 4&rdquo;); the count and the
        &ldquo;All done&rdquo; badge update reactively.
      </p>
      <div className="library__stack">
        <Tile label="Empty — shows the subset hint">
          <ChecklistGroup group={identity} checked={{}} onToggle={() => {}} />
        </Tile>
        <Tile label="Part-way — 2 of 3 required ready">
          <ChecklistGroup
            group={identity}
            checked={{ 1: true, 2: true }}
            onToggle={() => {}}
          />
        </Tile>
        <Tile label="Ready on a subset — any 3 of 4 satisfies it">
          <ChecklistGroup
            group={identity}
            checked={{ 1: true, 2: true, 3: true }}
            onToggle={() => {}}
          />
        </Tile>
      </div>
    </Section>
  );
}
