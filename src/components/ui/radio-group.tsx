"use client";

import * as React from "react";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { Radio as BaseRadio } from "@base-ui/react/radio";

import { cn } from "@/lib/utils";

/**
 * RadioGroup — base-ui RadioGroup with SA defaults.
 *
 * Composition pattern:
 *   <RadioGroup value={...} onValueChange={...}>
 *     <RadioGroupItem value="a">Label A</RadioGroupItem>
 *     <RadioGroupItem value="b">Label B</RadioGroupItem>
 *   </RadioGroup>
 *
 * For tile-style options used in the question flow, wrap each item in
 * <RadioCard> (see custom primitives).
 */
type RadioGroupProps = React.ComponentProps<typeof BaseRadioGroup>;

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup({ className, ...props }, ref) {
    return (
      <BaseRadioGroup
        ref={ref}
        className={cn("flex flex-col gap-3", className)}
        {...props}
      />
    );
  },
);

/**
 * The visual radio dot rendered on its own — 20×20, 1.5px border,
 * solid SA-navy ring when selected. Used inside <RadioCard> tile rows.
 */
export const RadioDot = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseRadio.Root>
>(function RadioDot({ className, ...props }, ref) {
  return (
    <BaseRadio.Root
      ref={ref}
      className={cn(
        "relative inline-flex h-5 w-5 shrink-0 items-center justify-center",
        "rounded-full border-[1.5px] border-[color:var(--input)] bg-[color:var(--background)]",
        "transition-colors duration-[120ms] ease-linear",
        "hover:border-[color:var(--primary)]",
        "data-[checked]:border-[6px] data-[checked]:border-[color:var(--primary)]",
        "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
        // Focus ring lives on the visible Radio.Root (the hidden input is unfocusable)
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]",
        className,
      )}
      {...props}
    >
      {/* Indicator is not visually used (we expand the border instead),
          but base-ui requires a child for the checked state to mount. */}
      <BaseRadio.Indicator />
    </BaseRadio.Root>
  );
});

/**
 * RadioGroupItem — simple label + dot row. For tile styling use RadioCard.
 */
export interface RadioGroupItemProps
  extends Omit<React.ComponentProps<typeof BaseRadio.Root>, "children"> {
  children: React.ReactNode;
}

export const RadioGroupItem = React.forwardRef<HTMLLabelElement, RadioGroupItemProps>(
  function RadioGroupItem({ className, children, value, ...props }, ref) {
    return (
      <label
        ref={ref}
        className={cn(
          "inline-flex items-center gap-3 cursor-pointer text-base text-[color:var(--foreground)]",
          className,
        )}
      >
        <RadioDot value={value} {...props} />
        <span>{children}</span>
      </label>
    );
  },
);
