"use client";

import * as React from "react";
import { Radio as BaseRadio } from "@base-ui/react/radio";

import { cn } from "@/lib/utils";

/**
 * RadioCard — tile-style option row used in the question flow.
 * The whole tile is the click/tap target (≥ 48px) and the focus ring
 * sits on the tile, not the inner dot.
 *
 * Use inside <RadioGroup>:
 *   <RadioCard value="single" label="Single" />
 */
interface RadioCardProps extends Omit<React.ComponentProps<typeof BaseRadio.Root>, "children"> {
  label: string;
  description?: string;
}

export const RadioCard = React.forwardRef<HTMLLabelElement, RadioCardProps>(
  function RadioCard({ className, label, description, value, ...props }, ref) {
    return (
      <label
        ref={ref}
        className={cn(
          "radio-card",
          className,
        )}
      >
        <BaseRadio.Root
          value={value}
          className="radio-card__input"
          {...props}
        >
          <BaseRadio.Indicator />
        </BaseRadio.Root>
        <span className="radio-card__copy">
          <span className="radio-card__label">{label}</span>
          {description && (
            <span className="radio-card__description">{description}</span>
          )}
        </span>
      </label>
    );
  },
);
