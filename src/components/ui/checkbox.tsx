"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Checkbox built on Base UI's Checkbox primitive — same library
 * the Collapsible already uses. Accessibility (label association, keyboard
 * activation via Space, focus management) is handled by the primitive.
 *
 * Composition:
 *   <Checkbox id="x" checked={…} onCheckedChange={…} />
 *   <label htmlFor="x">…</label>
 *
 * Visual: 20px square, --border-strong outline, --primary fill on check,
 * white Check glyph, --ring focus outline.
 */
export const Checkbox = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseCheckbox.Root>
>(function Checkbox({ className, ...props }, ref) {
  return (
    <BaseCheckbox.Root
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center",
        "h-5 w-5 flex-shrink-0",
        "rounded-[3px] border-2 border-[color:var(--border-strong)]",
        "bg-[color:var(--background)] text-[color:var(--primary-foreground)]",
        "cursor-pointer transition-colors duration-[120ms] ease-linear",
        "hover:border-[color:var(--primary)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]",
        "data-[checked]:bg-[color:var(--primary)] data-[checked]:border-[color:var(--primary)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <BaseCheckbox.Indicator className="flex items-center justify-center">
        <Check size={14} strokeWidth={3} aria-hidden="true" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
});
