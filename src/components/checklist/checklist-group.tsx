"use client";

import { CircleCheck } from "lucide-react";

import { ChecklistItem } from "@/components/checklist/checklist-item";
import type { ChecklistGroupConfig } from "@/lib/carer-checklist";

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
 * for screen readers ("All items in this group are complete") so the
 * pill icon + label isn't the sole carrier of meaning.
 */
export function ChecklistGroup({
  group,
  checked,
  onToggle,
}: ChecklistGroupProps) {
  const completedCount = group.items.filter((it) => checked[it.id]).length;
  const allComplete = completedCount === group.items.length;
  const Icon = group.icon;

  return (
    <section
      className="checklist-group"
      aria-labelledby={`group-${group.id}-title`}
      data-complete={allComplete ? "true" : "false"}
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
        {!allComplete && completedCount > 0 && (
          <span
            className="checklist-group__count"
            aria-label={`${completedCount} of ${group.items.length} items in this group complete`}
          >
            {completedCount} of {group.items.length}
          </span>
        )}
        {allComplete && (
          <span className="checklist-group__badge">
            <CircleCheck size={16} aria-hidden="true" />
            <span>All done</span>
            <span className="sr-only">
              {" "}
              — all items in this group are complete
            </span>
          </span>
        )}
      </header>
      <p className="checklist-group__description">{group.description}</p>
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
