"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import type { ChecklistItemConfig } from "@/lib/carer-checklist";

interface ChecklistItemProps {
  item: ChecklistItemConfig;
  checked: boolean;
  onToggle: () => void;
}

/**
 * A single checklist row. Composition:
 *   [Checkbox] [Label]                            [Why do I need this? ⌄]
 *                                                 [Helper panel (when expanded)]
 *
 * Each row owns its own collapsible state — the parent only tracks the
 * checked/unchecked state of each item.
 *
 * Accessibility:
 *   - Checkbox is the shadcn/Base UI primitive (label association via for/id)
 *   - "Why do I need this?" button: aria-expanded + aria-controls
 *   - Checked state communicated by the checkbox glyph, not colour alone
 *   - data-checked attribute on the row so the print stylesheet can read it
 */
export function ChecklistItem({ item, checked, onToggle }: ChecklistItemProps) {
  const [helperOpen, setHelperOpen] = useState(false);
  const baseId = useId();
  const checkboxId = `${baseId}-cb`;
  const helperId = `${baseId}-helper`;

  return (
    <div
      className="checklist-item"
      data-checked={checked ? "true" : "false"}
    >
      <div className="checklist-item__row">
        <Checkbox
          id={checkboxId}
          checked={checked}
          onCheckedChange={onToggle}
        />
        <label
          htmlFor={checkboxId}
          className="checklist-item__label"
        >
          {item.label}
        </label>
        <button
          type="button"
          className="checklist-item__toggle"
          aria-expanded={helperOpen}
          aria-controls={helperId}
          onClick={() => setHelperOpen((v) => !v)}
        >
          <span className="checklist-item__toggle-label">
            Why do I need this?
          </span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={`checklist-item__chevron${
              helperOpen ? " checklist-item__chevron--open" : ""
            }`}
          />
        </button>
      </div>
      <div
        id={helperId}
        className="checklist-item__helper"
        hidden={!helperOpen}
      >
        <p>{item.helper}</p>
      </div>
    </div>
  );
}
