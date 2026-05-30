"use client";

import { CircleCheck } from "lucide-react";

import { ChecklistItem } from "@/components/checklist/checklist-item";
import {
  countCheckedInGroup,
  isGroupReady,
  type ChecklistGroupConfig,
} from "@/lib/carer-checklist";

interface ChecklistGroupProps {
  group: ChecklistGroupConfig;
  checked: Record<number, boolean>;
  onToggle: (id: number) => void;
}

/**
 * Checklist group card. Layout:
 *   ┌─────────────────────────────────────────────────┐
 *   │ [icon] Group title              [All done pill]  │
 *   │ Group description                                │
 *   │ ─────────────────────────────                    │
 *   │ Item 1                                           │
 *   │ ─────────                                        │
 *   │ Item 2                                           │
 *   └─────────────────────────────────────────────────┘
 *
 * The "All done" completion pill includes a visually-hidden text node
 * for screen readers ("This section is ready") so the pill icon + label
 * isn't the sole carrier of meaning.
 *
 * A section is "ready" once `requiredCount` items are ticked — not
 * necessarily all of them. When a subset suffices, a hint tells the user
 * they only need any N of the listed items.
 */
export function ChecklistGroup({
  group,
  checked,
  onToggle,
}: ChecklistGroupProps) {
  const completedCount = countCheckedInGroup(group, checked);
  const ready = isGroupReady(group, checked);
  const subsetAllowed = group.requiredCount < group.items.length;
  const Icon = group.icon;

  return (
    <section
      className="checklist-group"
      aria-labelledby={`group-${group.id}-title`}
      data-complete={ready ? "true" : "false"}
    >
      <header className="checklist-group__header">
        <Icon
          size={20}
          aria-hidden="true"
          className="checklist-group__icon"
        />
        <h2
          id={`group-${group.id}-title`}
          className="checklist-group__title"
        >
          {group.title}
        </h2>
        {!ready && (
          <span
            className="checklist-group__count"
            aria-label={`${completedCount} of ${group.requiredCount} required items in this section ready`}
          >
            {completedCount} of {group.requiredCount}
          </span>
        )}
        {ready && (
          <span className="checklist-group__badge">
            <CircleCheck size={16} aria-hidden="true" />
            <span>All done</span>
            <span className="sr-only"> — this section is ready</span>
          </span>
        )}
      </header>
      <p className="checklist-group__description">{group.description}</p>
      {subsetAllowed && !ready && (
        <p className="checklist-group__requirement">
          You only need any {group.requiredCount} of these{" "}
          {group.items.length}.
        </p>
      )}
      <div className="checklist-group__items">
        {group.items.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            checked={Boolean(checked[item.id])}
            onToggle={() => onToggle(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
