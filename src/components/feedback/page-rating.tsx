"use client";

import { useId, useState } from "react";
import {
  Frown,
  Meh,
  Smile,
  Angry,
  Laugh,
} from "lucide-react";

/**
 * Five-emoji satisfaction scale matching the "How would you rate this page?"
 * widget on servicesaustralia.gov.au. Non-functional in the prototype — the
 * selected rating is held in component state only.
 *
 * Implemented as a radio group with visible icons + visible labels so it
 * meets WCAG 1.1.1 (text alternative) and 1.4.1 (not by colour alone).
 */
const scale = [
  { value: "1", label: "Very dissatisfied", Icon: Angry },
  { value: "2", label: "Dissatisfied", Icon: Frown },
  { value: "3", label: "Neutral", Icon: Meh },
  { value: "4", label: "Satisfied", Icon: Smile },
  { value: "5", label: "Very satisfied", Icon: Laugh },
] as const;

export function PageRating() {
  const groupName = useId();
  const [selected, setSelected] = useState<string>("");

  return (
    <section aria-labelledby={`${groupName}-legend`} className="page-rating">
      <h2 id={`${groupName}-legend`} className="page-rating__title">
        How would you rate this page?
      </h2>
      <ul className="page-rating__scale" role="radiogroup" aria-labelledby={`${groupName}-legend`}>
        {scale.map(({ value, label, Icon }) => {
          const id = `${groupName}-${value}`;
          const checked = selected === value;
          return (
            <li key={value} className="page-rating__item">
              <input
                type="radio"
                id={id}
                name={groupName}
                value={value}
                checked={checked}
                onChange={() => setSelected(value)}
                className="sr-only page-rating__input"
              />
              <label htmlFor={id} className="page-rating__face" data-checked={checked}>
                <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
                <span className="page-rating__label">{label}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {selected && (
        <p className="page-rating__thanks" role="status">
          Thanks for your feedback.
        </p>
      )}
    </section>
  );
}
